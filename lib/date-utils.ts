export function formatDate(dateString: string | null | undefined, locale: string = "id-ID", options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) {
    return ""
  }

  try {
    const date = new Date(dateString)
    
    // Default options for consistency
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    
    const formatOptions = { ...defaultOptions, ...options }
    
    // Use consistent formatting that works on both server and client
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
  })
}

export function formatDateFull(dateString: string | null | undefined): string {
  return formatDate(dateString, "id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
