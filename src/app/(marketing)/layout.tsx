import type { ReactNode } from "react"
import "@/app/globals.css"
import Header from "@/components/site/header"
import Footer from "@/components/site/footer"


export default function MarketingLayout({ children }: { children: ReactNode }) {
return (
<div className="min-h-screen flex flex-col">
<Header />
<main className="flex-1">{children}</main>
<Footer />
</div>
)
}