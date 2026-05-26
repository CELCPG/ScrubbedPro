import Link from 'next/link'

const footerLinks = {
  product: [
    { href: '/how-it-works', label: 'How it works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy' },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '#', label: 'CCPA Opt-Out Rights' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Brand column */}
          <div>
            <span className="font-medium tracking-tight text-navy">
              scrubbed<span className="text-blue">.pro</span>
            </span>
            <p className="mt-2 text-sm text-gray-500">
              They sold your number.<br />We take it back.
            </p>
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()} Scrubbed.Pro
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-medium text-navy">Product</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-navy transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-medium text-navy">Legal</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-navy transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            Scrubbed.Pro submits opt-out requests on your behalf using the public
            mechanisms each data broker is legally required to provide under state
            privacy laws including CCPA (California) and CDPA (Virginia).
          </p>
        </div>
      </div>
    </footer>
  )
}