"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AdminDropdown } from "./admin-dropdown"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout, loading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = [
    { name: "Berita Utama", href: "/category/berita-utama" },
    { name: "Gaya Hidup", href: "/category/gaya-hidup" },
    { name: "Kesehatan", href: "/category/kesehatan" },
    { name: "Politik & Hukum", href: "/category/politik-hukum" },
  ]

  if (!mounted || loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white text-slate-900 shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0 font-bold text-2xl">
              Portal Berita
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href} className="hover:opacity-80 transition-opacity text-sm">
                  {cat.name}
                </Link>
              ))}
              <Link href="/search" className="p-2 hover:opacity-80 transition-opacity">
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/admin/login" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white text-slate-900 shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 font-bold text-2xl">
            Portal Berita
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="hover:opacity-80 transition-opacity text-sm">
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search and Admin */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/search"
              className="p-2 hover:bg-slate-100 rounded transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            {user && user.role === 'admin' ? (
              <AdminDropdown user={user} onLogout={logout} />
            ) : (
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="block px-4 py-2 hover:bg-slate-100 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <div className="flex gap-2 pt-4">
              <Link
                href="/search"
                className="flex-1 px-4 py-2 border border-slate-300 rounded text-center hover:bg-slate-100 transition-colors"
              >
                Cari
              </Link>
              {user && user.role === 'admin' ? (
                <Link
                  href="/admin/dashboard"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-center"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
