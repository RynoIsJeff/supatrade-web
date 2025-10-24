// src/app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAuthedAdmin()
  if (!admin) return new Response("Unauthorized", { status: 401 })
  const { status } = await req.json()

  const app = await prisma.application.update({
    where: { id: params.id },
    data: { status },
    select: { id: true, status: true },
  })
  return Response.json({ application: app })
}
