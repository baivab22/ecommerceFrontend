/**
 * Optimized Image Component Wrapper
 * Extends next/image with sensible defaults and best practices
 */

import React, { useState } from 'react'
import Image from 'next/image'
import { CSSProperties } from 'react'
import { FILE_URL } from 'src/config'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  className?: string
  style?: CSSProperties
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none'
  objectPosition?: string
  onError?: () => void
  loading?: 'lazy' | 'eager'
  unoptimized?: boolean
  draggable?: boolean
  title?: string
}

/**
 * OptimizedImage Component
 * 
 * Wrapper around next/image with SEO-optimized defaults and error handling
 * 
 * Usage:
 * <OptimizedImage
 *   src="/path/to/image.jpg"
 *   alt="Descriptive alt text for SEO"
 *   width={400}
 *   height={300}
 *   quality={90}
 *   priority={false}
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  fill = false,
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0e4d5" width="400" height="300"/%3E%3C/svg%3E',
  className = '',
  style,
  objectFit = 'cover',
  objectPosition = 'center',
  onError,
  loading = 'lazy',
  unoptimized = false,
  draggable = false,
  title,
  ...rest
}) => {
  const [isError, setIsError] = useState(false)

  // Convert uploads/ paths to full URL or add leading slash for next/image compatibility
  const processedSrc = (() => {
    if (typeof src !== 'string') return src
    
    // Handle uploads/ paths
    if (src.startsWith('uploads/')) {
      return `${FILE_URL}/${encodeURI(src.replace(/^uploads\//, ''))}`
    }
    
    // Handle relative paths - add leading slash for next/image
    if (!src.startsWith('/') && !src.startsWith('http://') && !src.startsWith('https://')) {
      return `/${src}`
    }
    
    return src
  })()

  const handleError = () => {
    setIsError(true)
    if (onError) {
      onError()
    }
  }

  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...style
  }

  const imageStyle: CSSProperties = {
    objectFit,
    objectPosition
  }

  // Return a fallback if image fails to load
  if (isError) {
    return (
      <div style={containerStyle} className={className}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 300"
          style={{ width: '100%', height: 'auto', backgroundColor: '#f0e4d5' }}
        >
          <rect fill="#FFE8F4" width="400" height="300" />
          <text x="50%" y="50%" textAnchor="middle" fill="#999" fontSize="14">
            Image not available
          </text>
        </svg>
      </div>
    )
  }

  return (
    <>
      {fill ? (
        <div style={{ ...containerStyle, position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={processedSrc}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            className={className}
            style={imageStyle}
            onError={handleError}
            loading={loading}
            unoptimized={unoptimized}
            draggable={draggable}
            title={title || alt}
            {...rest}
          />
        </div>
      ) : (
        <Image
          src={processedSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={className}
          style={imageStyle}
          onError={handleError}
          loading={loading}
          unoptimized={unoptimized}
          draggable={draggable}
          title={title || alt}
          {...rest}
        />
      )}
    </>
  )
}

export default OptimizedImage
