import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://scrubbed.pro'),
  title: {
    default: 'Scrubbed.Pro — They sold your number. We take it back.',
    template: '%s | Scrubbed.Pro',
  },
  description: 'Scrubbed.Pro finds your personal data on 200+ broker sites and removes it. Automatically. Every month.',
  openGraph: {
    title: 'Scrubbed.Pro — Personal Data Removal',
    description: 'Stop being findable. Remove your data from 200+ broker sites automatically.',
    url: 'https://scrubbed.pro',
    siteName: 'Scrubbed.Pro',
    images: ['/og-image.png'],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scrubbed.Pro',
    description: 'They sold your number. We take it back.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-surface text-gray-700 antialiased`}>
        {children}
      </body>
    </html>
  )
}