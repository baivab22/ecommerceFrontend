import React, {useState, useEffect} from 'react'
// import { useRouter } from 'next/router'
import { useNavigate } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination, Navigation} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import {useMedia, useQuery} from 'src/hooks'
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io'
import {WatchAndShopCard} from '../watchAndShop/watchAndShop.component'
import {IoClose} from 'react-icons/io5'
import {BASE_URL, FILE_URL} from 'src/config'
// import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'

const CategorryContainers = ({
  imgSrc,
  name,
  linkValue
}: {
  imgSrc: string
  name: string
  linkValue: string
}) => {

  const navigate = useNavigate()
  // const router = useRouter()
  return (
    <div
      className="CategoryContainer"
      onClick={() => {
        navigate(linkValue)
      }}
    >
      <div className="categoryCont">
        <div className="categoryImageContainer">
          <div className="categoryImage">
            <div className="categoryImage-image">
              <img
                src={imgSrc}
                alt={`${name} category`}
                width={300}
                height={300}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>

        <div className="categoryImage-title">{name}</div>
      </div>
    </div>
  )
}

// Skeleton Component for Category Item
const CategorySkeleton = () => {
  const skeletonStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }

  const imageContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '50%',
    ...skeletonStyle
  }

  const titleSkeletonStyle: React.CSSProperties = {
    height: '16px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    width: '80px',
    margin: '0 auto',
    ...skeletonStyle
  }

  return (
    <div className="CategoryContainer">
      <div className="categoryCont">
        <div className="categoryImageContainer">
          <div className="categoryImage">
            <div className="categoryImage-image">
              <div style={imageContainerStyle}></div>
            </div>
          </div>
        </div>
        <div className="categoryImage-title">
          <div style={titleSkeletonStyle}></div>
        </div>
      </div>
      
      <style>
        {/* {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `} */}
      </style>
    </div>
  )
}

export const CategoryContainer = ({data, loading}: {data: any; loading?: boolean}) => {
  const query = useQuery()
  const media = useMedia()
  const [slidesToShow, setSlidesToShow] = useState(5)
  const [activeItem, setActiveItem] = useState(1)
  const isCarouselOcrActive = query.isOcr === 'true'
  const isFolderSearchActive = query.isFolderSearch === 'true'
  const isQuickSummaryActive = query.isQuickSummary === 'true'

  const isDataExtractionActive = query.isAidataExtraction === 'true'

  const [isFullScreen, setIsFullScreen] = useState(false)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)

  useEffect(() => {
    media?.xs && setSlidesToShow(3)
    media?.sm && setSlidesToShow(3)
    media?.md && setSlidesToShow(3)
    media?.lg && setSlidesToShow(4)
    media?.xl && setSlidesToShow(5)
  }, [media.xl, media.lg, media.md, media.sm])

  const handleCarouselClick = (item) => {
    setActiveItem(item)
  }

  // Show skeleton while loading or data is empty/null
  // But check if data exists and has items before showing actual content
  const shouldShowSkeleton = loading || !data || data.length === 0

  if (shouldShowSkeleton) {
    const arrowDisabledStyle: React.CSSProperties = {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }

    const skeletonContainerStyle: React.CSSProperties = {
      display: 'flex',
      gap: '30px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 10px'
    }

    return (
      <div className="productCarouselContainer">
        <div className="productCarousel">
          <div className="productCarousel-slider">
            <div className="swiper-button-prev-custom" style={arrowDisabledStyle}>
              <IoIosArrowBack size={18} />
            </div>
            <div style={skeletonContainerStyle}>
              {Array.from({length: slidesToShow}).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
            <div className="swiper-button-next-custom" style={arrowDisabledStyle}>
              <IoIosArrowForward size={18} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="productCarouselContainer">
      <div className="productCarousel">
        <div className="productCarousel-slider">
          <div
            className="swiper-button-prev-custom"
            onClick={() =>
              setActiveItem((prev) => {
                if (prev === 1) {
                  handleCarouselClick(data.length)
                  return data.length
                } else {
                  handleCarouselClick(prev - 1)
                  return prev - 1
                }
              })
            }
          >
            <IoIosArrowBack size={18} />
          </div>
          <Swiper
            slidesPerView={slidesToShow}
            spaceBetween={30}
            loop={true}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom'
            }}
            modules={[Pagination, Navigation]}
          >
            {data?.map((item: any, index: number) => {
              const mainImage = item?.image?.replace('uploads/', '')
              return (
                <SwiperSlide key={item.id}>
                  <CategorryContainers
                    imgSrc={`${FILE_URL}/${mainImage}`}
                    name={item.name}
                    linkValue={`/products?categoryId=${item.id}&categoryname=${item.name}`}
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>
          <div
            className="swiper-button-next-custom"
            onClick={() =>
              setActiveItem((prev) => {
                if (prev === data?.length) {
                  handleCarouselClick(1)
                  return 1
                } else {
                  handleCarouselClick(prev + 1)

                  return prev + 1
                }
              })
            }
          >
            <IoIosArrowForward size={18} />
          </div>
        </div>
      </div>
    </div>
  )
}