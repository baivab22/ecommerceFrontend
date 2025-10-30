import {BiTimeFive} from 'react-icons/bi'
import {Chip, HStack, StatInfo, Title, VStack} from 'src/app/common'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'src/store'
import {getProductDetailByIdAction} from '../../product.slice'
import {useParams} from 'react-router-dom'
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
import {FILE_URL} from 'src/config'

const ProductDetailsPage = () => {
  const dispatch = useDispatch()

  let {productId} = useParams()

  console.log(productId, 'productId')
  useEffect(() => {
    dispatch(getProductDetailByIdAction({productId: productId as string}))
  }, [])

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

  return (
    <ActivityIndicator animating={productDetailLoading}>
      <VStack className="productDetail-container">
        <VStack className="productDetail">
          <HStack style={{width: '100%'}} gap="$3">
            <div style={{width: '50%'}}>
              <CarouselSlider>
                {products?.map((data: any, index: any) => (
                  <img
                    src={data.url}
                    alt="image"
                    className="image"
                    key={index}
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
                    s
                    <CustomVideoPlayer
                      // videoUrl={productDetailData?.video}
                      videoUrl={`https://abhushangallery.com/products/${productDetailData?.video}`}
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
  )
}

export default ProductDetailsPage
