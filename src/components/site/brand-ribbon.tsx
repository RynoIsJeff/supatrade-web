const brands = ["SPAR", "Savemor", "Engen", "Steers", "Debonairs", "Build It"]
export default function BrandRibbon() {
return (
<div className="border-y bg-white">
<div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap items-center gap-6">
{brands.map(b => (
<span key={b} className="text-slate-700/80">{b}</span>
))}
</div>
</div>
)
}