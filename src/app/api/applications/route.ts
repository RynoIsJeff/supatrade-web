import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const jobId = form.get("jobId")?.toString() || null
  const firstName = form.get("firstName")?.toString() || ""
  const lastName = form.get("lastName")?.toString() || ""
  const email = form.get("email")?.toString() || ""
  const phone = form.get("phone")?.toString() || null
  const coverLetter = form.get("coverLetter")?.toString() || null
  const cvUrl = form.get("cvUrl")?.toString() || null

  if (!firstName || !lastName || !email) return new Response("Missing fields", { status: 400 })

  const app = await prisma.application.create({
    data: { jobId, firstName, lastName, email, phone, coverLetter, cvUrl },
    select: { id: true, jobId: true, createdAt: true }
  })
  return Response.json({ application: app }, { status: 201 })
}
