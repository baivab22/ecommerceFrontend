import {useState, useRef, useEffect, useCallback} from 'react'
import ReactImageMagnify from 'react-image-magnify'
import {Skeleton} from '@mui/material'
import {FILE_URL} from 'src/config'
import {ChevronLeft, ChevronRight} from 'lucide-react'

export const ZoomSlider = ({
  data,
  onImageSelect
}: {
  data: any
  onImageSelect?: (index: number) => void
}) => {
  const [images, setImages] = useState<string[]>([])
  const [img, setImg] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef(0)
  const touchEndXRef = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (onImageSelect) {
      onImageSelect(currentIndex)
    }
  }, [currentIndex, onImageSelect])

  const resolveProductImageUrl = (rawValue?: string) => {
    if (!rawValue) return ''
    const value = String(rawValue).trim()
    if (/^https?:\/\//i.test(value)) return encodeURI(value)
    const cleaned = value.replace(/^\/+/, '')
    const safePath = encodeURI(cleaned)
    if (cleaned.startsWith('products/')) return `${FILE_URL}/${safePath}`
    if (cleaned.startsWith('uploads/')) {
      return `${FILE_URL}/${encodeURI(cleaned.replace(/^uploads\//, ''))}`
    }
    return `${FILE_URL}/products/${safePath}`
  }

  useEffect(() => {
    if (!data || data.length === 0) {
      setLoading(true)
      return
    }
    setLoading(true)
    const resolved = data
      ?.map((item: any) => resolveProductImageUrl(item))
      .filter(Boolean)
    setImages(resolved)
    setImg(resolved?.[0])
    setCurrentIndex(0)
    setLoading(false)
  }, [data])

  const goToSlide = useCallback(
    (index: number) => {
      if (!images.length) return
      const target = (index + images.length) % images.length
      setCurrentIndex(target)
      setImg(images[target])
    },
    [images]
  )

  const goPrev = useCallback(() => {
    goToSlide(currentIndex - 1)
  }, [currentIndex, goToSlide])

  const goNext = useCallback(() => {
    goToSlide(currentIndex + 1)
  }, [currentIndex, goToSlide])

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goPrev, goNext])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goNext()
      } else {
        goPrev()
      }
    }
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
    setImg(images[index])
  }

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({...prev, [index]: true}))
  }

  const hasMultiple = images.length > 1

  return (
    <div className="container">
      <div className="left">
        <div className="left_1">
          {loading
            ? [1, 2, 3, 4].map((_, i) => (
                <div className="img_wrap" key={i}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                  />
                </div>
              ))
            : images?.map((image, i) => (
                <div
                  className={i === currentIndex ? 'img_wrap active' : 'img_wrap'}
                  key={i}
                  onClick={() => handleThumbnailClick(i)}
                >
                  {!imageLoaded[i] && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                      animation="wave"
                      style={{position: 'absolute', top: 0, left: 0}}
                    />
                  )}
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    onLoad={() => handleImageLoad(i)}
                    onError={event =>
                      (event.currentTarget.src =
                        'https://www.verizon.com/learning/_next/static/images/87c8be7b206ab401b295fd1d21620b79.jpg')
                    }
                    style={{display: imageLoaded[i] ? 'block' : 'none'}}
                  />
                </div>
              ))}
        </div>
        <div
          className="left_2"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {loading || !img ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              style={{aspectRatio: '1 / 1', height: 'auto'}}
              animation="wave"
            />
          ) : (
            <div style={{position: 'relative'}}>
              {hasMultiple && (
                <>
                  <button
                    className="zoom-slider-nav zoom-slider-nav--prev"
                    onClick={goPrev}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="zoom-slider-nav zoom-slider-nav--next"
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              {isMobile ? (
                <img
                  src={img}
                  alt="Product image"
                  className="zoom-slider-mobile-img"
                  loading="lazy"
                />
              ) : (
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: 'Product image',
                      isFluidWidth: true,
                      src: img,
                      height: 300,
                      width: 300
                    },
                    largeImage: {
                      src: img,
                      width: 1000,
                      height: 1200
                    }
                  }}
                />
              )}
              {hasMultiple && (
                <div className="zoom-slider-counter">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="right"></div>
    </div>
  )
}
