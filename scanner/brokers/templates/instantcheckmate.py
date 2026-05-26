"""
Scrubbed.Pro — Instant Checkmate Scraper
Instant Checkmate publishes criminal records, arrest records, and contact info.
Opt-out: https://www.instantcheckmate.com/opt-out
"""

import asyncio
from ..scraper import BaseScraper


class InstantCheckmateScraper(BaseScraper):

    async def scrape(self, person: dict) -> dict:
        page = await self.new_page()

        first_name = person.get('first_name', '')
        last_name = person.get('last_name', '')
        city = person.get('current_city', '')
        state = person.get('current_state', '')

        search_url = (
            f"https://www.instantcheckmate.com/people/{first_name.lower()}-{last_name.lower()}"
            f"/{city.lower()}/{state.lower()}"
        )

        try:
            await page.goto(search_url, wait_until='domcontentloaded', timeout=30000)
        except Exception as e:
            return {'error': str(e)}

        await self.accept_cookies(page)
        await asyncio.sleep(2)

        if await self.handle_captcha(page):
            content = await page.content()
            if any(x in content.lower() for x in ['cloudflare', 'access denied', '403', 'are you a robot']):
                return {'status': 'blocked', 'reason': 'cloudflare'}
            return {'status': 'blocked', 'reason': 'captcha'}

        content = await page.content()
        if any(phrase in content.lower() for phrase in ['no results', '0 results', 'not found', 'no records', 'no match']):
            return {'status': 'not_found'}

        # Click first result card
        try:
            first_result = page.locator('a[href*="/people/"]').first
            if await first_result.is_visible(timeout=3000):
                href = await first_result.get_attribute('href')
                if href:
                    profile_url = href if href.startswith('http') else f'https://www.instantcheckmate.com{href}'
                    await page.goto(profile_url, wait_until='domcontentloaded', timeout=30000)
                    await asyncio.sleep(2)
        except Exception:
            pass

        data = await self._extract_profile(page)

        return {
            'name': data.get('name'),
            'phone': data.get('phone'),
            'email': data.get('email'),
            'address': data.get('address'),
            'age': data.get('age'),
            'relatives': data.get('relatives', []),
            'criminal': data.get('criminal'),
            'url': page.url,
            'opt_out_url': 'https://www.instantcheckmate.com/opt-out',
            'source': 'instantcheckmate',
        }

    async def _extract_profile(self, page) -> dict:
        data = {'relatives': []}

        try:
            name_el = await page.query_selector('h1, [class*="name"], [class*="person-name"]')
            if name_el:
                data['name'] = (await name_el.inner_text()).strip()
        except Exception:
            pass

        try:
            phone_els = await page.query_selector_all('[class*="phone"], [class*="tel"]')
            phones = [(await el.inner_text()).strip() for el in phone_els[:3] if len((await el.inner_text()).strip()) > 7]
            data['phone'] = ', '.join(phones)
        except Exception:
            pass

        try:
            email_el = await page.query_selector('[class*="email"]')
            if email_el:
                data['email'] = (await email_el.inner_text()).strip()
        except Exception:
            pass

        try:
            addr_els = await page.query_selector_all('[class*="address"], [class*="location"]')
            addrs = [(await el.inner_text()).strip() for el in addr_els[:3] if len((await el.inner_text()).strip()) > 5]
            data['address'] = ' | '.join(addrs)
        except Exception:
            pass

        try:
            age_el = await page.query_selector('[class*="age"], [class*="born"]')
            if age_el:
                import re
                m = re.search(r'\d+', (await age_el.inner_text()))
                if m:
                    data['age'] = int(m.group())
        except Exception:
            pass

        try:
            rel_els = await page.query_selector_all('[class*="relative"], [class*="family"], [class*="known-as"]')
            data['relatives'] = [(await el.inner_text()).strip() for el in rel_els[:5] if len((await el.inner_text()).strip()) > 2]
        except Exception:
            pass

        # Check for criminal records
        try:
            criminal_els = await page.query_selector_all('[class*="criminal"], [class*="arrest"], [class*="misdemeanor"], [class*="felony"]')
            criminal_records = []
            for el in criminal_els[:5]:
                text = (await el.inner_text()).strip()
                if text and len(text) > 3:
                    criminal_records.append(text)
            if criminal_records:
                data['criminal'] = '; '.join(criminal_records)
        except Exception:
            pass

        return data
