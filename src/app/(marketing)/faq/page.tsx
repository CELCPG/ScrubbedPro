'use client'

import { useState } from 'react'
import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'

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
    a: "Never. We never ask for SSN, driver's license, or financial information. We only need your name, current and previous addresses, and phone numbers to find your broker listings.",
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

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-medium tracking-tight text-navy">FAQ</h1>
          <p className="mt-3 text-gray-500">Everything you need to know before you start.</p>

          <div className="mt-10 space-y-2">
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

          <p className="mt-10 text-sm text-gray-500 text-center">
            Still have questions?{' '}
            <a href="mailto:hello@scrubbed.pro" className="text-navy hover:underline">
              hello@scrubbed.pro
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}