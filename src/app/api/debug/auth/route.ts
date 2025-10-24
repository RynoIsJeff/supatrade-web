// src/app/api/debug/auth/route.ts
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET() {
  const c = await cookies()
  const token = c.get("sb-access-token")?.value
  const sb = supabaseServer()
  const { data, error } = token ? await sb.auth.getUser(token) : { data: null, error: "no token" }
  return Response.json({ hasToken: !!token, email: data?.user?.email || null, error: error || null })
}
