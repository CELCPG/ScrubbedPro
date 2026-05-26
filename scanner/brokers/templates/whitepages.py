"""
Scrubbed.Pro — Whitepages Scraper
Whitepages aggregates public records, phone data, and address history.
Opt-out: https://www.whitepages.com/suppression
"""

import asyncio
from ..scraper import BaseScraper


class WhitepagesScraper(BaseScraper):

    async def scrape(self, person: dict) -> dict:
        page = await self.new_page()

        first_name = person.get('first_name', '')
        last_name = person.get('last_name', '')
        city = person.get('current_city', '')
        state = person.get('current_state', '')

        search_url = (
            f"https://www.whitepages.com/search?who={first_name}+{last_name}"
            f"&where={city},{state}"
        )

        try:
            await page.goto(search_url, wait_until='domcontentloaded', timeout=30000)
        except Exception as e:
            return {'error': str(e)}

        await self.accept_cookies(page)
        await asyncio.sleep(1.5)

        if await self.handle_captcha(page):
            content = await page.content()
            if any(x in content.lower() for x in ['cloudflare', 'access denied', '403']):
                return {'status': 'blocked', 'reason': 'cloudflare'}
            return {'status': 'blocked', 'reason': 'captcha'}

        content = await page.content()
        if any(x in content.lower() for x in ['no results', '0 results', 'couldn\'t find']):
            return {'status': 'not_found'}

        # Collect profile links
        profile_links: list[str] = []
        try:
            links = await page.query_selector_all('a[href*="/person/"]')
            for link in links[:5]:
                href = await link.get_attribute('href')
                if href and href not in profile_links:
                    full_url = href if href.startswith('http') else f'https://www.whitepages.com{href}'
                    profile_links.append(full_url)
        except Exception:
            pass

        if not profile_links:
            return {'status': 'not_found'}

        # Visit top result
        profile_url = profile_links[0]
        try:
            await page.goto(profile_url, wait_until='domcontentloaded', timeout=30000)
            await asyncio.sleep(2)
        except Exception as e:
            return {'error': str(e), 'url': profile_url}

        data = await self._extract_profile(page)

        return {
            'name': data.get('name'),
            'phone': data.get('phone'),
            'address': data.get('address'),
            'email': data.get('email'),
            'age': data.get('age'),
            'relatives': data.get('relatives', []),
            'url': profile_url,
            'opt_out_url': 'https://www.whitepages.com/suppression',
            'source': 'whitepages',
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
            phones = [(await el.inner_text()).strip() for el in phone_els[:3] if len(await el.inner_text()) > 6]
            data['phone'] = ', '.join(phones)
        except Exception:
            pass

        try:
            addr_els = await page.query_selector_all('[class*="address"], [class*="location"]')
            addrs = [(await el.inner_text()).strip() for el in addr_els[:3] if len(await el.inner_text()) > 5]
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
            rel_els = await page.query_selector_all('[class*="relative"], [class*="family"], [class*="member"]')
            data['relatives'] = [(await el.inner_text()).strip() for el in rel_els[:5] if len(await el.inner_text()) > 2]
        except Exception:
            pass

        return data
