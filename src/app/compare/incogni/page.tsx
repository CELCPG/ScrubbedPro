import { Metadata } from 'next'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Incogni vs Scrubbed.Pro — Which One Actually Protects You? (2026)',
  description:
    'Incogni vs Scrubbed.Pro: $6.50/mo EU-focused service vs US-first automation. We compare broker coverage, phone number removal, robocall protection, and re-scan frequency.',
}

const competitorPros = [
  '$6.50/month — most affordable paid option',
  'Covers EU-based brokers that US-only services miss',
  'Clean, modern user interface',
  'Automated removal process for supported brokers',
]

const competitorCons = [
  'EU-focused broker list — fewer US data brokers covered',
  'No phone number removal service',
  'No robocall risk scoring or exposure analysis',
  'Less visibility into which US brokers are exposing your data',
]

const whyPeopleSwitch = [
  'US-focused users get better coverage with Scrubbed.Pro — we target the brokers Americans actually use',
  'No phone number removal means your phone is still exposed to spam and robocalls',
  'Incogni doesn\'t score your data exposure — we tell you exactly how at-risk you are',
  'Our robocall risk scoring gives you actionable data, not just removals',
  'If your main concern is US brokers, Incogni\'s EU tilt leaves gaps',
]

const comparisonData = [
  { feature: 'Monthly price', incogni: '$6.50/mo', scrubbed: '$X/mo' },
  { feature: 'Brokers covered', incogni: 'EU-heavy', scrubbed: '200+ (US-first)' },
  { feature: 'Phone number removal', incogni: '❌', scrubbed: '✅' },
  { feature: 'Robocall risk scoring', incogni: '❌', scrubbed: '✅' },
  { feature: 'US broker coverage', incogni: 'Limited', scrubbed: '✅' },
  { feature: 'Monthly re-scan', incogni: '✅', scrubbed: '✅' },
  { feature: 'Auto re-submission', incogni: '✅', scrubbed: '✅' },
  { feature: 'Free trial', incogni: '❌', scrubbed: '✅' },
]

export default function IncogniComparePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Incogni vs Scrubbed.Pro — Which One Actually Protects You? (2026)',
    description:
      'Incogni vs Scrubbed.Pro: comparing EU vs US broker coverage, phone number removal, robocall protection, and automation.',
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
              Incogni vs Scrubbed.Pro — Which One Actually Protects You?
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Incogni wins on price. But if you&apos;re in the US and care about stopping robocalls and phone number exposure, the math changes.
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
                    <th className="text-center px-4 py-3 font-semibold text-slate-700">Incogni</th>
                    <th className="text-center px-4 py-3 font-semibold text-blue-700">Scrubbed.Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-3 font-medium text-slate-800">{row.feature}</td>
                      <td className="text-center px-4 py-3 text-slate-600">{row.incogni}</td>
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
              <h2 className="text-xl font-bold text-slate-900 mb-4">What Incogni Does Well</h2>
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
              <h2 className="text-xl font-bold text-slate-900 mb-4">Where Incogni Falls Short</h2>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What Makes Scrubbed.Pro Different</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'US-First Broker Database',
                  desc: 'Our broker list targets the 200+ data brokers that US residents actually appear in — not EU-centric services with limited US reach.',
                },
                {
                  title: 'Phone Number Removal',
                  desc: 'We actively remove your phone number from broker databases, directly reducing robocall and spam exposure.',
                },
                {
                  title: 'Robocall Risk Scoring',
                  desc: 'We analyze which data points are driving calls to your number and score your overall exposure. Incogni doesn\'t offer this.',
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
              Your phone number is still exposed. Incogni won&apos;t fix that.
            </h2>
            <p className="text-slate-300 mb-6">
              Scrubbed.Pro removes your phone from brokers, scores your robocall risk, and re-scans every month — US-focused, end to end.
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