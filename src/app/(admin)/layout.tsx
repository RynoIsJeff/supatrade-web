import type { ReactNode } from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r p-4">
        <h2 className="font-bold mb-4">SupaTrade Admin</h2>
        <nav className="grid gap-2 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/jobs">Jobs</Link>
          <Link href="/admin/applications">Applications</Link>
          <form action="/admin/api/logout" method="post" className="mt-6">
            <button className="text-slate-600 hover:text-red-600">Sign out</button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
