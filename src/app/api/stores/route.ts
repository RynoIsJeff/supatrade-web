import { prisma } from "@/lib/prisma"

export async function GET() {
  const stores = await prisma.store.findMany({
    orderBy: [{ brand: "asc" }, { town: "asc" }],
    select: { id: true, name: true, town: true, brand: true },
  })
  return Response.json({ stores })
}
