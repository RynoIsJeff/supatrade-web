export default function Footer() {
return (
<footer className="border-t bg-slate-50">
<div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600">
<p>© {new Date().getFullYear()} SupaTrade Group. All rights reserved.</p>
</div>
</footer>
)
}