import { AdminNav } from '@/components/admin/AdminNav'
import { Badge } from '@/components/ui/Badge'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin header */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-bold text-white">Scrubbed.Pro</a>
            <Badge variant="risk" className="text-xs">Admin</Badge>
          </div>
          <AdminNav />
        </div>
      </div>

      {/* Page content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </div>
    </div>
  )
}
