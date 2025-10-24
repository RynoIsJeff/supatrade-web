// src/app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"
import { z } from "zod"

const Body = z.object({
  status: z.enum(["NEW","SHORTLISTED","INTERVIEWING","OFFER","HIRED","REJECTED"])
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAuthedAdmin()
  if (!admin) return new Response("Unauthorized", { status: 401 })

  const parsed = Body.safeParse(await req.json())
  if (!parsed.success) return new Response("Invalid status", { status: 400 })

  const app = await prisma.application.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  })
  return Response.json({ application: app })
}
