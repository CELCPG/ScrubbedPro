import Link from 'next/link'

/**
 * Scrubbed.Pro wordmark logo.
 * Uses CSS to style ".pro" in a lighter blue weight.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={className}>
      <span className="font-medium tracking-tight text-navy">
        scrubbed
        <span className="text-blue">.pro</span>
      </span>
    </Link>
  )
}

/**
 * Logo mark — favicon-sized icon for tabs/bars.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="28" height="28" rx="6" fill="#0F2D5E" />
      <path
        d="M8 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
        stroke="#2E75B6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="2" fill="#2E75B6" />
    </svg>
  )
}