import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'

const STEPS = [
  {
    title: 'Create your account',
    body: 'Sign up with your email. No credit card required for the first scan. Takes 30 seconds.',
  },
  {
    title: 'Tell us who to protect',
    body: 'Add your name, current and previous addresses, phone numbers, and email addresses. The more you add, the more accurate your scan.',
  },
  {
    title: 'We run the scan',
    body: 'Our system searches 200+ data broker sites — Spokeo, Whitepages, BeenVerified, Intelius, and 196 more — looking for listings that match your profile.',
  },
  {
    title: 'You get a risk score and full report',
    body: 'Your dashboard shows your exposure score (0-100), every broker where your data was found, and which fields were exposed: phone, address, email, relatives, etc.',
  },
  {
    title: 'We queue removals automatically',
    body: 'Listings are sorted by robocall risk and priority. We auto-submit opt-out requests at every broker that accepts them. Brokers requiring government ID are flagged for manual removal.',
  },
  {
    title: 'We watch for re-listings',
    body: 'Every month, we re-scan all brokers. If your data re-appears (it usually does within 60-90 days), we automatically re-submit the opt-out and alert you.',
  },
]

const BROKERS = [
  'Spokeo', 'Whitepages', 'BeenVerified', 'Intelius', 'Radaris',
  'PeopleFinder', 'Instant Checkmate', 'MyLife', 'PeekYou', 'Zabasearch',
  'USSearch', 'TruePeopleSearch', 'FastPeopleSearch', 'That&apos;s Them',
  'FamilyTreeNow', 'Infospace', 'Yahoo', 'Google', 'Bing', 'DuckDuckGo',
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-medium tracking-tight text-navy">How it works</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Scrubbed.Pro finds your personal data on data broker websites and removes it
            automatically — every month, forever, until you tell us to stop.
          </p>

          {/* Steps */}
          <div className="mt-12 space-y-8">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-sm font-medium">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-medium text-navy">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Brokers */}
          <h2 className="mt-16 text-2xl font-medium text-navy">200+ brokers and growing</h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            We cover all the major people-search sites and add new brokers monthly.
            A sample of brokers currently in our scan queue:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {BROKERS.map(b => (
              <span key={b} className="rounded-full bg-sky px-3 py-1 text-xs text-navy">
                {b}
              </span>
            ))}
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
              + 180 more
            </span>
          </div>

          {/* Legal note */}
          <Card className="mt-10">
            <p className="text-xs text-gray-500 leading-relaxed">
              Scrubbed.Pro submits opt-out requests on your behalf using the public
              mechanisms each data broker is legally required to provide under state
              privacy laws including CCPA (California) and CDPA (Virginia).
              We never scrape brokers aggressively or attempt to circumvent their defenses.
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}