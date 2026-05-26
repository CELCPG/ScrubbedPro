import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Remove Your Data from Intelius (2026) | Scrubbed.Pro',
  description:
    'Step-by-step guide to opt out of Intelius. Remove address history, phone numbers, criminal records, relatives, and associates from Intelius people-search.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Remove Your Data from Intelius (2026)',
  description:
    'Step-by-step guide to opt out of Intelius and remove your personal information, criminal records, and contact data from their people-search database.',
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
  dataExposed: 'Full address history, phone numbers, criminal records, relatives, associates, and court records',
  removalTime: '24–72 hours after email confirmation',
  reListingRisk: 'Medium-High — Intelius aggregates from multiple sources and updates regularly',
  difficulty: 'Medium',
  directUrl: 'intelius.com/people-search-suppression/',
}

export default function RemoveFromInteliusPage() {
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
              <span>Intelius</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-navy md:text-5xl">
              How to Remove Your Data from Intelius
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Intelius is one of the most comprehensive people-search brokers
              online, aggregating criminal records, address history, phone
              numbers, and family connections. Their suppression tool is
              thorough but can be confusing — this guide walks you through it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-safe-light px-3 py-1 text-xs font-medium text-safe">
                ✓ Removal time: 24–72 hrs
              </span>
              <span className="rounded-full bg-risk-light px-3 py-1 text-xs font-medium text-risk">
                ⚠ Medium-High re-listing risk
              </span>
              <span className="rounded-full bg-risk/10 px-3 py-1 text-xs font-medium text-risk">
                Difficulty: Medium
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
                    href="https://www.intelius.com/people-search-suppression/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:underline"
                  >
                    intelius.com/people-search-suppression/
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
                  title: 'Go to the Intelius people-search suppression page',
                  body: (
                    <>
                      Navigate to{' '}
                      <a
                        href="https://www.intelius.com/people-search-suppression/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                      >
                        intelius.com/people-search-suppression/
                      </a>
                      . This is the official record suppression form. Intelius
                      also owns several other broker sites (e.g., BeenVerified,
                      PublicRecordsNow), so removing from Intelius may also affect
                      listings on affiliated properties.
                    </>
                  ),
                },
                {
                  step: 2,
                  title: 'Enter your name and location',
                  body: (
                    <>
                      Provide your full name and the city and state (or zip code)
                      where you currently live. Intelius uses this to find your
                      record in their database. If you have a common name, try
                      adding a middle name or initial to narrow the results to
                      your actual record.
                    </>
                  ),
                },
                {
                  step: 3,
                  title: 'Find your listing and click "Remove this record"',
                  body: (
                    <>
                      Locate the result that matches your personal information.
                      Intelius often shows multiple records with similar names —
                      make sure you select the one that corresponds to your
                      correct address and known details. Click &quot;Remove this
                      record&quot; to begin the opt-out.
                    </>
                  ),
                },
                {
                  step: 4,
                  title: 'Fill out the opt-out form with your email',
                  body: (
                    <>
                      You&apos;ll be asked to complete a suppression form. Provide
                      an active email address — Intelius will send a confirmation
                      link here. You may also need to answer a question to help
                      them verify your identity, such as selecting your correct
                      address from a list or confirming a phone number associated
                      with your record.
                    </>
                  ),
                },
                {
                  step: 5,
                  title: 'Check your email and click the confirmation link',
                  body: (
                    <>
                      Look for an email from Intelius in your inbox. The
                      confirmation link proves you own the email address and
                      authorizes the removal. Click the link — it typically
                      expires within 24 hours. If the email hasn&apos;t arrived after
                      10 minutes, check your spam folder and double-check the
                      email address you entered was correct.
                    </>
                  ),
                },
                {
                  step: 6,
                  title: 'Wait 24–72 hours for processing',
                  body: (
                    <>
                      After clicking the confirmation link, Intelius will queue
                      your removal request. Processing takes 24–72 hours. During
                      this time your listing should no longer appear in search
                      results. Note that Intelius is known to re-list data from
                      updated public records and third-party sources. For
                      long-term peace of mind, consider a monitoring service
                      that re-submits opt-outs automatically each month.
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
              Intelius re-indexes your data regularly from dozens of sources.
              Scrubbed.Pro monitors and re-removes your information from Intelius
              and 200+ other brokers, automatically — every month, forever.
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