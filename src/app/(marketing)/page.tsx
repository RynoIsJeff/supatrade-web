import BrandRibbon from "@/components/site/brand-ribbon"
import Section from "@/components/site/section"


export default function HomePage() {
return (
<>
<section className="bg-primary text-white">
<div className="mx-auto max-w-6xl px-6 py-24">
<h1 className="text-4xl font-bold">SupaTrade Group</h1>
<p className="mt-4 max-w-2xl text-white/90">
A family of franchised brands across KwaZulu-Natal — serving communities with quality, value, and service.
</p>
<div className="mt-8 flex gap-3">
<a href="/stores" className="rounded-xl bg-white px-5 py-3 text-primary font-medium">Find a Store</a>
<a href="/careers" className="rounded-xl border border-white/40 px-5 py-3 font-medium">Careers</a>
</div>
</div>
</section>
<BrandRibbon />
<Section title="Who we are" subtitle="About the SupaTrade group" cta={{ href: "/about", label: "Learn more" }}>
<p>
SupaTrade supports a network of Spar, Savemor, Engen, Steers, Debonairs and Build It stores across KZN.
</p>
</Section>
</>
)
}