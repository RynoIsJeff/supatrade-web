// src/app/(marketing)/careers/[slug]/page.tsx
import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

export default async function JobDetail({
  params,
}: {
  params: { slug?: string }
}) {
  const slug = params?.slug ? decodeURIComponent(params.slug) : ""
  if (!slug) notFound()

  const job =
    (await prisma.job.findUnique({
      where: { slug },
      include: { store: true },
    })) ??
    (await prisma.job.findFirst({
      where: { slug },
      include: { store: true },
    }))

  if (!job || job.status !== "PUBLISHED") {
    notFound()
  }

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
      {/* apply form... */}
    </div>
  )
}
