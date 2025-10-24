// src/app/api/auth/login/route.ts
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const sb = supabaseServer()
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error || !data.session) return new Response("Unauthorized", { status: 401 })

  const c = await cookies()
  c.set("sb-access-token", data.session.access_token, { httpOnly: true, path: "/" })
  c.set("sb-refresh-token", data.session.refresh_token, { httpOnly: true, path: "/" })
  return new Response("ok")
}
