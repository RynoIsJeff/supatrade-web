// src/app/api/applications/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const firstName = form.get("firstName")?.toString() || ""
  const lastName = form.get("lastName")?.toString() || ""
  const email = form.get("email")?.toString() || ""
  const phone = form.get("phone")?.toString() || ""
  const coverLetter = form.get("coverLetter")?.toString() || ""
  const jobId = form.get("jobId")?.toString() || null
  const cv = form.get("cv") as File | null

  let cvUrl: string | null = null
  if (cv) {
    const filePath = `cvs/${Date.now()}-${cv.name}`
    const { error } = await supabase.storage.from("uploads").upload(filePath, cv, {
      contentType: cv.type,
      upsert: false,
    })
    if (error) return new Response(error.message, { status: 500 })
    const { data } = supabase.storage.from("uploads").getPublicUrl(filePath)
    cvUrl = data.publicUrl
  }

  const application = await prisma.application.create({
    data: { firstName, lastName, email, phone, coverLetter, jobId, cvUrl },
  })

  return Response.json({ ok: true, id: application.id })
}
