"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Settings, BarChart3 } from "lucide-react"

export function AdminIndicator() {
  const { user, loading } = useAuth()

  // Don't render during loading or if user is not admin
  if (loading || !user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex flex-col gap-2">
        {/* Admin Panel Quick Access */}
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-colors group"
          title="Admin Dashboard"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm font-medium">Admin Panel</span>
        </Link>
        
        {/* Admin Status Badge */}
        <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium text-center shadow-lg">
          Logged as Admin
        </div>
      </div>
    </div>
  )
}
