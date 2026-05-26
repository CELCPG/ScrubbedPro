import Link from 'next/link'

const appNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⌂' },
  { href: '/scan', label: 'Scan', icon: '◎' },
  { href: '/brokers', label: 'Brokers', icon: '⊞' },
  { href: '/removal', label: 'Removal', icon: '✓' },
  { href: '/profile', label: 'Profile', icon: '⊙' },
  { href: '/history', label: 'History', icon: '↺' },
]

/**
 * Top navigation bar for authenticated app pages.
 */
export function AppNav({ userEmail }: { userEmail?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/dashboard" className="font-medium tracking-tight text-navy text-lg">
          scrubbed<span className="text-blue">.pro</span>
        </Link>

        <div className="flex items-center gap-6">
          {appNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-500 hover:text-navy transition-colors"
            >
              <span aria-hidden="true" className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{userEmail}</span>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-xs text-gray-400 hover:text-navy">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}