// src/app/api/jobs/route.ts (POST)
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const c = await cookies()
  const token = c.get("sb-access-token")?.value
  if (!token) return new Response("Unauthorized", { status: 401 })

  const sb = supabaseServer()
  const { data: { user }, error } = await sb.auth.getUser(token)
  if (error || !user?.email) return new Response("Unauthorized", { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!dbUser || !["SUPER_ADMIN","HR_ADMIN"].includes(dbUser.role)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await req.json()
  // …create job as before, but set createdBy via dbUser.id
}
