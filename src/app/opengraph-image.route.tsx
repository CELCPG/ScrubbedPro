import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Scrubbed.Pro'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0B1C2D',
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 72, fontWeight: 800 }}>
            {title}
          </span>
          <span
            style={{
              color: '#7CB9E8',
              fontSize: 28,
              fontWeight: 400,
              maxWidth: 600,
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            They sold your number. We take it back.
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}