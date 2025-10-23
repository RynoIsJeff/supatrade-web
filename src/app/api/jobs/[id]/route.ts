import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"
import { JobStatus, JobType, Brand } from "@prisma/client"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { store: true },
  })
  if (!job) return new Response("Not found", { status: 404 })
  return Response.json({ job })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAuthedAdmin()
  if (!admin) return new Response("Unauthorized", { status: 401 })

  const body = await req.json()
  const { title, brand, type, status, description, closingDate, storeId } = body

  const job = await prisma.job.update({
    where: { id: params.id },
    data: {
      title: title ?? undefined,
      brand: brand as Brand | undefined,
      type: type as JobType | undefined,
      status: status as JobStatus | undefined,
      description: description ?? undefined,
      closingDate: closingDate ? new Date(closingDate) : null,
      storeId: storeId ?? null,
    },
    select: { id: true, slug: true },
  })
  return Response.json({ job })
}
