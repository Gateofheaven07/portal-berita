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

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    // Check if category has articles
    const articles = await sql`
      SELECT id FROM "Article" WHERE "categoryId" = ${id} LIMIT 1
    `

    if (articles.length > 0) {
      return NextResponse.json({ 
        message: "Tidak dapat menghapus kategori yang masih memiliki artikel" 
      }, { status: 400 })
    }

    await sql`DELETE FROM "Category" WHERE id = ${id}`

    return NextResponse.json({ message: "Kategori berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Error deleting category" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { name, description, icon } = await req.json()

    if (!name) {
      return NextResponse.json({ message: "Nama kategori harus diisi" }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    // Add icon column if it doesn't exist (migration on the fly)
    try {
      await sql`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS icon TEXT`
    } catch (e) {
      // Column might already exist, ignore error
    }

    await sql`
      UPDATE "Category" 
      SET name = ${name}, slug = ${slug}, description = ${description || null}, icon = ${icon || null}
      WHERE id = ${id}
    `

    return NextResponse.json({ message: "Kategori berhasil diupdate" })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ message: "Error updating category" }, { status: 500 })
  }
}
