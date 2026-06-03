/**
 * Sitemap Generation Script
 * Run this with: npm run generate:sitemap
 * Generates XML sitemaps for SEO optimization
 */

import fs from 'fs'
import path from 'path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/home', priority: '1.0', changefreq: 'daily' },
  { url: '/products', priority: '0.9', changefreq: 'daily' },
  { url: '/categories', priority: '0.9', changefreq: 'weekly' },
  { url: '/about-us', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact-us', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/terms-and-conditions', priority: '0.5', changefreq: 'yearly' },
  { url: '/shipping-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/return-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/login', priority: '0.6', changefreq: 'monthly' },
  { url: '/register', priority: '0.6', changefreq: 'monthly' },
]

interface SitemapURL {
  url: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: string
  image?: {
    loc: string
    title?: string
  }
}

function generateSitemapXML(urls: SitemapURL[], sitemapName: string) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlset = urls
    .map(item => {
      let url = `
    <url>
      <loc>${escapeXml(item.url)}</loc>`

      if (item.lastmod) {
        url += `\n      <lastmod>${item.lastmod}</lastmod>`
      }

      if (item.changefreq) {
        url += `\n      <changefreq>${item.changefreq}</changefreq>`
      }

      if (item.priority) {
        url += `\n      <priority>${item.priority}</priority>`
      }

      // Add image if available
      if (item.image) {
        url += `
      <image:image>
        <image:loc>${escapeXml(item.image.loc)}</image:loc>`
        
        if (item.image.title) {
          url += `\n        <image:title>${escapeXml(item.image.title)}</image:title>`
        }
        
        url += `\n      </image:image>`
      }

      url += `\n    </url>`
      return url
    })
    .join('')

  return `${xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlset}
</urlset>`
}

function generateSitemapIndex(sitemapFiles: string[]) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const sitemaps = sitemapFiles
    .map(file => `
  <sitemap>
    <loc>${escapeXml(`${SITE_URL}/${file}`)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`)
    .join('')

  return `${xmlHeader}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function generateSitemaps() {
  try {
    console.log('🔄 Generating sitemaps...')

    // Generate main sitemap with static pages
    const staticUrls: SitemapURL[] = STATIC_PAGES.map(page => ({
      url: `${SITE_URL}${page.url}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq as any,
      priority: page.priority
    }))

    const mainSitemap = generateSitemapXML(staticUrls, 'sitemap.xml')
    const mainSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
    fs.writeFileSync(mainSitemapPath, mainSitemap)
    console.log('✅ Generated: sitemap.xml')

    // Generate sitemap for products
    // NOTE: In production, fetch actual products from your API
    const productSitemap = generateSitemapXML([], 'sitemap-products.xml')
    const productSitemapPath = path.join(process.cwd(), 'public', 'sitemap-products.xml')
    fs.writeFileSync(productSitemapPath, productSitemap)
    console.log('✅ Generated: sitemap-products.xml')

    // Generate sitemap for categories
    const categorySitemap = generateSitemapXML([], 'sitemap-categories.xml')
    const categorySitemapPath = path.join(process.cwd(), 'public', 'sitemap-categories.xml')
    fs.writeFileSync(categorySitemapPath, categorySitemap)
    console.log('✅ Generated: sitemap-categories.xml')

    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex([
      'sitemap.xml',
      'sitemap-products.xml',
      'sitemap-categories.xml'
    ])
    const indexPath = path.join(process.cwd(), 'public', 'sitemap-index.xml')
    fs.writeFileSync(indexPath, sitemapIndex)
    console.log('✅ Generated: sitemap-index.xml')

    console.log('✨ All sitemaps generated successfully!')
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  generateSitemaps()
}

export { generateSitemaps, generateSitemapXML }
