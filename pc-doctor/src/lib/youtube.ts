/**
 * Extract YouTube video ID from various URL formats
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null
  
  try {
    const urlObj = new URL(url)
    
    // youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    }
    
    // youtu.be/VIDEO_ID
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1)
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

/**
 * Validate if a YouTube URL is properly formatted
 */
export function isValidYouTubeUrl(url: string): boolean {
  return getYouTubeId(url) !== null
}
