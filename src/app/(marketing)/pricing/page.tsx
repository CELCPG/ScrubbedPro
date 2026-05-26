import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'

const PLANS = [
  {
    name: 'Individual',
    monthly: 9,
    annual: 79,
    description: 'For one person who wants the spam calls to stop.',
    features: [
      '1 person monitored',
      '200+ data broker scan',
      'Monthly automatic re-scan',
      'Automated opt-out submissions',
      'Removal verification tracking',
      'Email alerts on re-listings',
    ],
    highlight: false,
  },
  {
    name: 'Family',
    monthly: 19,
    annual: 149,
    description: 'Protect everyone under your roof.',
    features: [
      'Up to 4 people monitored',
      '200+ broker scan per person',
      'Monthly automatic re-scans',
      'Automated opt-out submissions',
      'Family dashboard view',
      'Priority email support',
    ],
    highlight: true,
  },
  {
    name: 'Small Business',
    monthly: 49,
    annual: 399,
    description: 'For founders and small teams who want their information off the internet.',
    features: [
      'Up to 10 employees monitored',
      'Quarterly compliance reports',
      'Slack alert integration',
      'Priority support',
      'Bulk CSV employee import',
    ],
    highlight: false,
  },
]

const COMPARISON = [
  { feature: 'People monitored', individual: '1', family: '4', small_biz: '10' },
  { feature: 'Broker scans', individual: '200+', family: '200+ per person', small_biz: '200+ per person' },
  { feature: 'Automatic re-scans', individual: 'Monthly', family: 'Monthly', small_biz: 'Monthly' },
  { feature: 'Opt-out submissions', individual: '✓', family: '✓', small_biz: '✓' },
  { feature: 'Removal verification', individual: '✓', family: '✓', small_biz: '✓' },
  { feature: 'Re-listing alerts', individual: '✓', family: '✓', small_biz: '✓' },
  { feature: 'Family dashboard', individual: '—', family: '✓', small_biz: '—' },
  { feature: 'Quarterly reports', individual: '—', family: '—', small_biz: '✓' },
  { feature: 'Slack integration', individual: '—', family: '—', small_biz: '✓' },
  { feature: 'Bulk CSV import', individual: '—', family: '—', small_biz: '✓' },
  { feature: 'Priority support', individual: 'Standard', family: 'Priority', small_biz: 'Priority' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-medium tracking-tight text-navy text-center">Pricing</h1>
          <p className="mt-3 text-gray-500 text-center">No contracts. No surprise charges. Cancel anytime.</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div key={i} className={`rounded-2xl border-2 bg-white p-6 ${plan.highlight ? 'border-navy shadow-lg' : 'border-gray-100'}`}>
                {plan.highlight && (
                  <div className="text-xs font-medium text-white bg-navy rounded-full px-3 py-1 inline-block mb-3">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-medium text-navy">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-medium text-navy">${plan.annual}</span>
                  <span className="text-gray-400 text-sm">/year</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">or ${plan.monthly}/month</p>
                <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-safe">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="/signup" className="block mt-6">
                  <button className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-navy text-white hover:bg-navy-light'
                      : 'bg-surface text-navy hover:bg-gray-100'
                  }`}>
                    Get started
                  </button>
                </a>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <h2 className="mt-16 text-2xl font-medium text-navy text-center">Compare plans</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-left text-gray-500 font-medium">Feature</th>
                  <th className="py-3 text-center text-gray-500 font-medium">Individual</th>
                  <th className="py-3 text-center text-gray-500 font-medium">Family</th>
                  <th className="py-3 text-center text-gray-500 font-medium">Small Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3 text-gray-700">{row.feature}</td>
                    <td className="py-3 text-center text-gray-600">{row.individual}</td>
                    <td className="py-3 text-center text-gray-600">{row.family}</td>
                    <td className="py-3 text-center text-gray-600">{row.small_biz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}