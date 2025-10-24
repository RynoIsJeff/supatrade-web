import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  const admin = await getAuthedAdmin()
  if (!admin) return new Response("Unauthorized", { status: 401 })

  const url = new URL(req.url)
  const status = url.searchParams.get("status") || undefined
  const brand = url.searchParams.get("brand") || undefined
  const q = url.searchParams.get("q") || undefined

  const apps = await prisma.application.findMany({
    where: {
      status: status as any || undefined,
      job: brand ? { brand: brand as any } : undefined,
      OR: q ? [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName:  { contains: q, mode: "insensitive" } },
        { email:     { contains: q, mode: "insensitive" } },
      ] : undefined,
    },
    include: {
      job: { select: { id: true, title: true, brand: true, store: { select: { town: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })
  return Response.json({ applications: apps })
}
