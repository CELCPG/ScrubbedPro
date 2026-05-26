import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Remove Your Data from BeenVerified (2026) | Scrubbed.Pro',
  description:
    'Step-by-step guide to opt out of BeenVerified. Remove criminal records, arrest records, social media profiles, phone numbers, email, and address history.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Remove Your Data from BeenVerified (2026)',
  description:
    'Step-by-step guide to opt out of BeenVerified and remove criminal records, contact info, and social media data from their people-search database.',
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
  dataExposed: 'Criminal records, arrest records, social media profiles, phone numbers, email addresses, and full address history',
  removalTime: '24–72 hours after email confirmation link is clicked',
  reListingRisk: 'Medium-High — BeenVerified aggregates from a wide range of sources and may re-index your data',
  difficulty: 'Medium (email verification required)',
  directUrl: 'beenverified.com/-optout/',
}

export default function RemoveFromBeenVerifiedPage() {
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
              <span>BeenVerified</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-navy md:text-5xl">
              How to Remove Your Data from BeenVerified
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              BeenVerified publishes some of the most sensitive personal data
              available — including criminal records, arrests, and social media
              activity. Here&apos;s exactly how to remove it all.
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
                    href="https://www.beenverified.com/-optout/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:underline"
                  >
                    beenverified.com/-optout/
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
                  title: 'Go to the BeenVerified opt-out page',
                  body: (
                    <>
                      Navigate to{' '}
                      <a
                        href="https://www.beenverified.com/-optout/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                      >
                        beenverified.com/-optout/
                      </a>
                      . This is the official BeenVerified opt-out form. The
                      process is free and does not require you to create an
                      account.
                    </>
                  ),
                },
                {
                  step: 2,
                  title: 'Enter your email address',
                  body: (
                    <>
                      BeenVerified requires a valid email address for the
                      confirmation step — they use it to send you a unique
                      verification link. Use an email you actually control.
                      Don&apos;t use a throwaway address, or you won&apos;t be able to
                      confirm the removal.
                    </>
                  ),
                },
                {
                  step: 3,
                  title: 'Search for your record',
                  body: (
                    <>
                      After entering your email, search for yourself using your
                      full name and either your city and state or your approximate
                      location. If multiple results appear, review each one
                      carefully — BeenVerified aggregates data broadly, so a
                      record may list information slightly different from your own.
                    </>
                  ),
                },
                {
                  step: 4,
                  title: 'Select your record and click "Remove"',
                  body: (
                    <>
                      Identify the listing that corresponds to you. Click the
                      &quot;Remove&quot; button to initiate the opt-out. On the next
                      screen you&apos;ll be asked to confirm your identity — this
                      may include selecting additional data points from your
                      record to verify it&apos;s actually you.
                    </>
                  ),
                },
                {
                  step: 5,
                  title: 'Check your email for the confirmation link',
                  body: (
                    <>
                      BeenVerified will send a confirmation email to the address
                      you provided. Look for a message from{' '}
                      <code className="rounded bg-surface px-1 py-0.5 text-xs">
                        noreply@beenverified.com
                      </code>{' '}
                      — it usually arrives within 5 minutes. The link in this
                      email is time-sensitive. If you don&apos;t see it, check your
                      spam or junk folder.
                    </>
                  ),
                },
                {
                  step: 6,
                  title: 'Click the link in the email',
                  body: (
                    <>
                      Open the email and click the confirmation link. This
                      finalizes your opt-out request. After clicking, you should
                      see a confirmation message. Your record will then enter
                      BeenVerified&apos;s removal queue — typically completed within
                      24–72 hours after clicking the link.
                    </>
                  ),
                },
                {
                  step: 7,
                  title: 'Wait 24–72 hours for full removal',
                  body: (
                    <>
                      Once your confirmation link is clicked, BeenVerified
                      processes the removal within 24–72 hours. The listing
                      will disappear from search results when this window closes.
                      Keep the confirmation email in case you need to reference
                      it later or prove the opt-out was submitted.
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
              BeenVerified re-indexes data frequently and may re-list your record
              from new sources. Scrubbed.Pro monitors and re-removes your
              information from BeenVerified and 200+ other brokers,
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