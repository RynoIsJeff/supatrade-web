// src/app/(marketing)/careers/[slug]/page.tsx
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

// ensure dynamic (so new jobs work immediately)
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function JobDetail({
  params,
}: {
  // 👇 Next 16: params is a Promise
  params: Promise<{ slug: string }>
}) {
  const { slug: raw } = await params
  const slug = decodeURIComponent(raw || "")
  if (!slug) notFound()

  const job = await prisma.job.findUnique({
    where: { slug },
    include: { store: true },
  })
  if (!job || job.status !== "PUBLISHED") notFound()

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-sm text-slate-500">
        {job.brand} {job.store ? `• ${job.store.town}` : ""}
      </div>
      <h1 className="mt-1 text-3xl font-bold">{job.title}</h1>
      {job.closingDate && (
        <div className="mt-1 text-xs text-slate-500">
          Closes {new Date(job.closingDate).toLocaleDateString("en-ZA")}
        </div>
      )}
      <article
        className="prose prose-slate mt-6"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
    </div>
  )
}
