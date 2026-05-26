import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Remove Your Data from Whitepages (2026) | Scrubbed.Pro',
  description:
    'Complete guide to opting out of Whitepages. Remove your current address, previous addresses, phone numbers, and relatives from the Whitepages people-search database.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Remove Your Data from Whitepages (2026)',
  description:
    'Step-by-step guide to opt out of Whitepages and remove your personal information from their directory and people-search results.',
  author: {
    '@type': 'Organization',
    name: 'Scrubbed.Pro',
    url: 'https://scrubbed.pro',
  },
  datePublished: '2026-01-01',
  dateModified: '2026-05-24',
  publisher: {
    '@type': 'Organization',
    name: 'Scrubbed.Pro',
    url: 'https://scrubbed.pro',
  },
}

const keyFacts = {
  dataExposed: 'Current address, previous addresses, phone numbers, relatives, and associated names',
  removalTime: '24–48 hours after SMS or email confirmation',
  reListingRisk: 'High — Whitepages pulls from telecom records, public filings, and data partnerships',
  difficulty: 'Easy',
  directUrl: 'whitepages.com/suppression',
}

export default function RemoveFromWhitepagesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingNav />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="border-b border-gray-100 bg-surface py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <Link href="/guides" className="hover:text-navy transition-colors">
                All Guides
              </Link>
              <span>/</span>
              <span>Whitepages</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-navy md:text-5xl">
              How to Remove Your Data from Whitepages
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Whitepages is one of the oldest and most-visited people-search
              sites online. Its database includes addresses, phone numbers, and
              family connections — all removable through their suppression tool.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-safe-light px-3 py-1 text-xs font-medium text-safe">
                ✓ Removal time: 24–48 hrs
              </span>
              <span className="rounded-full bg-risk-light px-3 py-1 text-xs font-medium text-risk">
                ⚠ High re-listing risk
              </span>
              <span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-medium text-blue">
                Difficulty: Easy
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Key Facts */}
          <Card className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-navy">Key Facts</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Data exposed
                </dt>
                <dd className="mt-1 text-sm text-gray-700">
                  {keyFacts.dataExposed}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Removal time
                </dt>
                <dd className="mt-1 text-sm text-gray-700">{keyFacts.removalTime}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Re-listing risk
                </dt>
                <dd className="mt-1 text-sm text-gray-700">{keyFacts.reListingRisk}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Difficulty
                </dt>
                <dd className="mt-1 text-sm text-gray-700">{keyFacts.difficulty}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Direct opt-out URL
                </dt>
                <dd className="mt-1 text-sm">
                  <a
                    href="https://www.whitepages.com/suppression"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:underline"
                  >
                    whitepages.com/suppression
                  </a>
                </dd>
              </div>
            </dl>
          </Card>

          {/* Steps */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-navy">
              Step-by-Step Opt-Out Instructions
            </h2>
            <ol className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Go to the Whitepages suppression page',
                  body: (
                    <>
                      Visit{' '}
                      <a
                        href="https://www.whitepages.com/suppression"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                      >
                        whitepages.com/suppression
                      </a>
                      . This is Whitepages&apos; official record suppression tool.
                      It&apos;s free and designed to comply with state privacy laws.
                      Bookmark this page — you may need it again if your data
                      gets re-listed.
                    </>
                  ),
                },
                {
                  step: 2,
                  title: 'Search for your name and address',
                  body: (
                    <>
                      Enter your full name and current street address. The
                      address helps Whitepages distinguish you from others with
                      the same name. If you&apos;ve recently moved, search both your
                      current and previous address to catch all listings.
                    </>
                  ),
                },
                {
                  step: 3,
                  title: 'Find your listing and click "Remove This Listing"',
                  body: (
                    <>
                      Locate the result that matches your personal information
                      and click &quot;Remove This Listing.&quot; Whitepages may show
                      multiple listings under your name — remove all of them to
                      prevent partial data exposure.
                    </>
                  ),
                },
                {
                  step: 4,
                  title: 'Complete the suppression form',
                  body: (
                    <>
                      You&apos;ll be asked to fill out a short form. Select the
                      reason: choose <strong>&quot;I want to remove my information&quot;</strong> or
                      the equivalent option. You&apos;ll also need to provide a phone
                      number — Whitepages uses this for SMS verification. Use a
                      number you can receive texts on, as a verification code
                      will be sent to it.
                    </>
                  ),
                },
                {
                  step: 5,
                  title: 'Confirm via SMS or email',
                  body: (
                    <>
                      After submitting the form, Whitepages will send a
                      verification code to the phone number or email you
                      provided. Enter the code on the confirmation page to
                      complete the process. Without this step, your removal
                      request will not be processed.
                    </>
                  ),
                },
                {
                  step: 6,
                  title: 'Wait up to 48 hours for removal',
                  body: (
                    <>
                      Once verified, Whitepages states it can take up to 48 hours
                      to process your suppression request. Your listing will be
                      removed from search results during this window. Note:
                      Whitepages is aggressive about re-listing. Because they
                      continuously pull from public records, your data can
                      reappear within weeks. Ongoing monitoring is strongly
                      recommended.
                    </>
                  ),
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                    {item.step}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-semibold text-navy">{item.title}</h3>
                    <p className="mt-1 text-gray-600 leading-relaxed">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <Card className="mb-10 bg-navy text-white">
            <h3 className="text-lg font-semibold">
              Want to automate this for 200+ brokers?
            </h3>
            <p className="mt-2 text-gray-200 text-sm leading-relaxed">
              Whitepages re-lists your data regularly. Scrubbed.Pro monitors and
              re-removes your information from Whitepages and 200+ other brokers,
              automatically — every month, forever.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-blue hover:bg-blue/90 text-white"
                >
                  Start free scan
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  See pricing
                </Button>
              </Link>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex flex-wrap gap-4 border-t border-gray-100 pt-8">
            <Link href="/guides" className="text-sm text-gray-500 hover:text-navy transition-colors">
              ← Back to all guides
            </Link>
            <Link href="/compare" className="text-sm text-gray-500 hover:text-navy transition-colors">
              Compare plans
            </Link>
            <Link href="/signup" className="text-sm text-gray-500 hover:text-navy transition-colors">
              Sign up free
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}