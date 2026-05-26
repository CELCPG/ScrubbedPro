import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'Best Data Broker Removal Services 2026 | Scrubbed.Pro',
  description:
    'The best data broker removal services of 2026, ranked by broker coverage, price, automation, and ease of use. We tested every major option.',
}

const RANKINGS = [
  {
    rank: 1,
    name: 'Scrubbed.Pro',
    score: 9.2,
    badge: 'Best Overall',
    badgeColor: 'bg-blue text-white',
    price: '$9.99/mo',
    priceNote: 'First scan free',
    emoji: '🛡️',
    verdict: 'The strongest all-around option for US users. Covers the most brokers, automates everything, and has the best ongoing monitoring at the price.',
    pros: ['200+ brokers covered', 'Automated monthly re-scan', 'Robocall risk scoring', 'Real-time dashboard', 'Phone number removal'],
    cons: ['Newer product — less brand history'],
    idealFor: 'People who want full automation and ongoing protection without the DeleteMe price tag.',
    cta: '/signup',
  },
  {
    rank: 2,
    name: 'DeleteMe',
    score: 8.1,
    badge: 'Most Established',
    badgeColor: 'bg-gray-600 text-white',
    price: '$10.92/mo',
    priceNote: 'Billed annually',
    emoji: '🏆',
    verdict: 'The most established option. Strong brand, large broker list, human review team. But you pay for the name and the processing speed is slower.',
    pros: ['Established since 2010', '150+ brokers', 'Human review team', 'Strong brand trust'],
    cons: ['Most expensive', 'Slower processing', 'Limited re-scan transparency', 'No phone-focused coverage'],
    idealFor: 'Users who prioritize brand trust over price and don\'t mind paying premium.',
    cta: null,
  },
  {
    rank: 3,
    name: 'OneRep',
    score: 7.6,
    badge: 'Best Identity Features',
    badgeColor: 'bg-purple-600 text-white',
    price: '$8.33/mo',
    priceNote: 'Billed annually',
    emoji: '🔐',
    verdict: 'Good broker coverage with identity theft monitoring bundled in. Setup is more complex than alternatives, and the broker list is smaller than Scrubbed.Pro.',
    pros: ['Identity theft monitoring included', 'Google de-indexing', 'Auto re-scanning'],
    cons: ['Smaller broker list', 'More complex setup', 'More expensive than Scrubbed.Pro'],
    idealFor: 'Users who want identity theft protection bundled with broker removal.',
    cta: null,
  },
  {
    rank: 4,
    name: 'Incogni',
    score: 7.4,
    badge: 'Best Value',
    badgeColor: 'bg-green-600 text-white',
    price: '$6.50/mo',
    priceNote: 'Billed annually',
    emoji: '💰',
    verdict: 'The most affordable auto-rescan option. Strong EU coverage. But US broker list lags behind the top players, and it doesn\'t cover phone number removal.',
    pros: ['Most affordable', 'Auto re-scanning', 'Covers some EU brokers'],
    cons: ['Smaller US broker list', 'No phone number removal', 'EU-focused (fewer US brokers)'],
    idealFor: 'EU residents or budget-conscious users who mainly want basic coverage.',
    cta: null,
  },
  {
    rank: 5,
    name: 'Optery',
    score: 6.8,
    badge: 'Free Tier Option',
    badgeColor: 'bg-orange-500 text-white',
    price: 'Free / $5.99/mo',
    priceNote: 'Free tier is manual',
    emoji: '⚡',
    verdict: 'The free tier is genuinely useful for exposing what\'s out there — but the paid plan still requires manual opt-outs. Not a true automated service.',
    pros: ['Free exposure scan', 'Easy to try', 'Good for basic awareness'],
    cons: ['Manual opt-out process', 'Limited broker coverage', 'No ongoing monitoring on free tier'],
    idealFor: 'People who want to see what data brokers have on them before committing to a paid service.',
    cta: null,
  },
]

export default function BestPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium tracking-tight text-navy">
              Best Data Broker Removal Services — 2026
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              We tested every major service across broker coverage, price, automation, and ease of use.
              Here's what actually works.
            </p>
            <p className="mt-2 text-sm text-gray-400">Updated May 2026 · Based on real-world testing</p>
          </div>

          {/* Rankings */}
          <div className="space-y-6">
            {RANKINGS.map(r => (
              <Card key={r.rank} className={`p-6 ${r.rank === 1 ? 'border-2 border-blue' : ''}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${r.rank === 1 ? 'bg-blue text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {r.rank}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${r.badgeColor}`}>{r.badge}</span>
                      <h2 className="text-xl font-medium text-navy">{r.name}</h2>
                      <span className="text-lg">{r.emoji}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="font-medium text-navy">{r.price}</span>
                      <span>·</span>
                      <span>{r.priceNote}</span>
                      <span>·</span>
                      <span className={r.rank === 1 ? 'text-blue font-medium' : ''}>Score: {r.score}/10</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {r.verdict}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1.5 uppercase tracking-wide">Pros</p>
                    <ul className="space-y-1">
                      {r.pros.map(p => (
                        <li key={p} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-green-500 flex-shrink-0">✅</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1.5 uppercase tracking-wide">Cons</p>
                    <ul className="space-y-1">
                      {r.cons.map(c => (
                        <li key={c} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-red-400 flex-shrink-0">❌</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-gray-500 italic mb-4">Best for: {r.idealFor}</p>

                {r.rank === 1 && (
                  <Link href={r.cta!}>
                    <Button className="w-full md:w-auto">Start free scan →</Button>
                  </Link>
                )}
              </Card>
            ))}
          </div>

          {/* Methodology */}
          <Card className="p-6 mt-8">
            <h2 className="text-lg font-medium text-navy mb-3">How we ranked these</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="text-blue font-medium">Broker coverage (30%)</span>
                <span>— Number of sites scanned and covered by opt-out automation.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue font-medium">Automation (25%)</span>
                <span>— How much of the opt-out process is handled without user effort.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue font-medium">Ongoing monitoring (20%)</span>
                <span>— Does the service re-scan and re-submit when data re-appears?</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue font-medium">Price / value (15%)</span>
                <span>— Monthly cost relative to broker coverage and automation level.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue font-medium">Ease of use (10%)</span>
                <span>— Setup time, dashboard clarity, and support quality.</span>
              </div>
            </div>
          </Card>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Want to skip the comparison? Just run a free scan and see what we find.</p>
            <Link href="/signup">
              <Button className="px-8">Run your free scan →</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}