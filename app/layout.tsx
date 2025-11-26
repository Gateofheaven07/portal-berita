import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { AdminIndicator } from "@/components/admin-indicator"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portal Berita Jabodetabek - Informasi Terkini dan Terpercaya",
  description: "Portal berita terpercaya untuk Jabodetabek dengan berita utama, gaya hidup, kesehatan, dan politik",
  keywords: "berita, jabodetabek, jakarta, informasi, berita terkini",
  openGraph: {
    title: "Portal Berita Jabodetabek",
    description: "Portal berita terpercaya untuk Jabodetabek",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <AdminIndicator />
        </AuthProvider>
      </body>
    </html>
  )
}
