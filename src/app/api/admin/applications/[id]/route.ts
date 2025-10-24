// src/app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"
import { AppStatus } from "@prisma/client"
import type { NextRequest } from "next/server"
import { z } from "zod"

function isValidStatus(v: unknown): v is AppStatus {
  return typeof v === "string" && (v in AppStatus)
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // 👈 Next 16: params is a Promise
) {
  try {
    const admin = await getAuthedAdmin()
    if (!admin) return new Response("Unauthorized", { status: 401 })

    const { id } = await ctx.params            // 👈 await it
    if (!id) return new Response("Missing id", { status: 400 })

    const body = await req.json().catch(() => ({}))
    const status = body?.status
    if (!isValidStatus(status)) return new Response("Invalid status", { status: 400 })

    const app = await prisma.application.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    })

    const Body = z.object({
      status: z.enum(["NEW","SHORTLISTED","INTERVIEWING","OFFER","HIRED","REJECTED"])
    })
    const parsed = Body.safeParse(await req.json())
      if (!parsed.success) return new Response("Invalid status", { status: 400 })

    return Response.json({ application: app })
  } catch (e: any) {
    console.error("PATCH /api/admin/applications/[id] error:", e)
    return new Response(e?.message || "Server error", { status: 500 })
  }
}
