import Document, { Html, Head, Main, NextScript } from 'next/document'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Essential Meta Tags */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          
          {/* SEO Meta Tags */}
          <meta name="theme-color" content="#b8860b" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Jewelry Store" />
          
          {/* Favicon and App Icons */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          
          {/* Google Site Verification */}
          <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
          
          {/* Robots Meta for SEO */}
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          
          {/* Global JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Nepal Imitation Jewellery',
                url: SITE_URL,
                logo: `${SITE_URL}/logo.png`,
                description: 'Premium imitation jewellery store in Nepal',
                sameAs: [
                  'https://www.facebook.com/yourpage',
                  'https://www.instagram.com/yourpage',
                  'https://www.twitter.com/yourpage',
                  'https://www.youtube.com/yourpage'
                ],
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Support',
                  telephone: '+977-1-XXXXXXX',
                  email: 'support@abhushangallery.com'
                }
              })
            }}
          />
          
          {/* Performance optimization - prefetch critical resources */}
          <link rel="prefetch" href="/_next/static/chunks/main.js" as="script" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
