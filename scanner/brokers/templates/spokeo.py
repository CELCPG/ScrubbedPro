"""
Scrubbed.Pro — Spokeo Scraper
Spokeo aggregates personal data from public records and social networks.
Opt-out: https://www.spokeo.com/privacy
"""

import asyncio
from ..scraper import BaseScraper


class SpokeoScraper(BaseScraper):
    """
    Spokeo people-search scraper.
    Search: https://www.spokeo.com/search?q={name}&location={city},{state}
    """

    async def scrape(self, person: dict) -> dict:
        """
        1. Search for the person
        2. Parse search results for profile links
        3. Visit the top result and extract exposed fields
        """
        page = await self.new_page()

        first_name = person.get('first_name', '')
        last_name = person.get('last_name', '')
        city = person.get('current_city', '')
        state = person.get('current_state', '')

        search_url = (
            f"https://www.spokeo.com/search?q={first_name}+{last_name}"
            f"&location={city},{state}"
        )

        try:
            await page.goto(search_url, wait_until='domcontentloaded', timeout=30000)
        except Exception as e:
            return {'error': str(e)}

        await self.accept_cookies(page)
        await asyncio.sleep(1.5)

        # Check for CAPTCHA / Cloudflare
        if await self.handle_captcha(page):
            content = await page.content()
            if 'cloudflare' in content.lower() or 'access denied' in content.lower():
                return {'status': 'blocked', 'reason': 'cloudflare'}
            return {'status': 'blocked', 'reason': 'captcha'}

        content = await page.content()
        if any(x in content.lower() for x in ['cloudflare', 'access denied', '403 forbidden', 'attention required']):
            return {'status': 'blocked', 'reason': 'cloudflare'}

        # Check for "no results"
        if any(phrase in content.lower() for phrase in ['no results found', 'we couldn\'t find', '0 results']):
            return {'status': 'not_found'}

        # Collect profile links from search results
        profile_links: list[str] = []
        try:
            # Spokeo result cards contain data-link attributes or anchor tags
            links = await page.query_selector_all('a[href*="/people/"]')
            for link in links[:5]:
                href = await link.get_attribute('href')
                if href and '/people/' in href and href not in profile_links:
                    full_url = href if href.startswith('http') else f'https://www.spokeo.com{href}'
                    profile_links.append(full_url)
        except Exception:
            pass

        if not profile_links:
            return {'status': 'not_found'}

        # Visit the first (most relevant) profile
        profile_url = profile_links[0]
        try:
            await page.goto(profile_url, wait_until='domcontentloaded', timeout=30000)
            await asyncio.sleep(2)
        except Exception as e:
            return {'error': str(e), 'url': profile_url}

        # Extract data from the profile page
        data = await self._extract_profile(page, person)

        # Try to navigate to opt-out from the profile
        opt_out_url = await self._get_opt_out_url(page)

        return {
            'name': data.get('name'),
            'phone': data.get('phone'),
            'email': data.get('email'),
            'address': data.get('address'),
            'age': data.get('age'),
            'relatives': data.get('relatives', []),
            'url': profile_url,
            'opt_out_url': opt_out_url,
            'source': 'spokeo',
        }

    async def _extract_profile(self, page, person: dict) -> dict:
        """Extract personal data from a Spokeo profile page."""
        data = {'relatives': []}

        try:
            # Name — usually in h1 or prominent heading
            name_el = await page.query_selector('h1, [class*="name"], [class*="person-name"]')
            if name_el:
                data['name'] = (await name_el.inner_text()).strip()
        except Exception:
            pass

        try:
            # Phone numbers
            phone_els = await page.query_selector_all('[class*="phone"], [class*="tel"]')
            phones = []
            for el in phone_els[:3]:
                text = (await el.inner_text()).strip()
                if text and len(text) >= 7:
                    phones.append(text)
            data['phone'] = ', '.join(phones) if phones else ''
        except Exception:
            pass

        try:
            # Email
            email_el = await page.query_selector('[class*="email"]')
            if email_el:
                data['email'] = (await email_el.inner_text()).strip()
        except Exception:
            pass

        try:
            # Address
            addr_els = await page.query_selector_all('[class*="address"], [class*="location"]')
            addrs = []
            for el in addr_els[:3]:
                text = (await el.inner_text()).strip()
                if text and len(text) > 5:
                    addrs.append(text)
            data['address'] = ' | '.join(addrs) if addrs else ''
        except Exception:
            pass

        try:
            # Age
            age_el = await page.query_selector('[class*="age"], [class*="born"]')
            if age_el:
                text = (await age_el.inner_text()).strip()
                import re
                m = re.search(r'\d+', text)
                if m:
                    data['age'] = int(m.group())
        except Exception:
            pass

        try:
            # Relatives
            rel_els = await page.query_selector_all('[class*="relative"], [class*="family"]')
            relatives = []
            for el in rel_els[:5]:
                text = (await el.inner_text()).strip()
                if text and len(text) > 2:
                    relatives.append(text)
            data['relatives'] = relatives
        except Exception:
            pass

        return data

    async def _get_opt_out_url(self, page) -> str | None:
        """Try to find the opt-out link on the profile page."""
        try:
            # Look for privacy / opt-out link
            opts = await page.query_selector_all(
                'a[href*="opt-out"], a[href*="privacy"], a[href*="remove"]'
            )
            for opt in opts:
                href = await opt.get_attribute('href')
                if href:
                    return href if href.startswith('http') else f'https://www.spokeo.com{href}'
        except Exception:
            pass
        # Fallback to the known opt-out page
        return 'https://www.spokeo.com/privacy'
