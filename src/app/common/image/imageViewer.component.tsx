import React, { useEffect, useCallback } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'

interface ImageViewerProps {
  src: string
  alt?: string
  onClose: () => void
}

export const ImageViewer = React.memo(({ src, alt = '', onClose }: ImageViewerProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="image-viewer-overlay" onClick={onClose}>
      <button
        className="image-viewer-close"
        onClick={onClose}
        type="button"
        aria-label="Close fullscreen view"
      >
        <AiFillCloseCircle size={36} color="white" />
      </button>
      <img
        className="image-viewer-image"
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
})

ImageViewer.displayName = 'ImageViewer'
