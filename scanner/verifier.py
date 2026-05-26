"""
Scrubbed.Pro — Verifier
Post-removal verification: checks if data is actually gone.
"""

import asyncio
import aiohttp
from datetime import datetime
from .scraper import ScrapeResult


class Verifier:
    """
    Verifies that a removal was successful by re-scraping the broker.
    """

    def __init__(self, scraper_class, broker_config: dict, rate_limiter=None):
        self.scraper_class = scraper_class
        self.broker = broker_config
        self.rate_limiter = rate_limiter

    async def verify(self, person: dict, broker_result_id: str) -> dict:
        """
        Re-scrape the broker to confirm data is no longer present.

        Returns:
          - status: 'verified_removed' | 're_listed' | 'error'
          - verified_removed_at: ISO timestamp or None
          - re_listed_at: ISO timestamp or None
          - notes: str
        """
        from datetime import datetime

        # Re-run a quick scrape to check if listing is gone
        async with self.scraper_class(self.broker, self.rate_limiter) as scraper:
            result = await scraper.scrape(person)

        if result.status == 'not_found':
            return {
                'status': 'verified_removed',
                'verified_removed_at': datetime.utcnow().isoformat() + 'Z',
                're_listed_at': None,
                'notes': f"{self.broker['name']}: listing no longer present.",
            }
        elif result.status == 'found':
            return {
                'status': 're_listed',
                'verified_removed_at': None,
                're_listed_at': datetime.utcnow().isoformat() + 'Z',
                'notes': f"{self.broker['name']}: data re-listed at {result.listing_url}",
            }
        else:
            return {
                'status': 'error',
                'verified_removed_at': None,
                're_listed_at': None,
                'notes': f"Could not verify {self.broker['name']}: {result.error_message}",
            }