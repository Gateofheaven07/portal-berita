"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { 
  User, 
  Settings, 
  LogOut, 
  BarChart3, 
  FileText, 
  Image, 
  MessageSquare,
  ChevronDown,
  Tags
} from "lucide-react"

interface AdminDropdownProps {
  user: {
    name: string
    email: string
    role: string
  } | null
  onLogout: () => void
}

export function AdminDropdown({ user, onLogout }: AdminDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Safety check for user
  if (!user || !user.name) {
    return null
  }

  const userInitial = user.name.charAt(0).toUpperCase()
  
  const adminMenuItems = [
    { 
      label: "Dashboard", 
      href: "/admin/dashboard", 
      icon: BarChart3 
    },
    { 
      label: "Kelola Artikel", 
      href: "/admin/articles", 
      icon: FileText 
    },
    { 
      label: "Kelola Kategori", 
      href: "/admin/categories", 
      icon: Tags 
    },
    { 
      label: "Galeri", 
      href: "/admin/gallery", 
      icon: Image 
    },
    { 
      label: "Pesan", 
      href: "/admin/messages", 
      icon: MessageSquare 
    },
  ]

  return (
    <div className="relative">
      {/* Admin Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <div className="w-6 h-6 bg-primary-foreground text-primary rounded-full flex items-center justify-center text-xs font-bold">
          {userInitial}
        </div>
        <span className="text-sm font-medium">{user.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User Info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {userInitial}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="inline-flex px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Menu Items */}
            <div className="py-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Logout */}
            <div className="py-2 border-t border-gray-100">
              <button
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
