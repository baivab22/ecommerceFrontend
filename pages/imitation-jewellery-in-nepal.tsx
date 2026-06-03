import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'
const PAGE_URL = `${SITE_URL}/imitation-jewellery-in-nepal`
const DESCRIPTION = 'Discover premium imitation jewellery in Nepal with fast delivery across Kathmandu and the entire country. Shop necklaces, earrings, bangles, bridal sets and fashion jewellery online at our trusted Nepal jewellery store.'
const KEYWORDS = 'imitation jewellery in Nepal, online jewellery store Nepal, fashion jewellery Kathmandu, bridal jewellery Nepal, affordable imitation jewellery'

export default function ImitationJewelleryInNepalPage() {
  return (
    <>
      <Head>
        <title>Imitation Jewellery in Nepal | Best Online Jewellery Store</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={KEYWORDS} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Imitation Jewellery in Nepal | Best Online Jewellery Store" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Nepal Imitation Jewellery" />
        <meta property="og:image" content={`${SITE_URL}/logo`} />
        <meta property="og:image:alt" content="Imitation Jewellery in Nepal" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Imitation Jewellery in Nepal | Best Online Jewellery Store" />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/logo`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Imitation Jewellery in Nepal',
              description: DESCRIPTION,
              url: PAGE_URL,
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: SITE_URL
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Imitation Jewellery in Nepal',
                    item: PAGE_URL
                  }
                ]
              }
            })
          }}
        />
      </Head>

      <main style={{ padding: '32px 24px', maxWidth: '960px', margin: '0 auto', color: '#1f2937' }}>
        <section style={{ marginBottom: '32px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Ecommerce jewellery store in Nepal</p>
          <h1 style={{ fontSize: '36px', lineHeight: 1.1, margin: '0 0 20px' }}>Imitation Jewellery in Nepal</h1>
          <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '20px' }}>
            Welcome to Nepal’s trusted online destination for imitation jewellery in Nepal. Our collection features elegant necklaces, earrings, bangles, rings and bridal jewellery sets designed for every style, budget and special occasion.
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '30px' }}>
            Whether you are shopping for festive wear in Kathmandu, a wedding set in Pokhara, or everyday fashion jewellery anywhere in Nepal, enjoy secure checkout, fast delivery and beautifully curated designs made to shine.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '18px' }}>Why choose our imitation jewellery in Nepal?</h2>
          <ul style={{ fontSize: '16px', lineHeight: 1.8, marginLeft: '20px', color: '#374151' }}>
            <li style={{ marginBottom: '12px' }}><strong>Authentic fashion jewellery:</strong> Premium imitation jewellery that looks and feels luxurious without a high price tag.</li>
            <li style={{ marginBottom: '12px' }}><strong>Fast nationwide delivery:</strong> Order from Kathmandu, Lalitpur, Bhaktapur, Pokhara and all major cities in Nepal.</li>
            <li style={{ marginBottom: '12px' }}><strong>Wide choice:</strong> Shop necklaces, earrings, bangles, rings, bridal sets, polki, kundan and modern fashion jewellery.</li>
            <li style={{ marginBottom: '12px' }}><strong>Secure checkout:</strong> Easy online ordering and trusted payment options for customers across Nepal.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '18px' }}>Popular imitation jewellery categories</h2>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Necklaces</h3>
              <p style={{ margin: 0, color: '#4b5563' }}>Stylish imitation necklace sets for weddings, festivals and everyday fashion.</p>
            </div>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Earrings</h3>
              <p style={{ margin: 0, color: '#4b5563' }}>Elegant stud, dangler and jhumka designs crafted for Nepali style.</p>
            </div>
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Bangles & Sets</h3>
              <p style={{ margin: 0, color: '#4b5563' }}>Complete imitation jewellery sets and bangles for a polished look.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '18px' }}>Shop imitation jewellery from Nepal’s best online store</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: '24px' }}>
            Ready to browse the latest imitation jewellery in Nepal? Visit our product collection to explore wedding jewellery, everyday fashion jewellery and gift-ready designs with fast delivery across Nepal.
          </p>
          <Link href="/products">
            <a style={{ display: 'inline-block', background: '#b8860b', color: '#fff', padding: '14px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>Shop Imitation Jewellery</a>
          </Link>
        </section>
      </main>
    </>
  )
}
