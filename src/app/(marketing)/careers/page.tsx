export default function CareersPage() {
return (
<div className="mx-auto max-w-6xl px-6 py-16">
<h1 className="text-3xl font-bold">Careers</h1>
<p className="mt-4 text-slate-600">View open roles across SupaTrade stores or submit a general application.</p>
<div className="mt-8 flex gap-3">
<a href="#jobs" className="rounded-xl bg-primary px-5 py-3 text-white">Open Positions</a>
<a href="#general-apply" className="rounded-xl border px-5 py-3">General Apply</a>
</div>
</div>
)
}