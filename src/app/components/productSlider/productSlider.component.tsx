import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const ProductSlider = ({backgroundImage}) => {
  console.log(backgroundImage, 'backgroundImage')
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  }

  return (
    <div className="carouselContainers">
      <Slider className="slider" adaptiveHeight {...settings}>
        {backgroundImage.map((item: any, index: number) => {
          return (
            <div className="image-container" key={index}>
              <img src={item.url} alt="imange" placeholder="blur" loading="lazy"></img>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
