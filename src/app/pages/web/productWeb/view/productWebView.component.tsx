import React, {useEffect, useRef, useState} from 'react'
import {Chip, HStack, Title, VStack} from 'src/app/common'
import {useDispatch, useSelector} from 'src/store'
import {getProductDetailByIdAction} from 'src/app/pages/products/product.slice'
import { useNavigate, useParams } from 'react-router-dom'
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
import {resolveProductImageUrl, resolveProductVideoUrl} from 'src/helpers/mediaUrl.helper'
// import ZoomSlider from 'src/app/components/zoomSlider/zoomSlider.component'

export const ProductWebDetail = () => {
  const media = useMedia()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { productId } = useParams()

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

  const productIdString = productId

  useEffect(() => {
    if (!productIdString) return

    window.scrollTo({top: 0, behavior: 'smooth'})
    dispatch(getProductDetailByIdAction({productId: productIdString}))
  }, [productIdString, dispatch])

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
  const productVideoUrl = resolveProductVideoUrl(productVideoSource)
  const previewHeight = media.md ? 'min(82vh, 860px)' : 'min(72vh, 620px)'
  const productDescriptionRef = useRef<HTMLDivElement | null>(null)
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)

  const ALL_COLOR_INDEX = -1
  const [productImageList, setProductImageList] = useState<string[]>([])
  const hasProductImages = productImageList.length > 0
  const [activeColorIndex, setActiveColorIndex] = useState<number>(ALL_COLOR_INDEX)

  const getAllVariantImages = (data: any) =>
    data?.images?.flatMap((item: any) => {
      if (typeof item === 'string') return [item]
      if (Array.isArray(item.coloredImages) && item.coloredImages.length > 0)
        return item.coloredImages
      if (typeof item.coloredImage === 'string') return [item.coloredImage]
      return []
    })

  useEffect(() => {
    const requiredImageList = getAllVariantImages(productDetailData)
    setProductImageList((requiredImageList || []).filter(Boolean))
    setActiveColorIndex(ALL_COLOR_INDEX)
  }, [productDetailData, productId])

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
    if (index === ALL_COLOR_INDEX) {
      const requiredImageList = getAllVariantImages(productDetailData)
      setActiveColorIndex(ALL_COLOR_INDEX)
      setProductImageList((requiredImageList || []).filter(Boolean))
      return
    }

    const selectedVariant = productDetailData?.images?.find((item: any) => {
      return item._id === id || item.id === id || String(item._id) === String(id)
    })

    const selectedImages = selectedVariant
      ? Array.isArray(selectedVariant.coloredImages)
        ? selectedVariant.coloredImages
        : selectedVariant.coloredImage
        ? [selectedVariant.coloredImage]
        : []
      : []

    setActiveColorIndex(index)
    setProductImageList(selectedImages.filter(Boolean))
  }

  const handleCarouselImageSelect = (index: number) => {
    if (productDetailData?.images?.[index]) {
      setActiveColorIndex(index)
    }
  }

  const datas = useSelector((state: any) => state.cart)

  const handleAddToCart = (data: any, colorIndex: number) => {
    const userId = getCookie('userId')
    const roles = getCookie('userRoles')
    const currentCartProduct = datas?.cartData?.[0]?.products?.find(
      (item: any) => item?.productId?.id === data?.id
    )
    const currentQuantityInCart = Number(currentCartProduct?.quantity || 0)
    const canAddMore = currentQuantityInCart < safeStockQuantity

    if (userId && !!roles) {
      const isAlreadyExist = Boolean(currentCartProduct)

      if (!canAddMore) {
        toast.error(`Only ${safeStockQuantity} items available in stock`)
        return
      }

      if (!isAlreadyExist) {
        const selectedColorName =
          colorIndex === ALL_COLOR_INDEX
            ? productDetailData?.images?.[0]?.colorName
            : productDetailData?.images?.[colorIndex]?.colorName
        const cartData = {
          userId,
          products: [
            {
              productId: data?.id,
              quantity: 1,
              price: data?.discountedPrice,
              colorName: selectedColorName || 'Default'
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
            },
            onFailure: (error: any) => {
              const errorMessage =
                error?.message || error || 'Failed to add product to cart'
              toast.error(String(errorMessage))
            }
          })
        )
      } else {
        const nextQuantity = currentQuantityInCart + 1

        if (nextQuantity > safeStockQuantity) {
          toast.error(`Only ${safeStockQuantity} items available in stock`)
          return
        }

        dispatch(
          updatedCartByProductIdAction({
            data: {
              userId,
              productId: currentCartProduct?.productId?.id,
              quantity: nextQuantity,
              price: Number(
                currentCartProduct?.productId?.discountedPrice * nextQuantity
              ),
              colorName:
                colorIndex === ALL_COLOR_INDEX
                  ? productDetailData?.images?.[0]?.colorName
                  : productDetailData?.images?.[colorIndex]?.colorName ||
                    currentCartProduct?.colorName ||
                    productDetailData?.images?.[0]?.colorName ||
                    'Default'
            },
            onSuccess: () => {
              toast.success('Product on cart updated successfully')
              userId && dispatch(getCartlistAction({userId}))
            },
            onFailure: (error: any) => {
              const errorMessage =
                error?.message || error || 'Failed to update cart'
              toast.error(String(errorMessage))
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
                    <ZoomSlider
                      data={productImageList}
                      onImageSelect={handleCarouselImageSelect}
                    />
                  </div>
                ) : (
                  <div className="productDetail-media-empty">
                    <img
                      src="/assets/images/defaultProduct.jpeg"
                      alt={productDetailData?.name || 'Product'}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      loading="lazy"
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
                  <HStack gap="$3" align="center">
                    <button
                      type="button"
                      onClick={() => handleColorClicked('all', ALL_COLOR_INDEX)}
                      style={{
                        border:
                          activeColorIndex === ALL_COLOR_INDEX
                            ? '2px solid hsl(353, 100%, 78%)'
                            : '1px solid #ddd',
                        borderRadius: '999px',
                        background: activeColorIndex === ALL_COLOR_INDEX ? '#fff6f8' : '#fff',
                        color: '#333',
                        cursor: 'pointer',
                        fontSize: '0.86rem',
                        fontWeight: activeColorIndex === ALL_COLOR_INDEX ? 700 : 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #ddd',
                          background: '#fff',
                          display: 'inline-flex'
                        }}
                      >
                          <img
                            src="assets/images/wholecolor.jpg"
                            alt="All color variants"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                            loading="lazy"
                          />
                      </span>
                    </button>

                    {productDetailData?.images?.map((item: any, index: number) => {
                      const colorValue = item.colorName || '#ccc'
                      const isSelected = activeColorIndex === index

                      return (
                        <button
                          key={item._id || index}
                          type="button"
                          onClick={() => handleColorClicked(item._id, index)}
                          title={item.colorName || `Color ${index + 1}`}
                          style={{
                            border: isSelected ? '2px solid hsl(353, 100%, 78%)' : '1px solid #ddd',
                            borderRadius: '999px',
                            padding: '4px',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 150ms ease',
                            transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                            position:'relative',
                            zIndex:1

                          }}
                        >
                          <span
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: colorValue,
                              boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                              display: 'inline-block'
                            }}
                          />
                        </button>
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

                    !!auth?.isLoggedin
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
                            zIndex: 1000,
                            pointerEvents: 'none'
                          }}
                          onMouseDown={handleMouseDown}
                          onTouchStart={handleTouchStart}
                        >
                          <div style={{ pointerEvents: 'auto' }}>
                            <CustomVideoPlayer
                              videoUrl={resolveProductVideoUrl(productDetailData?.video)}
                              productDetails={{
                                name: productDetailData.name,
                                description: productDetailData?.description,
                                price: productDetailData?.originalPrice
                              }}
                              thumbnailUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfcz8nhghqfpLH6iYrPyz6_U9fqSdujGVmrezxtryOpI0cxnLFzwSHklg5csZgs8K1QMU&usqp=CAU"
                            />
                          </div>
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