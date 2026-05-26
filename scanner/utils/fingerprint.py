"""
Scrubbed.Pro — Fingerprint utilities
Browser fingerprint randomization for anti-detection.
"""

import random
import asyncio


# Realistic screen resolutions
SCREEN_RESOLUTIONS = [
    (1920, 1080), (2560, 1440), (3840, 2160),
    (1440, 900), (1680, 1050), (1536, 864),
]

# Timezones
TIMEZONES = [
    'America/New_York', 'America/Chicago', 'America/Denver',
    'America/Los_Angeles', 'America/Phoenix', 'Europe/London',
]


def random_viewport():
    w, h = random.choice(SCREEN_RESOLUTIONS)
    return {
        'width': random.randint(w - 100, w),
        'height': random.randint(h - 100, h),
    }


def random_timezone():
    return random.choice(TIMEZONES)


async def apply_fingerprint(context, page):
    """
    Apply randomized fingerprint to a Playwright page.
    Call after creating a new context but before navigating.
    """
    # Random timezone
    tz = random_timezone()
    await context.add_init_script(f"""
        Intl.DateTimeFormat.prototype.resolvedOptions = () => (
            {{ timeZone: '{tz}' }}
        );
    """)

    # Canvas noise (makes canvas fingerprinting less reliable)
    await context.add_init_script("""
        const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function(...args) {
            const ctx = this.getContext('2d');
            if (ctx) {
                const imageData = ctx.getImageData(0, 0, this.width, this.height);
                for (let i = 0; i < imageData.data.length; i += 4) {
                    imageData.data[i]   = imageData.data[i]   ^ (Math.random() * 0.1 * 255);
                    imageData.data[i+1] = imageData.data[i+1] ^ (Math.random() * 0.1 * 255);
                    imageData.data[i+2] = imageData.data[i+2] ^ (Math.random() * 0.1 * 255);
                }
                ctx.putImageData(imageData, 0, 0);
            }
            return origToDataURL.apply(this, args);
        };
    """)