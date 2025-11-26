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

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function GET() {
  try {
    const categories = await sql`
      SELECT * FROM "Category" ORDER BY name
    `

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ message: "Error fetching categories", categories: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const decoded = verifyToken(req)

  if (!decoded || (decoded as any).role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ message: "Nama kategori harus diisi" }, { status: 400 })
    }

    const id = require("crypto").randomUUID()
    const slug = generateSlug(name)

    // Check if slug already exists
    const existingCategory = await sql`
      SELECT id FROM "Category" WHERE slug = ${slug} LIMIT 1
    `

    if (existingCategory.length > 0) {
      return NextResponse.json({ message: "Kategori dengan nama serupa sudah ada" }, { status: 400 })
    }

    await sql`
      INSERT INTO "Category" (id, name, slug, description)
      VALUES (${id}, ${name}, ${slug}, ${description || null})
    `

    return NextResponse.json({ message: "Kategori berhasil dibuat", id }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error creating category"
      : "Error creating category"
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}