// src/app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAuthedAdmin()
  if (!admin) return new Response("Unauthorized", { status: 401 })
  const { status, note } = await req.json()

  try {
    const app = await prisma.application.update({
      where: { id: params.id },
      data: {
        status,                        // NEW | SHORTLISTED | ...
        coverLetter: note ?? undefined // or switch to a dedicated `notes` column later
      },
      select: { id: true, status: true },
    })
    return Response.json({ application: app })
  } catch (e: any) {
    console.error("PATCH /api/admin/applications/:id failed:", e)
    return new Response("Server error", { status: 500 })
  }
}
