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
    // Add icon column if it doesn't exist (migration on the fly)
    try {
      await sql`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS icon TEXT`
    } catch (e) {
      // Column might already exist, ignore error
    }

    const result = await sql`
      SELECT id, name, slug, description, icon FROM "Category" ORDER BY name
    `

    // Normalize data structure (handle different return types from neon)
    let categoriesArray: any[] = []
    if (Array.isArray(result)) {
      categoriesArray = result
    } else if (result && typeof result === 'object') {
      categoriesArray = (result as any).rows || (result as any).data || [result]
    }

    // Transform and normalize data
    const categories = categoriesArray.map((cat: any) => {
      // Ensure icon is retrieved as complete string
      let iconValue: string | null = null
      if (cat?.icon) {
        // Handle different possible return types
        if (typeof cat.icon === 'string') {
          iconValue = cat.icon
        } else if (cat.icon && typeof cat.icon === 'object' && cat.icon.toString) {
          iconValue = cat.icon.toString()
        } else {
          iconValue = String(cat.icon)
        }
        // Ensure it's not empty
        if (iconValue && iconValue.trim() === '') {
          iconValue = null
        }
      }
      
      const iconLength = iconValue?.length || 0
      const iconStart = iconValue?.substring(0, 30) || 'null'
      const iconEnd = iconValue ? iconValue.substring(Math.max(0, iconLength - 30)) : 'null'
      console.log(`Category ${cat?.name}: icon exists: ${!!iconValue}, icon length: ${iconLength}, icon starts with: ${iconStart}, icon ends with: ${iconEnd}`)
      
      return {
        id: String(cat?.id || ''),
        name: String(cat?.name || ''),
        slug: String(cat?.slug || ''),
        description: cat?.description ? String(cat.description) : null,
        icon: iconValue,
      }
    })

    const categoriesWithIcons = categories.filter(c => c.icon)
    console.log("Total categories returned:", categories.length, "with icons:", categoriesWithIcons.length)
    if (categoriesWithIcons.length > 0) {
      categoriesWithIcons.forEach(cat => {
        console.log(`Icon for ${cat.name}: length=${cat.icon?.length}, valid base64=${cat.icon?.startsWith('data:image/')}`)
      })
    }
    
    return NextResponse.json({ categories }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }
    })
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
    const { name, description, icon } = await req.json()

    if (!name) {
      return NextResponse.json({ message: "Nama kategori harus diisi" }, { status: 400 })
    }

    const id = require("crypto").randomUUID()
    const slug = generateSlug(name)

    // Check if slug already exists
    const existingCategory = await sql`
      SELECT id FROM "Category" WHERE slug = ${slug} LIMIT 1
    `

    const existingArray = Array.isArray(existingCategory) 
      ? existingCategory 
      : (existingCategory as any)?.rows || (existingCategory as any)?.data || []
    
    if (existingArray.length > 0) {
      return NextResponse.json({ message: "Kategori dengan nama serupa sudah ada" }, { status: 400 })
    }

    // Add icon column if it doesn't exist (migration on the fly)
    try {
      await sql`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS icon TEXT`
    } catch (e) {
      // Column might already exist, ignore error
    }

    await sql`
      INSERT INTO "Category" (id, name, slug, description, icon)
      VALUES (${id}, ${name}, ${slug}, ${description || null}, ${icon || null})
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