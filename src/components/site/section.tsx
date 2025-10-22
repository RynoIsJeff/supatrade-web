import { ReactNode } from "react"


export default function Section({
title,
subtitle,
cta,
children,
}: {
title: string
subtitle?: string
cta?: { href: string; label: string }
children?: ReactNode
}) {
return (
<section className="py-16">
<div className="mx-auto max-w-6xl px-6">
<div className="max-w-2xl">
<h2 className="text-2xl font-semibold">{title}</h2>
{subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
</div>
<div className="mt-6 prose prose-slate max-w-none">
{children}
</div>
{cta && (
<div className="mt-6">
<a href={cta.href} className="inline-flex rounded-lg bg-primary px-4 py-2 text-white">
{cta.label}
</a>
</div>
)}
</div>
</section>
)
}