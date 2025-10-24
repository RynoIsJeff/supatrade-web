// src/app/(admin)/admin/applications/page.tsx
"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"

type Row = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  coverLetter?: string | null
  status: "NEW" | "SHORTLISTED" | "INTERVIEWING" | "OFFER" | "HIRED" | "REJECTED"
  createdAt: string
  cvUrl?: string | null // this should store "cvs/....pdf" if using signed URLs
  job?: { title: string; brand: string; store?: { town?: string | null } | null } | null
}

const fetcher = async (u: string) => {
  const r = await fetch(u, { credentials: "same-origin", cache: "no-store" })
  if (!r.ok) throw new Error(`HTTP ${r.status} ${await r.text().catch(() => "")}`)
  return r.json()
}

function StatusButton({
  current,
  next,
  onClick,
}: {
  current: Row["status"]
  next: Row["status"]
  onClick: () => void
}) {
  const active = current === next
  const base = "px-2 py-1 rounded border text-xs font-medium transition-colors"
  const idle = "border-slate-300 text-slate-600 hover:bg-slate-100"
  const color =
    next === "REJECTED"
      ? "bg-red-100 text-red-700 border-red-300"
      : next === "INTERVIEWING"
      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
      : "bg-blue-100 text-blue-700 border-blue-300"
  return (
    <button type="button" onClick={onClick} className={`${base} ${active ? color : idle}`}>
      {next.charAt(0) + next.slice(1).toLowerCase()}
    </button>
  )
}

export default function ApplicationsAdmin() {
  // ✅ All hooks MUST be in here (inside component body)
  const [status, setStatus] = useState("")
  const [brand, setBrand] = useState("")
  const [q, setQ] = useState("")
  const [cvLink, setCvLink] = useState<string | null>(null) // if you want to keep this

  const query = new URLSearchParams({ ...(status && { status }), ...(brand && { brand }), ...(q && { q }) }).toString()

  const { data, error, mutate, isValidating } = useSWR<{ applications: Row[] }>(
    `/api/admin/applications?${query}`,
    fetcher
  )
  const apps = data?.applications ?? []

  const rows = useMemo(() => (status !== "REJECTED" ? apps.filter(a => a.status !== "REJECTED") : apps), [apps, status])

  async function openCv(path?: string | null) {
    if (!path) return
    const r = await fetch(`/api/admin/cv-url/${encodeURIComponent(path)}`, { credentials: "same-origin" })
    if (!r.ok) return alert("Could not open CV")
    const { url } = await r.json()
    setCvLink(url)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  async function updateStatus(id: string, next: Row["status"]) {
    if (!data) return
    const prev = data
    const optimistic = { applications: data.applications.map(a => (a.id === id ? { ...a, status: next } : a)) }
    mutate(optimistic, { revalidate: false })
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ status: next }),
    })
    if (!res.ok) {
      mutate(prev, { revalidate: false })
      const msg = await res.text().catch(() => "")
      alert(`Failed to update status: ${res.status}${msg ? ` — ${msg}` : ""}`)
      return
    }
    mutate()
  }

  if (error) {
    return <div className="text-red-600 p-4">Failed to load applications: {String(error.message)}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select className="border rounded p-2" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>NEW</option>
          <option>SHORTLISTED</option>
          <option>INTERVIEWING</option>
          <option>OFFER</option>
          <option>HIRED</option>
          <option>REJECTED</option>
        </select>
        <select className="border rounded p-2" value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="">All brands</option>
          <option>BUILD_IT</option>
          <option>SPAR</option>
          <option>SAVEMOR</option>
          <option>ENGEN</option>
          <option>STEERS</option>
          <option>DEBONAIRS</option>
        </select>
        <input
          className="border rounded p-2 flex-1 min-w-[180px]"
          placeholder="Search name/email"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <button className="border rounded px-3" onClick={() => mutate()}>
          {isValidating ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <a
        className="border rounded px-3 py-2"
        href={`/api/admin/applications/export?${query}`}
      >
        Export CSV
      </a>


      {/* Table */}
      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Applicant</th>
              <th className="p-3">Job</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Status</th>
              <th className="p-3">Applied</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a.id} className="border-t hover:bg-slate-50">
                <td className="p-3 align-top">
                  <div className="font-medium">
                    {a.firstName} {a.lastName}
                  </div>
                  <div className="text-slate-500">
                    {a.email}
                    {a.phone ? ` · ${a.phone}` : ""}
                  </div>
                    {a.cvUrl && (
                      <button className="text-primary underline" onClick={() => openCv(a.cvUrl)}>
                        View CV
                      </button>
                    )}
                  {a.coverLetter && (
                    <details className="mt-1 text-xs">
                      <summary className="cursor-pointer text-primary underline">View Cover Letter</summary>
                      <div className="mt-1 whitespace-pre-wrap text-slate-700">{a.coverLetter}</div>
                    </details>
                  )}
                </td>
                <td className="p-3">{a.job?.title || "General Application"}</td>
                <td className="p-3">{a.job?.brand || "-"}</td>
                <td className="p-3 font-semibold">{a.status}</td>
                <td className="p-3">{new Date(a.createdAt).toLocaleDateString("en-ZA")}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <StatusButton current={a.status} next="SHORTLISTED" onClick={() => updateStatus(a.id, "SHORTLISTED")} />
                    <StatusButton current={a.status} next="INTERVIEWING" onClick={() => updateStatus(a.id, "INTERVIEWING")} />
                    <StatusButton current={a.status} next="REJECTED" onClick={() => updateStatus(a.id, "REJECTED")} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-slate-500" colSpan={6}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
