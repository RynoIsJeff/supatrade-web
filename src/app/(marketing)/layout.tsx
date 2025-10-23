// src/app/(marketing)/layout.tsx
import type { ReactNode } from "react"

export const metadata = {
  title: "SupaTrade — Careers & Stores",
}

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
