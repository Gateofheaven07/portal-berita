/**
 * Get current date/time in UTC that represents the current Indonesia time
 * Database stores dates in UTC, so we need to ensure the UTC time we store
 * will display correctly when formatted with Asia/Jakarta timezone
 * 
 * This function gets the current time in Indonesia timezone and converts it to UTC
 * so that when displayed with Asia/Jakarta timezone, it shows the correct date
 */
export function getIndonesiaDate(): Date {
  const now = new Date()
  
  // Get current time in Indonesia timezone
  const indonesiaTimeString = now.toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  })
  
  // Parse: "MM/DD/YYYY, HH:MM:SS"
  const [datePart, timePart] = indonesiaTimeString.split(", ")
  const [month, day, year] = datePart.split("/").map(Number)
  const [hour, minute, second] = timePart.split(":").map(Number)
  
  // Create a Date object that represents this Indonesia time
  // We need to create it as if the components are in UTC, then adjust
  // If it's 28 Nov 2025 01:00:00 in Indonesia (UTC+7), the UTC equivalent is 27 Nov 2025 18:00:00
  // So we create a UTC date with Indonesia time components, then subtract 7 hours
  const indonesiaDateUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, second || 0))
  const utcDate = new Date(indonesiaDateUTC.getTime() - (7 * 60 * 60 * 1000))
  
  return utcDate
}

export function formatDate(dateString: string | null | undefined, locale: string = "id-ID", options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) {
    return ""
  }

  try {
    const date = new Date(dateString)
    
    // Default options for consistency with Indonesia timezone
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta", // Ensure Indonesia timezone
    }
    
    const formatOptions = { ...defaultOptions, ...options }
    
    // Use consistent formatting with Indonesia timezone
    return date.toLocaleDateString(locale, formatOptions)
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

export function formatDateShort(dateString: string | null | undefined): string {
  return formatDate(dateString, "id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Jakarta", // Ensure Indonesia timezone
  })
}

export function formatDateFull(dateString: string | null | undefined): string {
  return formatDate(dateString, "id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta", // Ensure Indonesia timezone
  })
}
