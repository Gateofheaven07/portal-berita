"use client"

import { useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
}

export function useAuthInfo() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          setLoading(false)
          return
        }

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
        console.error("Auth verification error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  return { user, loading, logout }
}
