"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const verifyAuth = async () => {
      // Only access localStorage on client side
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken")
        const storedUser = localStorage.getItem("user")
        
        if (token && storedUser) {
          try {
            // Verify token with server
            const response = await fetch("/api/auth/verify", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            
            if (response.ok) {
              const data = await response.json()
              setUser(data.user)
            } else {
              // Token invalid, clear storage
              localStorage.removeItem("authToken")
              localStorage.removeItem("user")
            }
          } catch (error) {
            console.error("Error verifying auth:", error)
            // On error, try to use stored user but mark for re-verification
            try {
              setUser(JSON.parse(storedUser))
            } catch (parseError) {
              localStorage.removeItem("user")
              localStorage.removeItem("authToken")
            }
          }
        }
      }
      setLoading(false)
    }
    
    verifyAuth()
  }, [])

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    }
    setUser(null)
    // Redirect to homepage after logout
    window.location.href = "/"
  }

  if (!mounted) {
    return <AuthContext.Provider value={{ user: null, loading: true, logout }}>{children}</AuthContext.Provider>
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
