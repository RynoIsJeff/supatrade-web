"use client"

import { useState } from "react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const r = await fetch("/admin/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (r.ok) window.location.href = "/admin"
    else setErr("Invalid credentials")
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold">Admin sign in</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input className="rounded border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="rounded border p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="rounded bg-primary px-4 py-2 text-white">Sign in</button>
      </form>
    </div>
  )
}
