// src/app/(admin)/admin/jobs/page.tsx
"use client"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function AdminJobs() {
  const { data } = useSWR("/api/jobs", fetcher)
  const jobs = data?.jobs ?? []
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Link href="/admin/jobs/new" className="rounded bg-primary px-3 py-2 text-white">New Job</Link>
      </div>
      <div className="mt-6 grid gap-3">
        {jobs.map((j: any) => (
          <div key={j.id} className="rounded border p-3">
            <div className="text-sm text-slate-500">{j.brand} {j.store ? `• ${j.store.town}` : ""}</div>
            <div className="font-semibold">{j.title}</div>
            <div className="text-xs text-slate-500">Slug: {j.slug}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
