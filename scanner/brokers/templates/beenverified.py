"""
Scrubbed.Pro — BeenVerified Scraper
BeenVerified provides background checks including criminal records, relatives, and contact info.
Opt-out: https://www.beenverified.com/optout
"""

import asyncio
from ..scraper import BaseScraper


class BeenVerifiedScraper(BaseScraper):

    async def scrape(self, person: dict) -> dict:
        page = await self.new_page()

        first_name = person.get('first_name', '')
        last_name = person.get('last_name', '')
        city = person.get('current_city', '')
        state = person.get('current_state', '')

        # BeenVerified uses /people/{first}-{last}/{city}/{state} URL pattern
        search_url = (
            f"https://www.beenverified.com/people/{first_name.lower()}-{last_name.lower()}"
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
        if any(phrase in content.lower() for phrase in ['no results', '0 results', 'not found', 'no records']):
            return {'status': 'not_found'}

        # Click first result card if we see a list
        try:
            first_result = page.locator('a[href*="/people/"]').first
            if await first_result.is_visible(timeout=3000):
                href = await first_result.get_attribute('href')
                if href:
                    profile_url = href if href.startswith('http') else f'https://www.beenverified.com{href}'
                    await page.goto(profile_url, wait_until='domcontentloaded', timeout=30000)
                    await asyncio.sleep(2)
        except Exception:
            pass

        data = await self._extract_profile(page, person)
        current_url = page.url

        return {
            'name': data.get('name'),
            'phone': data.get('phone'),
            'email': data.get('email'),
            'address': data.get('address'),
            'age': data.get('age'),
            'relatives': data.get('relatives', []),
            'criminal': data.get('criminal'),
            'url': current_url,
            'opt_out_url': 'https://www.beenverified.com/optout',
            'source': 'beenverified',
        }

    async def _extract_profile(self, page, person: dict) -> dict:
        data = {'relatives': []}

        try:
            name_el = await page.query_selector('h1, h2[class*="name"], [class*="person-name"]')
            if name_el:
                data['name'] = (await name_el.inner_text()).strip()
        except Exception:
            pass

        try:
            phone_els = await page.query_selector_all('[class*="phone"]')
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
            rel_section = page.locator('[class*="relative"], [class*="family"], [class*="associates"]')
            if await rel_section.count() > 0:
                rel_els = await rel_section.all()
                relatives = []
                for section in rel_els:
                    try:
                        items = await section.query_selector_all('a, span')
                        for item in items:
                            text = (await item.inner_text()).strip()
                            if text and len(text) > 2 and text != data.get('name', ''):
                                relatives.append(text)
                    except Exception:
                        pass
                data['relatives'] = list(dict.fromkeys(relatives))[:5]
        except Exception:
            pass

        # Check for criminal records section
        try:
            criminal_el = await page.query_selector('[class*="criminal"], [class*="criminal-record"]')
            if criminal_el and await criminal_el.is_visible():
                data['criminal'] = (await criminal_el.inner_text()).strip()
        except Exception:
            pass

        return data
