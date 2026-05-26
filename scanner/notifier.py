"""
Scrubbed.Pro — Notifier
Writes results to Supabase and calls the webhook.
"""

import aiohttp
import json
from datetime import datetime, timedelta
from typing import Optional


class Notifier:
    """
    Handles writing scan results to Supabase and notifying the frontend.
    Optionally calls a webhook URL for real-time updates.
    """

    def __init__(
        self,
        supabase_url: str,
        supabase_key: str,
        webhook_url: Optional[str] = None,
    ):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.webhook_url = webhook_url
        self._session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self._session = aiohttp.ClientSession(
            headers={
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json',
            }
        )
        return self

    async def __aexit__(self, *args):
        if self._session:
            await self._session.close()
            self._session = None

    async def write_broker_result(self, scan_id: str, result: dict):
        """
        Upsert a broker_result row in Supabase.
        """
        if not self._session:
            raise RuntimeError("Notifier must be used as async context manager")

        payload = {
            'scan_id': scan_id,
            'broker_id': result.get('broker_id'),
            'broker_name': result.get('broker_id', '').title(),
            'status': result.get('status', 'error'),
            'listing_url': result.get('listing_url'),
            'match_confidence': result.get('match_confidence'),
            'fields_exposed': result.get('fields_exposed', []),
            'priority': result.get('priority', 'medium'),
            'robocall_risk': result.get('robocall_risk', False),
            'raw_data': result.get('raw_data'),
        }

        await self._session.post(
            f'{self.supabase_url}/rest/v1/broker_results',
            json=payload,
        )

    async def update_scan_counters(self, scan_id: str, counters: dict):
        """
        Increment scan counters after a broker completes.
        """
        if not self._session:
            raise RuntimeError("Notifier must be used as async context manager")

        patch_data = {}
        if 'found' in counters:
            patch_data['brokers_with_listings'] = counters['found']
        if 'blocked' in counters:
            patch_data['brokers_blocked'] = counters['blocked']
        if 'total' in counters:
            patch_data['total_brokers_scanned'] = counters['total']

        if patch_data:
            await self._session.patch(
                f'{self.supabase_url}/rest/v1/scans?id=eq.{scan_id}',
                json=patch_data,
            )

    async def complete_scan(
        self,
        scan_id: str,
        report: dict,
        scan_duration_seconds: int,
    ):
        """
        Mark scan as completed with final report and score.
        """
        if not self._session:
            raise RuntimeError("Notifier must be used as async context manager")

        next_scan = (datetime.utcnow() + timedelta(days=30)).isoformat() + 'Z'

        patch_data = {
            'status': 'completed',
            'completed_at': datetime.utcnow().isoformat() + 'Z',
            'exposure_score': report.get('exposure_score', 0),
            'risk_tier': report.get('risk_tier', 'LOW'),
            'brokers_with_listings': report.get('brokers_with_listings', 0),
            'brokers_blocked': report.get('brokers_blocked', 0),
            'fields_most_exposed': report.get('fields_most_exposed', []),
            'robocall_risk_brokers': report.get('robocall_risk_brokers', []),
            'report_json': report,
            'scan_duration_seconds': scan_duration_seconds,
            'next_scan_at': next_scan,
        }

        await self._session.patch(
            f'{self.supabase_url}/rest/v1/scans?id=eq.{scan_id}',
            json=patch_data,
        )

        # Also insert removal queue items
        for item in report.get('removal_queue', []):
            await self._session.post(
                f'{self.supabase_url}/rest/v1/removal_queue',
                json={
                    'scan_id': scan_id,
                    'broker_id': item['broker_id'],
                    'broker_name': item['broker_name'],
                    'status': item['status'],
                    'priority': item['priority'],
                    'opt_out_method': item.get('opt_out_method', 'web_form'),
                    'requires_id': item.get('requires_id', False),
                    'estimated_removal_days': item.get('estimated_removal_days', 30),
                },
            )

    async def send_webhook(self, scan_id: str, result: dict):
        """
        POST scan result to the frontend webhook endpoint.
        """
        if not self.webhook_url or not self._session:
            return

        await self._session.post(
            self.webhook_url,
            json={'scan_id': scan_id, **result},
        )