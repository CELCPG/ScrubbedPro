'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { ToastProvider } from '@/components/ui/ToastProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-surface">
        <Sidebar currentPath={pathname} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}