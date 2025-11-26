"use client"

import { useEffect } from "react"

interface ViewTrackerProps {
  slug: string
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Wait 2 seconds before tracking view to ensure genuine read
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await fetch(`/api/articles/${slug}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        // Silently fail for analytics
        console.debug("View tracking failed:", error)
      }
    }

    trackView()
  }, [slug])

  // This component renders nothing
  return null
}
