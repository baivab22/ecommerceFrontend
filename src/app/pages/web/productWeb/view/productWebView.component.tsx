import {BiTimeFive} from 'react-icons/bi'
import {Chip, HStack, StatInfo, Title, VStack} from 'src/app/common'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'src/store'
import {getProductDetailByIdAction} from 'src/app/pages/products/product.slice'
import {useNavigate, useParams} from 'react-router-dom'
import ReactStarsRating from 'react-awesome-stars-rating'
import {Skeleton} from '@mui/material'

import {
  Button,
  InputField,
  Label,
  SelectField,
  ActivityIndicator
} from 'src/app/common'
import {
  CarouselSlider,
  ProductSection,
  ProductSlider,
  ZoomSlider
} from 'src/app/components'
import CustomVideoPlayer from 'src/app/common/customVideoPlayer/customVideoPlayer.component'
import html2canvas from 'html2canvas'
import {
  createCartByUserIdAction,
  getCartlistAction,
  updatedCartByProductIdAction
} from '../../cart/cart.slice'
import toast from 'react-hot-toast'
import {getCookie} from 'src/helpers'
import {useMedia} from 'src/hooks'
import {useAuth} from 'src/app/routing'
import {BASE_URL, FILE_URL} from 'src/config'
import { fetchHolidayModeAction, selectHolidayMode } from 'src/app/pages/holidayMode/holidayMode.slice'

export const ProductWebDetail = () => {
  const media = useMedia()
  const [position, setPosition] = useState({x: media.md ? 1175 : 0, y: 450})
  const [offset, setOffset] = useState({x: 0, y: 0})
  const [isDragging, setIsDragging] = useState(false)

  const {auth} = useAuth()

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    setIsDragging(true)
    setOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    })
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - offset.x,
      y: touch.clientY - offset.y
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Add event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, {passive: false})
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, offset])

  const dispatch = useDispatch()

  const resolveMediaUrl = (folder: 'products' | 'video', rawValue?: string) => {
    if (!rawValue) return ''
    const value = String(rawValue).trim()
    if (/^https?:\/\//i.test(value)) return encodeURI(value)

    const cleaned = value.replace(/^\/+/, '')
    const safePath = encodeURI(cleaned)
    if (cleaned.startsWith(`${folder}/`)) return `${FILE_URL}/${safePath}`
    if (cleaned.startsWith('uploads/')) {
      return `${FILE_URL}/${encodeURI(cleaned.replace(/^uploads\//, ''))}`
    }

    return `${FILE_URL}/${folder}/${safePath}`
  }

  let {productId} = useParams()

  useEffect(() => {
    // Scroll to top when product changes
    window.scrollTo({top: 0, behavior: 'smooth'})
    dispatch(getProductDetailByIdAction({productId: productId as string}))
  }, [productId, dispatch])

  const {productDetailData, productDetailLoading}: any = useSelector(
    (state: any) => state.product
  )
  const safeStockQuantity = Math.max(0, Number(productDetailData?.stockQuantity) || 0)

  const [productImageList, setProductImageList] = useState([])

  console.log(productImageList, 'il value')
  
  useEffect(() => {
    const requiredImageList = productDetailData?.images?.map(
      (item: any, index: number) => {
        return typeof item === 'string' ? item : item.coloredImage
      }
    )

    setProductImageList((requiredImageList || []).filter(Boolean))
  }, [productDetailData])

  const products = productDetailData?.image
  
  const ratingChange = (value: number) => {
    console.log(value, 'rating value')
  }

  const [activeColorIndex, setActiveColorIndex] = useState(0)

  // Reset active color index when product changes
  useEffect(() => {
    setActiveColorIndex(0)
  }, [productId])

  const handleColorClicked = (id: string, index: number) => {
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
  
  const datas = useSelector((state: any) => state.cart)

  const handleAddToCart = (data: any,activeColorIndex:number) => {
    const userId = getCookie('userId')
    const roles = getCookie('userRoles')

    console.log(activeColorIndex,"active color index value data");

    console.log(userId, roles, 'userIduserIduserId',productDetailData.images[activeColorIndex])

    if (userId && !!roles) {
      const isAlreadyExist = datas?.cartData?.[0]?.products?.some(
        (item: any) => {
          console.log(
            item,
            data,
            'helo details dataaaaaaaa'
          )
          return item?.productId?.id === data?.id
        }
      )

      if (!isAlreadyExist) {
        const cartData = {
          userId,
          products: [
            {
              productId: data?.id,
              quantity: 1,
              price: data?.discountedPrice,
              colorName:
                productDetailData?.images?.[activeColorIndex]?.colorName ||
                productDetailData?.images?.[0]?.colorName ||
                'Default'
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
        const isAlreadyExistData = datas?.cartData?.[0]?.products?.find(
          (item: any) => {
            return item?.productId?.id === data?.id
          }
        )

        console.log(isAlreadyExistData, 'isAlreadyExistData valuessssssssss')
        dispatch(
          updatedCartByProductIdAction({
            data: {
              userId: userId,
              productId: isAlreadyExistData?.productId?.id,
              quantity: isAlreadyExistData?.quantity + 1,
              price: Number(
                isAlreadyExistData?.productId?.discountedPrice *
                  (isAlreadyExistData?.quantity + 1)
              ),
              colorName:
                productDetailData?.images?.[activeColorIndex]?.colorName ||
                isAlreadyExistData?.colorName ||
                productDetailData?.images?.[0]?.colorName ||
                'Default'
            },
            onSuccess: () => {
              toast.success('Product on cart updated successfully')
              userId && dispatch(getCartlistAction({userId: userId}))
            }
          })
        )
      }
    } else {
      toast.error('Please login first to add products')
    }
  }

  console.log('auth.isLoggedin', auth.isLoggedin)

  // Skeleton Component for Product Detail
  const ProductDetailSkeleton = () => (
    <div className="productDetail-container">
      <VStack className="productDetail">
        <div
          style={{width: '100%', display: 'flex'}}
          className="productsWrapper"
        >
          <div style={{width: '60%'}} className="productDetail-left">
            {/* Image Slider Skeleton */}
            <div style={{display: 'flex', gap: '20px'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton 
                    key={item}
                    variant="rectangular" 
                    width={80} 
                    height={80} 
                    animation="wave"
                    sx={{borderRadius: '8px'}}
                  />
                ))}
              </div>
              <Skeleton 
                variant="rectangular" 
                width={513} 
                height={400} 
                animation="wave"
                sx={{borderRadius: '8px'}}
              />
            </div>
          </div>

          <VStack
            className="productDetail-detailTop"
            gap="$4"
          >
            {/* Title Skeleton */}
            <Skeleton 
              variant="text" 
              width="80%" 
              height={40} 
              animation="wave"
            />

            {/* Description Skeleton */}
            <Skeleton 
              variant="text" 
              width="100%" 
              height={20} 
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="90%" 
              height={20} 
              animation="wave"
            />
            <Skeleton 
              variant="text" 
              width="70%" 
              height={20} 
              animation="wave"
            />

            {/* Price Skeleton */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '20px'
              }}
            >
              <Skeleton 
                variant="text" 
                width={120} 
                height={30} 
                animation="wave"
              />
              <Skeleton 
                variant="text" 
                width={120} 
                height={30} 
                animation="wave"
              />
            </div>

            {/* Color Section Skeleton */}
            <VStack className="productDetail-detailTop-color">
              <Skeleton 
                variant="text" 
                width={60} 
                height={25} 
                animation="wave"
              />
              <HStack gap="$3">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton 
                    key={item}
                    variant="circular" 
                    width={40} 
                    height={40} 
                    animation="wave"
                  />
                ))}
              </HStack>
            </VStack>

            {/* Add to Cart Button Skeleton */}
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={50} 
              animation="wave"
              sx={{borderRadius: '8px'}}
            />

            {/* Stock Info Skeleton */}
            <HStack
              justify="flex-start"
              align="center"
              gap="$4"
            >
              <Skeleton 
                variant="text" 
                width={80} 
                height={25} 
                animation="wave"
              />
              <Skeleton 
                variant="rectangular" 
                width={80} 
                height={30} 
                animation="wave"
                sx={{borderRadius: '16px'}}
              />
            </HStack>

            {/* Category Chip Skeleton */}
            <Skeleton 
              variant="rectangular" 
              width={150} 
              height={30} 
              animation="wave"
              sx={{borderRadius: '16px'}}
            />
          </VStack>
        </div>
      </VStack>
    </div>
  )


  const navigate=useNavigate();

  const handleLoggedOutAddItemToCart=()=>{
         toast.error('Please login first to add products')
    navigate('/login')
  }

  return (
    <>
      {productDetailLoading ? (
        <ProductDetailSkeleton />
      ) : (
        <div className="productDetail-container">
          <VStack className="productDetail">
            <div
              style={{width: '100%', display: 'flex'}}
              className="productsWrapper"
            >
              <div style={{width: '60%'}} className="productDetail-left">
                {productImageList && (
                  <ZoomSlider data={productImageList}></ZoomSlider>
                )}
              </div>

              <VStack
                className="productDetail-detailTop"
                gap="$4"
                id="productContainer"
              >
                <Title heading className="productDetail-detailTop-name">
                  {productDetailData?.name}
                </Title>
{
   productDetailData?.description &&     <div
                  className="productDetail-detailTop-description"
                  dangerouslySetInnerHTML={{
                    __html: productDetailData?.description
                  }}
                ></div>
}
            

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '20px'
                  }}
                  className="priceContainer"
                >
                  <p
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

                        console.log(item,"item data value")
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
                              onClick={() => handleColorClicked(item._id, index)}
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
                    if (safeStockQuantity <= 0) {
                      toast.error('Product is out of stock')
                      return
                    }
                    !!auth.isLoggedin
                      ? handleAddToCart(productDetailData,activeColorIndex)
                      : handleLoggedOutAddItemToCart()
                  }}
                >
                  <p>{safeStockQuantity <= 0 ? "OUT OF STOCK":"ADD TO CART"}</p>
                </div>

                <HStack
                  className="productDetail-inStock"
                  justify="flex-start"
                  align="center"
                  gap="$4"
                >
                  <Title subheading> In Stock:</Title>
                  <Chip
                    title={`${safeStockQuantity} pics`}
                    color="rgb(219 247 241)"
                  ></Chip>
                </HStack>
                
                <VStack className="productDetail-detailBottom" gap="$8">
                  <VStack
                    className="productDetail-detailBottom-description"
                    gap="$4"
                  >
                    <Chip
                      title={productDetailData?.subCategory?.name}
                      color="rgb(219 247 241)"
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
                      {productDetailData?.video && (
                        <div
                          style={{
                            position: 'absolute',
                            left: position.x,
                            top: position.y,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            touchAction: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            zIndex: 1000
                          }}
                          onMouseDown={handleMouseDown}
                          onTouchStart={handleTouchStart}
                        >
                          <CustomVideoPlayer
                            videoUrl={resolveMediaUrl('video', productDetailData?.video)}

                            productDetails={{

                            name:productDetailData.name,
                            description:productDetailData?.description,
                          price:productDetailData?.originalPrice}}
                            thumbnailUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfcz8nhghqfpLH6iYrPyz6_U9fqSdujGVmrezxtryOpI0cxnLFzwSHklg5csZgs8K1QMU&usqp=CAU"
                          ></CustomVideoPlayer>
                        </div>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </VStack>
            </div>
          </VStack>
        </div>
      )}
      
      {/* Similar Products Section - Always visible, independent of loading state */}
      <div style={{marginBottom: '20px', padding: '2vw'}}>
        <ProductSection
          header="Similar Products"
          isProfilePage={true}
          isForSimilar={true}
          currentProduct={productDetailData}
        ></ProductSection>
      </div>
    </>
  )
}