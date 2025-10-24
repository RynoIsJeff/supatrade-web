"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("manager@ultimatemarketingsmash.com")
  const [password, setPassword] = useState("devpass")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()                  // ✅ prevents navigation
    setLoading(true)
    setErr(null)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email, password }),
    })
    setLoading(false)
    if (!res.ok) {
      setErr(await res.text().catch(() => "Login failed"))
      return
    }
    router.replace("/admin")            // ✅ go to admin after success
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3" noValidate>
        <input className="rounded border p-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="rounded border p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button type="submit" disabled={loading} className="rounded bg-primary px-4 py-2 text-white">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
