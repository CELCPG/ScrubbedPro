"""
Scrubbed.Pro — Parser
Normalizes raw broker HTML/text into structured results.
Implements the match confidence scoring algorithm.
"""

from typing import Optional
from .scraper import ScrapeResult


def levenshtein_ratio(s1: str, s2: str) -> float:
    """Calculate fuzzy match ratio between two strings (0.0–1.0)."""
    if not s1 or not s2:
        return 0.0
    s1, s2 = s1.lower(), s2.lower()
    if s1 == s2:
        return 1.0
    len1, len2 = len(s1), len(s2)
    max_len = max(len1, len2)
    if max_len == 0:
        return 1.0
    # Simple ratio based on length similarity and common prefix
    common = sum(1 for a, b in zip(s1, s2) if a == b) / max_len
    return common


def score_match(
    person: dict,
    broker_data: dict,
) -> tuple[float, list[str]]:
    """
    Calculate match confidence score (0.0–1.0) based on field signals.
    Returns (confidence, list_of_exposed_fields).
    Only includes listings >= 0.50.
    """
    score = 0.0
    exposed_fields: list[str] = []

    fn = person.get('first_name', '').lower().strip()
    ln = person.get('last_name', '').lower().strip()
    full_name = f"{fn} {ln}".strip()
    current_city = person.get('current_city', '').lower().strip()
    current_state = (person.get('current_state') or '').upper().strip()
    prev_cities = [c.lower() for c in (person.get('previous_cities') or [])]
    prev_states = [s.upper() for s in (person.get('previous_states') or [])]
    phones = [p.strip() for p in (person.get('phone_numbers') or [])]
    emails = [e.lower().strip() for e in (person.get('email_addresses') or [])]
    relatives = [r.lower() for r in (person.get('relatives') or [])]

    # Broker data fields (lowercased keys)
    bd_name = (broker_data.get('name') or '').lower()
    bd_phone = broker_data.get('phone') or ''
    bd_email = broker_data.get('email') or ''
    bd_city = (broker_data.get('city') or '').lower()
    bd_state = (broker_data.get('state') or '').upper()
    bd_age = broker_data.get('age')
    bd_prev_cities = [c.lower() for c in (broker_data.get('previous_cities') or [])]
    bd_relatives = [r.lower() for r in (broker_data.get('relatives') or [])]
    bd_address = broker_data.get('address') or ''
    bd_employer = broker_data.get('employer') or ''

    # Full name exact match
    bd_full_name = (broker_data.get('full_name') or '').lower()
    if bd_full_name == full_name:
        score += 0.35
    elif levenshtein_ratio(bd_full_name, full_name) > 0.85:
        score += 0.20

    # Current city match
    if bd_city and bd_city == current_city:
        score += 0.20

    # State match
    if bd_state and bd_state == current_state:
        score += 0.10

    # Age within 2 years
    if bd_age and person.get('age'):
        try:
            if abs(int(bd_age) - int(person['age'])) <= 2:
                score += 0.15
        except (ValueError, TypeError):
            pass

    # Previous city match
    if bd_city and bd_city in prev_cities:
        score += 0.10

    # Relative name match
    for rel in relatives:
        for bd_rel in bd_relatives:
            if rel in bd_rel or bd_rel in rel:
                score += 0.15
                break

    # Phone number match
    for phone in phones:
        if phone and phone in bd_phone:
            score += 0.25
            exposed_fields.append('phone')
            break

    # Email match
    for email in emails:
        if email and email in bd_email:
            score += 0.25
            exposed_fields.append('email')
            break

    # Address exposed
    if bd_address:
        exposed_fields.append('address')
        score += 0.15

    # Clamp to max 1.0
    return min(score, 1.0), exposed_fields


def parse_broker_response(
    broker_id: str,
    broker_config: dict,
    raw_data: dict,
    person: dict,
) -> ScrapeResult:
    """
    Parse a broker's raw response and return a normalized ScrapeResult.
    Determines status, confidence, and exposed fields.
    """
    confidence, exposed = score_match(person, raw_data)

    if confidence < 0.50:
        return ScrapeResult(
            broker_id=broker_id,
            status='not_found',
            match_confidence=confidence,
        )

    # Determined a match
    result = ScrapeResult(
        broker_id=broker_id,
        status='found',
        match_confidence=round(confidence, 3),
        fields_exposed=exposed,
        priority=broker_config.get('priority', 'medium'),
        robocall_risk=broker_config.get('robocall_risk', False),
        listing_url=raw_data.get('url'),
        raw_data=raw_data,
    )

    return result