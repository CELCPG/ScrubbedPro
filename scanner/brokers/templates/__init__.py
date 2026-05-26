"""
Scrubbed.Pro — Broker Templates
Each broker gets its own scraper class extending BaseScraper.
Import from here: from .brokers.templates import SpokeoScraper, etc.
"""

from .spokeo import SpokeoScraper
from .whitepages import WhitepagesScraper
from .beenverified import BeenVerifiedScraper
from .intelius import InteliusScraper
from .radaris import RadarisScraper
from .peoplefinder import PeopleFinderScraper
from .instantcheckmate import InstantCheckmateScraper
from .mylife import MyLifeScraper

__all__ = [
    "SpokeoScraper",
    "WhitepagesScraper",
    "BeenVerifiedScraper",
    "InteliusScraper",
    "RadarisScraper",
    "PeopleFinderScraper",
    "InstantCheckmateScraper",
    "MyLifeScraper",
]
