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

export async function DELETE(req: NextRequest) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { ids } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "IDs array is required" }, { status: 400 })
    }

    // Delete multiple articles
    // Loop through ids and delete one by one (safer approach)
    for (const id of ids) {
      await sql`DELETE FROM "Article" WHERE id = ${id}`
    }

    return NextResponse.json({ message: "Articles deleted successfully", count: ids.length })
  } catch (error) {
    console.error("Error deleting articles:", error)
    return NextResponse.json({ message: "Error deleting articles" }, { status: 500 })
  }
}

