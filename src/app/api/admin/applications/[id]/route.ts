// src/app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"
import { AppStatus } from "@prisma/client"

function isValidStatus(v: unknown): v is AppStatus {
  return typeof v === "string" && (v in AppStatus)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await getAuthedAdmin()
    if (!admin) return new Response("Unauthorized", { status: 401 })

    const body = await req.json().catch(() => ({}))
    const status = body?.status

    if (!isValidStatus(status)) {
      return new Response("Invalid status", { status: 400 })
    }

    const app = await prisma.application.update({
      where: { id: params.id },
      data: { status }, // typed as AppStatus by the guard above
      select: { id: true, status: true },
    })

    return Response.json({ application: app })
  } catch (e: any) {
    console.error("PATCH /api/admin/applications/[id] error:", e)
    // surface Prisma codes like P2025 (record not found), etc.
    const msg = e?.code ? `${e.code}: ${e.message}` : (e?.message || "Server error")
    return new Response(msg, { status: 500 })
  }
}
