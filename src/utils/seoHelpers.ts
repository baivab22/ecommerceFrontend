/**
 * SEO Helper Functions
 * Centralized SEO utilities for consistent meta tags across the application
 */

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogImageAlt?: string
  ogType?: string
  canonicalUrl?: string
  twitterHandle?: string
  noindex?: boolean
}

export interface StructuredDataConfig {
  '@context': string
  '@type': string
  [key: string]: any
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/og-image.png`
const DEFAULT_TWITTER_HANDLE = '@abhushangallery'

/**
 * Generate canonical URL for a page
 */
export const getCanonicalUrl = (path: string): string => {
  return `${SITE_URL}${path}`
}

/**
 * Generate SEO meta tags configuration
 */
export const generateSeoMetaTags = ({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = 'Abhushi Gallery - Imitation Jewellery',
  ogType = 'website',
  canonicalUrl,
  twitterHandle = DEFAULT_TWITTER_HANDLE,
  noindex = false
}: SEOConfig) => ({
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
  ogType,
  canonicalUrl,
  twitterHandle,
  noindex
})

/**
 * Generate Product JSON-LD structured data
 */
export const generateProductSchema = (product: {
  id: string
  name: string
  description?: string
  image?: string
  price?: number
  priceCurrency?: string
  rating?: number
  ratingCount?: number
  availability?: string
  sku?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/product/${product.id}`,
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku,
  brand: {
    '@type': 'Brand',
    name: 'Abhushi Gallery'
  },
  ...(product.price && {
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: product.priceCurrency || 'NPR',
      price: product.price,
      availability: product.availability || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Abhushi Gallery'
      }
    }
  }),
  ...(product.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      ratingCount: product.ratingCount || 1
    }
  })
})

/**
 * Generate Collection/Category JSON-LD structured data
 */
export const generateCollectionSchema = (collection: {
  name: string
  description?: string
  image?: string
  url: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Collection',
  name: collection.name,
  description: collection.description,
  image: collection.image,
  url: collection.url
})

/**
 * Generate BreadcrumbList JSON-LD structured data
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

/**
 * Generate Organization JSON-LD structured data
 */
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Abhushi Gallery',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Premium imitation jewellery store in Nepal with fashion jewellery, bridal sets, and accessories',
  sameAs: [
    'https://www.facebook.com/abhushigallery',
    'https://www.instagram.com/abhushigallery',
    'https://www.youtube.com/c/abhushigallery'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+977-1-XXXXXXX',
    contactType: 'Customer Support',
    email: 'support@abhushangallery.com',
    areaServed: 'NP'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NP',
    addressLocality: 'Kathmandu',
    postalCode: 'XXXXX'
  }
})

/**
 * Generate LocalBusiness JSON-LD structured data
 */
export const generateLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': SITE_URL,
  name: 'Abhushi Gallery',
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  description: 'Premium imitation jewellery store in Nepal',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kathmandu',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
    postalCode: 'XXXXX'
  },
  telephone: '+977-1-XXXXXXX',
  email: 'support@abhushangallery.com',
  priceRange: '₹$$-$$$',
  sameAs: [
    'https://www.facebook.com/abhushigallery',
    'https://www.instagram.com/abhushigallery'
  ]
})

/**
 * Generate FAQ JSON-LD structured data
 */
export const generateFaqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
})

/**
 * Get optimized image alt text for SEO
 */
export const getOptimizedAltText = (text: string, fallback: string = 'Product Image'): string => {
  if (!text) return fallback
  return text.substring(0, 125).trim() // Google recommends keeping alt text under 125 chars
}

/**
 * Generate social media meta tags
 */
export const generateSocialTags = (config: SEOConfig) => ({
  og: {
    title: config.title,
    description: config.description,
    image: config.ogImage || DEFAULT_OG_IMAGE,
    imageAlt: config.ogImageAlt || 'Abhushi Gallery',
    type: config.ogType || 'website',
    url: config.canonicalUrl || SITE_URL
  },
  twitter: {
    card: 'summary_large_image',
    title: config.title,
    description: config.description,
    image: config.ogImage || DEFAULT_OG_IMAGE,
    creator: config.twitterHandle || DEFAULT_TWITTER_HANDLE
  }
})
