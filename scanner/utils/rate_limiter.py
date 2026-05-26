"""
Scrubbed.Pro — Rate limiter
Simple sliding-window rate limiter per broker.
"""

import time
import asyncio


class RateLimiter:
    """
    Per-broker rate limiter using a token bucket approach.
    Enforces minimum delay between requests to the same broker.
    """

    def __init__(self, min_interval_seconds: float = 5.0):
        self.min_interval = min_interval_seconds
        self._last_request: dict[str, float] = {}
        self._lock = asyncio.Lock()

    async def acquire(self, broker_id: str):
        """
        Wait until it&apos;s safe to make a request to this broker.
        """
        async with self._lock:
            last = self._last_request.get(broker_id, 0)
            elapsed = time.monotonic() - last
            if elapsed < self.min_interval:
                wait = self.min_interval - elapsed
                await asyncio.sleep(wait)
            self._last_request[broker_id] = time.monotonic()