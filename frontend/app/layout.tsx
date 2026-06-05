import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CodeMentor AI",
  description: "AI code review untuk developer Indonesia",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
