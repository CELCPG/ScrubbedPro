'use client'

import Link from 'next/link'
import { Logo } from './Logo'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
]

/**
 * Sticky marketing nav — transparent on hero, white after scroll.
 */
export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-40 transition-colors duration-200
      ${scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-sm'}
    `}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo className="text-xl" />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-navy transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-navy">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light transition-colors"
          >
            Start free scan
          </Link>
        </div>
      </div>
    </nav>
  )
}