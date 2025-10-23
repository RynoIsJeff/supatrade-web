"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Store = { id: string; name: string; town: string; brand: string }
type Job = {
  id: string; title: string; slug: string; brand: string; type: string; status: string;
  description: string; closingDate?: string | null; storeId?: string | null
}

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>()
  const r = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/jobs/${id}`).then(r => r.json()).then(d => setJob(d.job))
    fetch("/api/stores").then(r => r.json()).then(d => setStores(d.stores ?? []))
  }, [id])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!job) return
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: payload.title,
        brand: payload.brand,
        type: payload.type,
        status: payload.status,
        description: payload.description,
        storeId: (payload.storeId as string) || null,
        closingDate: (payload.closingDate as string) || null,
      }),
    })
    setSaving(false)
    if (res.ok) r.push("/admin/jobs")
  }

  if (!job) return <p>Loading…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <input name="title" defaultValue={job.title} className="rounded border p-2" required />
        <select name="brand" defaultValue={job.brand} className="rounded border p-2" required>
          <option>BUILD_IT</option><option>SPAR</option><option>SAVEMOR</option>
          <option>ENGEN</option><option>STEERS</option><option>DEBONAIRS</option>
        </select>
        <select name="type" defaultValue={job.type} className="rounded border p-2" required>
          <option>FULL_TIME</option><option>PART_TIME</option><option>TEMPORARY</option>
          <option>CASUAL</option><option>CONTRACT</option>
        </select>
        <select name="status" defaultValue={job.status} className="rounded border p-2" required>
          <option>DRAFT</option><option>PUBLISHED</option><option>CLOSED</option>
        </select>
        <select name="storeId" defaultValue={job.storeId || ""} className="rounded border p-2">
          <option value="">(No specific store)</option>
          {stores.map(s => <option key={s.id} value={s.id}>{s.name} — {s.town}</option>)}
        </select>
        <input name="closingDate" type="date"
               defaultValue={job.closingDate?.slice(0,10) || ""} className="rounded border p-2" />
        <textarea name="description" defaultValue={job.description} rows={6} className="rounded border p-2" />
        <button disabled={saving} className="rounded bg-primary px-4 py-2 text-white w-fit">
          {saving ? "Saving…" : "Update job"}
        </button>
      </form>
    </div>
  )
}
