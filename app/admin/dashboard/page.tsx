"use client"

import { useProtectedRoute } from "@/hooks/use-protected-route"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { LogOut, Plus, FileText } from "lucide-react"

export default function AdminDashboard() {
  const { user, loading } = useProtectedRoute()
  const { logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Admin</h1>
              <p className="opacity-90 mt-1">Selamat datang, {user?.name}!</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/admin/articles/create"
            className="p-8 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Buat Artikel Baru</h3>
                <p className="text-muted-foreground mt-1">Tambahkan berita atau artikel terbaru</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/articles"
            className="p-8 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Kelola Artikel</h3>
                <p className="text-muted-foreground mt-1">Lihat, edit, dan hapus artikel</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/categories"
            className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-foreground mb-2">Kelola Kategori</h3>
            <p className="text-sm text-muted-foreground">Tambah, edit, dan hapus kategori</p>
          </Link>

          <Link
            href="/admin/messages"
            className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-foreground mb-2">Pesan Masuk</h3>
            <p className="text-sm text-muted-foreground">Lihat pesan dari halaman kontak</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
