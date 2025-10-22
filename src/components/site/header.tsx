import Link from "next/link"


const links = [
{ href: "/", label: "Home" },
{ href: "/about", label: "About" },
{ href: "/stores", label: "Stores" },
{ href: "/careers", label: "Careers" },
{ href: "/contact", label: "Contact" },
]


export default function Header() {
return (
<header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
<div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
<Link href="/" className="font-bold text-primary">SupaTrade</Link>
<nav className="hidden md:flex items-center gap-6">
{links.map(l => (
<Link key={l.href} href={l.href} className="text-sm text-slate-700 hover:text-primary">
{l.label}
</Link>
))}
</nav>
<Link href="/admin" className="rounded-lg bg-primary px-4 py-2 text-white text-sm">Admin</Link>
</div>
</header>
)
}