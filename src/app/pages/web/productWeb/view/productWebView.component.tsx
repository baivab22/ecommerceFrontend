
import React, {useEffect, useRef, useState} from 'react'
import {Chip, HStack, Title, VStack} from 'src/app/common'
import {useDispatch, useSelector} from 'src/store'
import {getProductDetailByIdAction} from 'src/app/pages/products/product.slice'
import {useNavigate, useParams} from 'react-router-dom'
import {Dialog, DialogContent, Skeleton} from '@mui/material'
import {ProductSection, ZoomSlider} from 'src/app/components'
import CustomVideoPlayer from 'src/app/common/customVideoPlayer/customVideoPlayer.component'
import {
  createCartByUserIdAction,
  getCartlistAction,
  updatedCartByProductIdAction
} from '../../cart/cart.slice'
import toast from 'react-hot-toast'
import {getCookie} from 'src/helpers'
import {useMedia} from 'src/hooks'
import {useAuth} from 'src/app/routing'
import {FILE_URL} from 'src/config'
// import ZoomSlider from 'src/app/components/zoomSlider/zoomSlider.component'

export const ProductWebDetail = () => {
  const media = useMedia()
  // const {auth} = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()


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

  const {productId} = useParams()

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'})
    dispatch(getProductDetailByIdAction({productId: productId as string}))
  }, [productId, dispatch])

  const {productDetailData, productDetailLoading}: any = useSelector(
    (state: any) => state.product
  )

  const safeStockQuantity = Math.max(
    0,
    Number(productDetailData?.stockQuantity) || 0
  )
  const formatPriceTwoDecimals = (value: unknown) => {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return '0.00'
    return numericValue.toFixed(2)
  }

  const displayDiscountedPrice = formatPriceTwoDecimals(
    productDetailData?.discountedPrice
  )
  const displayOriginalPrice = formatPriceTwoDecimals(
    productDetailData?.originalPrice
  )
  const displayVideoPrice =
    productDetailData?.discountedPrice ?? productDetailData?.originalPrice
  const productVideoSource = productDetailData?.video
  const hasProductVideo = Boolean(productVideoSource)
  const productVideoUrl = resolveMediaUrl('video', productVideoSource)
  const previewHeight = media.md ? 'min(82vh, 860px)' : 'min(72vh, 620px)'
  const productDescriptionRef = useRef<HTMLDivElement | null>(null)
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)

  const [productImageList, setProductImageList] = useState<string[]>([])
  const hasProductImages = productImageList.length > 0
  const [activeColorIndex, setActiveColorIndex] = useState(0)

  useEffect(() => {
    const requiredImageList = productDetailData?.images?.map((item: any) => {
      return typeof item === 'string' ? item : item.coloredImage
    })

    setProductImageList((requiredImageList || []).filter(Boolean))
  }, [productDetailData])

  useEffect(() => {
    setActiveColorIndex(0)
  }, [productId])

  useEffect(() => {
    const descriptionElement = productDescriptionRef.current

    if (!descriptionElement) {
      setIsDescriptionOverflowing(false)
      return
    }

    const updateOverflowState = () => {
      setIsDescriptionOverflowing(
        descriptionElement.scrollHeight > descriptionElement.clientHeight + 1
      )
    }

    const rafId = window.requestAnimationFrame(updateOverflowState)
    window.addEventListener('resize', updateOverflowState)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateOverflowState)
    }
  }, [productDetailData?.description, media.md])

  const handleColorClicked = (id: string, index: number) => {
    const requiredImageList = productDetailData?.images?.find((item: any) => {
      return item._id === id
    })

    setActiveColorIndex(index)
    setProductImageList([requiredImageList?.coloredImage].filter(Boolean))
  }

  const datas = useSelector((state: any) => state.cart)

  const handleAddToCart = (data: any, colorIndex: number) => {
    const userId = getCookie('userId')
    const roles = getCookie('userRoles')

    if (userId && !!roles) {
      const isAlreadyExist = datas?.cartData?.[0]?.products?.some((item: any) => {
        return item?.productId?.id === data?.id
      })

      if (!isAlreadyExist) {
        const cartData = {
          userId,
          products: [
            {
              productId: data?.id,
              quantity: 1,
              price: data?.discountedPrice,
              colorName:
                productDetailData?.images?.[colorIndex]?.colorName ||
                productDetailData?.images?.[0]?.colorName ||
                'Default'
            }
          ]
        }

        dispatch(
          createCartByUserIdAction({
            userId,
            data: cartData,
            onSuccess: () => {
              toast.success('Product added to cart Successfully!')
              const currentUserId = getCookie('userId')
              currentUserId && dispatch(getCartlistAction({userId: currentUserId}))
            }
          })
        )
      } else {
        const isAlreadyExistData = datas?.cartData?.[0]?.products?.find(
          (item: any) => item?.productId?.id === data?.id
        )

        dispatch(
          updatedCartByProductIdAction({
            data: {
              userId,
              productId: isAlreadyExistData?.productId?.id,
              quantity: isAlreadyExistData?.quantity + 1,
              price: Number(
                isAlreadyExistData?.productId?.discountedPrice *
                  (isAlreadyExistData?.quantity + 1)
              ),
              colorName:
                productDetailData?.images?.[colorIndex]?.colorName ||
                isAlreadyExistData?.colorName ||
                productDetailData?.images?.[0]?.colorName ||
                'Default'
            },
            onSuccess: () => {
              toast.success('Product on cart updated successfully')
              userId && dispatch(getCartlistAction({userId}))
            }
          })
        )
      }
    } else {
      toast.error('Please login first to add products')
      navigate('/login')
    }
  }

  const handleLoggedOutAddItemToCart = () => {
    toast.error('Please login first to add products')
    navigate('/login')
  }

  const ProductDetailSkeleton = () => (
    <div className="productDetail-container">
      <VStack className="productDetail">
        <div className="productsWrapper">
          <div className="productDetail-media">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={media.md ? 760 : 520}
              animation="wave"
              sx={{borderRadius: '28px'}}
            />
          </div>

          <VStack className="productDetail-detailTop" gap="$4">
            <Skeleton variant="text" width="80%" height={40} animation="wave" />
            <Skeleton variant="text" width="100%" height={20} animation="wave" />
            <Skeleton variant="text" width="90%" height={20} animation="wave" />
            <Skeleton variant="text" width="70%" height={20} animation="wave" />

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '20px',
                flexWrap: 'wrap'
              }}
            >
              <Skeleton variant="text" width={120} height={30} animation="wave" />
              <Skeleton variant="text" width={120} height={30} animation="wave" />
            </div>

            <VStack className="productDetail-detailTop-color">
              <Skeleton variant="text" width={60} height={25} animation="wave" />
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

            <Skeleton
              variant="rectangular"
              width="100%"
              height={50}
              animation="wave"
              sx={{borderRadius: '12px'}}
            />

            <HStack justify="flex-start" align="center" gap="$4">
              <Skeleton variant="text" width={80} height={25} animation="wave" />
              <Skeleton
                variant="rectangular"
                width={80}
                height={30}
                animation="wave"
                sx={{borderRadius: '16px'}}
              />
            </HStack>

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

  return (
    <>
      {productDetailLoading ? (
        <ProductDetailSkeleton />
      ) : (
        <div className="productDetail-container">
          <VStack className="productDetail">
            <div className="productsWrapper">
              <div className="productDetail-media">
                {(hasProductVideo && !hasProductImages) ? (
                  <div className="productDetail-media-videoFallback">
                    <div className="productDetail-media-videoFallback-player">
                      <CustomVideoPlayer
                        videoUrl={productVideoUrl}
                        thumbnailUrl="/assets/images/defaultProduct.jpeg"
                        previewWidth="100%"
                        previewHeight={previewHeight}
                        autoPlayWithSound={true}
                        showPlayingIndicator={true}
                        productDetails={{
                          name: productDetailData?.name,
                          description: productDetailData?.description,
                          price: `NPR.${formatPriceTwoDecimals(displayVideoPrice)}`
                        }}
                      />
                    </div>
                  </div>
                ) : hasProductImages ? (
                  <div className="productDetail-media-gallery">
                    <ZoomSlider data={productImageList} />
                  </div>
                ) : (
                  <div className="productDetail-media-empty">
                    <img
                      src="/assets/images/defaultProduct.jpeg"
                      alt={productDetailData?.name || 'Product'}
                    />
                  </div>
                )}
              </div>

              <VStack className="productDetail-detailTop" gap="$4" id="productContainer">
                <Title heading className="productDetail-detailTop-name">
                  {productDetailData?.name}
                </Title>

                {productDetailData?.description && (
                  <div className="productDetail-detailTop-descriptionWrap">
                    <div
                      ref={productDescriptionRef}
                      className="productDetail-detailTop-description"
                      dangerouslySetInnerHTML={{
                        __html: productDetailData?.description
                      }}
                    />

                    {isDescriptionOverflowing && (
                      <button
                        type="button"
                        className="productDetail-detailTop-descriptionSeeMore"
                        onClick={() => setIsDescriptionModalOpen(true)}
                      >
                        ... See more
                      </button>
                    )}
                  </div>
                )}

                <div className="priceContainer" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0' }}>
                  <span style={{ color: '#FB2E86', fontWeight: 600, fontSize: '1.25rem' }} className="originalPrice">
                    NPR.{displayDiscountedPrice}
                  </span>
                  <span className="discountedPrice" style={{ fontSize: '1rem', color: '#888', marginLeft: 0 }}>
                    NPR.{displayOriginalPrice}
                  </span>
                </div>

                <VStack className="productDetail-detailTop-color">
                  <p>Color</p>
                  <HStack gap="$3">
                    {productDetailData?.images?.map((item: any, index: number) => {
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
                            style={{background: item.colorName}}
                            className="productDetail-detailTop-color-item"
                            onClick={() => handleColorClicked(item._id, index)}
                          ></div>
                        </div>
                      )
                    })}
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
                      ? handleAddToCart(productDetailData, activeColorIndex)
                      : handleLoggedOutAddItemToCart()
                  }}
                >
                  <p>{safeStockQuantity <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}</p>
                </div>

                <HStack
                  className="productDetail-inStock"
                  justify="flex-start"
                  align="center"
                  gap="$4"
                >
                  <Title subheading> In Stock:</Title>
                  <Chip title={`${safeStockQuantity} pics`} color="rgb(219 247 241)" />
                </HStack>

                <VStack className="productDetail-detailBottom" gap="$8">
                  <VStack className="productDetail-detailBottom-description" gap="$4">
                    <Chip
                      title={productDetailData?.subCategory?.name}
                      color="rgb(219 247 241)"
                    />


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
                      {productDetailData?.video && hasProductImages && (
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

      <div style={{marginBottom: '20px', padding: '2vw'}}>
        <ProductSection
          header="Similar Products"
          isProfilePage={true}
          isForSimilar={true}
          currentProduct={productDetailData}
        />
      </div>

      <Dialog
        open={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{className: 'productDetail-descriptionModalPaper'}}
      >
        <DialogContent className="productDetail-descriptionModalContent">
          <button
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'transparent',
              border: 'none',
              fontSize: 28,
              cursor: 'pointer',
              zIndex: 10
            }}
            aria-label="Close"
            onClick={() => setIsDescriptionModalOpen(false)}
          >
            &times;
          </button>
          <div
            className="productDetail-descriptionModalBody"
            dangerouslySetInnerHTML={{
              __html: productDetailData?.description || ''
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}