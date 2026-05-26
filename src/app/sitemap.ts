import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://scrubbed.pro'
  return [
    // Main marketing
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    // SEO hub pages
    { url: `${base}/best`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    // Comparison pages
    { url: `${base}/compare/deleteme`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/compare/optery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/compare/incogni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/compare/onerep`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // How-to guides
    { url: `${base}/guides/remove-from-spokeo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/remove-from-whitepages`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/remove-from-beenverified`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/guides/remove-from-intelius`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    // Legal
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ]
}