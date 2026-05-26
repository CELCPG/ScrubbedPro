import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Remove Your Data from Spokeo (2026) | Scrubbed.Pro',
  description:
    'Step-by-step guide to opt out of Spokeo. Remove your name, address, phone, email, relatives, and social media profiles from one of the largest people-search brokers.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Remove Your Data from Spokeo (2026)',
  description:
    'Step-by-step guide to opt out of Spokeo and remove your personal information from their people-search database.',
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
  dataExposed: 'Name, current & previous addresses, phone numbers, email addresses, relatives, associates, and social media profiles',
  removalTime: '24–48 hours after email confirmation',
  reListingRisk: 'High — Spokeo refreshes data monthly from public records and third-party sources',
  difficulty: 'Easy',
  directUrl: 'spokeo.com/optout',
}

export default function RemoveFromSpokeoPage() {
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
              <span>Spokeo</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-navy md:text-5xl">
              How to Remove Your Data from Spokeo
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Spokeo aggregates personal information from public records, social
              media, and third-party data providers. Here&apos;s exactly how to get
              your listing removed — and stay removed.
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
                    href="https://www.spokeo.com/optout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue hover:underline"
                  >
                    spokeo.com/optout
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
                  title: 'Go to the Spokeo opt-out page',
                  body: (
                    <>
                      Navigate to{' '}
                      <a
                        href="https://www.spokeo.com/optout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                      >
                        spokeo.com/optout
                      </a>
                      . This is the official removal request form Spokeo is
                      required to maintain. Do not use third-party sites that
                      offer to do this for a fee — the process is free and takes
                      less than 10 minutes.
                    </>
                  ),
                },
                {
                  step: 2,
                  title: 'Search for your listing',
                  body: (
                    <>
                      Enter your full name and either your city/state or zip
                      code. Be as specific as possible to avoid confusion with
                      people who share your name. If your name is common, add a
                      middle name or initial to narrow results.
                    </>
                  ),
                },
                {
                  step: 3,
                  title: 'Find your listing and select it',
                  body: (
                    <>
                      Browse the results and locate the entry that matches your
                      current information. Click the checkbox next to your
                      listing to select it. Spokeo sometimes shows multiple
                      versions of the same person — select all that apply to
                      ensure complete removal.
                    </>
                  ),
                },
                {
                  step: 4,
                  title: 'Click "Remove This Listing"',
                  body: (
                    <>
                      Once you&apos;ve checked your listing(s), click the
                      &quot;Remove This Listing&quot; button. You&apos;ll be prompted
                      to confirm your email address — this is where Spokeo will
                      send the confirmation link to verify your identity and
                      complete the request.
                    </>
                  ),
                },
                {
                  step: 5,
                  title: 'Confirm via email',
                  body: (
                    <>
                      Check your inbox for an email from{' '}
                      <code className="rounded bg-surface px-1 py-0.5 text-xs">
                        noreply@spokeo.com
                      </code>
                      . The subject line will reference your opt-out request.
                      Click the confirmation link inside — it typically expires
                      within 24 hours. If you don&apos;t see it, check your spam
                      folder.
                    </>
                  ),
                },
                {
                  step: 6,
                  title: 'Wait 24–48 hours for removal',
                  body: (
                    <>
                      After confirming, Spokeo states it can take up to 48 hours
                      to process your removal. During this time your listing will
                      no longer appear in search results. Don&apos;t resubmit the
                      form — doing so may reset the processing timer. If your
                      listing is still visible after 72 hours, try again or
                      contact Spokeo support.
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
              Spokeo re-lists your data monthly. Scrubbed.Pro monitors and
              re-removes your information from Spokeo and 200+ other brokers,
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