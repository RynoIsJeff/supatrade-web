import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "SupaTrade Group" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"  // 👈 silences the warning
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
