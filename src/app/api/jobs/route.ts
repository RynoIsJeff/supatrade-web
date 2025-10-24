// src/app/api/jobs/route.ts
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"
import { Brand, JobStatus, JobType } from "@prisma/client"
import DOMPurify from "isomorphic-dompurify"

export async function GET() {
  const jobs = await prisma.job.findMany({
    where: { status: JobStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, slug: true, title: true, brand: true, type: true,
      closingDate: true, createdAt: true,
      store: { select: { id: true, name: true, town: true, brand: true } },
    },
  })
  return Response.json({ jobs })
}

export async function POST(req: NextRequest) {
  const admin = await getAuthedAdmin()
  if (!admin) return new Response("Unauthorized", { status: 401 })

  const b = await req.json()
  const title = String(b.title || "").trim()
  const brand = b.brand as Brand
  const type = (b.type as JobType) ?? JobType.FULL_TIME
  const status = (b.status as JobStatus) ?? JobStatus.PUBLISHED
  // sanitize description before saving
  const descriptionRaw = String(b.description || "")
  const description = DOMPurify.sanitize(descriptionRaw, { USE_PROFILES: { html: true } })

  const storeId = (b.storeId as string) || null
  const closingDate = b.closingDate ? new Date(b.closingDate) : null

  if (!title || !brand) return new Response("Missing fields", { status: 400 })

  // ensure unique slug
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  let slug = base
  for (let i = 2; await prisma.job.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`

  const job = await prisma.job.create({
    data: {
      title, brand, type, status, description, storeId, closingDate, slug,
      createdById: admin.id,
    },
    select: { id: true, slug: true },
  })

  return Response.json({ job }, { status: 201 })
}