const ACTIVE_VIDEO_EVENT = 'app:active-video-change'
const PLAYING_VIDEO_EVENT = 'app:playing-video-change'

type ActiveVideoChangeDetail = {
  activeVideoId: string
}

type PlayingVideoChangeDetail = {
  playingVideoId: string
}

const videoElementMap = new Map<string, HTMLElement>()
const inViewVideoIds = new Set<string>()
let currentActiveVideoId = ''
let isViewportListenerAttached = false

// Global audio management
const allVideoElements = new Map<string, HTMLVideoElement>()
let currentPlayingVideoId: string | null = null

const dispatchActiveVideoChange = (activeVideoId: string) => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<ActiveVideoChangeDetail>(ACTIVE_VIDEO_EVENT, {
      detail: {activeVideoId}
    })
  )
}

const dispatchPlayingVideoChange = (playingVideoId: string | null) => {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<PlayingVideoChangeDetail>(PLAYING_VIDEO_EVENT, {
      detail: {playingVideoId: playingVideoId || ''}
    })
  )
}

const evaluateNearestCenterVideo = () => {
  if (typeof window === 'undefined') return

  const viewportCenterY = window.innerHeight / 2
  let nearestVideoId = ''
  let nearestDistance = Number.POSITIVE_INFINITY

  inViewVideoIds.forEach((videoId) => {
    const element = videoElementMap.get(videoId)
    if (!element) return

    const rect = element.getBoundingClientRect()
    if (rect.height <= 0) return

    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)

    if (visibleHeight <= 0) return

    const elementCenterY = rect.top + rect.height / 2
    const distanceFromViewportCenter = Math.abs(elementCenterY - viewportCenterY)

    if (distanceFromViewportCenter < nearestDistance) {
      nearestDistance = distanceFromViewportCenter
      nearestVideoId = videoId
    }
  })

  if (nearestVideoId === currentActiveVideoId) return

  currentActiveVideoId = nearestVideoId
  dispatchActiveVideoChange(currentActiveVideoId)
}

const attachViewportListenersIfNeeded = () => {
  if (typeof window === 'undefined' || isViewportListenerAttached) return

  const reevaluate = () => {
    evaluateNearestCenterVideo()
  }

  window.addEventListener('scroll', reevaluate, {passive: true})
  window.addEventListener('resize', reevaluate)
  window.addEventListener('orientationchange', reevaluate)
  isViewportListenerAttached = true
}

export const registerVideoCandidate = (videoId: string, element: HTMLElement) => {
  videoElementMap.set(videoId, element)
  attachViewportListenersIfNeeded()
  evaluateNearestCenterVideo()
}

export const unregisterVideoCandidate = (videoId: string) => {
  videoElementMap.delete(videoId)
  inViewVideoIds.delete(videoId)
  evaluateNearestCenterVideo()
}

export const updateVideoInView = (videoId: string, inView: boolean) => {
  if (inView) {
    inViewVideoIds.add(videoId)
  } else {
    inViewVideoIds.delete(videoId)
  }

  evaluateNearestCenterVideo()
}

export const announceActiveVideo = (activeVideoId: string) => {
  currentActiveVideoId = activeVideoId
  dispatchActiveVideoChange(activeVideoId)
}

export const subscribeToActiveVideo = (
  callback: (activeVideoId: string) => void
) => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ActiveVideoChangeDetail>
    callback(customEvent.detail?.activeVideoId || '')
  }

  window.addEventListener(ACTIVE_VIDEO_EVENT, handler)

  return () => {
    window.removeEventListener(ACTIVE_VIDEO_EVENT, handler)
  }
}

// ============================================
// GLOBAL AUDIO MANAGEMENT SYSTEM
// ============================================

/**
 * Register a video element globally to be tracked for audio management.
 * This ensures only one video plays sound at a time across the entire application.
 */
export const registerVideoElement = (videoId: string, videoElement: HTMLVideoElement) => {
  allVideoElements.set(videoId, videoElement)
  
  // Add play and pause event listeners to manage global audio
  const handlePlay = () => {
    // Only unmute if no other video is playing
    if (currentPlayingVideoId === null) {
      currentPlayingVideoId = videoId
      muteAllVideosExcept(videoId)
      dispatchPlayingVideoChange(videoId)
    }
  }

  const handlePause = () => {
    if (currentPlayingVideoId === videoId) {
      currentPlayingVideoId = null
      dispatchPlayingVideoChange(null)
    }
  }

  const handleEnded = () => {
    if (currentPlayingVideoId === videoId) {
      currentPlayingVideoId = null
      dispatchPlayingVideoChange(null)
    }
  }

  videoElement.addEventListener('play', handlePlay)
  videoElement.addEventListener('pause', handlePause)
  videoElement.addEventListener('ended', handleEnded)

  // Return cleanup function
  return () => {
    allVideoElements.delete(videoId)
    videoElement.removeEventListener('play', handlePlay)
    videoElement.removeEventListener('pause', handlePause)
    videoElement.removeEventListener('ended', handleEnded)
    
    if (currentPlayingVideoId === videoId) {
      currentPlayingVideoId = null
      dispatchPlayingVideoChange(null)
    }
  }
}

/**
 * Mute all videos except the specified one.
 * This ensures only one video plays audio at a time.
 */
export const muteAllVideosExcept = (videoId: string | null) => {
  allVideoElements.forEach((video, id) => {
    if (id !== videoId && !video.paused) {
      video.muted = true
      video.pause()
    }
  })
}

/**
 * Set a video as the currently playing video (with audio).
 * This will mute all other videos.
 */
export const setCurrentPlayingVideo = (videoId: string | null) => {
  currentPlayingVideoId = videoId
  muteAllVideosExcept(videoId)
  dispatchPlayingVideoChange(videoId)
}

/**
 * Get the ID of the currently playing video (with audio).
 */
export const getCurrentPlayingVideoId = (): string | null => {
  return currentPlayingVideoId
}

/**
 * Subscribe to playing video changes.
 * Triggered when a video starts/stops playing with audio.
 */
export const subscribeToPlayingVideo = (
  callback: (playingVideoId: string | null) => void
) => {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<PlayingVideoChangeDetail>
    callback(customEvent.detail?.playingVideoId || null)
  }

  window.addEventListener(PLAYING_VIDEO_EVENT, handler)

  return () => {
    window.removeEventListener(PLAYING_VIDEO_EVENT, handler)
  }
}

/**
 * Stop all video playback with audio across the entire application.
 */
export const stopAllVideos = () => {
  allVideoElements.forEach((video) => {
    if (!video.paused) {
      video.pause()
    }
    video.muted = true
  })
  currentPlayingVideoId = null
  dispatchPlayingVideoChange(null)
}
