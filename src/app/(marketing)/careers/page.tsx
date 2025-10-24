import Link from "next/link"

async function fetchJobs() {
  const res = await fetch(`${process.env.SITE_URL || ""}/api/jobs`, { cache: "no-store" })
  if (!res.ok) return { jobs: [] }
  return res.json() as Promise<{ jobs: any[] }>
}

export default async function CareersPage() {
  const { jobs } = await fetchJobs()
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold">Careers</h1>
      <p className="mt-4 text-slate-600">View open roles or submit a general application.</p>

      <div className="mt-8 grid gap-4">
        {jobs.length === 0 && <p className="text-slate-500">No open roles right now.</p>}
        {jobs.map((j) => (
          <Link
            key={j.id}
            href={`/careers/${j.slug}`}
            className="block rounded-lg border p-4 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label={`Open ${j.title}`}
          >
            <div className="text-sm text-slate-500">
              {j.brand} {j.store ? `• ${j.store.town}` : ""}
            </div>

            <h3 className="text-lg font-semibold">{j.title}</h3>

            {j.closingDate && (
              <div className="text-xs text-slate-500">
                Closes {new Date(j.closingDate).toLocaleDateString("en-ZA")}
              </div>
            )}

            <div className="mt-3">
              <span className="text-primary underline">View & Apply</span>
            </div>
          </Link>
        ))}

      </div>

      <hr className="my-10" />
      <h2 id="general-apply" className="text-2xl font-semibold">General Application</h2>
      <form action="/api/applications" method="post" className="mt-4 grid gap-3">
        <input type="hidden" name="jobId" value="" />
        <input name="firstName" placeholder="First name" className="rounded border p-2" required />
        <input name="lastName" placeholder="Last name" className="rounded border p-2" required />
        <input name="email" type="email" placeholder="Email" className="rounded border p-2" required />
        <input name="phone" placeholder="Phone (optional)" className="rounded border p-2" />
        <textarea name="coverLetter" placeholder="Cover letter (optional)" className="rounded border p-2" rows={4} />
        <button className="rounded bg-primary px-4 py-2 text-white w-fit">Submit</button>
      </form>
    </div>
  )
}
