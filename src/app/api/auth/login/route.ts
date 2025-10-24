// src/app/api/auth/login/route.ts
export const runtime = "nodejs"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // DEV bypass (local only)
  if (process.env.DEV_AUTH_BYPASS === "true") {
    const devEmail = process.env.DEV_AUTH_EMAIL || email

    await prisma.user.upsert({
      where: { email: devEmail },
      update: {},
      create: { email: devEmail, name: "Dev Admin" },
    })

    const c = await cookies()
    c.set("sb-access-token", "dev-token", { httpOnly: true, path: "/" })
    c.set("sb-refresh-token", "dev-refresh", { httpOnly: true, path: "/" })
    return new Response("ok")
  }

  // Supabase mode (prod)
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response("Auth not configured", { status: 500 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session) return new Response("Unauthorized", { status: 401 })

  const c = await cookies()
  c.set("sb-access-token", data.session.access_token, { httpOnly: true, path: "/" })
  c.set("sb-refresh-token", data.session.refresh_token, { httpOnly: true, path: "/" })
  return new Response("ok")
}
