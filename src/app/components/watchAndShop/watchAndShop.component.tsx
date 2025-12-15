import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useMedia } from 'src/hooks'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { Play, X } from 'lucide-react'
import { BASE_URL, FILE_URL } from 'src/config'
import { HStack, VStack } from 'src/app/common'
import { getNprPrice } from 'src/helpers/nprPrice.helper'
import './_watchAndShop.scss'

export const WatchAndShopSection = ({ data }: { data: any }) => {
  const media = useMedia()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const swiperRef = useRef(null)

  console.log(data,"data value finally")

  const getSlides = () => {
    if (media?.xs) return 2
    if (media?.sm) return 2
    if (media?.md) return 3
    if (media?.lg) return 5
    if (media?.xl) return 6
    return 6
  }

  return (
    <>
      <div className="watchAndShopSectionContainer">
        <div className="watchAndShopSection">
          <Swiper
            ref={swiperRef}
            slidesPerView={getSlides()}
            spaceBetween={24}
            loop={data?.length > getSlides()}
            navigation={{
              prevEl: '.swiper-button-prev-watch',
              nextEl: '.swiper-button-next-watch'
            }}
            modules={[Navigation]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 12
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 12
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20
              },
              1536: {
                slidesPerView: 6,
                spaceBetween: 24
              }
            }}
            className="swiper-wrapper-watch"
          >
            {data?.map((item: any, index: number) => (
              <SwiperSlide key={item.id} className="swiper-slide-watch">
                <WatchAndShopCard
                  data={item}
                  index={index}
                  setIsFullScreen={setIsFullScreen}
                  setActiveIndex={setActiveVideoIndex}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="swiper-button-prev-watch" aria-label="Previous slide">
            <IoIosArrowBack size={18} />
          </button>
          <button className="swiper-button-next-watch" aria-label="Next slide">
            <IoIosArrowForward size={18} />
          </button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && data[activeVideoIndex] && (
        <FullscreenVideoModal
          data={data[activeVideoIndex]}
          onClose={() => setIsFullScreen(false)}
          videoUrl={`${FILE_URL}/video/${data[activeVideoIndex]?.video}`}
          allData={data}
          currentIndex={activeVideoIndex}
          setActiveIndex={setActiveVideoIndex}
          swiperRef={swiperRef}
        />
      )}
    </>
  )
}

export const WatchAndShopCard = ({
  data,
  index,
  setIsFullScreen,
  setActiveIndex
}: any) => {
  return (
    <div className="watchAndShopCardContainer">
      <div className="customVideoPlayerWatch">
        <div
          className="thumbnailWatch"
          onClick={() => {
            setIsFullScreen(true)
            setActiveIndex(index)
          }}
        >
          <div className="videosWatch">
              <video src={`http://localhost:8000/uploads/video/${data?.video}`} muted autoPlay loop playsInline />
            {/* <video src={`https://abhushangallery.com/video/${data?.video}`} muted autoPlay loop playsInline /> */}
          </div>

          <button
            className="playButtonWatch"
            onClick={(e) => {
              e.stopPropagation()
              setIsFullScreen(true)
              setActiveIndex(index)
            }}
            aria-label="Play video"
            type="button"
          >
            <Play size={32} color="white" fill="white" />..
          </button>
        </div>

        {/* Product Details Card */}
        <HStack className="productDetailCardWatch">
          <div className="productImageWatch">
            <img
              src={`${BASE_URL}/products/${data?.images?.[0]?.coloredImage}`}
              onError={(event) => {
                event.currentTarget.src =
                  'https://www.verizon.com/learning/_next/static/images/87c8be7b206ab401b295fd1d21620b79.jpg'
              }}
              alt={data?.name}
            />
          </div>

          <VStack className="productDescriptionWatch">
            <div className="productTitleWatch">{data?.name}</div>
            <div className="productPriceWatch">
              {getNprPrice(data?.originalPrice)}
            </div>
          </VStack>
        </HStack>
      </div>
    </div>
  )
}

export const FullscreenVideoModal = ({
  data,
  onClose,
  videoUrl,
  allData,
  currentIndex,
  setActiveIndex,
  swiperRef
}: any) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log('Play error:', err))
      }
    }, 100)

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handlePrevVideo = () => {
    const newIndex = currentIndex === 0 ? allData.length - 1 : currentIndex - 1
    setActiveIndex(newIndex)
  }

  const handleNextVideo = () => {
    const newIndex = currentIndex === allData.length - 1 ? 0 : currentIndex + 1
    setActiveIndex(newIndex)
  }

  return (
    <div className="fullscreenContainerWatch">
      {/* Close Button */}
      <button
        className="closeButtonWatch"
        onClick={onClose}
        aria-label="Close video"
        type="button"
      >
        <X size={28} />
      </button>

      {/* Previous Button */}
      <button
        className="fullscreenNavButtonWatch fullscreenNavPrevWatch"
        onClick={handlePrevVideo}
        aria-label="Previous video"
        type="button"
      >
        <IoIosArrowBack size={24} />
      </button>

      {/* Video Container */}
      <div className="videoContainerWatch">
        <video
          key={currentIndex}
          ref={videoRef}
          src={videoUrl}
          className="fullscreenVideoWatch"
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
        />
      </div>

      {/* Next Button */}
      <button
        className="fullscreenNavButtonWatch fullscreenNavNextWatch"
        onClick={handleNextVideo}
        aria-label="Next video"
        type="button"
      >
        <IoIosArrowForward size={24} />
      </button>

      {/* Product Footer */}
      <div className="productFooterWatch">
        <div className="productFooterContentWatch">
          <div className="productInfoSectionWatch">
            <h2 className="productNameWatch">{data?.name}</h2>
            <p className="productPriceDetailWatch">
              {getNprPrice(data?.originalPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}