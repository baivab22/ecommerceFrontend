import React from 'react'
import Head from 'next/head'
import { ProductListForWeb } from '../../src/app/pages/web'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'
const PRODUCTS_URL = `${SITE_URL}/products`
const PRODUCTS_DESCRIPTION = 'Browse our collection of imitation jewellery in Nepal. Find necklaces, earrings, bracelets, rings and bridal accessory sets available for online ordering with fast delivery.'

export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>Shop Imitation Jewellery in Nepal | Online Jewellery Collection</title>
        <meta name="description" content={PRODUCTS_DESCRIPTION} />
        <meta name="keywords" content="imitation jewellery Nepal, online jewellery shop, fashion jewellery Kathmandu, bridal jewellery Nepal, jewellery delivery Nepal" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PRODUCTS_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shop Imitation Jewellery in Nepal | Online Jewellery Collection" />
        <meta property="og:description" content={PRODUCTS_DESCRIPTION} />
        <meta property="og:url" content={PRODUCTS_URL} />
        <meta property="og:site_name" content="Nepal Imitation Jewellery" />
        <meta property="og:image" content={`${SITE_URL}/logo`} />
        <meta property="og:image:alt" content="Shop imitation jewellery in Nepal" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shop Imitation Jewellery in Nepal | Online Jewellery Collection" />
        <meta name="twitter:description" content={PRODUCTS_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/logo`} />
      </Head>
      <ProductListForWeb />
    </>
  )
}
