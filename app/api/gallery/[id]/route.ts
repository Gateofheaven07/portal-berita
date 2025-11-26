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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = verifyToken(req)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await sql`DELETE FROM "Gallery" WHERE id = ${id}`

    return NextResponse.json({ message: "Image deleted" })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ message: "Error deleting image" }, { status: 500 })
  }
}
