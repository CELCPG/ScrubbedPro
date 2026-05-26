import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata = {
  title: 'How to Remove Your Data from Data Broker Sites (2026 Guide) | Scrubbed.Pro',
  description:
    'Step-by-step guides to remove your personal information from Spokeo, Whitepages, BeenVerified, Intelius, and 200+ other data broker sites.',
}

const GUIDES = [
  {
    name: 'Spokeo',
    url: '/guides/remove-from-spokeo',
    difficulty: 'Easy',
    time: '10–15 min',
    emoji: '🔍',
    description: 'One of the largest people-search sites. Removes name, address, phone, relatives, and associates.',
    brokers: ['Spokeo', 'PeekYou', 'Zabasearch'],
    popular: true,
  },
  {
    name: 'Whitepages',
    url: '/guides/remove-from-whitepages',
    difficulty: 'Easy',
    time: '5–10 min',
    emoji: '🏠',
    description: 'Shows current and previous addresses, phone numbers, and relatives. Opt-out is quick but must be confirmed.',
    brokers: ['Whitepages', 'Whitepages Pro'],
    popular: true,
  },
  {
    name: 'BeenVerified',
    url: '/guides/remove-from-beenverified',
    difficulty: 'Medium',
    time: '15–20 min',
    emoji: '📋',
    description: 'Background check site. Often shows criminal records, social media, and contact info. Opt-out requires email verification.',
    brokers: ['BeenVerified', 'Background Check'],
    popular: true,
  },
  {
    name: 'Intelius',
    url: '/guides/remove-from-intelius',
    difficulty: 'Medium',
    time: '15–20 min',
    emoji: '🔎',
    description: 'Background check giant. Covers criminal records, address history, phone numbers, and relatives.',
    brokers: ['Intelius', 'People Lookup', 'US Search'],
    popular: false,
  },
  {
    name: 'Radaris',
    url: '/guides/remove-from-radaris',
    difficulty: 'Medium',
    time: '20–30 min',
    emoji: '📊',
    description: 'Less known but widely used by employers and landlords. Opt-out is unusually complex.',
    brokers: ['Radaris', '私人侦探'],
    popular: false,
  },
  {
    name: 'PeopleFinder',
    url: '/guides/remove-from-peoplefinder',
    difficulty: 'Easy',
    time: '10 min',
    emoji: '👤',
    description: 'Lists current/past addresses, phone numbers, and relatives. Opt-out via mail-in form.',
    brokers: ['PeopleFinder', 'Intelius'],
    popular: false,
  },
  {
    name: 'MyLife',
    url: '/guides/remove-from-mylife',
    difficulty: 'Hard',
    time: '30+ min',
    emoji: '⭐',
    description: 'Claims public records data. Opt-out is deliberately obscured and requires ID verification in some states.',
    brokers: ['MyLife', 'MyLife.com'],
    popular: true,
  },
  {
    name: 'Instant Checkmate',
    url: '/guides/remove-from-instant-checkmate',
    difficulty: 'Medium',
    time: '15–20 min',
    emoji: '🚔',
    description: 'Criminal record search site. Opt-out is fast but must be confirmed via email.',
    brokers: ['Instant Checkmate', 'Checkmate'],
    popular: false,
  },
]

export default function GuidesHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-medium tracking-tight text-navy">
              How to Remove Your Data from Broker Sites
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
              Step-by-step guides for removing your personal information from the most common data broker sites.
              Updated May 2026.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {GUIDES.length} guides · All free to read
            </p>
          </div>

          {/* Most popular */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-navy mb-4">Most popular</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {GUIDES.filter(g => g.popular).map(g => (
                <Link key={g.name} href={g.url}>
                  <Card className="p-5 hover:border-blue transition-colors cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{g.emoji}</span>
                      <span className="text-xs text-gray-400 font-medium">{g.difficulty}</span>
                    </div>
                    <h3 className="font-medium text-navy mb-1">Remove from {g.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{g.description}</p>
                    <p className="text-xs text-blue mt-3">Read guide →</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* All guides */}
          <div className="mb-12">
            <h2 className="text-lg font-medium text-navy mb-4">All guides</h2>
            <div className="space-y-3">
              {GUIDES.map(g => (
                <Link key={g.name} href={g.url}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue/40 hover:bg-surface transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl w-8 text-center">{g.emoji}</span>
                      <div>
                        <h3 className="font-medium text-navy">How to remove your data from {g.name}</h3>
                        <p className="text-sm text-gray-500">{g.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>⏱ {g.time}</span>
                      <span>{g.difficulty}</span>
                      <span className="text-blue">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA banner */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-medium text-navy mb-2">
              Don't want to do this manually for 200+ sites?
            </h2>
            <p className="text-gray-500 mb-6">
              Scrubbed.Pro automates opt-out submissions for 200+ data broker sites — and re-scans every month to catch re-listings.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button className="px-8">Run free scan →</Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="secondary" className="px-8">See how it works</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}