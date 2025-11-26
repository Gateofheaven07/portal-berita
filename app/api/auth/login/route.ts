import { sql } from "@/lib/db"
import * as bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password harus diisi" }, { status: 400 })
    }

    // Query user from database
    const users = await sql`
      SELECT * FROM "User" WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    const user = users[0]

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error.message || "Terjadi kesalahan pada server"
      : "Terjadi kesalahan pada server"
    return NextResponse.json({ message: errorMessage, error: error?.message }, { status: 500 })
  }
}
