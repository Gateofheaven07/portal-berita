import { neon } from "@neondatabase/serverless"
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

async function addCommentsTable() {
  try {
    console.log("Menambahkan tabel Comment...")

    // Buat tabel Comment
    await sql`
      CREATE TABLE IF NOT EXISTS "Comment" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        content TEXT NOT NULL,
        "articleId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"(id) ON DELETE CASCADE
      )
    `

    console.log("✓ Tabel Comment berhasil dibuat")

    // Buat index untuk performa query
    await sql`
      CREATE INDEX IF NOT EXISTS "Comment_articleId_idx" ON "Comment"("articleId")
    `

    await sql`
      CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt")
    `

    console.log("✓ Index berhasil dibuat")
    console.log("\n✅ Tabel Comment berhasil ditambahkan ke database!")
    console.log("Fitur komentar sekarang sudah siap digunakan.")
  } catch (error) {
    console.error("❌ Error:", error.message)
    if (error.message.includes("already exists")) {
      console.log("ℹ️  Tabel Comment sudah ada di database.")
    } else {
      process.exit(1)
    }
  }
}

addCommentsTable()

