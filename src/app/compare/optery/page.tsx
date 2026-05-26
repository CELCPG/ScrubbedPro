import { Metadata } from 'next'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Optery vs Scrubbed.Pro — Free Tool vs Full Service (2026)',
  description:
    'Optery free tier vs Scrubbed.Pro full automation. We compare broker coverage, manual effort required, ongoing monitoring, and what you actually get for free.',
}

const competitorPros = [
  'Free tier available for basic opt-out coverage',
  'Good for users who want to DIY without spending money',
  'Covers a reasonable number of US brokers',
  'Simple, straightforward interface',
]

const competitorCons = [
  'Manual opt-out required — no automation, you do the work',
  'Free tier covers far fewer brokers than paid competitors',
  'No ongoing monitoring after initial removal',
  'Brokers re-list your data and you\'re back to square one without noticing',
]

const whyPeopleSwitch = [
  'Free tier sounds good until you realize you have to do the opt-outs yourself',
  'Scrubbed.Pro monitors continuously — you set it and forget it',
  '200+ brokers covered vs Optery\'s limited free list',
  'Auto re-scanning means we catch re-listings before they become a problem',
  'Most people spend more time managing Optery than they save',
]

const comparisonData = [
  { feature: 'Starting price', optery: 'Free (limited)', scrubbed: '$X/mo' },
  { feature: 'Brokers covered', optery: '~50 (free tier)', scrubbed: '200+' },
  { feature: 'Automated opt-out', optery: '❌', scrubbed: '✅' },
  { feature: 'Monthly re-scan', optery: '❌', scrubbed: '✅' },
  { feature: 'Phone number removal', optery: '❌', scrubbed: '✅' },
  { feature: 'Robocall risk scoring', optery: '❌', scrubbed: '✅' },
  { feature: 'Ongoing monitoring', optery: '❌', scrubbed: '✅' },
  { feature: 'Auto re-submission', optery: '❌', scrubbed: '✅' },
]

export default function OpteryComparePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Optery vs Scrubbed.Pro — Free Tool vs Full Service (2026)',
    description:
      'Comparing Optery free tier vs Scrubbed.Pro full automation across broker coverage, manual effort, and ongoing monitoring.',
    author: { '@type': 'Organization', name: 'Scrubbed.Pro' },
    datePublished: '2026-05-24',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingNav />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-slate-50 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Comparison</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Optery vs Scrubbed.Pro — Free Tool vs Full Service
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Optery&apos;s free tier is a solid starting point — but &quot;free&quot; means you do the work. Here&apos;s how the full picture stacks up.
            </p>
          </div>
        </section>

        {/* Body */}
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

          {/* Comparison Table */}
          <Card className="overflow-hidden">
            <div className="bg-slate-900 px-6 py-4">
              <h2 className="text-white font-semibold text-lg">Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="text-left px-6 py-3 font-semibold text-slate-700">Feature</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-700">Optery</th>
                    <th className="text-center px-4 py-3 font-semibold text-blue-700">Scrubbed.Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-3 font-medium text-slate-800">{row.feature}</td>
                      <td className="text-center px-4 py-3 text-slate-600">{row.optery}</td>
                      <td className="text-center px-4 py-3 font-semibold text-blue-700">{row.scrubbed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pros / Cons */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-t-4 border-green-500">
              <h2 className="text-xl font-bold text-slate-900 mb-4">What Optery Does Well</h2>
              <ul className="space-y-3">
                {competitorPros.map((pro) => (
                  <li key={pro} className="flex gap-3 text-slate-700">
                    <span className="text-green-500 mt-0.5">✅</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="border-t-4 border-red-400">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Where Optery Falls Short</h2>
              <ul className="space-y-3">
                {competitorCons.map((con) => (
                  <li key={con} className="flex gap-3 text-slate-700">
                    <span className="text-red-400 mt-0.5">⚠️</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Why People Switch */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-5">Why People Switch to Scrubbed.Pro</h2>
            <ul className="space-y-3">
              {whyPeopleSwitch.map((reason, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="text-blue-600 mt-0.5">→</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Differentiators */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Get With Scrubbed.Pro</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Fully Automated Removal',
                  desc: 'We handle the opt-outs. You get an always-up-to-date dashboard showing your removal status across 200+ brokers.',
                },
                {
                  title: '200+ Brokers Covered',
                  desc: 'Our broker list dwarfs Optery\'s free tier. US-first coverage means we catch the brokers that actually expose your data.',
                },
                {
                  title: 'Monthly Re-Scanning',
                  desc: 'We re-scan every month. If a broker re-lists you, we auto-submit again. You never have to check or follow up.',
                },
              ].map((item) => (
                <Card key={item.title} className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-slate-900 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Free tier costs you time. We cost $X/month and save you hours.
            </h2>
            <p className="text-slate-300 mb-6">
              Automated removal across 200+ brokers, monthly re-scans, and real-time status. No manual work required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <a href="/signup">Start free scan →</a>
              </Button>
              <Button size="lg" variant="secondary" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <a href="/pricing">See pricing</a>
              </Button>
            </div>
          </div>

          {/* Internal Links */}
          <div className="flex flex-wrap gap-4 text-sm text-blue-600">
            <a href="/how-it-works" className="hover:underline">How it works →</a>
            <a href="/pricing" className="hover:underline">Pricing →</a>
            <a href="/signup" className="hover:underline">Start free scan →</a>
            <a href="/compare" className="hover:underline">← All comparisons</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}