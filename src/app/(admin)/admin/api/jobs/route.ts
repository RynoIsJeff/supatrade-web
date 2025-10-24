// src/app/api/jobs/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"
import { Brand, JobStatus, JobType } from "@prisma/client"
import { z } from "zod"
import DOMPurify from "isomorphic-dompurify"

const JobSchema = z.object({
  title: z.string().min(3),
  brand: z.enum(["SPAR", "SAVEMOR", "ENGEN", "STEERS", "DEBONAIRS", "BUILD_IT"]),
  type: z.enum(["FULL_TIME", "PART_TIME", "TEMPORARY", "CASUAL", "CONTRACT"]).default("FULL_TIME"),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).default("PUBLISHED"),
  storeId: z.string().uuid().nullable().optional(),
  closingDate: z.string().datetime().nullable().optional(),
  description: z.string().default(""),
})

async function uniqueSlugFromTitle(title: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  let slug = base
  for (let i = 2; await prisma.job.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`
  return slug
}

export async function GET() {
  // (optional) keep your existing GET logic here if needed, or return 405
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

  // Validate body with Zod
  const parsed = JobSchema.safeParse(await req.json())
  if (!parsed.success) return new Response("Invalid payload", { status: 400 })
  const b = parsed.data

  // Sanitize HTML description
  const description = DOMPurify.sanitize(b.description, { USE_PROFILES: { html: true } })

  // Generate unique slug
  const slug = await uniqueSlugFromTitle(b.title)

  const job = await prisma.job.create({
    data: {
      title: b.title,
      brand: b.brand as Brand,
      type: (b.type as JobType) ?? JobType.FULL_TIME,
      status: (b.status as JobStatus) ?? JobStatus.PUBLISHED,
      description,
      storeId: b.storeId ?? null,
      closingDate: b.closingDate ? new Date(b.closingDate) : null,
      slug,
      createdById: admin.id,
    },
    select: { id: true, slug: true },
  })

  return Response.json({ job }, { status: 201 })
}
