/**
 * Meta Tags Manager
 * Centralized component for managing dynamic meta tags on pages
 */

import Head from 'next/head'
import { ReactNode } from 'react'
import { generateSeoMetaTags, generateSocialTags } from 'src/utils/seoHelpers'

interface PageMetaTagsProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogImageAlt?: string
  canonicalUrl?: string
  ogType?: 'website' | 'product' | 'article' | 'profile'
  noindex?: boolean
  children?: ReactNode
}

/**
 * PageMetaTags Component
 * 
 * Renders all necessary meta tags for a page
 * 
 * Usage:
 * <PageMetaTags
 *   title="Product Name"
 *   description="Product description"
 *   keywords="product, keywords"
 *   ogImage="/image.jpg"
 *   canonicalUrl="https://site.com/product"
 * />
 */
export const PageMetaTags: React.FC<PageMetaTagsProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
  canonicalUrl,
  ogType = 'website',
  noindex = false,
  children
}) => {
  const seoTags = generateSeoMetaTags({
    title,
    description,
    keywords,
    ogImage,
    ogImageAlt,
    ogType,
    canonicalUrl,
    noindex
  })

  const socialTags = generateSocialTags(seoTags)

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Noindex for private pages */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={socialTags.og.title} />
      <meta property="og:description" content={socialTags.og.description} />
      {socialTags.og.image && <meta property="og:image" content={socialTags.og.image} />}
      {socialTags.og.imageAlt && <meta property="og:image:alt" content={socialTags.og.imageAlt} />}
      <meta property="og:url" content={socialTags.og.url} />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={socialTags.twitter.card} />
      <meta name="twitter:title" content={socialTags.twitter.title} />
      <meta name="twitter:description" content={socialTags.twitter.description} />
      {socialTags.twitter.image && <meta name="twitter:image" content={socialTags.twitter.image} />}
      {socialTags.twitter.creator && <meta name="twitter:creator" content={socialTags.twitter.creator} />}
      
      {children}
    </Head>
  )
}

export default PageMetaTags
