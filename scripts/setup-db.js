import { neon } from "@neondatabase/serverless"
import * as bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, "..", ".env")

try {
  const envFile = readFileSync(envPath, "utf-8")
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, "")
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
} catch (error) {
  console.warn("Warning: Could not read .env file:", error.message)
}

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set!")
  console.error("Please make sure .env file exists with DATABASE_URL")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function setupDatabase() {
  try {
    console.log("Starting database setup...")
    console.log("Connecting to database...")

    // Create tables
    console.log("Creating tables...")
    
    // Drop and recreate User table to ensure correct structure
    await sql`DROP TABLE IF EXISTS "User" CASCADE;`
    await sql`
      CREATE TABLE "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'admin',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Drop and recreate Category table
    await sql`DROP TABLE IF EXISTS "Category" CASCADE;`
    await sql`
      CREATE TABLE "Category" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Drop and recreate Article table
    await sql`DROP TABLE IF EXISTS "Article" CASCADE;`
    await sql`
      CREATE TABLE "Article" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "content" TEXT NOT NULL,
        "excerpt" TEXT,
        "featuredImage" TEXT,
        "categoryId" TEXT NOT NULL,
        "authorId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'draft',
        "views" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "publishedAt" TIMESTAMP(3),
        CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `

    // Drop and recreate Gallery table
    await sql`DROP TABLE IF EXISTS "Gallery" CASCADE;`
    await sql`
      CREATE TABLE "Gallery" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "image" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Drop and recreate ContactMessage table
    await sql`DROP TABLE IF EXISTS "ContactMessage" CASCADE;`
    await sql`
      CREATE TABLE "ContactMessage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS "Article_categoryId_idx" ON "Article"("categoryId");
    `
    await sql`
      CREATE INDEX IF NOT EXISTS "Article_authorId_idx" ON "Article"("authorId");
    `
    await sql`
      CREATE INDEX IF NOT EXISTS "Article_status_idx" ON "Article"("status");
    `

    console.log("Tables created successfully!")

    // Check if admin user exists
    const existingUsers = await sql`
      SELECT * FROM "User" WHERE email = 'admin@newportal.com'
    `

    if (existingUsers.length === 0) {
      console.log("Creating default admin user...")
      
      // Hash password: demo123456
      const hashedPassword = await bcrypt.hash("demo123456", 10)
      const adminUserId = randomUUID()

      await sql`
        INSERT INTO "User" (id, email, password, name, role)
        VALUES (${adminUserId}, 'admin@newportal.com', ${hashedPassword}, 'Admin', 'admin')
      `

      console.log("✓ Default admin user created!")
      console.log("  Email: admin@newportal.com")
      console.log("  Password: demo123456")
    } else {
      console.log("✓ Admin user already exists")
    }

    // Insert default categories
    console.log("Setting up default categories...")
    
    const categories = [
      {
        id: randomUUID(),
        name: "Berita Utama",
        slug: "berita-utama",
        description: "Berita terkini dan isu aktual",
      },
      {
        id: randomUUID(),
        name: "Gaya Hidup",
        slug: "gaya-hidup",
        description: "Tren, hiburan, kuliner, dan fashion",
      },
      {
        id: randomUUID(),
        name: "Kesehatan",
        slug: "kesehatan",
        description: "Informasi kesehatan dan tips medis",
      },
      {
        id: randomUUID(),
        name: "Politik dan Hukum",
        slug: "politik-hukum",
        description: "Dinamika politik dan isu hukum",
      },
    ]

    for (const category of categories) {
      await sql`
        INSERT INTO "Category" (id, name, slug, description)
        VALUES (${category.id}, ${category.name}, ${category.slug}, ${category.description})
        ON CONFLICT (name) DO NOTHING
      `
    }

    console.log("✓ Categories setup completed!")

    console.log("\n✅ Database setup completed successfully!")
    console.log("\nYou can now login with:")
    console.log("  Email: admin@newportal.com")
    console.log("  Password: demo123456")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()

