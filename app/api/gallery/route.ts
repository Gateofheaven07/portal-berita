import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { randomUUID } from "crypto"

function verifyToken(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1]
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const gallery = await sql`
      SELECT * FROM "Gallery" ORDER BY "createdAt" DESC
    `

    return NextResponse.json({ gallery })
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json({ message: "Error fetching gallery", gallery: [] }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const decoded = verifyToken(req)

  if (!decoded) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, image, description } = await req.json()

    if (!title || !image) {
      return NextResponse.json({ message: "Title and image are required" }, { status: 400 })
    }

    const id = randomUUID()

    await sql`
      INSERT INTO "Gallery" (id, title, image, description)
      VALUES (${id}, ${title}, ${image}, ${description || null})
    `

    return NextResponse.json({ message: "Image added successfully", id }, { status: 201 })
  } catch (error: any) {
    console.error("Error adding image:", error)
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Error adding image"
      : "Error adding image"
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
