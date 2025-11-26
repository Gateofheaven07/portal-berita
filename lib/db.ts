import { neon } from "@neondatabase/serverless"

let sqlInstance: ReturnType<typeof neon> | null = null

/**
 * Get database connection instance
 * Lazy initialization to prevent errors during build time
 */
function getDb() {
  if (!sqlInstance) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      // During build time, if DATABASE_URL is not set, we'll create a mock
      // that will throw a helpful error at runtime
      const mockDb = ((strings: TemplateStringsArray, ...values: any[]) => {
        throw new Error(
          "DATABASE_URL environment variable is not set. " +
          "Please create a .env.local file with your database connection string."
        )
      }) as any
      
      // Support for sql.query() method
      mockDb.query = async () => {
        throw new Error(
          "DATABASE_URL environment variable is not set. " +
          "Please create a .env.local file with your database connection string."
        )
      }
      
      return mockDb
    }
    
    sqlInstance = neon(databaseUrl)
  }
  
  return sqlInstance
}

// Create a function that acts as both a callable function and an object with methods
// This allows it to work as both sql`...` (template literal) and sql.query()
function createSqlProxy() {
  const handler = {
    get(_target: any, prop: string | symbol) {
      const db = getDb()
      const value = (db as any)[prop]
      if (typeof value === "function") {
        return value.bind(db)
      }
      return value
    },
  }
  
  // Create a callable function that proxies to getDb()
  const sqlFunction = ((strings: TemplateStringsArray, ...values: any[]) => {
    const db = getDb()
    return (db as any)(strings, ...values)
  }) as any
  
  // Add properties from the proxy
  return new Proxy(sqlFunction, handler) as ReturnType<typeof neon>
}

// Export the sql instance
export const sql = createSqlProxy()

