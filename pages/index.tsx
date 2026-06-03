import React from 'react'
import PageMetaTags from 'src/components/PageMetaTags'
import {HomePage} from '../src/app/pages/web/home/home.component'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'
const HOME_URL = `${SITE_URL}`
const HOME_DESCRIPTION = 'Discover premium imitation jewellery in Nepal with fast delivery across Kathmandu and beyond. Shop necklaces, earrings, bangles, bridal sets and fashion jewellery online.'

export default function IndexPage() {
  return (
    <>
      <PageMetaTags
        title="Imitation Jewellery in Nepal | Fashion Jewellery Store"
        description={HOME_DESCRIPTION}
        keywords="imitation jewellery in Nepal, fashion jewellery Nepal, online jewellery store Kathmandu, bridal jewellery Nepal, affordable imitation jewellery"
        canonicalUrl={HOME_URL}
        ogImage={`${SITE_URL}/logo.png`}
        ogImageAlt="Imitation Jewellery in Nepal"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Nepal Imitation Jewellery',
              url: HOME_URL,
              description: HOME_DESCRIPTION,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${HOME_URL}/products?search={search_term_string}`,
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </PageMetaTags>
      <HomePage />
    </>
  )
}
