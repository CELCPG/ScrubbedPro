import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/dashboard', '/scan', '/removal', '/settings', '/api/'],
      },
    ],
    sitemap: 'https://scrubbed.pro/sitemap.xml',
  }
}