import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {useDispatch, useSelector} from 'src/store'
import {useEffect, useMemo} from 'react'
import {getBannerListAction} from 'src/app/pages/banners/banners.slice'
import {FILE_URL} from 'src/config'

export const MainCarousel = () => {
  const dispatch = useDispatch()
  const {bannerData}: any = useSelector((state: any) => state.banner)

  const bannerSlides = useMemo(() => {
    const bannerRecord = bannerData?.[0] || {}
    const desktopImages =
      (Array.isArray(bannerRecord?.desktopBannerImage) &&
        bannerRecord.desktopBannerImage.length > 0 &&
        bannerRecord.desktopBannerImage) ||
      (Array.isArray(bannerRecord?.bannerImage) && bannerRecord.bannerImage) ||
      []
    const mobileImages =
      (Array.isArray(bannerRecord?.mobileBannerImage) && bannerRecord.mobileBannerImage) ||
      []

    const effectiveDesktopImages =
      desktopImages.length > 0 ? desktopImages : mobileImages
    const effectiveMobileImages =
      mobileImages.length > 0 ? mobileImages : desktopImages

    const slideCount = Math.max(
      effectiveDesktopImages.length,
      effectiveMobileImages.length
    )

    return Array.from({length: slideCount}, (_, index) => ({
      desktop:
        effectiveDesktopImages[index] ||
        effectiveDesktopImages[0] ||
        '',
      mobile:
        effectiveMobileImages[index] ||
        effectiveMobileImages[0] ||
        ''
    }))
  }, [bannerData])

  // const remappedBannerImage = useCallback(() => {
  //   console.log(bannerData, 'bannerData from ')
  //   const mydata = bannerData[0]?.bannerImage?.map(
  //     (item: any, index: number) => {
  //       return item
  //     }
  //   )

  //   console.log(mydata, 'mydata')

  //   setBannerList(mydata)
  // }, [bannerData])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  }

  useEffect(() => {
    dispatch(
      getBannerListAction({
        onSuccess: () => {}
      })
    )
  }, [])

  // useEffect(() => {
  //   console.log(bannerList, 'bannerlist')
  // }, [bannerData])

  return (
    <div className="carouselContainers">
      <Slider className="slider" adaptiveHeight {...settings}>
        {bannerSlides?.length > 0 &&
          bannerSlides?.map((item: any, index: number) => {
            return (
              <picture key={`${item.desktop}-${item.mobile}-${index}`}>
                <source media="(max-width: 768px)" srcSet={`${FILE_URL}/banners/${item.mobile}`} />
                <img
                  src={`${FILE_URL}/banners/${item.desktop}`}
                  alt="banner"
                />
              </picture>
            )
          })}
      </Slider>
    </div>
  )
}
