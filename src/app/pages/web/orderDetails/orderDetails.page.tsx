import React, {useEffect, useState} from 'react'
import {useMedia, useParams} from 'src/hooks'
import {useDispatch} from 'src/store'
import {getOrderDetailByIdAction} from '../../products/product.slice'
import {useLocation} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {ActivityIndicator, Chip, HStack, Title, VStack} from 'src/app/common'
import {CarouselSlider, ZoomSlider} from 'src/app/components'
import ReactStarsRating from 'react-awesome-stars-rating'
import CustomVideoPlayer from 'src/app/common/customVideoPlayer/customVideoPlayer.component'
import {FILE_URL} from 'src/config'
import {createCartByUserIdAction, getCartlistAction} from '../cart/cart.slice'
import toast from 'react-hot-toast'
import {getCookie} from 'src/helpers'
import {useAuth} from 'src/app/routing'
import {getNprPrice} from 'src/helpers/nprPrice.helper'

export const OrderDetailsPage = () => {
  const dispatch = useDispatch()

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const orderId = searchParams.get('orderId')
  const isForOrder = searchParams.get('isForOrder')

  const {orderDetailData, orderDetailLoading} = useSelector(
    (state: any) => state.product
  )
  const ratingChange = (value: number) => {
    console.log(value, 'rating value')
  }
  console.log(orderId, orderDetailData, 'orderId final')
  useEffect(() => {
    dispatch(getOrderDetailByIdAction({orderId: orderId as string}))
  }, [])

  const productDetailData = orderDetailData?.products[0].productId

  console.log(productDetailData, 'productDetailData hai')

  const products = productDetailData?.image

  const [productImageList, setProductImageList] = useState([])

  useEffect(() => {
    const requiredImageList = productDetailData?.images?.map(
      (item: any, index: number) => {
        return item.coloredImage
      }
    )

    console.log(requiredImageList, productDetailData, 'requiredImageList data')

    setProductImageList(requiredImageList)
  }, [productDetailData])
  const media = useMedia()
  const handleAddToCart = (data: any) => {
    const userId = getCookie('userId')

    const roles = getCookie('userRoles')

    if (!!userId && !!roles) {
      const cartData = {
        userId,
        products: [
          {
            productId: data?.id,
            quantity: 1,
            price: data?.discountedPrice
          }
        ]
      }

      dispatch(
        createCartByUserIdAction({
          userId: userId,
          data: cartData,
          onSuccess: () => {
            toast.success('Product added to cart Successfully!')
            const userId = getCookie('userId')
            userId && dispatch(getCartlistAction({userId: userId}))
          }
        })
      )
    } else {
      toast.error('Please login first to add product')
    }
  }
  const [activeColorIndex, setActiveColorIndex] = useState(0)
  const handleColorClicked = (id: string, index) => {
    const requiredImageList = productDetailData?.images?.find(
      (item: any, index: number) => {
        return item._id === id
      }
    )

    console.log(requiredImageList, 'heee')
    console.log(productDetailData.video, 'heee')

    setActiveColorIndex(index)

    setProductImageList([requiredImageList?.coloredImage])
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const [position, setPosition] = useState({x: media.md ? 1175 : '0', y: 450})
  const [offset, setOffset] = useState({x: 0, y: 0})
  const handleMouseDown = (e) => {
    setOffset({
      //@ts-ignore
      x: e.clientX - position.x - 30,
      y: e.clientY - position.y - 40
    })

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e) => {
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })
  }

  const {auth} = useAuth()

  console.log(productImageList, 'product image list value')
  const total = orderDetailData?.products?.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  return (
    <div>
      <ActivityIndicator animating={orderDetailLoading}>
        <div className="productDetail-container">
          <VStack className="productDetail">
            <div
              style={{width: '100%', display: 'flex'}}
              className="productsWrapper"
            >
              <div style={{width: '60%'}} className="productDetail-left">
                {/* <CarouselSlider>
                {products?.map((data: any, index: any) => (
                  <img
                    src={data.url}
                    alt="image"
                    className="image"
                    key={index}
                  />
                ))}
              </CarouselSlider> */}
                {productImageList && (
                  <ZoomSlider data={productImageList}></ZoomSlider>
                )}
              </div>

              <VStack
                className="productDetail-detailTop"
                gap="$4"
                id="productContainer"
              >
                {/* <ReactStarsRating size={15} onChange={ratingChange} value={3} /> */}
                <Title heading className="productDetail-detailTop-name">
                  {productDetailData?.name}
                </Title>

                <div
                  className="productDetail-detailTop-description"
                  dangerouslySetInnerHTML={{
                    __html: productDetailData?.description
                  }}
                ></div>

                {/* <HStack>
                <div className="productDetail-detailBottom-description-content">
                  {productDetailData?.details}
                </div>
              </HStack> */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '20px'
                  }}
                  className="priceContainer"
                >
                  <p
                    // subheading
                    style={{color: '#FB2E86'}}
                    className="originalPrice"
                  >
                    NPR.{productDetailData?.discountedPrice}
                  </p>
                  <p className="discountedPrice">
                    NPR.{productDetailData?.originalPrice}
                  </p>
                </div>

                <VStack className="productDetail-detailTop-color">
                  <p>Color</p>
                  <HStack gap="$3">
                    {productDetailData?.images?.map(
                      (item: any, index: number) => {
                        return (
                          <div
                            key={index}
                            style={{
                              border:
                                activeColorIndex === index
                                  ? '2px solid hsl(353, 100%, 78%)'
                                  : 'none',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',

                              borderRadius: '50%',
                              boxSizing: 'border-box',
                              padding: '3px'
                            }}
                          >
                            <div
                              style={{
                                background: item.colorName
                              }}
                              className="productDetail-detailTop-color-item"
                              onClick={() =>
                                handleColorClicked(item._id, index)
                              }
                              key={index}
                            ></div>
                          </div>
                        )
                      }
                    )}
                  </HStack>
                </VStack>

                <div
                  className="productDetail-detailTop-addToCart"
                  onClick={() => {
                    !!auth.isLoggedin
                      ? handleAddToCart(productDetailData)
                      : toast.success('Product Updated SuccessFully')
                  }}
                >
                  <p>ADD TO CART</p>
                </div>

                <HStack
                  className="productDetail-inStock"
                  justify="flex-start"
                  align="center"
                  gap="$4"
                >
                  <Title subheading> In Stock:</Title>
                  <Chip
                    title={`${productDetailData?.stockQuantity ?? 0} pics`}
                    // color="rgb(241 233 214)"
                    color="rgb(219 247 241)"
                    // style={{width: 'max-content'}}

                    // icon={<FaCartArrowDown size={12} fill="black" />}

                    // style={{color: 'black'}}
                  ></Chip>
                </HStack>
                <VStack className="productDetail-detailBottom" gap="$8">
                  <VStack
                    className="productDetail-detailBottom-description"
                    gap="$4"
                  >
                    {/* <Chip color="success"></Chip> */}

                    <Chip
                      title={productDetailData?.category?.name}
                      // color="rgb(241 233 214)"
                      color="rgb(219 247 241)"
                      // style={{width: 'max-content'}}

                      // icon={<FaCartArrowDown size={12} fill="black" />}

                      // style={{color: 'black'}}
                    ></Chip>

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
                      <div
                        style={{
                          position: 'absolute',
                          left: position.x,
                          top: position.y
                          // cursor: 'grab'
                        }}
                        onMouseDown={handleMouseDown}
                      >
                        <CustomVideoPlayer
                          videoUrl={`https://abhushangallery.com/video/${productDetailData?.video}`}
                          thumbnailUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfcz8nhghqfpLH6iYrPyz6_U9fqSdujGVmrezxtryOpI0cxnLFzwSHklg5csZgs8K1QMU&usqp=CAU"
                        ></CustomVideoPlayer>
                      </div>
                    </HStack>
                  </VStack>
                </VStack>
              </VStack>
            </div>

            <div>
              <div className="productDetail-detailBottom-description">
                <div className="productDetail-detailBottom-description-text">
                  Order Details ,please do the following steps to pay the
                  amount:
                </div>
                <div className="amountToPay">
                  <p>Total Amount due</p>
                  <p>{getNprPrice(total || 0)}</p>
                </div>

                <p>
                  Please scan the qr code below and pay{' '}
                  {getNprPrice(total || 0)}
                </p>

                <img
                  src="src/assets/images/bankqr.png"
                  alt="image"
                  className="qrImage"
                />
              </div>
            </div>
          </VStack>
        </div>
      </ActivityIndicator>
    </div>
  )
}
