'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-block text-xl font-medium tracking-tight text-navy">
            scrubbed<span className="text-blue">.pro</span>
          </Link>
          <h1 className="mt-4 text-xl font-medium text-navy">Reset your password</h1>
          <p className="mt-1 text-sm text-gray-500">
            {sent ? "Check your email for a reset link." : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-safe-light px-4 py-3 text-sm text-safe">
              We sent a password reset link to <strong>{email}</strong>.
              Check your inbox and click the link to reset your password.
            </div>
            <Link href="/login" className="block text-center text-sm text-navy hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {error && (
              <p className="rounded-lg bg-critical-light px-3 py-2 text-sm text-critical">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="text-gray-500 hover:text-navy">
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}