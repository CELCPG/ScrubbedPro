"""
Scrubbed.Pro — Reporter
Builds final JSON report from scan results.
"""

import uuid
from datetime import datetime
from .scorer import compute_exposure_score
from .scraper import ScrapeResult


def build_report(
    person: dict,
    scan_results: list[ScrapeResult],
    scan_duration_seconds: int,
    next_scan_at: str,
) -> dict:
    """
    Assemble a full scan report dict from results.
    This gets stored in scans.report_json.
    """
    score, tier = compute_exposure_score(scan_results, person)

    found = [r for r in scan_results if r.status == 'found']
    blocked = [r for r in scan_results if r.status == 'blocked']

    # Fields most exposed (aggregate across all found listings)
    field_counts: dict[str, int] = {}
    for r in found:
        for f in r.fields_exposed:
            field_counts[f] = field_counts.get(f, 0) + 1

    top_fields = sorted(field_counts, key=field_counts.get, reverse=True)[:5]

    # Robocall risk brokers
    robocall_brokers = [r.broker_id for r in found if r.robocall_risk]

    # Build removal queue items from confirmed matches
    removal_queue = [
        {
            'broker_id': r.broker_id,
            'broker_name': r.broker_id.title(),  # broker name from config
            'status': 'pending',
            'priority': r.priority,
            'opt_out_method': 'web_form',
            'requires_id': False,
            'estimated_removal_days': 30,
        }
        for r in found
    ]

    return {
        'report_id': str(uuid.uuid4()),
        'generated_at': datetime.utcnow().isoformat() + 'Z',
        'person': {
            'name': f"{person['first_name']} {person['last_name']}",
            'current_location': f"{person['current_city']}, {person['current_state']}",
        },
        'exposure_score': score,
        'risk_tier': tier,
        'summary': _generate_summary(score, tier, len(found)),
        'total_brokers_scanned': len(scan_results),
        'brokers_with_listings': len(found),
        'brokers_blocked': len(blocked),
        'fields_most_exposed': top_fields,
        'robocall_risk_brokers': robocall_brokers,
        'listings': [
            {
                'broker_id': r.broker_id,
                'broker_name': r.broker_id.title(),
                'status': r.status,
                'listing_url': r.listing_url,
                'match_confidence': r.match_confidence,
                'fields_exposed': r.fields_exposed,
                'priority': r.priority,
                'robocall_risk': r.robocall_risk,
            }
            for r in found
        ],
        'removal_queue': removal_queue,
        'scan_duration_seconds': scan_duration_seconds,
        'next_scan_recommended': next_scan_at,
    }


def _generate_summary(score: int, tier: str, found_count: int) -> str:
    if tier == 'CRITICAL':
        return f"Your data is exposed at {found_count} broker sites with a critical risk score of {score}. Immediate removal action is required."
    elif tier == 'HIGH':
        return f"Found {found_count} listings across broker sites. Your risk score is {score} (HIGH). We recommend starting removals immediately."
    elif tier == 'MEDIUM':
        return f"Found {found_count} listings. Your exposure score is {score} (MEDIUM). Removing high-priority listings will reduce your risk."
    else:
        return f"Your exposure is low (score: {score}). {found_count} listing(s) found. Keep monitoring to catch new appearances."