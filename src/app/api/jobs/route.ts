import { NextRequest } from "next/server"
import { PrismaClient, JobStatus } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  const jobs = await prisma.job.findMany({
    where: { status: JobStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, slug: true, title: true, brand: true, type: true, closingDate: true, createdAt: true,
      store: { select: { id: true, name: true, town: true, brand: true } },
    },
  })
  return Response.json({ jobs })
}

export async function POST(req: NextRequest) {
  const token = (req.headers.get("authorization") || "").replace("Bearer ", "").trim()
  if (!token || token !== process.env.INTERNAL_ADMIN_TOKEN) return new Response("Unauthorized", { status: 401 })

  const b = await req.json()
  const { title, brand, type, storeId, description, status, closingDate, createdById } = b
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const job = await prisma.job.create({
    data: {
      title, brand, type, storeId: storeId || null, description,
      status: status ?? "PUBLISHED",
      closingDate: closingDate ? new Date(closingDate) : null,
      slug, createdById,
    },
    select: { id: true, slug: true }
  })
  return Response.json({ job }, { status: 201 })
}
