"""
Scrubbed.Pro — Removal engine
Automated opt-out submission at data brokers.
"""

import asyncio
import aiohttp
from typing import Optional
from .scraper import ScrapeResult


class RemovalEngine:
    """
    Submits opt-out requests at data brokers.
    Only auto-submits where opt_out_requires_id is False.
    """

    def __init__(self, broker_config: dict, rate_limiter=None):
        self.broker = broker_config
        self.rate_limiter = rate_limiter

    async def submit(self, person: dict, listing_url: Optional[str] = None) -> dict:
        """
        Submit an opt-out request for a single broker.

        Returns dict with:
          - status: 'submitted' | 'requires_manual' | 'error'
          - submitted_at: ISO timestamp
          - notes: str
        """
        # Never auto-submit if broker requires ID
        if self.broker.get('opt_out_requires_id', False):
            return {
                'status': 'requires_manual',
                'notes': f"{self.broker['name']} requires government ID for opt-out. Manual submission required.",
                'submitted_at': None,
            }

        opt_out_url = self.broker.get('opt_out_url')
        if not opt_out_url:
            return {
                'status': 'error',
                'notes': f"No opt-out URL configured for {self.broker['name']}",
                'submitted_at': None,
            }

        method = self.broker.get('opt_out_method', 'web_form')

        if method == 'web_form':
            return await self._submit_web_form(person, opt_out_url)
        elif method == 'email':
            return await self._submit_email(person, opt_out_url)
        else:
            return {
                'status': 'requires_manual',
                'notes': f"{self.broker['name']} requires manual submission via {method}",
                'submitted_at': None,
            }

    async def _submit_web_form(self, person: dict, url: str) -> dict:
        """
        Submit opt-out via web form.
        Sends only name + address — never SSN, DL, or financial info.
        """
        from datetime import datetime

        payload = {
            'first_name': person.get('first_name', ''),
            'last_name': person.get('last_name', ''),
            'address': person.get('current_city', ''),  # city only
            'state': person.get('current_state', ''),
            # Never include: SSN, DOB, driver license
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, data=payload, timeout=aiohttp.ClientTimeout(total=30)) as resp:
                    if resp.status in (200, 201, 302):
                        return {
                            'status': 'submitted',
                            'submitted_at': datetime.utcnow().isoformat() + 'Z',
                            'notes': f"Opt-out submitted at {self.broker['name']}",
                        }
                    else:
                        return {
                            'status': 'error',
                            'notes': f"HTTP {resp.status} from {self.broker['name']}",
                            'submitted_at': None,
                        }
        except Exception as e:
            return {
                'status': 'error',
                'notes': f"Error submitting to {self.broker['name']}: {str(e)}",
                'submitted_at': None,
            }

    async def _submit_email(self, person: dict, email_address: str) -> dict:
        """
        Submit opt-out via email.
        """
        from datetime import datetime

        subject = f"Opt-Out Request: {person.get('first_name')} {person.get('last_name')}"
        body = (
            f"I am requesting removal of my personal information from {self.broker['name']}.\n\n"
            f"Name: {person.get('first_name')} {person.get('last_name')}\n"
            f"City: {person.get('current_city')}, {person.get('current_state')}\n\n"
            f"Please remove my data and confirm when complete."
        )

        try:
            async with aiohttp.ClientSession() as session:
                await session.send_mail(
                    from_addr='privacy@scrubbed.pro',
                    to_addrs=[email_address],
                    subject=subject,
                    body=body,
                )
            return {
                'status': 'submitted',
                'submitted_at': datetime.utcnow().isoformat() + 'Z',
                'notes': f"Opt-out email sent to {self.broker['name']}",
            }
        except Exception as e:
            return {
                'status': 'error',
                'notes': f"Email failed to {self.broker['name']}: {str(e)}",
                'submitted_at': None,
            }