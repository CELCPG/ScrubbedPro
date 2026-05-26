"""
Scrubbed.Pro — Scanner Engine
Base scraper class and utilities.
"""

import asyncio
import random
import time
from typing import Optional
from dataclasses import dataclass

from playwright.async_api import async_playwright, Page, Browser, BrowserContext


# ─── User agents ───────────────────────────────────────────────────────────────
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/125.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
]


@dataclass
class ScrapeResult:
    """Normalized result from a broker scrape."""
    broker_id: str
    status: str  # 'found' | 'not_found' | 'blocked' | 'error'
    listing_url: Optional[str] = None
    match_confidence: Optional[float] = None
    fields_exposed: list[str] = None
    priority: str = 'medium'
    robocall_risk: bool = False
    raw_data: Optional[dict] = None
    error_message: Optional[str] = None

    def __post_init__(self):
        if self.fields_exposed is None:
            self.fields_exposed = []


class BaseScraper:
    """
    Playwright-based scraper base class.
    Each broker gets its own isolated browser context.
    """

    def __init__(self, broker_config: dict, rate_limiter=None):
        self.broker = broker_config
        self.rate_limiter = rate_limiter
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        await self.cleanup()
        return None

    async def cleanup(self):
        """Release browser resources."""
        if self.context:
            await self.context.close()
            self.context = None
        if self.browser:
            await self.browser.close()
            self.browser = None

    async def launch_browser(self):
        """Launch an isolated browser context with randomized fingerprint."""
        pw = await async_playwright().__aenter__()
        self.browser = await pw.chromium.launch(headless=True)
        self.context = await self.browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={
                'width': random.randint(1280, 1920),
                'height': random.randint(800, 1080),
            },
            locale='en-US',
        )
        # Hide webdriver flag
        await self.context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        """)
        return self.context

    async def new_page(self) -> Page:
        """Create a new page in the isolated context."""
        if not self.context:
            await self.launch_browser()
        page = await self.context.new_page()
        page.set_default_timeout(30000)
        return page

    def random_delay(self, min_ms: float = 500, max_ms: float = 2500):
        """Return a random delay in seconds."""
        return random.uniform(min_ms, max_ms)

    async def human_click(self, page: Page, selector: str):
        """Click with a random delay and optional mouse path."""
        await page.wait_for_selector(selector, state='visible')
        await asyncio.sleep(self.random_delay(200, 800))
        await page.click(selector)

    async def human_type(self, page: Page, selector: str, text: str):
        """Type with randomized speed and occasional delays."""
        await page.wait_for_selector(selector, state='visible')
        for char in text:
            await page.type(selector, char, delay=random.randint(20, 80))
            if random.random() < 0.05:  # 5% chance of a pause
                await asyncio.sleep(random.uniform(0.1, 0.3))

    async def accept_cookies(self, page: Page):
        """Attempt to dismiss cookie banners without disrupting the page."""
        selectors = [
            'button:has-text("Accept")', 'button:has-text("Accept all")',
            'button:has-text("Allow")', '#onetrust-accept-btn-handler',
            '[aria-label="Accept cookies"]',
        ]
        for sel in selectors:
            try:
                el = page.locator(sel).first
                if await el.is_visible(timeout=2000):
                    await el.click()
                    await asyncio.sleep(300)
                    return
            except Exception:
                pass

    async def handle_captcha(self, page: Page) -> bool:
        """Detect CAPTCHA challenges. Return True if CAPTCHA was encountered."""
        page_content = await page.content()
        captcha_indicators = ['captcha', 'g-recaptcha', 'hcaptcha', 'Are you a robot']
        return any(ind.lower() in page_content.lower() for ind in captcha_indicators)

    async def scrape(self, person: dict) -> ScrapeResult:
        """
        Main entry point — override in subclass for custom logic.
        Returns a ScrapeResult with normalized data.
        """
        raise NotImplementedError("Subclass must implement scrape()")