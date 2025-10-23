"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Store = { id: string; name: string; town: string; brand: string }

export default function NewJobPage() {
  const r = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // simple store list for select
    fetch("/api/stores").then(r => r.json()).then(d => setStores(d.stores ?? []))
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: payload.title,
        brand: payload.brand,
        type: payload.type,
        status: payload.status,
        description: payload.description,
        storeId: (payload.storeId as string) || null,
        closingDate: (payload.closingDate as string) || null,
        createdById: "placeholder", // server will use cookie user soon
      }),
    })
    setSaving(false)
    if (res.ok) r.push("/admin/jobs")
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Job</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <input name="title" placeholder="Title" className="rounded border p-2" required />
        <select name="brand" className="rounded border p-2" required>
          <option value="">Brand…</option>
          <option>BUILD_IT</option>
          <option>SPAR</option>
          <option>SAVEMOR</option>
          <option>ENGEN</option>
          <option>STEERS</option>
          <option>DEBONAIRS</option>
        </select>
        <select name="type" className="rounded border p-2" required>
          <option>FULL_TIME</option>
          <option>PART_TIME</option>
          <option>TEMPORARY</option>
          <option>CASUAL</option>
          <option>CONTRACT</option>
        </select>
        <select name="status" className="rounded border p-2" required defaultValue="PUBLISHED">
          <option>DRAFT</option>
          <option>PUBLISHED</option>
          <option>CLOSED</option>
        </select>
        <select name="storeId" className="rounded border p-2">
          <option value="">(No specific store)</option>
          {stores.map(s => (
            <option key={s.id} value={s.id}>{s.name} — {s.town}</option>
          ))}
        </select>
        <input name="closingDate" type="date" className="rounded border p-2" />
        <textarea name="description" placeholder="HTML description…" rows={6} className="rounded border p-2" />
        <button disabled={saving} className="rounded bg-primary px-4 py-2 text-white w-fit">
          {saving ? "Saving…" : "Create job"}
        </button>
      </form>
    </div>
  )
}
