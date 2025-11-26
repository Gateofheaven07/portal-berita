import { neon } from "@neondatabase/serverless"

let sqlInstance: ReturnType<typeof neon> | null = null

/**
 * Get database connection instance
 * Lazy initialization to prevent errors during build time
 */
function getDb() {
  if (!sqlInstance) {
    let databaseUrl = process.env.DATABASE_URL
    
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
    
    // Clean and validate the connection string
    // Remove quotes if present and trim whitespace
    databaseUrl = databaseUrl.trim()
    
    // Remove surrounding quotes (single or double, with or without escaping)
    databaseUrl = databaseUrl.replace(/^["']|["']$/g, "")
    databaseUrl = databaseUrl.replace(/^\\["']|\\["']$/g, "")
    
    // Remove any escaped quotes that might cause issues
    databaseUrl = databaseUrl.replace(/\\"/g, '"').replace(/\\'/g, "'")
    
    // Final trim to ensure no leading/trailing whitespace
    databaseUrl = databaseUrl.trim()
    
    // Validate that it's a valid URL
    try {
      new URL(databaseUrl)
    } catch (error) {
      throw new Error(
        `Database connection string is not a valid URL. Connection string: "${databaseUrl}"`
      )
    }
    
    // Initialize neon with proper error handling
    try {
      sqlInstance = neon(databaseUrl)
    } catch (error: any) {
      throw new Error(
        `Failed to initialize database connection: ${error?.message || 'Unknown error'}. Connection string: "${databaseUrl}"`
      )
    }
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

