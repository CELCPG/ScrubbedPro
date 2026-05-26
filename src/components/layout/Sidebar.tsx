import Link from 'next/link'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/scan', label: 'Scan' },
  { href: '/brokers', label: 'Brokers' },
  { href: '/removal', label: 'Removal' },
  { href: '/profile', label: 'Profile' },
  { href: '/history', label: 'History' },
  { href: '/settings', label: 'Settings' },
]

/**
 * Left sidebar for authenticated app layout.
 */
export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-100 bg-surface p-4">
      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((link) => {
          const isActive = currentPath === link.href || currentPath.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                rounded-lg px-3 py-2 text-sm transition-colors
                ${isActive
                  ? 'bg-navy text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-navy'}
              `}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}