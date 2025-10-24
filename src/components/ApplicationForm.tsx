"use client"

import { useState } from "react"

export default function ApplicationForm({ jobId }: { jobId?: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    if (jobId) formData.append("jobId", jobId)
    const res = await fetch("/api/applications", { method: "POST", body: formData })
    setLoading(false)
    if (res.ok) setDone(true)
  }

  if (done) return <p className="text-green-600">✅ Application submitted successfully!</p>

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input required name="firstName" placeholder="First name" className="border p-2 rounded"/>
        <input required name="lastName"  placeholder="Last name"  className="border p-2 rounded"/>
      </div>
      <input required name="email" type="email" placeholder="Email" className="border p-2 rounded"/>
      <input name="phone" placeholder="Phone (optional)" className="border p-2 rounded"/>
      <textarea name="coverLetter" placeholder="Cover letter" className="border p-2 rounded h-24"/>
      <input name="cv" type="file" accept=".pdf,.doc,.docx" className="border p-2 rounded"/>
      <button disabled={loading} className="bg-primary text-white rounded px-4 py-2">
        {loading ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  )
}
