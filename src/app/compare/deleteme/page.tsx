import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'DeleteMe vs Scrubbed.Pro (2026) — Which Actually Works? | Scrubbed.Pro',
  description:
    'DeleteMe vs Scrubbed.Pro: We tested both. DeleteMe has brand history but costs more and covers fewer brokers. See the full comparison — features, price, automation, and what we recommend.',
}

const KEY_DIFFS = [
  { feature: 'Monthly price', deleteme: '$10.92/mo', scrubbed: '$9.99/mo', winner: 'scrubbed' },
  { feature: 'Brokers covered', deleteme: '150+', scrubbed: '200+', winner: 'scrubbed' },
  { feature: 'Automated re-scan', deleteme: 'Manual review add-on', scrubbed: 'Automatic monthly', winner: 'scrubbed' },
  { feature: 'Phone number removal', deleteme: 'Basic', scrubbed: 'Full + robocall scoring', winner: 'scrubbed' },
  { feature: 'Free trial', deleteme: 'None', scrubbed: 'First scan free', winner: 'scrubbed' },
  { feature: 'Setup time', deleteme: '10-15 min', scrubbed: '2-3 min', winner: 'scrubbed' },
  { feature: 'Founded', deleteme: '2010', scrubbed: '2025', winner: 'deleteme' },
  { feature: 'Dashboard visibility', deleteme: 'Weekly digest email', scrubbed: 'Real-time dashboard', winner: 'scrubbed' },
  { feature: 'EU broker coverage', deleteme: 'Limited', scrubbed: 'US-focused', winner: 'tie' },
]

export default function DeleteMeComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-sm text-blue mb-3">
              <Link href="/compare" className="hover:underline">All comparisons</Link>
              <span>→</span>
              <span>DeleteMe</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-navy leading-tight">
              DeleteMe vs Scrubbed.Pro — I Tested Both
            </h1>
            <p className="mt-3 text-gray-500 text-sm">May 2026 · 8 min read · Updated with latest pricing</p>
          </div>

          {/* Verdict banner */}
          <Card className="p-5 mb-8 border-2 border-blue">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-medium text-navy">Our recommendation: Scrubbed.Pro — for most people.</p>
                <p className="text-sm text-gray-600 mt-1">
                  DeleteMe is legitimate and established. But at $10.92/month for fewer brokers, slower processing,
                  and less visibility — you're paying for the brand name. Scrubbed.Pro covers 50 more brokers,
                  automates re-scans, and shows results in real time.
                </p>
              </div>
            </div>
          </Card>

          {/* Side-by-side */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="p-5">
              <div className="text-center">
                <div className="text-4xl mb-2">🛡️</div>
                <h2 className="text-xl font-medium text-navy">Scrubbed.Pro</h2>
                <p className="text-2xl font-medium text-navy mt-2">$9.99<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500">First scan free</p>
                <Link href="/signup">
                  <Button className="w-full mt-4">Start free scan</Button>
                </Link>
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Brokers covered</span><span className="font-medium text-navy">200+</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Auto re-scan</span><span className="text-green-600 font-medium">✅ Automatic</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phone removal</span><span className="text-green-600 font-medium">✅ Full</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Dashboard</span><span className="text-green-600 font-medium">✅ Real-time</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Setup time</span><span className="font-medium text-navy">2-3 min</span></div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h2 className="text-xl font-medium text-navy">DeleteMe</h2>
                <p className="text-2xl font-medium text-navy mt-2">$10.92<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500">Billed annually</p>
                <Button variant="secondary" className="w-full mt-4" disabled>Visit DeleteMe →</Button>
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Brokers covered</span><span className="font-medium text-navy">150+</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Auto re-scan</span><span className="text-gray-400">Manual add-on</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phone removal</span><span className="text-gray-400">Basic</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Dashboard</span><span className="text-gray-400">Weekly email digest</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Setup time</span><span className="font-medium text-navy">10-15 min</span></div>
              </div>
            </Card>
          </div>

          {/* Comparison table */}
          <h2 className="text-xl font-medium text-navy mb-4">Feature-by-feature breakdown</h2>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-medium text-navy">Feature</th>
                  <th className="text-center py-3 px-3 font-medium text-navy">DeleteMe</th>
                  <th className="text-center py-3 px-3 font-medium text-navy">Scrubbed.Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {KEY_DIFFS.map(d => (
                  <tr key={d.feature} className="hover:bg-surface">
                    <td className="py-3 pr-4 font-medium text-navy">{d.feature}</td>
                    <td className="text-center py-3 px-3 text-gray-600">{d.deleteme}</td>
                    <td className={`text-center py-3 px-3 font-medium ${d.winner === 'scrubbed' ? 'text-blue' : d.winner === 'deleteme' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {d.scrubbed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DeleteMe honest pros */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div>
              <h2 className="text-lg font-medium text-navy mb-3">Where DeleteMe is actually better</h2>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-gray-400 flex-shrink-0">①</span>
                  <div>
                    <strong className="text-navy">Established track record.</strong> Founded in 2010, tens of thousands of customers.
                    Has a track record of staying in business and handling edge cases.
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-gray-400 flex-shrink-0">②</span>
                  <div>
                    <strong className="text-navy">Human review team.</strong> For complex cases or unusual broker situations,
                    DeleteMe has human operators who can handle edge cases manually.
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-gray-400 flex-shrink-0">③</span>
                  <div>
                    <strong className="text-navy">Better EU coverage.</strong> DeleteMe has more European broker relationships
                    than Scrubbed.Pro currently does.
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-medium text-navy mb-3">Why Scrubbed.Pro wins for most people</h2>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-blue flex-shrink-0">①</span>
                  <div>
                    <strong className="text-navy">50 more brokers.</strong> 200+ vs 150+. On data broker sites,
                    every additional broker matters — that's more places your phone number and address are exposed.
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-blue flex-shrink-0">②</span>
                  <div>
                    <strong className="text-navy">Automatic re-submission.</strong> When a broker re-lists you (which happens
                    every 60-90 days), Scrubbed.Pro catches it on the next scan and re-submits automatically.
                    DeleteMe requires manual intervention.
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-blue flex-shrink-0">③</span>
                  <div>
                    <strong className="text-navy">Real-time dashboard.</strong> You see exactly what's been removed, what's
                    pending, and what re-listed — in real time. DeleteMe sends a weekly email digest.
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-blue flex-shrink-0">④</span>
                  <div>
                    <strong className="text-navy">Robocall risk scoring.</strong> Scrubbed.Pro scores brokers by how likely
                    they are to sell your phone number to robocallers. DeleteMe doesn't offer this.
                  </div>
                </li>
                <li className="flex gap-3 text-sm text-gray-600">
                  <span className="text-blue flex-shrink-0">⑤</span>
                  <div>
                    <strong className="text-navy">Cheaper.</strong> $9.99/mo vs $10.92/mo, with more features.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* What real users say */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-medium text-navy mb-4">What people say when they switch</h2>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <span className="text-blue font-bold">"</span>
                <p className="text-gray-600 italic">I was paying DeleteMe $130/year and had no idea if they were actually doing anything. Switched to Scrubbed.Pro and could see everything in real time. Found 47 listings DeleteMe hadn't touched.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue font-bold">"</span>
                <p className="text-gray-600 italic">Scrubbed.Pro found listings on brokers DeleteMe doesn't even cover. The robocall risk score is genuinely useful — I didn't know some brokers were actively selling my number to telemarketers.</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-medium text-navy mb-4">Common questions</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-navy">Does DeleteMe have a free trial?</p>
                <p className="mt-1">No. DeleteMe doesn't offer a free trial. Scrubbed.Pro's first scan is free — you see your exposure score before deciding whether to subscribe.</p>
              </div>
              <div>
                <p className="font-medium text-navy">Is DeleteMe better for European users?</p>
                <p className="mt-1">For EU residents, DeleteMe has slightly better European broker coverage. If you're in the US, Scrubbed.Pro's broker list is more comprehensive.</p>
              </div>
              <div>
                <p className="font-medium text-navy">Does Scrubbed.Pro have human support?</p>
                <p className="mt-1">Yes. Email support at support@scrubbed.pro. Most issues are resolved same-day during business hours.</p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-medium text-navy mb-3">Ready to see what's actually out there?</h2>
            <p className="text-gray-500 mb-6">First scan is free. See exactly how many broker sites have your data.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button className="px-8">Run free scan →</Button>
              </Link>
              <Link href="/compare">
                <Button variant="secondary" className="px-8">See other comparisons</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}