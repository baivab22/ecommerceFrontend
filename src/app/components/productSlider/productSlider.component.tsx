import Slider from 'react-slick'
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'

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
              <OptimizedImage 
                src={item.url} 
                alt={`Banner ${index + 1}`}
                width={1200}
                height={400}
                priority={index === 0}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}
