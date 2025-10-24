import { prisma } from "@/lib/prisma"
import { getAuthedAdmin } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAuthedAdmin()
  if (!admin) return new Response("Unauthorized", { status: 401 })
  const { status, note } = await req.json()

  const app = await prisma.application.update({
    where: { id: params.id },
    data: {
      status, // NEW | SHORTLISTED | INTERVIEWING | OFFER | HIRED | REJECTED
      coverLetter: note ?? undefined, // (or add a notes field in schema later)
    },
    select: { id: true, status: true }
  })
  return Response.json({ application: app })
}
