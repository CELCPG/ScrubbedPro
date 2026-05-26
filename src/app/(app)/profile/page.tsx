'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { Person } from '@/types'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/ToastProvider'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

interface LocationRow { city: string; state: string }

export default function ProfilePage() {
  const router = useRouter()
  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showRescanModal, setShowRescanModal] = useState(false)
  const [error, setError] = useState('')

  // Identity
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [age, setAge] = useState('')

  // Location
  const [currentCity, setCurrentCity] = useState('')
  const [currentState, setCurrentState] = useState('VA')
  const [previousLocations, setPreviousLocations] = useState<LocationRow[]>([])

  // Contact
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([''])
  const [emailAddresses, setEmailAddresses] = useState<string[]>([''])
  const [relatives, setRelatives] = useState<string[]>([''])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      // Fetch the primary person record for this user
      supabase
        .from('persons')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_primary', true)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            // Try any person record
            supabase
              .from('persons')
              .select('*')
              .eq('user_id', session.user.id)
              .limit(1)
              .single()
              .then(({ data: p }) => {
                if (p) loadPerson(p)
                else setLoading(false)
              })
          } else {
            loadPerson(data)
          }
        })
    })
  }, [router])

  function loadPerson(p: Person) {
    setPerson(p)
    setFirstName(p.first_name)
    setMiddleName(p.middle_name || '')
    setLastName(p.last_name)
    setAge(p.age ? String(p.age) : '')
    setCurrentCity(p.current_city)
    setCurrentState(p.current_state || 'VA')
    setPreviousLocations(
      (p.previous_cities || []).map((city, i) => ({
        city,
        state: (p.previous_states || [])[i] || '',
      })).filter(r => r.city && r.state)
    )
    setPhoneNumbers(p.phone_numbers?.length ? p.phone_numbers : [''])
    setEmailAddresses(p.email_addresses?.length ? p.email_addresses : [''])
    setRelatives(p.relatives?.length ? p.relatives : [''])
    setLoading(false)
  }

  const { toast } = useToast()

  const handleSave = async () => {
    setError('')
    setSaving(true)

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    // Build updated person object
    const updated = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      middle_name: middleName.trim() || null,
      age: age ? parseInt(age) : null,
      current_city: currentCity.trim(),
      current_state: currentState,
      previous_cities: previousLocations.map(l => l.city.trim()).filter(Boolean),
      previous_states: previousLocations.map(l => l.state).filter(Boolean),
      phone_numbers: phoneNumbers.filter(n => n.trim()),
      email_addresses: emailAddresses.filter(e => e.trim()),
      relatives: relatives.filter(r => r.trim()),
    }

    const { error: err } = await supabase
      .from('persons')
      .update(updated)
      .eq('id', person!.id)

    setSaving(false)

    if (err) {
      setError('Failed to save profile: ' + err.message)
      toast('Failed to save profile.', 'error')
    } else {
      toast('Profile saved.', 'success')
      setShowRescanModal(true)
    }
  }

  const triggerRescan = async () => {
    setShowRescanModal(false)
    router.push('/scan')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-medium tracking-tight text-navy">Your profile</h1>
      <p className="mt-1 text-sm text-gray-500">
        This information drives your scans. Keep it accurate.
      </p>

      <div className="mt-8 space-y-8">
        {/* Identity */}
        <Card>
          <h2 className="text-base font-medium text-navy mb-4">Identity</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name *" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Input label="Last name *" value={lastName} onChange={e => setLastName(e.target.value)} />
            <Input label="Middle name (optional)" value={middleName} onChange={e => setMiddleName(e.target.value)} />
            <Input label="Age (optional)" type="number" value={age} onChange={e => setAge(e.target.value)} />
          </div>
        </Card>

        {/* Current location */}
        <Card>
          <h2 className="text-base font-medium text-navy mb-4">Current location</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="City *" value={currentCity} onChange={e => setCurrentCity(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">State *</label>
              <select
                value={currentState}
                onChange={e => setCurrentState(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Card>

        {/* Previous locations */}
        <Card>
          <h2 className="text-base font-medium text-navy mb-1">Previous locations</h2>
          <p className="text-xs text-gray-500 mb-4">
            Data brokers index your historical addresses. Add every city you have lived in over the last 10 years.
          </p>
          <div className="space-y-3">
            {previousLocations.map((loc, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  placeholder="City"
                  value={loc.city}
                  onChange={e => {
                    const updated = [...previousLocations]
                    updated[i].city = e.target.value
                    setPreviousLocations(updated)
                  }}
                  className="flex-1"
                />
                <select
                  value={loc.state}
                  onChange={e => {
                    const updated = [...previousLocations]
                    updated[i].state = e.target.value
                    setPreviousLocations(updated)
                  }}
                  className="rounded-lg border border-gray-200 px-2 py-2 text-sm"
                >
                  <option value="">State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setPreviousLocations(previousLocations.filter((_, j) => j !== i))}
                  className="text-gray-400 hover:text-critical text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPreviousLocations([...previousLocations, { city: '', state: '' }])}
              className="text-sm text-navy hover:underline"
            >
              + Add previous location
            </button>
          </div>
        </Card>

        {/* Phone numbers */}
        <Card>
          <h2 className="text-base font-medium text-navy mb-1">Phone numbers</h2>
          <p className="text-xs text-gray-500 mb-4">List all numbers you have used.越多越好。</p>
          <div className="space-y-3">
            {phoneNumbers.map((phone, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={e => {
                    const updated = [...phoneNumbers]
                    updated[i] = e.target.value
                    setPhoneNumbers(updated)
                  }}
                  className="flex-1"
                />
                {phoneNumbers.length > 1 && (
                  <button type="button" onClick={() => setPhoneNumbers(phoneNumbers.filter((_, j) => j !== i))} className="text-gray-400 hover:text-critical text-sm">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setPhoneNumbers([...phoneNumbers, ''])} className="text-sm text-navy hover:underline">
              + Add phone number
            </button>
          </div>
        </Card>

        {/* Email addresses */}
        <Card>
          <h2 className="text-base font-medium text-navy mb-1">Email addresses</h2>
          <p className="text-xs text-gray-500 mb-4">All addresses you have used online.</p>
          <div className="space-y-3">
            {emailAddresses.map((email, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => {
                    const updated = [...emailAddresses]
                    updated[i] = e.target.value
                    setEmailAddresses(updated)
                  }}
                  className="flex-1"
                />
                {emailAddresses.length > 1 && (
                  <button type="button" onClick={() => setEmailAddresses(emailAddresses.filter((_, j) => j !== i))} className="text-gray-400 hover:text-critical text-sm">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setEmailAddresses([...emailAddresses, ''])} className="text-sm text-navy hover:underline">
              + Add email address
            </button>
          </div>
        </Card>

        {/* Relatives */}
        <Card>
          <h2 className="text-base font-medium text-navy mb-1">Known relatives</h2>
          <p className="text-xs text-gray-500 mb-4">Helps us confirm we found the right person when there are common names.</p>
          <div className="space-y-3">
            {relatives.map((rel, i) => (
              <div key={i} className="flex items-center gap-3">
                <Input
                  placeholder="First name Last name"
                  value={rel}
                  onChange={e => {
                    const updated = [...relatives]
                    updated[i] = e.target.value
                    setRelatives(updated)
                  }}
                  className="flex-1"
                />
                {relatives.length > 1 && (
                  <button type="button" onClick={() => setRelatives(relatives.filter((_, j) => j !== i))} className="text-gray-400 hover:text-critical text-sm">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setRelatives([...relatives, ''])} className="text-sm text-navy hover:underline">
              + Add relative
            </button>
          </div>
        </Card>

        {error && (
          <p className="rounded-lg bg-critical-light px-4 py-3 text-sm text-critical">{error}</p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            We never collect SSN, driver&apos;s license, or financial information.
          </p>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Save profile'}
          </Button>
        </div>
      </div>

      {/* Rescan modal */}
      {showRescanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-medium text-navy mb-2">Profile saved!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Your profile changed. Want to run a new scan now to update your results?
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowRescanModal(false)} className="flex-1">
                Wait for scheduled scan
              </Button>
              <Button onClick={triggerRescan} className="flex-1">
                Run scan now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}