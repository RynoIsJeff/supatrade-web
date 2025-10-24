// src/lib/auth.ts
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function getAuthedAdmin() {
  const c = await cookies()
  const token = c.get("sb-access-token")?.value
  if (!token) {
    console.warn("getAuthedAdmin: no sb-access-token cookie")
    return null
  }

  const sb = supabaseServer()
  const { data, error } = await sb.auth.getUser(token)
  if (error || !data?.user?.email) {
    console.warn("getAuthedAdmin: getUser failed", error)
    return null
  }

  const user = await prisma.user.findUnique({ where: { email: data.user.email } })
  if (!user) {
    console.warn("getAuthedAdmin: prisma user not found", data.user.email)
    return null
  }

  const allowed = user.role === "SUPER_ADMIN" || user.role === "HR_ADMIN"
  if (!allowed) console.warn("getAuthedAdmin: role not allowed", user.role)
  return allowed ? user : null
}
