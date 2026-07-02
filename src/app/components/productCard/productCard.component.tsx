import React, {useEffect, useRef, useState} from 'react'
import {FaCartArrowDown} from 'react-icons/fa'
import {Chip, HStack, VStack} from 'src/app/common'
import ReactStarsRating from 'react-awesome-stars-rating'
import { useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'src/store'
import {createCartByUserId} from 'src/app/pages/web/cart/cart.service'
import {createCartByUserIdAction} from 'src/app/pages/web/cart/cart.slice'
import {getCookie} from 'src/helpers'
import toast from 'react-hot-toast'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import {FiEye, FiPlay, FiShoppingCart} from 'react-icons/fi'
import {
  resolveProductImageUrl,
  resolveProductVideoUrl
} from 'src/helpers/mediaUrl.helper'
import { fetchHolidayModeAction, selectHolidayMode } from 'src/app/pages/holidayMode/holidayMode.slice'
import {registerVideoElement} from 'src/helpers/videoPlayback.helper'

export const ProductCard = ({data}: {data: any}) => {
  const [activeImage, setActiveImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [productImages, setProductImages] = useState([])
  const productVideoRef = useRef<HTMLVideoElement | null>(null)
  const videoInstanceIdRef = useRef(
    `product-card-${data?.id || 'unknown'}-${Math.random().toString(36).slice(2, 9)}`
  )

  console.log('product card data',productImages)


  const productVideoUrl = resolveProductVideoUrl(data?.video)
  
  useEffect(() => {
    const ProductImages = (data?.images || [])
      .map((item: any) => {
console.log('item from product images', item,data.name)        
        return (typeof item === 'string'
          ? item
          : Array.isArray(item?.coloredImages)
            ? item.coloredImages
            : item?.coloredImage
              ? [item.coloredImage]
              : undefined)})

console.log('product images after mapping', ProductImages)
    setProductImages(ProductImages)
  }, [data])

  useEffect(() => {
    const video = productVideoRef.current
    const hasInlineVideo = Boolean(productVideoUrl) && productImages.length === 0

    if (!video || !hasInlineVideo) return
    const cleanup = registerVideoElement(videoInstanceIdRef.current, video)

    return () => {
      cleanup()
    }
  }, [productVideoUrl, productImages.length])

  useEffect(() => {
    const video = productVideoRef.current
    const hasInlineVideo = Boolean(productVideoUrl) && productImages.length === 0

    if (!video || !hasInlineVideo) return
    setIsVideoMuted(true)
    video.muted = true

    const ensurePlayback = () => {
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => undefined)
      }
    }

    ensurePlayback()
    video.addEventListener('loadedmetadata', ensurePlayback)

    return () => {
      video.removeEventListener('loadedmetadata', ensurePlayback)
      video.muted = true
      setIsVideoMuted(true)
      video.pause()
    }
  }, [])

  const handleVideoPlayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    const video = productVideoRef.current
    if (!video) return

    video.muted = false
    video.volume = 1
    setIsVideoMuted(false)

    const playPromise = video.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        video.muted = true
        setIsVideoMuted(true)
      })
    }
  }

  const discountPercentage = data?.originalPrice 
    ? Math.round(((data.originalPrice - data.discountedPrice) / data.originalPrice) * 100)
    : 0



console.log(productImages[0],"prrrr")
  return (
    <div
      className="productCard-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() =>{
        console.log("product clicked")
        navigate(`/products/view/${data?.id}`)
      }}
    >
      <VStack className="productCard" gap="$3">
        <div className="productCard-image-wrapper">
          <div
            className={`productCard-image ${productImages.length === 0 && productVideoUrl ? 'productCard-image--video' : ''}`}
          >
            {productImages.length > 0 ? (
              <img
                src={(() => { const src = resolveProductImageUrl(productImages?.[0]?.[0]); console.log('ProductCard src:', src, 'for', data?.name); return src; })()}
                alt={data?.name || 'Product image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : productVideoUrl ? (
              <>
                <video
                  ref={productVideoRef}
                  className="productCard-video productCard-video-relative"
                  autoPlay
                  muted={isVideoMuted}
                  loop
                  playsInline
                  controls={false}
                >
                  <source src={productVideoUrl} type="video/mp4" />
                </video>
                <button
                  type="button"
                  className={`productCard-video-play ${isVideoMuted ? 'visible' : ''}`}
                  onClick={handleVideoPlayClick}
                  aria-label={isVideoMuted ? 'Play video with sound' : 'Mute video'}
                >
                  <FiPlay size={18} />
                  <span>Play with sound</span>
                </button>
              </>
            ) : (
              <img
                src="/assets/images/defaultProduct.jpeg"
                alt={data?.name || 'Product image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="productCard-discount-badge">
                {discountPercentage}%
              </div>
            )}

            {/* Stock Indicator */}
            { data?.stockQuantity > 0 && (
              <div className="productCard-stock-badge low-stock">
                Only {data?.stockQuantity} left
              </div>
            )}
            
            {data?.stockQuantity === 0 && (
              <div className="productCard-stock-badge out-of-stock">
                Out of Stock
              </div>
            )}

            {/* Quick Actions Overlay */}
            <div className={`productCard-overlay ${isHovered ? 'active' : ''}`}>
              <button 
                className="productCard-action-btn primary"
                onClick={(e) => {
                  // e.stopPropagation()
           
                }}
              >
                <FiEye size={20} />
                <span>Quick View</span>
              </button>
            </div>
          </div>
        </div>

        <VStack className="productCard-content" gap="$2">
          <HStack justify="space-between" align="center" style={{width: '100%'}}>
            <Chip
              title={data?.subCategory?.name}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600'
              }}
              color="rgba(99, 102, 241, 0.1)"
            />
          </HStack>

          <div className="productCard-title-wrapper">
            <h3 className="productCard-title">{data?.name}</h3>
          </div>

     

          <HStack align="center" gap="$2" className="productCard-price-wrapper">
            <div className="productCard-price-current">
              {getNprPrice(data?.discountedPrice)}
            </div>
            {data?.originalPrice > data?.discountedPrice && (
              <div className="productCard-price-original">
                {getNprPrice(data?.originalPrice)}
              </div>
            )}
          </HStack>
        </VStack>

        {/* <div 
          className="productCard-footer"

        >
          <span>View Details</span>
          <FiEye size={16} />
        </div> */}
      </VStack>
    </div>
  )
}