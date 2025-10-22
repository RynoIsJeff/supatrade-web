import type { ReactNode } from "react"
import "@/app/globals.css"


export default function AdminLayout({ children }: { children: ReactNode }) {
return (
<div className="min-h-screen">
{/* Admin nav/sidebar will come after auth */}
{children}
</div>
)
}