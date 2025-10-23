// src/app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "SupaTrade Group" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
