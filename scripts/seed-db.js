import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Insert default admin user
    const adminUserId = crypto.randomUUID()
    await sql`
      INSERT INTO "User" (id, email, password, name, role)
      VALUES (${adminUserId}, 'admin@newportal.com', '$2b$10$YourHashedPasswordHere', 'Admin', 'admin')
      ON CONFLICT DO NOTHING;
    `

    // Insert categories
    const categories = [
      {
        id: crypto.randomUUID(),
        name: "Berita Utama",
        slug: "berita-utama",
        description: "Berita terkini dan isu aktual",
      },
      {
        id: crypto.randomUUID(),
        name: "Gaya Hidup",
        slug: "gaya-hidup",
        description: "Tren, hiburan, kuliner, dan fashion",
      },
      {
        id: crypto.randomUUID(),
        name: "Kesehatan",
        slug: "kesehatan",
        description: "Informasi kesehatan dan tips medis",
      },
      {
        id: crypto.randomUUID(),
        name: "Politik dan Hukum",
        slug: "politik-hukum",
        description: "Dinamika politik dan isu hukum",
      },
    ]

    for (const category of categories) {
      await sql`
        INSERT INTO "Category" (id, name, slug, description)
        VALUES (${category.id}, ${category.name}, ${category.slug}, ${category.description})
        ON CONFLICT DO NOTHING;
      `
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
