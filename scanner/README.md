"""
Scrubbed.Pro — README
Scanner setup and deployment docs.
"""

README = """
# Scrubbed.Pro — Scanner

Python 3.11+ scanner that searches data broker sites and submits opt-out requests.

## Quick start (local development)

```bash
cd scanner

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install --with-deps chromium

# Set environment variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJ...
export SCANNER_WEBHOOK_SECRET=your_secret
export WEBHOOK_URL=https://your-app.vercel.app/api/webhooks/scanner

# Run a test scan (CLI mode)
python main.py scan \\
  --scan-id "test-scan-uuid" \\
  --person '{"first_name":"Col","last_name":"Lacy","current_city":"Mechanicsville","current_state":"VA","phone_numbers":[],"email_addresses":[],"previous_cities":[],"previous_states":[],"relatives":[]}' \\
  --brokers brokers/broker_config.json \\
  --webhook https://your-app.vercel.app/api/webhooks/scanner
```

## HTTP server mode (Railway deployment)

```bash
SCANNER_MODE=http PORT=8080 python main.py
```

The server accepts POST /scan with:
```json
{
  "scan_id": "uuid",
  "person": { "first_name": "...", ... }
}
```

## Docker

```bash
docker build -t scrubbed-pro-scanner .
docker run -p 8080:8080 \\
  -e SUPABASE_URL=... \\
  -e SUPABASE_SERVICE_ROLE_KEY=... \\
  -e SCANNER_MODE=http \\
  scrubbed-pro-scanner
```

## Broker configuration

Edit `brokers/broker_config.json` to add or modify brokers.
Each broker needs:
- `id`: unique slug
- `name`: display name
- `search_url_template`: URL with {first_name}, {last_name}, {city}, {state} placeholders
- `opt_out_url`: URL for opt-out form
- `method`: "playwright" | "api" | "manual"
- `active`: true/false

## Adding a new broker template

1. Add broker entry to `broker_config.json`
2. Create `brokers/templates/<broker_id>.py` extending `BaseScraper`
3. Override the `scrape()` method with broker-specific logic
4. Update `engine.py` to route broker_id → template class
"""

with open('scanner/README.md', 'w') as f:
    f.write(README)

print("README written to scanner/README.md")