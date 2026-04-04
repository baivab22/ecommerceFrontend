import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
// import Image from 'next/image'

// import banner1 from 'src/public/assets/image/banner1.webp'
// import banner2 from 'src/public/assets/image/banner2.webp'
// import banner3 from 'src/public/assets/image/banner3.webp'

import banner3 from 'src/assets/images/banner1.webp'
import banner1 from 'src/assets/images/banner2.webp'
import banner2 from 'src/assets/images/banner3.webp'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {useDispatch, useSelector} from 'src/store'
import {useCallback, useEffect, useState} from 'react'
import {getBannerListAction} from 'src/app/pages/banners/banners.slice'
import {FILE_URL} from 'src/config'

export const MainCarousel = () => {
  const dispatch = useDispatch()
  const {bannerData}: any = useSelector((state: any) => state.banner)
  const [bannerList, setBannerList] = useState<any>([])

  useEffect(() => {
    console.log(bannerData, 'bannerData hai ta')
    const datas = bannerData?.[0]?.bannerImage?.map(
      (item: any, index: number) => {
        return item
      }
    )

    console.log(datas, 'datas req hai ta')

    setBannerList(datas)
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

  const backgroundImage = [banner1, banner2, banner3]

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
        {bannerList?.length > 0 &&
          bannerList?.map((item: any, index: number) => {
            return (
              // <div className="image-container" key={index}>
              <img
                // src={`https://abhushangallery.com/${item}`}
                src={`${FILE_URL}/banners/${item}`}

                alt="image"
                placeholder="blur"
                // blurDataURL={item}
                // objectFit="cover"
                // objectPosition={'top center'}
                // layout="fill"
              ></img>
              // </div>
            )
          })}
      </Slider>
    </div>
  )
}
