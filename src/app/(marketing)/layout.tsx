// src/app/layout.tsx
import "../globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SupaTrade Group",
  description: "Corporate website for SupaTrade Group – powered by UMS.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
