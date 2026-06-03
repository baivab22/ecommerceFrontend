import {FILE_URL} from 'src/config'

const encodePath = (value: string) => encodeURI(value.replace(/^\/+/, ''))

export const resolveProductImageUrl = (rawValue?: string) => {
  if (!rawValue) return ''
  const value = String(rawValue).trim()
  if (/^data:/i.test(value)) return value
  if (/^https?:\/\//i.test(value)) return encodeURI(value)

  const cleaned = encodePath(value)
  if (cleaned.startsWith('products/')) return `${FILE_URL}/${cleaned}`
  if (cleaned.startsWith('uploads/')) {
    return `${FILE_URL}/${encodePath(cleaned.replace(/^uploads\//, ''))}`
  }

  return `${FILE_URL}/products/${cleaned}`
}

/** Product videos are stored under /uploads/video (legacy files may be under /uploads/products). */
export const resolveProductVideoUrl = (rawValue?: string) => {
  if (!rawValue) return ''
  const value = String(rawValue).trim()
  if (/^data:/i.test(value)) return value
  if (/^https?:\/\//i.test(value)) return encodeURI(value)

  const cleaned = encodePath(value)
  if (cleaned.startsWith('video/')) return `${FILE_URL}/${cleaned}`
  if (cleaned.startsWith('products/')) return `${FILE_URL}/${cleaned}`
  if (cleaned.startsWith('uploads/')) {
    return `${FILE_URL}/${encodePath(cleaned.replace(/^uploads\//, ''))}`
  }

  return `${FILE_URL}/video/${cleaned}`
}

export const getProductVideoFallbackUrl = (primaryUrl: string) => {
  if (!primaryUrl || !primaryUrl.includes('/video/')) return ''
  return primaryUrl.replace('/video/', '/products/')
}
