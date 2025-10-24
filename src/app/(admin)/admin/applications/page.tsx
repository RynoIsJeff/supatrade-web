"use client"

import useSWR from "swr"
import { useState } from "react"

type Row = {
  id: string
  firstName: string; lastName: string; email: string; phone?: string | null
  status: string; createdAt: string
  cvUrl?: string | null
  job?: { title: string; brand: string; store?: { town?: string | null } | null } | null
}
const fetcher = (u: string) => fetch(u).then(r => r.json())

export default function ApplicationsAdmin() {
  const [status, setStatus] = useState<string>("")
  const [brand, setBrand] = useState<string>("")
  const [q, setQ] = useState<string>("")
  const query = new URLSearchParams({ ...(status && {status}), ...(brand && {brand}), ...(q && {q}) }).toString()
  const { data, mutate } = useSWR<{ applications: Row[] }>(`/api/admin/applications?${query}`, fetcher)
  const apps = data?.applications ?? []

  async function updateStatus(id: string, next: string) {
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
    mutate()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <select className="border rounded p-2" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>NEW</option><option>SHORTLISTED</option><option>INTERVIEWING</option>
          <option>OFFER</option><option>HIRED</option><option>REJECTED</option>
        </select>
        <select className="border rounded p-2" value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="">All brands</option>
          <option>BUILD_IT</option><option>SPAR</option><option>SAVEMOR</option>
          <option>ENGEN</option><option>STEERS</option><option>DEBONAIRS</option>
        </select>
        <input className="border rounded p-2 flex-1 min-w-[180px]" placeholder="Search name/email"
               value={q} onChange={e => setQ(e.target.value)} />
        <button className="border rounded px-3" onClick={() => mutate()}>Refresh</button>
      </div>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-3">Applicant</th>
              <th className="p-3">Job</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Status</th>
              <th className="p-3">Applied</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{a.firstName} {a.lastName}</div>
                  <div className="text-slate-500">{a.email}{a.phone ? ` · ${a.phone}` : ""}</div>
                  {a.cvUrl && <a className="text-primary underline" href={a.cvUrl} target="_blank">CV</a>}
                </td>
                <td className="p-3">{a.job?.title || <span className="text-slate-500">General Apply</span>}</td>
                <td className="p-3">{a.job?.brand || "-"}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3">{new Date(a.createdAt).toLocaleDateString("en-ZA")}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="rounded border px-2 py-1" onClick={() => updateStatus(a.id, "SHORTLISTED")}>Shortlist</button>
                    <button className="rounded border px-2 py-1" onClick={() => updateStatus(a.id, "INTERVIEWING")}>Interview</button>
                    <button className="rounded border px-2 py-1" onClick={() => updateStatus(a.id, "REJECTED")}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {apps.length === 0 && (
              <tr><td className="p-6 text-slate-500" colSpan={6}>No applications yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
