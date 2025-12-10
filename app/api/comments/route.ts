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

// GET komentar
// - Jika ada articleId: ambil komentar untuk artikel tertentu (public)
// - Jika tidak ada articleId tapi ada token admin: ambil semua komentar (admin only)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const articleId = searchParams.get("articleId")
    const decoded = verifyToken(req)
    const isAdmin = decoded && (decoded as any).role === "admin"

    // Jika admin dan tidak ada articleId, ambil semua komentar
    if (isAdmin && !articleId) {
      const comments = await sql`
        SELECT 
          c.id, 
          c.name, 
          c.email, 
          c.content, 
          c."createdAt", 
          c."updatedAt",
          c."articleId",
          a.title as "articleTitle",
          a.slug as "articleSlug"
        FROM "Comment" c
        LEFT JOIN "Article" a ON c."articleId" = a.id
        ORDER BY c."createdAt" DESC
      ` as Array<{
        id: string
        name: string
        email: string
        content: string
        createdAt: Date
        updatedAt: Date
        articleId: string
        articleTitle: string | null
        articleSlug: string | null
      }>

      return NextResponse.json({ comments })
    }

    // Jika ada articleId, ambil komentar untuk artikel tertentu (public)
    if (!articleId) {
      return NextResponse.json({ message: "articleId is required" }, { status: 400 })
    }

    const comments = await sql`
      SELECT id, name, email, content, "createdAt", "updatedAt"
      FROM "Comment"
      WHERE "articleId" = ${articleId}
      ORDER BY "createdAt" DESC
    ` as Array<{
      id: string
      name: string
      email: string
      content: string
      createdAt: Date
      updatedAt: Date
    }>

    return NextResponse.json({ comments })
  } catch (error: any) {
    console.error("Error fetching comments:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error fetching comments"
      : "Error fetching comments"
    return NextResponse.json({ message: errorMessage, comments: [] }, { status: 500 })
  }
}

// POST komentar baru (tanpa perlu login)
export async function POST(req: NextRequest) {
  try {
    const { name, email, content, articleId } = await req.json()

    // Validasi input
    if (!name || !email || !content || !articleId) {
      return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 })
    }

    // Validasi email format sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 })
    }

    // Validasi panjang konten
    if (content.trim().length < 3) {
      return NextResponse.json({ message: "Komentar terlalu pendek" }, { status: 400 })
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ message: "Komentar terlalu panjang (maksimal 1000 karakter)" }, { status: 400 })
    }

    // Verifikasi artikel exists
    const article = await sql`
      SELECT id FROM "Article" WHERE id = ${articleId} AND status = 'published'
    ` as Array<{ id: string }>

    if (article.length === 0) {
      return NextResponse.json({ message: "Artikel tidak ditemukan" }, { status: 404 })
    }

    const id = require("crypto").randomUUID()

    await sql`
      INSERT INTO "Comment" (id, name, email, content, "articleId")
      VALUES (${id}, ${name.trim()}, ${email.trim()}, ${content.trim()}, ${articleId})
    `

    return NextResponse.json({ message: "Komentar berhasil dikirim", id }, { status: 201 })
  } catch (error: any) {
    console.error("Error posting comment:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error posting comment"
      : "Error posting comment"
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}

