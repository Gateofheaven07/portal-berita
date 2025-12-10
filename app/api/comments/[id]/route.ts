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

// DELETE komentar (hanya admin)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    
    // Verifikasi komentar exists
    const comment = await sql`
      SELECT id FROM "Comment" WHERE id = ${id}
    ` as Array<{ id: string }>

    if (comment.length === 0) {
      return NextResponse.json({ message: "Komentar tidak ditemukan" }, { status: 404 })
    }

    await sql`DELETE FROM "Comment" WHERE id = ${id}`

    return NextResponse.json({ message: "Komentar berhasil dihapus" })
  } catch (error: any) {
    console.error("Error deleting comment:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error deleting comment"
      : "Error deleting comment"
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}

