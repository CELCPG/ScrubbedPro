'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/ToastProvider'
import type { Person, Scan } from '@/types'

type ScanPhase = 'idle' | 'running' | 'complete'

interface BrokerFeedItem {
  broker_id: string
  broker_name: string
  status: 'scanning' | 'found' | 'not_found' | 'blocked' | 'error'
  match_confidence?: number
  fields_exposed?: string[]
}

export default function ScanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<ScanPhase>('idle')
  const [scanId, setScanId] = useState<string | null>(null)
  const [feed, setFeed] = useState<BrokerFeedItem[]>([])
  const [progress, setProgress] = useState({ current: 0, total: 8 })
  const [elapsed, setElapsed] = useState(0)
  const [stats, setStats] = useState({ found: 0, blocked: 0 })
  const [startTime, setStartTime] = useState<number | null>(null)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      supabase
        .from('persons')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_primary', true)
        .single()
        .then(({ data }) => {
          if (data) setPerson(data)
          setLoading(false)
        })
    })
  }, [router])

  // Elapsed timer
  useEffect(() => {
    if (phase !== 'running' || !startTime) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, startTime])

  const startScan = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user || !person) return

    setPhase('running')
    setStartTime(Date.now())
    setFeed([])
    setStats({ found: 0, blocked: 0 })
    setElapsed(0)

    // Create scan record via API
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person_id: person.id }),
    })

    if (!res.ok) {
      setPhase('idle')
      return
    }

    const { scan_id } = await res.json()
    setScanId(scan_id)

    // Simulate live broker feed for demo (Phase 3 will use real scanner)
    const brokers = [
      { broker_id: 'spokeo', broker_name: 'Spokeo' },
      { broker_id: 'whitepages', broker_name: 'Whitepages' },
      { broker_id: 'beenverified', broker_name: 'BeenVerified' },
      { broker_id: 'intelius', broker_name: 'Intelius' },
      { broker_id: 'radaris', broker_name: 'Radaris' },
      { broker_id: 'peoplefinder', broker_name: 'PeopleFinder' },
      { broker_id: 'instantcheckmate', broker_name: 'Instant Checkmate' },
      { broker_id: 'mylife', broker_name: 'MyLife' },
    ]

    setProgress({ current: 0, total: brokers.length })

    for (let i = 0; i < brokers.length; i++) {
      const broker = brokers[i]

      // Add as "scanning"
      setFeed(f => [...f, { broker_id: broker.broker_id, broker_name: broker.broker_name, status: 'scanning' }])

      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))

      // Random outcome for demo (in Phase 3 this comes from the real scanner)
      const rand = Math.random()
      let status: BrokerFeedItem['status'] = 'not_found'
      let match_confidence: number | undefined
      let fields_exposed: string[] = []

      if (rand > 0.55) {
        status = 'found'
        match_confidence = 0.7 + Math.random() * 0.28
        fields_exposed = ['phone', 'address', 'email'].slice(0, Math.floor(Math.random() * 3) + 1)
        setStats(s => ({ ...s, found: s.found + 1 }))
      } else if (rand < 0.1) {
        status = 'blocked'
        setStats(s => ({ ...s, blocked: s.blocked + 1 }))
      }

      setFeed(f =>
        f.map(item =>
          item.broker_id === broker.broker_id
            ? { ...item, status, match_confidence, fields_exposed }
            : item
        )
      )

      setProgress(p => ({ ...p, current: i + 1 }))
    }

    // Complete the scan
    await fetch(`/api/scan/${scan_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    })

    setPhase('complete')
    toast(`Scan complete — ${stats.found} listings found.`, 'success')
    // Auto-redirect after 3 seconds
    setTimeout(() => router.push('/dashboard'), 3000)
  }

  const cancelScan = async () => {
    if (!scanId) return
    setCanceling(true)
    await fetch(`/api/scan/${scanId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'canceled' }),
    })
    setPhase('idle')
    setCanceling(false)
    toast('Scan canceled.', 'info')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Pre-scan state ─────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="p-8 max-w-xl">
        <h1 className="text-2xl font-medium tracking-tight text-navy">Scan</h1>
        <p className="mt-1 text-sm text-gray-500">Check 200+ broker sites for your personal data.</p>

        <Card className="mt-6">
          <h2 className="text-base font-medium text-navy mb-3">Your profile</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div><span className="font-medium text-navy">Name:</span> {person?.first_name} {person?.last_name}</div>
            <div><span className="font-medium text-navy">Location:</span> {person?.current_city}, {person?.current_state}</div>
            <div><span className="font-medium text-navy">Previous locations:</span> {(person?.previous_cities || []).join(', ') || 'None'}</div>
            <div><span className="font-medium text-navy">Phone numbers:</span> {(person?.phone_numbers || []).length || 'None'}</div>
            <div><span className="font-medium text-navy">Emails:</span> {(person?.email_addresses || []).length || 'None'}</div>
          </div>
          <button
            onClick={() => router.push('/profile')}
            className="mt-3 text-sm text-navy hover:underline"
          >
            Edit profile
          </button>
        </Card>

        <Card className="mt-4 border border-blue/20 bg-blue/5">
          <div className="flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue mt-0.5 shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p className="text-xs font-semibold text-navy">Your legal rights — we protect them</p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                You have the right to request removal under CCPA (California), CDPA (Virginia),
                CPA (Colorado), and similar state laws. We submit only your name and city
                to brokers — never your SSN, driver&apos;s license, or financial information,
                even when brokers request it.
              </p>
            </div>
          </div>
        </Card>

        <Card className="mt-4">
          <h2 className="text-base font-medium text-navy mb-3">What we&apos;ll do</h2>
          <ol className="space-y-3 text-sm text-gray-600">
            {[
              { step: 'Search 200+ broker sites', detail: 'Spokeo, Whitepages, BeenVerified, Intelius + 195 more' },
              { step: 'Score match confidence & risk', detail: 'We verify it\'s really you before flagging a listing' },
              { step: 'Build your removal queue', detail: 'Prioritized by robocall risk and broker response time' },
              { step: 'Email you when done', detail: 'Full report with what was found and what happens next' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-white text-xs">
                  {i + 1}
                </span>
                <div>
                  <span className="font-medium text-navy">{item.step}</span>
                  <span className="text-gray-400"> — {item.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="mt-6">
          <Button size="lg" onClick={startScan} className="w-full">
            Start scan
          </Button>
          <p className="mt-3 text-xs text-gray-400 text-center">
            Scans typically take 3-5 minutes. We&apos;ll email you when it&apos;s complete.
          </p>
        </div>
      </div>
    )
  }

  // ── Running state ──────────────────────────────────────────────
  if (phase === 'running') {
    const m = Math.floor(elapsed / 60)
    const s = elapsed % 60
    const timeStr = `${m}:${s.toString().padStart(2, '0')}`

    return (
      <div className="flex gap-8 p-8">
        <div className="flex-1 max-w-xl">
          <h1 className="text-2xl font-medium tracking-tight text-navy mb-2">Scanning…</h1>
          <p className="text-sm text-gray-500 mb-6">
            Don&apos;t close this page. We&apos;ll notify you when it&apos;s done.
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>{progress.current} of {progress.total} brokers</span>
              <span>{timeStr}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-navy transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>

          {/* Live feed */}
          <div className="space-y-2">
            {feed.map((item) => (
              <div key={item.broker_id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
                <span className="w-24 text-sm font-medium text-navy">{item.broker_name}</span>
                {item.status === 'scanning' && <Spinner size="sm" />}
                {item.status === 'found' && <Badge variant="critical">✓ Found</Badge>}
                {item.status === 'not_found' && <Badge variant="safe">✓ No listing</Badge>}
                {item.status === 'blocked' && <Badge variant="default">⊘ Blocked</Badge>}
                {item.status === 'error' && <Badge variant="risk">✕ Error</Badge>}
                {item.match_confidence && (
                  <span className="ml-auto text-xs text-gray-400">
                    {Math.round(item.match_confidence * 100)}% match
                  </span>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            className="mt-6 text-gray-400"
            onClick={cancelScan}
            disabled={canceling}
          >
            {canceling ? 'Canceling…' : 'Cancel scan'}
          </Button>
        </div>

        {/* Stats sidebar */}
        <div className="w-48 shrink-0 space-y-4">
          <Card className="text-center py-4">
            <div className="text-2xl font-medium text-critical">{stats.found}</div>
            <div className="mt-1 text-xs text-gray-500">Listings found</div>
          </Card>
          <Card className="text-center py-4">
            <div className="text-2xl font-medium text-gray-400">{stats.blocked}</div>
            <div className="mt-1 text-xs text-gray-500">Brokers blocked</div>
          </Card>
          <Card className="text-center py-4">
            <div className="text-2xl font-medium text-navy">{timeStr}</div>
            <div className="mt-1 text-xs text-gray-500">Time elapsed</div>
          </Card>
        </div>
      </div>
    )
  }

  // ── Complete state ─────────────────────────────────────────────
  return (
    <div className="flex items-center justify-center p-12">
      <Card className="max-w-sm text-center py-8">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-medium text-navy">Scan complete!</h2>
        <p className="mt-2 text-sm text-gray-500">
          Found {stats.found} listings. Redirecting to your dashboard…
        </p>
        <div className="mt-4">
          <Spinner size="md" className="mx-auto" />
        </div>
      </Card>
    </div>
  )
}