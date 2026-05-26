'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        'error-callback'?: () => void
        'expired-callback'?: () => void
        theme?: 'light' | 'dark' | 'auto'
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string>('')

  // Load Turnstile script and render widget
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (!siteKey) return

    const scriptId = 'turnstile-script'
    const render = () => {
      if (!window.turnstile || !captchaRef.current) return
      widgetIdRef.current = window.turnstile.render(captchaRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setCaptchaToken(token),
        'error-callback': () => setError('CAPTCHA error. Please try again.'),
        'expired-callback': () => setCaptchaToken(''),
        theme: 'auto',
      })
    }

    if (window.turnstile) {
      render()
    } else if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.onload = render
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      // Verify CAPTCHA via our server route — the Turnstile secret must
      // stay server-side. Required whenever the site key is configured.
      const captchaRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      if (captchaRequired) {
        if (!captchaToken) {
          setError('Please complete the CAPTCHA.')
          setLoading(false)
          return
        }
        const verifyRes = await fetch('/api/auth/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: captchaToken }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyData.success) {
          setError('CAPTCHA verification failed. Please try again.')
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current)
          }
          setCaptchaToken('')
          setLoading(false)
          return
        }
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        window.location.href = '/profile'
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
          <h1 className="mt-4 text-xl font-medium text-navy">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">First scan is free. No credit card.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />

          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="rounded-lg bg-critical-light px-3 py-2 text-sm text-critical">
              {error}
            </p>
          )}

          <div ref={captchaRef} className="flex justify-center" />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          By signing up you agree to our{' '}
          <Link href="/terms" className="underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>

        <div className="mt-6 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-navy hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}