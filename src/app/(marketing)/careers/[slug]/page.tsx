// src/app/(marketing)/careers/[slug]/page.tsx
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ApplicationForm from "@/components/ApplicationForm"

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
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <article className="prose mb-8" dangerouslySetInnerHTML={{ __html: job.description }} />
      <h2 className="text-xl font-semibold mb-2">Apply for this position</h2>
      <ApplicationForm jobId={job.id}/>
    </div>
  )
}
