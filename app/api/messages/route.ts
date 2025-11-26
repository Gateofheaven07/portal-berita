import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

function verifyToken(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1]
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const decoded = verifyToken(req)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const messages = await sql`
      SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC
    `

    return NextResponse.json({ messages })
  } catch (error: any) {
    console.error("Error fetching messages:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error fetching messages"
      : "Error fetching messages"
    return NextResponse.json({ message: errorMessage, messages: [] }, { status: 500 })
  }
}
