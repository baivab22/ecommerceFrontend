import React from 'react'
import PageMetaTags from 'src/components/PageMetaTags'
import {HomePage} from '../src/app/pages/web/home/home.component'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'
const HOME_URL = `${SITE_URL}/home`
const HOME_DESCRIPTION = 'Discover premium imitation jewellery in Nepal with fast delivery across Kathmandu and beyond. Shop necklaces, earrings, bangles, bridal sets and fashion jewellery online.'

export default function HomeRoutePage() {
  return (
    <>
      <PageMetaTags
        title="Imitation Jewellery in Nepal | Fashion Jewellery Store"
        description={HOME_DESCRIPTION}
        keywords="imitation jewellery in Nepal, fashion jewellery Nepal, online jewellery store Kathmandu, bridal jewellery Nepal, affordable imitation jewellery"
        canonicalUrl={HOME_URL}
        ogImage={`${SITE_URL}/logo.png`}
        ogImageAlt="Imitation Jewellery in Nepal"
      />
      <HomePage />
    </>
  )
}