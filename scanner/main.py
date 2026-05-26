#!/usr/bin/env python3
"""
Scrubbed.Pro — Scanner CLI
Main entry point for the Python scanner worker.
Can run in two modes:
  1. scan   — run a full scan for a person
  2. serve  — HTTP server for webhook-triggered scans (Railway deployment)
"""

import argparse
import asyncio
import json
import os
import sys
from datetime import datetime

from engine import ScanEngine
from notifier import Notifier


def load_env():
    """Load required environment variables."""
    required = [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
    ]
    optional = ['SCANNER_WEBHOOK_SECRET', 'WEBHOOK_URL']
    missing = [k for k in required if not os.environ.get(k)]
    if missing:
        print(f"Missing required env vars: {', '.join(missing)}")
        sys.exit(1)


async def run_scan(scan_id: str, person: dict, brokers_path: str, webhook_url: str = None):
    """
    Execute a single scan for one person.
    """
    print(f"[{scan_id}] Starting scan for {person['first_name']} {person['last_name']}")

    notifier = Notifier(
        supabase_url=os.environ['SUPABASE_URL'],
        supabase_key=os.environ['SUPABASE_SERVICE_ROLE_KEY'],
        webhook_url=webhook_url,
    )

    async with notifier:
        engine = ScanEngine(
            person=person,
            scan_id=scan_id,
            broker_config_path=brokers_path,
            notifier=notifier,
            webhook_url=webhook_url,
            concurrency=3,
        )
        report = await engine.run()
        print(f"[{scan_id}] Scan complete. Score: {report['exposure_score']} ({report['risk_tier']})")
        return report


async def run_cli():
    """
    CLI mode: run a scan given person data directly on the command line.
    Usage: python main.py scan --person '{"first_name": "Col Lacy", ...}'
    """
    parser = argparse.ArgumentParser(description='Scrubbed.Pro Scanner')
    sub = parser.add_subparsers(dest='command')

    scan_parser = sub.add_parser('scan', help='Run a scan')
    scan_parser.add_argument('--person', required=True, help='JSON person object')
    scan_parser.add_argument('--scan-id', required=True, help='Scan ID in Supabase')
    scan_parser.add_argument('--brokers', default='brokers/broker_config.json', help='Path to broker config')
    scan_parser.add_argument('--webhook', help='Frontend webhook URL')

    args = parser.parse_args()

    if args.command == 'scan':
        try:
            person = json.loads(args.person)
        except json.JSONDecodeError as e:
            print(f"Invalid JSON in --person: {e}")
            sys.exit(1)

        await run_scan(args.scan_id, person, args.brokers, args.webhook)


async def run_http_server():
    """
    HTTP server mode: listen for scan trigger webhooks from the Next.js app.
    """
    from aiohttp import web

    async def handle_scan(request):
        expected_secret = os.environ.get('SCANNER_WEBHOOK_SECRET')
        if not expected_secret:
            return web.json_response({'error': 'Server misconfigured'}, status=500)
        provided = request.headers.get('X-Scanner-Secret', '')
        # constant-time compare
        import hmac
        if not hmac.compare_digest(provided, expected_secret):
            return web.json_response({'error': 'Unauthorized'}, status=401)

        body = await request.json()
        scan_id = body.get('scan_id')
        person = body.get('person')
        webhook_url = os.environ.get('WEBHOOK_URL')

        if not scan_id or not person:
            return web.json_response({'error': 'Missing scan_id or person'}, status=400)

        # Run scan in background
        asyncio.create_task(run_scan(
            scan_id,
            person,
            os.environ.get('BROKERS_CONFIG_PATH', 'brokers/broker_config.json'),
            webhook_url,
        ))

        return web.json_response({'status': 'queued', 'scan_id': scan_id})

    async def health(request):
        return web.json_response({'status': 'ok', 'time': datetime.utcnow().isoformat() + 'Z'})

    app = web.Application()
    app.router.add_post('/scan', handle_scan)
    app.router.add_get('/health', health)

    port = int(os.environ.get('PORT', 8080))
    print(f"Scanner HTTP server listening on port {port}")
    web.run_app(app, port=port)


if __name__ == '__main__':
    load_env()

    mode = os.environ.get('SCANNER_MODE', 'cli')

    if mode == 'http':
        asyncio.run(run_http_server())
    else:
        asyncio.run(run_cli())