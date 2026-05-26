import { Metadata } from 'next'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'OneRep vs Scrubbed.Pro — Privacy Battle (2026)',
  description:
    'OneRep vs Scrubbed.Pro: identity theft monitoring vs automated broker removal. Comparing setup complexity, broker coverage, price, and ongoing protection.',
}

const competitorPros = [
  'Good Google de-indexing — removes links from search results effectively',
  'Includes identity theft monitoring as part of the service',
  'Covers a decent range of data brokers',
  'Active in the privacy tool space with some community trust',
]

const competitorCons = [
  '$8.33/month — higher price without full automation',
  'Smaller broker list compared to Scrubbed.Pro',
  'Setup can be complex and time-consuming',
  'Less transparency on re-scan and re-submission processes',
]

const whyPeopleSwitch = [
  'OneRep charges $8.33/mo but still leaves gaps in broker coverage',
  'Scrubbed.Pro covers 200+ brokers — more than OneRep\'s smaller list',
  'Simple setup vs OneRep\'s multi-step onboarding',
  'Our dashboard gives you a clear, real-time view of every removal — no guesswork',
  'Auto re-scanning means we stay on top of re-listings automatically',
]

const comparisonData = [
  { feature: 'Monthly price', onerep: '$8.33/mo', scrubbed: '$X/mo' },
  { feature: 'Brokers covered', onerep: '~100+', scrubbed: '200+' },
  { feature: 'Automated re-scan', onerep: 'Limited', scrubbed: '✅' },
  { feature: 'Auto re-submission', onerep: '❌', scrubbed: '✅' },
  { feature: 'Phone number removal', onerep: 'Partial', scrubbed: '✅' },
  { feature: 'Simple setup', onerep: '❌', scrubbed: '✅' },
  { feature: 'Google de-indexing', onerep: '✅', scrubbed: '✅' },
  { feature: 'Identity theft monitoring', onerep: '✅', scrubbed: '❌' },
]

export default function OneRepComparePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'OneRep vs Scrubbed.Pro — Privacy Battle (2026)',
    description:
      'Comparing OneRep and Scrubbed.Pro across broker coverage, setup complexity, automation, and US privacy protection.',
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
              OneRep vs Scrubbed.Pro — Privacy Battle
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Both aim to remove your data from broker sites. But the coverage, automation, and day-to-day experience aren&apos;t the same. Here&apos;s the breakdown.
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
                    <th className="text-center px-4 py-3 font-semibold text-slate-700">OneRep</th>
                    <th className="text-center px-4 py-3 font-semibold text-blue-700">Scrubbed.Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-3 font-medium text-slate-800">{row.feature}</td>
                      <td className="text-center px-4 py-3 text-slate-600">{row.onerep}</td>
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
              <h2 className="text-xl font-bold text-slate-900 mb-4">What OneRep Does Well</h2>
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
              <h2 className="text-xl font-bold text-slate-900 mb-4">Where OneRep Falls Short</h2>
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
                  title: 'More Brokers, Better Coverage',
                  desc: '200+ brokers covered vs OneRep\'s smaller list. More brokers removed means less of your data out there.',
                },
                {
                  title: 'Simpler Setup',
                  desc: 'OneRep\'s onboarding can be involved. Scrubbed.Pro gets you going faster with less friction.',
                },
                {
                  title: 'Real-Time Dashboard Visibility',
                  desc: 'See every removal, every status, every update. No wondering whether your data is actually gone.',
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
              More brokers. Simpler setup. Better visibility.
            </h2>
            <p className="text-slate-300 mb-6">
              Scrubbed.Pro removes your data across 200+ brokers, re-scans monthly, and gives you a dashboard that actually tells you where things stand.
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