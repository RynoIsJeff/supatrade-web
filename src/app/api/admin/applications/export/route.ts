export const runtime = "nodejs"
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
    include: { job: { select: { title: true, brand: true, store: { select: { town: true } } } } },
    orderBy: { createdAt: "desc" },
  })

  const header = ["Created","Status","First","Last","Email","Phone","Job","Brand","Town"].join(",")
  const rows = apps.map(a => [
    a.createdAt.toISOString(),
    a.status,
    `"${a.firstName.replace(/"/g,'""')}"`,
    `"${a.lastName.replace(/"/g,'""')}"`,
    a.email,
    a.phone || "",
    `"${(a.job?.title||"General").replace(/"/g,'""')}"`,
    a.job?.brand || "",
    a.job?.store?.town || "",
  ].join(","))
  const csv = [header, ...rows].join("\n")

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications.csv"`,
    },
  })
}
