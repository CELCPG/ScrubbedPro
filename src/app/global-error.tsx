'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error }: { error: Error | string }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: '#0B1C2D' }}>Something went wrong</h1>
        <p style={{ color: '#6B7280', marginTop: '1rem' }}>
          We&apos;ve logged this error and are looking into it. Refresh to try again.
        </p>
      </body>
    </html>
  )
}