import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function getAuthedAdmin() {
  const c = await cookies()
  const token = c.get("sb-access-token")?.value
  if (!token) return null

  const sb = supabaseServer()
  const { data, error } = await sb.auth.getUser(token)
  const email = data?.user?.email
  if (error || !email) return null

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const allowed = user.role === "SUPER_ADMIN" || user.role === "HR_ADMIN"
  return allowed ? user : null
}
