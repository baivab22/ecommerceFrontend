import {BiTimeFive} from 'react-icons/bi'
import {Chip, HStack, StatInfo, Title, VStack} from 'src/app/common'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'src/store'
import {getProductDetailByIdAction} from '../../product.slice'
import { useRouter } from 'next/router'
import ReactStarsRating from 'react-awesome-stars-rating'

import {
  Button,
  InputField,
  Label,
  SelectField,
  ActivityIndicator
} from 'src/app/common'
import {CarouselSlider, ProductSlider} from 'src/app/components'
import CustomVideoPlayer from 'src/app/common/customVideoPlayer/customVideoPlayer.component'
import OptimizedImage from 'src/app/common/OptimizedImage/OptimizedImage.component'
import PageMetaTags from 'src/components/PageMetaTags'
import {generateProductSchema, getCanonicalUrl} from 'src/utils/seoHelpers'
import {BASE_URL, FILE_URL} from 'src/config'

const ProductDetailsPage = () => {
  const dispatch = useDispatch()

  const resolveVideoUrl = (rawValue?: string) => {
    if (!rawValue) return ''
    const value = String(rawValue).trim()
    if (/^https?:\/\//i.test(value)) return encodeURI(value)

    const cleaned = value.replace(/^\/+/, '')
    const safePath = encodeURI(cleaned)
    if (cleaned.startsWith('video/')) return `${FILE_URL}/${safePath}`
    if (cleaned.startsWith('uploads/')) {
      return `${FILE_URL}/${encodeURI(cleaned.replace(/^uploads\//, ''))}`
    }

    return `${FILE_URL}/video/${safePath}`
  }

  const router = useRouter()
  const { productId } = router.query
  const productIdString = Array.isArray(productId) ? productId[0] : productId

  console.log(productIdString, 'productId')
  useEffect(() => {
    if (!productIdString) return
    dispatch(getProductDetailByIdAction({productId: productIdString as string}))
  }, [productIdString, dispatch])

  const {productDetailData, productDetailLoading}: any = useSelector(
    (state: any) => state.product
  )
  useEffect(() => {
    console.log(productDetailData, productDetailLoading, 'productDetail data')
  }, [productDetailData])

  const products = productDetailData?.image
  const ratingChange = (value: number) => {
    console.log(value, 'rating value')
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abhushangallery.com'
  const safeStockQuantity = Math.max(0, Number(productDetailData?.stockQuantity) || 0)
  const firstImage = products?.[0]?.url || `${SITE_URL}/logo.png`
  const productTitle = productDetailData?.name
    ? `${productDetailData.name} | Nepal Imitation Jewellery`
    : 'Product details | Nepal Imitation Jewellery'
  const productDescription =
    productDetailData?.description?.replace(/<[^>]+>/g, '').slice(0, 160) ||
    'Explore premium imitation jewellery in Nepal with affordable bridal sets, necklaces, earrings, and fashion jewellery.'
  const productUrl = getCanonicalUrl(`/products/${productIdString || ''}`)
  const productPrice = productDetailData?.discountedPrice || productDetailData?.originalPrice

  return (
    <>
      <PageMetaTags
        title={productTitle}
        description={productDescription}
        keywords={`imitation jewellery, ${productDetailData?.category?.name || 'fashion jewellery'}, ${productDetailData?.name || 'product'}`}
        canonicalUrl={productUrl}
        ogImage={firstImage}
        ogImageAlt={productDetailData?.name || 'Product image'}
        ogType="product"
      >
        {productDetailData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                generateProductSchema({
                  id: String(productIdString),
                  name: productDetailData?.name,
                  description: productDetailData?.description?.replace(/<[^>]+>/g, ''),
                  image: firstImage,
                  price: Number(productPrice),
                  priceCurrency: 'NPR',
                  rating: Number(productDetailData?.rating || 0),
                  ratingCount: Number(productDetailData?.ratingCount || productDetailData?.reviews?.length || 0),
                  availability:
                    safeStockQuantity > 0
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                  sku: productDetailData?.sku || productDetailData?.productId || String(productIdString)
                })
              )
            }}
          />
        )}
      </PageMetaTags>
      <ActivityIndicator animating={productDetailLoading}>
        <VStack className="productDetail-container">
          <VStack className="productDetail">
            <HStack style={{width: '100%'}} gap="$3">
              <div style={{width: '50%'}}>
                <CarouselSlider>
                  {products?.map((data: any, index: any) => (
                    <OptimizedImage
                      key={index}
                      src={data.url}
                      alt={`${productDetailData?.name || 'Product'} image ${index + 1}`}
                      width={600}
                      height={600}
                      style={{width: '100%', height: 'auto'}}
                      className="image"
                    />
                  ))}
                </CarouselSlider>
              </div>

              <VStack className="productDetail-detailTop" gap="$4">
                <Title heading>{productDetailData?.name} </Title>
              <HStack justify="flex-start" gap="$5">
                <Title subheading>
                  NPR.{productDetailData?.discountedPrice}
                </Title>
                <Title subheading>NPR.{productDetailData?.originalPrice}</Title>
              </HStack>
              <VStack className="productDetail-detailBottom" gap="$8">
                <ReactStarsRating size={15} onChange={ratingChange} value={3} />

                <VStack
                  className="productDetail-detailBottom-description"
                  gap="$4"
                >
                  <HStack>
                    <div
                      className="productDetail-detailBottom-description-content"
                      dangerouslySetInnerHTML={{
                        __html: productDetailData?.description
                      }}
                    />
                  </HStack>
                  <Title subheading>{productDetailData?.category?.name}</Title>
                  <HStack
                    style={{
                      width: '70%'
                    }}
                  >
                    {/* <ProductSlider backgroundImage={products} /> */}
                  </HStack>

                  <HStack
                    style={{
                      width: '40%'
                    }}
                  >
                    {/* <Title heading>Video</Title> */}
                    {/* <video controls width="640" height="360">
                      <source src={productDetailData?.video} type="video/mp4" />
                    </video> */}
                    <CustomVideoPlayer
                      // videoUrl={productDetailData?.video}
                      videoUrl={resolveVideoUrl(productDetailData?.video)}
                      thumbnailUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfcz8nhghqfpLH6iYrPyz6_U9fqSdujGVmrezxtryOpI0cxnLFzwSHklg5csZgs8K1QMU&usqp=CAU"
                    ></CustomVideoPlayer>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </ActivityIndicator>
    </>
  )
  }

export default ProductDetailsPage
