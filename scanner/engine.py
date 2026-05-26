"""
Scrubbed.Pro — Engine
Async orchestrator that runs the scanner across all configured brokers.
"""

import asyncio
import json
import time
from datetime import datetime, timedelta
from typing import Optional

from .scraper import ScrapeResult, BaseScraper
from .parser import parse_broker_response
from .reporter import build_report
from .notifier import Notifier

# Import broker templates — each returns a scraper instance
# from .brokers.templates import spokeo, whitepages, etc.


async def load_broker_config(path: str) -> list[dict]:
    """Load and parse the broker config JSON."""
    with open(path) as f:
        data = json.load(f)
    return [b for b in data.get('brokers', []) if b.get('active', False)]


class ScanEngine:
    """
    Async orchestrator for running a full scan across all active brokers.
    """

    def __init__(
        self,
        person: dict,
        scan_id: str,
        broker_config_path: str,
        notifier: Notifier,
        webhook_url: Optional[str] = None,
        concurrency: int = 3,
        broker_timeout_seconds: int = 60,
        scan_timeout_seconds: int = 1800,
    ):
        self.person = person
        self.scan_id = scan_id
        self.broker_config_path = broker_config_path
        self.notifier = notifier
        self.webhook_url = webhook_url
        self.concurrency = concurrency
        self.broker_timeout_seconds = broker_timeout_seconds
        self.scan_timeout_seconds = scan_timeout_seconds
        self.results: list[ScrapeResult] = []
        self._start_time: Optional[float] = None

    async def run(self) -> dict:
        """
        Run the full scan. Returns the final report dict.
        """
        brokers = await load_broker_config(self.broker_config_path)
        self._start_time = time.time()

        # Use semaphore to limit concurrent browser contexts
        semaphore = asyncio.Semaphore(self.concurrency)

        async def scrape_with_semaphore(broker: dict):
            async with semaphore:
                try:
                    return await asyncio.wait_for(
                        self._scrape_broker(broker),
                        timeout=self.broker_timeout_seconds,
                    )
                except asyncio.TimeoutError:
                    print(f"[{self.scan_id}] Timeout scraping {broker.get('name', broker.get('id'))}")
                    return ScrapeResult(
                        broker_id=broker['id'],
                        status='error',
                        error_message=f"Timeout after {self.broker_timeout_seconds}s",
                    )

        # Scrape all brokers concurrently (up to concurrency limit), with an
        # overall scan-level cap so a stuck pool can't hang the worker forever.
        tasks = [scrape_with_semaphore(b) for b in brokers]
        try:
            self.results = await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=self.scan_timeout_seconds,
            )
        except asyncio.TimeoutError:
            print(f"[{self.scan_id}] Scan exceeded {self.scan_timeout_seconds}s — aborting")
            self.results = [
                ScrapeResult(
                    broker_id='unknown',
                    status='error',
                    error_message=f"Scan timeout after {self.scan_timeout_seconds}s",
                )
            ]

        # Filter out exceptions → keep only ScrapeResult
        valid_results: list[ScrapeResult] = []
        for r in self.results:
            if isinstance(r, ScrapeResult):
                valid_results.append(r)
            elif isinstance(r, Exception):
                print(f"Broker scrape exception: {r}")

        # Build final report
        duration = int(time.time() - self._start_time)
        next_scan = (datetime.utcnow() + timedelta(days=30)).isoformat() + 'Z'
        report = build_report(self.person, valid_results, duration, next_scan)

        # Write completion to Supabase
        await self.notifier.complete_scan(
            self.scan_id,
            report,
            duration,
        )

        # Send webhook to frontend if configured
        if self.webhook_url:
            await self.notifier.send_webhook(
                self.scan_id,
                {'event': 'scan_complete', 'report': report},
            )

        return report

    async def _scrape_broker(self, broker: dict) -> ScrapeResult:
        """
        Scrape a single broker and write result to Supabase immediately.
        """
        broker_id = broker['id']
        print(f"[{self.scan_id}] Scraping {broker['name']}…")

        try:
            # Dynamically load the broker template scraper
            scraper = self._get_scraper(broker)
            if not scraper:
                return ScrapeResult(
                    broker_id=broker_id,
                    status='error',
                    error_message=f"No scraper for {broker_id}",
                )

            async with scraper as s:
                raw_data = await s.scrape(self.person)

            # Parse and score the result
            result = parse_broker_response(broker_id, broker, raw_data, self.person)

        except Exception as e:
            print(f"[{self.scan_id}] Error scraping {broker['name']}: {e}")
            return ScrapeResult(
                broker_id=broker_id,
                status='error',
                error_message=str(e),
            )

        # Write result to Supabase immediately (live updates for frontend)
        await self.notifier.write_broker_result(
            self.scan_id,
            {
                'broker_id': broker_id,
                'status': result.status,
                'listing_url': result.listing_url,
                'match_confidence': result.match_confidence,
                'fields_exposed': result.fields_exposed,
                'priority': result.priority,
                'robocall_risk': result.robocall_risk,
                'raw_data': result.raw_data,
            },
        )

        # Update counters
        counters = {'total': 1}
        if result.status == 'found':
            counters['found'] = 1
        elif result.status == 'blocked':
            counters['blocked'] = 1

        await self.notifier.update_scan_counters(self.scan_id, counters)

        # Send webhook for live feed
        if self.webhook_url:
            await self.notifier.send_webhook(self.scan_id, {
                'event': 'broker_result',
                'broker_id': broker_id,
                'broker_name': broker['name'],
                'status': result.status,
                'match_confidence': result.match_confidence,
                'fields_exposed': result.fields_exposed,
            })

        print(f"[{self.scan_id}] {broker['name']}: {result.status}" + (
            f" ({result.match_confidence:.0%})" if result.match_confidence else ""
        ))

        return result

    def _get_scraper(self, broker: dict):
        """
        Return an initialized scraper for the given broker.
        Currently uses generic BaseScraper; swap for broker-specific
        template scrapers in Phase 3.
        """
        return GenericScraper(broker)


class GenericScraper(BaseScraper):
    """
    Generic Playwright scraper that works for most brokers.
    Replace individual brokers' _scrape() override in templates/ for better results.
    """

    async def scrape(self, person: dict) -> dict:
        """
        Generic scrape: navigates to search URL, fills form, scrapes results.
        """
        import asyncio
        page = await self.new_page()

        # Build search URL
        template = self.broker.get('search_url_template', '')
        url = template.format(
            first_name=person.get('first_name', ''),
            last_name=person.get('last_name', ''),
            city=person.get('current_city', ''),
            state=person.get('current_state', ''),
        )

        try:
            await page.goto(url, wait_until='networkidle', timeout=30000)
        except Exception as e:
            return {'error': str(e)}

        # Accept any cookie banners
        await self.accept_cookies(page)

        # Check for CAPTCHA
        if await self.handle_captcha(page):
            return {'status': 'blocked', 'reason': 'captcha'}

        # Check for Cloudflare or access denied
        content = await page.content()
        if any(x in content.lower() for x in ['cloudflare', 'access denied', '403 forbidden']):
            return {'status': 'blocked', 'reason': 'cloudflare'}

        # Try to extract person data from the page
        data = await self._extract_person_data(page, person)
        return data

    async def _extract_person_data(self, page, person: dict) -> dict:
        """
        Override in broker-specific templates for better extraction.
        Default implementation tries basic selectors.
        """
        try:
            # Look for name
            name_el = await page.query_selector('[class*="name"], [class*="person-name"], h1')
            name_text = await name_el.inner_text() if name_el else ''

            # Look for phone
            phone_el = await page.query_selector('[class*="phone"], [class*="tel"]')
            phone_text = await phone_el.inner_text() if phone_el else ''

            # Look for address
            addr_el = await page.query_selector('[class*="address"], [class*="location"]')
            address_text = await addr_el.inner_text() if addr_el else ''

            # Look for email
            email_el = await page.query_selector('[class*="email"]')
            email_text = await email_el.inner_text() if email_el else ''

            return {
                'name': name_text,
                'phone': phone_text,
                'address': address_text,
                'email': email_text,
                'url': page.url,
            }
        except Exception:
            return {'url': page.url}