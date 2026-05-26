'use client'

import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

const FAQ_ITEMS = [
  {
    q: 'Is this legal?',
    a: 'Yes. Under the California Consumer Privacy Act (CCPA), the Virginia Consumer Data Protection Act (CDPA), and similar state privacy laws, every data broker is legally required to provide an opt-out mechanism. We use those official channels. We never hack or scrape aggressively.',
  },
  {
    q: 'Will my data stay removed?',
    a: 'Removed data tends to re-appear within 60-90 days as brokers refresh from public records. That is why we re-scan every month and re-submit opt-out requests automatically. Continuous monitoring is the product.',
  },
  {
    q: 'Do you need my Social Security number?',
    a: 'Never. We never ask for SSN, driver\'s license, or financial information. We only need your name, current and previous addresses, and phone numbers to find your broker listings.',
  },
  {
    q: 'How long does removal take?',
    a: 'Most brokers process opt-outs in 14-30 days. Some take up to 45. You will see the status of every removal in your dashboard.',
  },
  {
    q: 'What if a broker re-lists my data?',
    a: 'We detect it on the next monthly scan and re-submit the opt-out automatically. You also get an email alert when a re-listing is detected.',
  },
  {
    q: 'Which data brokers do you cover?',
    a: 'We currently cover 200+ brokers including all the largest people-search sites: Spokeo, Whitepages, BeenVerified, Intelius, Radaris, PeopleFinder, MyLife, Instant Checkmate, and more. We add new brokers monthly.',
  },
  {
    q: 'What does Scrubbed.Pro not do?',
    a: 'We do not remove data from social media, credit bureaus, or government records. We do not block phone calls (use a call-blocking app for that). We focus on data brokers because that is where your information is most exposed and most easily removed.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts. Cancel from your account settings in two clicks. You keep access until the end of your billing period.',
  },
]

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="rounded-xl border border-gray-100 bg-white">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium text-navy text-sm">{item.q}</span>
            <span className={`text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

import { useState } from 'react'

const PAIN_POINTS = [
  {
    icon: '📵',
    title: 'Your phone rings 12 times a day.',
    body: 'From spam, scammers, debt collectors, and political campaigns. None of them should have your number.',
  },
  {
    icon: '📍',
    title: 'Your home address is publicly searchable.',
    body: 'Anyone can find where you live in under 30 seconds for free.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Your family is exposed too.',
    body: 'Brokers list your parents, siblings, and previous addresses going back 20 years.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'You tell us who to protect.',
    body: 'Add your name, addresses, and phone numbers to your private profile. Takes 2 minutes.',
  },
  {
    n: '2',
    title: 'We scan 200+ data broker sites.',
    body: 'Spokeo, Whitepages, BeenVerified, and 197 more. We find every listing of you.',
  },
  {
    n: '3',
    title: 'We remove your data. Then we watch.',
    body: 'Automated opt-outs at every broker. Monthly re-scans to catch re-listings.',
  },
]

const PLANS = [
  {
    name: 'Individual',
    monthly: 9,
    annual: 79,
    description: 'For one person who wants the spam calls to stop.',
    features: ['1 person monitored', '200+ data broker scan', 'Monthly automatic re-scan', 'Automated opt-out submissions', 'Removal verification tracking', 'Email alerts on re-listings'],
    highlight: false,
  },
  {
    name: 'Family',
    monthly: 19,
    annual: 149,
    description: 'Protect everyone under your roof.',
    features: ['Up to 4 people monitored', '200+ broker scan per person', 'Monthly automatic re-scans', 'Automated opt-out submissions', 'Family dashboard view', 'Priority email support'],
    highlight: true,
  },
  {
    name: 'Small Business',
    monthly: 49,
    annual: 399,
    description: 'For founders and small teams who want their information off the internet.',
    features: ['Up to 10 employees monitored', 'Quarterly compliance reports', 'Slack alert integration', 'Priority support', 'Bulk CSV employee import'],
    highlight: false,
  },
]

export default function HomePage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('annual')

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-navy leading-tight">
              They sold your number.
              <br />
              We take it back.
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-lg leading-relaxed">
              Scrubbed.Pro finds your personal data on 200+ broker sites and removes it.
              Automatically. Every month. So the spam calls stop.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/signup">
                <Button size="lg">Scan yourself free</Button>
              </Link>
              <a href="#how-it-works" className="text-sm font-medium text-navy flex items-center gap-1 hover:underline">
                See how it works →
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Built by people who got tired of 12 spam calls a day.
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-critical" />
                <div className="w-3 h-3 rounded-full bg-risk" />
                <div className="w-3 h-3 rounded-full bg-safe" />
              </div>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <svg width="140" height="140" className="-rotate-90">
                    <circle cx={70} cy={70} r={56} fill="none" stroke="#f3f4f6" strokeWidth={14} />
                    <circle cx={70} cy={70} r={56} fill="none" stroke="#991B1B" strokeWidth={14}
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * 0.82}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-medium text-navy">82</span>
                    <span className="text-xs text-gray-400">out of 100</span>
                  </div>
                </div>
                <div>
                  <Badge variant="critical" className="text-sm">CRITICAL risk</Badge>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Listings found</span>
                      <span className="font-medium text-navy">14</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Brokers blocking</span>
                      <span className="font-medium text-navy">3</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Verified removed</span>
                      <span className="font-medium text-safe">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 bg-surface px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p, i) => (
              <Card key={i} className="text-center py-8">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-medium text-navy">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{p.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-medium tracking-tight text-navy text-center">How it works</h2>
          <p className="mt-3 text-gray-500 text-center">Three steps. Then we keep watching.</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white font-medium">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-medium text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-surface px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-medium tracking-tight text-navy text-center">Pricing</h2>
          <p className="mt-3 text-gray-500 text-center">No contracts. Cancel anytime.</p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingInterval === 'monthly' ? 'text-navy' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              className={`relative w-12 h-6 rounded-full transition-colors ${billingInterval === 'annual' ? 'bg-navy' : 'bg-gray-200'}`}
              onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'annual' : 'monthly')}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${billingInterval === 'annual' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-sm font-medium ${billingInterval === 'annual' ? 'text-navy' : 'text-gray-400'}`}>
              Annual
              <span className="ml-1.5 text-xs text-safe font-medium">Save $29/yr</span>
            </span>
          </div>

          {/* Plan cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div key={i} className={`rounded-2xl border-2 bg-white p-6 ${plan.highlight ? 'border-navy shadow-lg' : 'border-gray-100'}`}>
                {plan.highlight && (
                  <div className="text-xs font-medium text-white bg-navy rounded-full px-3 py-1 inline-block mb-3">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-medium text-navy">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-medium text-navy">${billingInterval === 'annual' ? plan.annual : plan.monthly}</span>
                  <span className="text-gray-400 text-sm">/{billingInterval === 'annual' ? 'year' : 'month'}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-safe">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full">
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-medium tracking-tight text-navy text-center">FAQ</h2>
          <div className="mt-8">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-navy px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white">Stop being findable.</h2>
          <p className="mt-4 text-sky-300 text-lg">Your first scan is free. No credit card.</p>
          <Link href="/signup">
            <Button className="mt-8 bg-white text-navy hover:bg-gray-100 text-lg px-8 py-4">
              Scan yourself now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}