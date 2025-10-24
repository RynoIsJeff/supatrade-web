"use client"

import useSWR from "swr"
import { useState } from "react"

type Row = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  coverLetter?: string | null
  status: string
  createdAt: string
  cvUrl?: string | null
  job?: { title: string; brand: string; store?: { town?: string | null } | null } | null
}

const fetcher = async (u: string) => {
  const r = await fetch(u, { credentials: "same-origin", cache: "no-store" })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

export default function ApplicationsAdmin() {
  const [status, setStatus] = useState("")
  const [brand, setBrand] = useState("")
  const [q, setQ] = useState("")
  const query = new URLSearchParams({
    ...(status && { status }),
    ...(brand && { brand }),
    ...(q && { q }),
  }).toString()

  const { data, error, mutate } = useSWR<{ applications: Row[] }>(
    `/api/admin/applications?${query}`,
    fetcher
  )
  const apps = data?.applications ?? []

  async function updateStatus(id: string, next: string) {
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
      credentials: "same-origin",
    })
    mutate()
  }

  const filtered = apps.filter(a => {
    if (status !== "REJECTED" && a.status === "REJECTED") return false
    return true
  })

  if (error)
    return (
      <div className="text-red-600 p-4">
        Failed to load applications: {String(error.message)}
      </div>
    )

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
          Refresh
        </button>
      </div>

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
            {filtered.map(a => (
              <tr key={a.id} className="border-t hover:bg-slate-50">
                <td className="p-3 align-top">
                  <div className="font-medium">{a.firstName} {a.lastName}</div>
                  <div className="text-slate-500">{a.email}{a.phone ? ` · ${a.phone}` : ""}</div>
                  {a.cvUrl && (
                    <a
                      className="text-primary underline"
                      href={a.cvUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View CV
                    </a>
                  )}
                  {a.coverLetter && (
                    <details className="mt-1 text-xs">
                      <summary className="cursor-pointer text-primary underline">
                        View Cover Letter
                      </summary>
                      <div className="mt-1 whitespace-pre-wrap text-slate-700">
                        {a.coverLetter}
                      </div>
                    </details>
                  )}
                </td>
                <td className="p-3">{a.job?.title || "General Application"}</td>
                <td className="p-3">{a.job?.brand || "-"}</td>
                <td className="p-3 font-semibold">{a.status}</td>
                <td className="p-3">
                  {new Date(a.createdAt).toLocaleDateString("en-ZA")}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {["SHORTLISTED", "INTERVIEWING", "REJECTED"].map(btn => {
                      const color =
                        btn === "REJECTED"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : btn === "INTERVIEWING"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-blue-100 text-blue-700 border-blue-300"
                      const active = a.status === btn
                      return (
                        <button
                          key={btn}
                          onClick={() => updateStatus(a.id, btn)}
                          className={`px-2 py-1 rounded border text-xs font-medium ${
                            active ? color : "border-slate-300 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {btn.charAt(0) + btn.slice(1).toLowerCase()}
                        </button>
                      )
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
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
