"""
Scrubbed.Pro — Scorer
Exposure risk scoring model.
Assigns 0–100 risk score and tier (CRITICAL/HIGH/MEDIUM/LOW).
"""

from .scraper import ScrapeResult


RISK_TIERS = {
    'CRITICAL': (80, 100),
    'HIGH': (60, 79),
    'MEDIUM': (40, 59),
    'LOW': (0, 39),
}


def compute_exposure_score(
    scan_results: list[ScrapeResult],
    person: dict,
) -> tuple[int, str]:
    """
    Calculate overall exposure risk score (0–100) and tier.

    Signals:
    - Each confirmed broker listing: +3 (max 30)
    - High-priority broker found: +8 each
    - Phone number exposed: +10
    - Email exposed: +8
    - Current address exposed: +12
    - Each previous address exposed: +6 (max 18)
    - Relatives exposed: +5
    - Employers exposed: +4
    - Social profiles linked: +6
    - Per robocall_risk=True broker: +5
    """
    score = 0

    # Count confirmed listings
    confirmed = [r for r in scan_results if r.status == 'found']
    score += min(len(confirmed) * 3, 30)

    # High-priority brokers
    high_priority = [r for r in confirmed if r.priority == 'high']
    score += len(high_priority) * 8

    # Exposed fields across all results
    all_fields: set[str] = set()
    for r in confirmed:
        all_fields.update(r.fields_exposed)

    if 'phone' in all_fields:
        score += 10
    if 'email' in all_fields:
        score += 8
    if 'address' in all_fields:
        score += 12
    if 'relatives' in all_fields:
        score += 5
    if 'employer' in all_fields:
        score += 4
    if 'social' in all_fields:
        score += 6

    # Previous addresses (count unique ones exposed)
    prev_cities = set(person.get('previous_cities') or [])
    for r in confirmed:
        raw = r.raw_data or {}
        for pc in (raw.get('previous_cities') or []):
            if pc and pc.lower() in [c.lower() for c in prev_cities]:
                score += 6
    # Cap at 18
    score = min(score, 18) + (score - min(score, 18))  # keep original for prev addrs
    # Actually just cap total after all additions
    score = min(score, 18)

    # Robocall risk brokers
    robocall = [r for r in confirmed if r.robocall_risk]
    score += len(robocall) * 5

    # Re-cap at 100
    score = min(score, 100)

    # Determine tier
    tier = 'LOW'
    for t, (low, high) in RISK_TIERS.items():
        if low <= score <= high:
            tier = t
            break

    return score, tier