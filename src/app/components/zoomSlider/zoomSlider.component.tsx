// import './App.css'
import {useStepContext} from '@mui/material'
import {useState, useRef, useEffect} from 'react'
import ReactImageMagnify from 'react-image-magnify'
import {Skeleton} from '@mui/material'
import {BASE_URL, FILE_URL} from 'src/config'

export const ZoomSlider = ({data}: {data: any}) => {
  console.log(data, 'data required')
  const [images, setImages] = useState([])
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({})

  useEffect(() => {
    if (!data || data.length === 0) {
      setLoading(true)
      return
    }

    setLoading(true)
    const images = data?.map((item: any, index: number) => {
      return `${FILE_URL}/products/${item}`
    })

    console.log(images, 'images values')

    setImages(images)
    setImg(images?.[0])
    setLoading(false)
  }, [data])

  const hoverHandler = (image, i) => {
    setImg(image)
    refs.current[i].classList.add('active')
    for (var j = 0; j < images?.length; j++) {
      if (i !== j) {
        refs.current[j].classList.remove('active')
      }
    }
  }

  const refs = useRef([])
  refs.current = []
  const addRefs = (el) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el)
    }
  }

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({...prev, [index]: true}))
  }

  return (
    <div className="container">
      <div className="left">
        <div className="left_1">
          {loading ? (
            // Skeleton for thumbnail list
            <>
              {[1, 2, 3, 4].map((_, i) => (
                <div className="img_wrap" key={i}>
                  <Skeleton 
                    variant="rectangular" 
                    width="100%" 
                    height="100%" 
                    animation="wave"
                  />
                </div>
              ))}
            </>
          ) : (
            images?.map((image, i) => (
              <div
                className={i == 0 ? 'img_wrap active' : 'img_wrap'}
                key={i}
                onMouseOver={() => hoverHandler(image, i)}
                ref={addRefs}
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
                  onLoad={() => handleImageLoad(i)}
                  onError={(event) =>
                    (event.currentTarget.src =
                      'https://www.verizon.com/learning/_next/static/images/87c8be7b206ab401b295fd1d21620b79.jpg')
                  }
                  style={{display: imageLoaded[i] ? 'block' : 'none'}}
                />
              </div>
            ))
          )}
        </div>
        <div className="left_2" style={{height: '100%', width: '513px'}}>
          {loading || !img ? (
            // Skeleton for main image
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={300} 
              animation="wave"
            />
          ) : (
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: 'Wristwatch by Ted Baker London',
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
        </div>
      </div>
      <div className="right"></div>
    </div>
  )
}