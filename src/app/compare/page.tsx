import { Metadata } from 'next'
import Link from 'next/link'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Data Broker Removal Services Compared — 2026 | Scrubbed.Pro',
  description:
    'Compare DeleteMe, Optery, Incogni, OneRep, and Scrubbed.Pro on price, broker coverage, automation, phone number removal, and free trial. See which service actually works.',
}

const competitors = [
  { name: 'DeleteMe', price: '$10.92/mo', brokers: '~100+', autorescan: '❌', phone: 'Limited', trial: '❌', href: '/compare/deleteme' },
  { name: 'Optery', price: 'Free (limited)', brokers: '~50', autorescan: '❌', phone: '❌', trial: '❌', href: '/compare/optery' },
  { name: 'Incogni', price: '$6.50/mo', brokers: 'EU-heavy', autorescan: '✅', phone: '❌', trial: '❌', href: '/compare/incogni' },
  { name: 'OneRep', price: '$8.33/mo', brokers: '~100+', autorescan: 'Partial', phone: 'Partial', trial: '❌', href: '/compare/onerep' },
]

const scrubbed = {
  name: 'Scrubbed.Pro',
  price: '$X/mo',
  brokers: '200+',
  autorescan: '✅',
  phone: '✅',
  trial: '✅',
  href: '/signup',
}

const comparisonRows = [
  { feature: 'Monthly price' },
  { feature: 'Brokers covered' },
  { feature: 'Automated monthly re-scan' },
  { feature: 'Auto re-submission' },
  { feature: 'Phone number removal' },
  { feature: 'Robocall risk scoring' },
  { feature: 'Free trial' },
]

function getValue(competitor: typeof competitors[0], feature: string): string {
  switch (feature) {
    case 'Monthly price': return competitor.price
    case 'Brokers covered': return competitor.brokers
    case 'Automated monthly re-scan': return competitor.autorescan
    case 'Auto re-submission': return competitor.autorescan === '✅' ? '✅' : '❌'
    case 'Phone number removal': return competitor.phone
    case 'Robocall risk scoring': return competitor.phone === '✅' ? '✅' : '❌'
    case 'Free trial': return competitor.trial
    default: return '—'
  }
}

export default function ComparePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Data Broker Removal Services Compared — 2026',
    description:
      'Head-to-head comparison of DeleteMe, Optery, Incogni, OneRep, and Scrubbed.Pro across price, broker coverage, automation, and US focus.',
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
          <div className="max-w-5xl mx-auto">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Compare</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Data Broker Removal Services Compared
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Not all services are equal. We put five major data broker removal tools side by side so you can see exactly what you&apos;re paying for — and what you&apos;re not.
            </p>
          </div>
        </section>

        {/* Main Comparison Table */}
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

          <Card className="overflow-hidden">
            <div className="bg-slate-900 px-6 py-4">
              <h2 className="text-white font-semibold text-lg">Side-by-Side Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Feature</th>
                    {competitors.map((c) => (
                      <th key={c.name} className="text-center px-3 py-3 font-semibold text-slate-700">{c.name}</th>
                    ))}
                    <th className="text-center px-3 py-3 font-semibold text-blue-700 bg-blue-50">Scrubbed.Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-3 font-medium text-slate-800">{row.feature}</td>
                      {competitors.map((c) => (
                        <td key={c.name} className="text-center px-3 py-3 text-slate-600">{getValue(c, row.feature)}</td>
                      ))}
                      <td className="text-center px-3 py-3 font-semibold text-blue-700 bg-blue-50">
                        {row.feature === 'Monthly price' ? scrubbed.price
                          : row.feature === 'Brokers covered' ? scrubbed.brokers
                          : row.feature === 'Automated monthly re-scan' ? scrubbed.autorescan
                          : row.feature === 'Auto re-submission' ? scrubbed.autorescan
                          : row.feature === 'Phone number removal' ? scrubbed.phone
                          : row.feature === 'Robocall risk scoring' ? '✅'
                          : scrubbed.trial}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Individual comparison cards */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Deep Dives</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {competitors.map((comp) => (
                <Card key={comp.name} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{comp.name}</h3>
                      <p className="text-slate-600 text-sm">{comp.price}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${comp.price === 'Free (limited)' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {comp.price === 'Free (limited)' ? 'Free tier' : 'Paid'}
                    </span>
                  </div>
                  <ul className="space-y-1.5 mb-5 text-sm text-slate-600">
                    <li>• {comp.brokers} brokers covered</li>
                    <li>• Auto re-scan: {comp.autorescan}</li>
                    <li>• Phone removal: {comp.phone}</li>
                  </ul>
                  <a href={comp.href}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Read full comparison →
                    </Button>
                  </a>
                </Card>
              ))}
            </div>
          </div>

          {/* How we stack up */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-5">How Scrubbed.Pro Stacks Up</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { stat: '200+', label: 'Brokers covered', sub: 'More than DeleteMe, OneRep, and Incogni' },
                { stat: '✅', label: 'Monthly auto re-scan', sub: 'Competitors either don\'t re-scan or do it manually' },
                { stat: '✅', label: 'Phone number removal', sub: 'Incogni and Optery don\'t cover this' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{item.stat}</div>
                  <div className="font-semibold text-slate-900">{item.label}</div>
                  <div className="text-sm text-slate-600">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-slate-900 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              See how we stack up → Start your free scan.
            </h2>
            <p className="text-slate-300 mb-6">
              Automated removal across 200+ brokers. Monthly re-scans. Real-time dashboard. No manual work required.
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

          {/* Navigation links */}
          <div className="flex flex-wrap gap-4 text-sm text-blue-600">
            <a href="/how-it-works" className="hover:underline">How it works →</a>
            <a href="/pricing" className="hover:underline">Pricing →</a>
            <a href="/signup" className="hover:underline">Start free scan →</a>
            <a href="/compare/deleteme" className="hover:underline">DeleteMe comparison →</a>
            <a href="/compare/optery" className="hover:underline">Optery comparison →</a>
            <a href="/compare/incogni" className="hover:underline">Incogni comparison →</a>
            <a href="/compare/onerep" className="hover:underline">OneRep comparison →</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}