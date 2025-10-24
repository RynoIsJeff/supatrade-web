// src/lib/auth.ts
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function getAuthedAdmin() {
  const c = await cookies()
  const token = c.get("sb-access-token")?.value

  // DEV BYPASS: accept the dummy cookie and return a Prisma user
  if (process.env.DEV_AUTH_BYPASS === "true") {
    if (!token || token !== "dev-token") return null
    const email = process.env.DEV_AUTH_EMAIL || "manager@ultimatemarketingsmash.com"
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: "Dev Admin" },
    })
    return user
  }

  // PROD: verify the cookie with Supabase, then map to your Prisma user
  if (!token || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user?.email) return null

  const user = await prisma.user.upsert({
    where: { email: data.user.email },
    update: {},
    create: { email: data.user.email, name: data.user.user_metadata?.name ?? null },
  })
  return user
}
