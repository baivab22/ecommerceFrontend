// // import './App.css'
// import {useStepContext} from '@mui/material'
// import {useState, useRef, useEffect} from 'react'
// import ReactImageMagnify from 'react-image-magnify'
// import {Skeleton} from '@mui/material'
// import {BASE_URL, FILE_URL} from 'src/config'
// import { OptimizedImage } from 'src/app/common/OptimizedImage/OptimizedImage.component'

// export const ZoomSlider = ({
//   data,
//   onImageSelect
// }: {
//   data: any
//   onImageSelect?: (index: number) => void
// }) => {
//   console.log(data, 'data required')
//   const [images, setImages] = useState([])
//   const [img, setImg] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [imageLoaded, setImageLoaded] = useState<{[key: number]: boolean}>({})
//   const [activeIndex, setActiveIndex] = useState(0)
//   const touchStartX = useRef<number | null>(null)
//   const touchCurrentX = useRef<number | null>(null)

//   const resolveProductImageUrl = (rawValue?: string) => {
//     if (!rawValue) return ''
//     const value = String(rawValue).trim()
//     if (/^https?:\/\//i.test(value)) return encodeURI(value)

//     const cleaned = value.replace(/^\/+/, '')
//     const safePath = encodeURI(cleaned)
//     if (cleaned.startsWith('products/')) return `${FILE_URL}/${safePath}`
//     if (cleaned.startsWith('uploads/')) {
//       return `${FILE_URL}/${encodeURI(cleaned.replace(/^uploads\//, ''))}`
//     }

//     return `${FILE_URL}/products/${safePath}`
//   }

//   useEffect(() => {
//     if (!data || data.length === 0) {
//       setLoading(true)
//       return
//     }

//     setLoading(true)
//     const images = data?.map((item: any) => resolveProductImageUrl(item)).filter(Boolean)

//     console.log(images, 'images values')

//     setImages(images)
//     setImg(images?.[0])
//     setActiveIndex(0)
//     setLoading(false)
//   }, [data])

//   const hoverHandler = (image, i) => {
//     setImg(image)
//     setActiveIndex(i)
//     onImageSelect?.(i)
//     if (refs.current[i]) {
//       refs.current[i].classList.add('active')
//       for (var j = 0; j < images?.length; j++) {
//         if (i !== j && refs.current[j]) {
//           refs.current[j].classList.remove('active')
//         }
//       }
//     }
//   }

//   const refs = useRef<HTMLDivElement[]>([])
//   refs.current = []
//   const addRefs = (el: HTMLDivElement | null) => {
//     if (el && !refs.current.includes(el)) {
//       refs.current.push(el)
//     }
//   }

//   const goPrev = () => {
//     if (!images || images.length === 0) return
//     const nextIndex = (activeIndex - 1 + images.length) % images.length
//     setActiveIndex(nextIndex)
//     setImg(images[nextIndex])
//     onImageSelect?.(nextIndex)
//     if (refs.current[nextIndex]) {
//       refs.current[nextIndex].classList.add('active')
//       refs.current.forEach((el, j) => {
//         if (j !== nextIndex) el.classList.remove('active')
//       })
//     }
//   }

//   const goNext = () => {
//     if (!images || images.length === 0) return
//     const nextIndex = (activeIndex + 1) % images.length
//     setActiveIndex(nextIndex)
//     setImg(images[nextIndex])
//     onImageSelect?.(nextIndex)
//     if (refs.current[nextIndex]) {
//       refs.current[nextIndex].classList.add('active')
//       refs.current.forEach((el, j) => {
//         if (j !== nextIndex) el.classList.remove('active')
//       })
//     }
//   }

//   const handleImageLoad = (index: number) => {
//     setImageLoaded(prev => ({...prev, [index]: true}))
//   }

//   const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
//     touchStartX.current = event.touches[0]?.clientX || null
//     touchCurrentX.current = touchStartX.current
//   }

//   const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
//     touchCurrentX.current = event.touches[0]?.clientX || null
//   }

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
//     const target = event.target as HTMLElement
//     const tagName = target?.tagName?.toLowerCase()
//     const isEditableElement =
//       tagName === 'input' ||
//       tagName === 'textarea' ||
//       tagName === 'select' ||
//       (target as HTMLElement).isContentEditable

//     if (isEditableElement) return

//     if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
//       event.preventDefault()
//       goPrev()
//     }

//     if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
//       event.preventDefault()
//       goNext()
//     }
//   }

//   const handleTouchEnd = () => {
//     if (touchStartX.current === null || touchCurrentX.current === null) return
//     const deltaX = touchCurrentX.current - touchStartX.current
//     const threshold = 50
//     if (Math.abs(deltaX) < threshold) return
//     if (deltaX > 0) {
//       goPrev()
//     } else {
//       goNext()
//     }
//     touchStartX.current = null
//     touchCurrentX.current = null
//   }

//   return (
//     <div className="container">
//       <div className="left">
//         <div className="left_1">
//           {loading ? (
//             // Skeleton for thumbnail list
//             <>
//               {[1, 2, 3, 4].map((_, i) => (
//                 <div className="img_wrap" key={i}>
//                   <Skeleton 
//                     variant="rectangular" 
//                     width="100%" 
//                     height="100%" 
//                     animation="wave"
//                   />
//                 </div>
//               ))}
//             </>
//           ) : (
//             images?.map((image, i) => (
//               <div
//                 className={i == 0 ? 'img_wrap active' : 'img_wrap'}
//                 key={i}
//                 onMouseOver={() => hoverHandler(image, i)}
//                 onClick={() => hoverHandler(image, i)}
//                 ref={addRefs}
//                 style={{
//                   position: 'relative',
//                   zIndex: i === activeIndex ? 40 : 30,
//                   pointerEvents: 'auto'
//                 }}
//               >
//                 {!imageLoaded[i] && (
//                   <Skeleton 
//                     variant="rectangular" 
//                     width="100%" 
//                     height="100%" 
//                     animation="wave"
//                     style={{position: 'absolute', top: 0, left: 0}}
//                   />
//                 )}
//                 <OptimizedImage
//                   src={image}
//                   alt={`Thumbnail ${i + 1}`}
//                   width={120}
//                   height={120}
//                   objectFit="contain"
//                   onError={() => handleImageLoad(i)}
//                   style={{display: imageLoaded[i] ? 'block' : 'none', width: '100%', height: '100%'}}
//                 />
//               </div>
//             ))
//           )}
//         </div>
//         <div
//           className="left_2"
//           style={{height: '100%', width: '513px', position: 'relative'}}
//           tabIndex={0}
//           role="region"
//           aria-label="Product image slider"
//           onKeyDown={handleKeyDown}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           {loading || !img ? (
//             // Skeleton for main image
//             <Skeleton 
//               variant="rectangular" 
//               width="100%" 
//               height={300} 
//               animation="wave"
//             />
//           ) : (
//             <>
//               <ReactImageMagnify
//                 {...{
//                   smallImage: {
//                     alt: 'Wristwatch by Ted Baker London',
//                     isFluidWidth: true,
//                     src: img,
//                     height: 300,
//                     width: 300
//                   },
//                   largeImage: {
//                     src: img,
//                     width: 1000,
//                     height: 1200
//                   }
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={goPrev}
//                 style={{
//                   position: 'absolute',
//                   left: 8,
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   background: 'rgba(0,0,0,0.45)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '50%',
//                   width: 36,
//                   height: 36,
//                   cursor: 'pointer',
//                   zIndex: 20
//                 }}
//               >
//                 ◀
//               </button>
//               <button
//                 type="button"
//                 onClick={goNext}
//                 style={{
//                   position: 'absolute',
//                   right: 8,
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   background: 'rgba(0,0,0,0.45)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '50%',
//                   width: 36,
//                   height: 36,
//                   cursor: 'pointer',
//                   zIndex: 20
//                 }}
//               >
//                 ▶
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//       <div className="right"></div>
//     </div>
//   )
// }


// import { useState, useRef, useEffect } from 'react'
// import { Skeleton } from '@mui/material'
// import { FILE_URL } from 'src/config'
// import { OptimizedImage } from 'src/app/common/OptimizedImage/OptimizedImage.component'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import { Navigation, Zoom, FreeMode } from 'swiper/modules'
// import type { Swiper as SwiperType } from 'swiper'

// // Import Swiper styles
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/zoom'
// import 'swiper/css/free-mode'

// export const ZoomSlider = ({
//   data,
//   onImageSelect
// }: {
//   data: any
//   onImageSelect?: (index: number) => void
// }) => {
//   console.log(data, 'data required')
//   const [images, setImages] = useState<string[]>([])
//   const [loading, setLoading] = useState(true)
//   const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({})
//   const [activeIndex, setActiveIndex] = useState(0)
//   const mainSwiperRef = useRef<SwiperType | null>(null)
//   const touchStartX = useRef<number | null>(null)
//   const touchCurrentX = useRef<number | null>(null)

//   const resolveProductImageUrl = (rawValue?: string) => {
//     if (!rawValue) return ''
//     const value = String(rawValue).trim()
//     if (/^https?:\/\//i.test(value)) return encodeURI(value)

//     const cleaned = value.replace(/^\/+/, '')
//     const safePath = encodeURI(cleaned)
//     if (cleaned.startsWith('products/')) return `${FILE_URL}/${safePath}`
//     if (cleaned.startsWith('uploads/')) {
//       return `${FILE_URL}/${encodeURI(cleaned.replace(/^uploads\//, ''))}`
//     }

//     return `${FILE_URL}/products/${safePath}`
//   }

//   useEffect(() => {
//     if (!data || data.length === 0) {
//       setLoading(true)
//       return
//     }

//     setLoading(true)
//     const imageUrls = data?.map((item: any) => resolveProductImageUrl(item)).filter(Boolean)

//     console.log(imageUrls, 'images values')

//     setImages(imageUrls)
//     setActiveIndex(0)
//     setLoading(false)
//   }, [data])

//   const handleImageLoad = (index: number) => {
//     setImageLoaded(prev => ({ ...prev, [index]: true }))
//   }

//   const handleSlideChange = (swiper: SwiperType) => {
//     const newIndex = swiper.activeIndex
//     setActiveIndex(newIndex)
//     onImageSelect?.(newIndex)
//   }

//   const handleThumbClick = (index: number) => {
//     if (mainSwiperRef.current) {
//       mainSwiperRef.current.slideTo(index)
//     }
//   }

//   const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
//     touchStartX.current = event.touches[0]?.clientX || null
//     touchCurrentX.current = touchStartX.current
//   }

//   const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
//     touchCurrentX.current = event.touches[0]?.clientX || null
//   }

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
//     const target = event.target as HTMLElement
//     const tagName = target?.tagName?.toLowerCase()
//     const isEditableElement =
//       tagName === 'input' ||
//       tagName === 'textarea' ||
//       tagName === 'select' ||
//       (target as HTMLElement).isContentEditable

//     if (isEditableElement) return

//     if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
//       event.preventDefault()
//       if (mainSwiperRef.current) {
//         mainSwiperRef.current.slidePrev()
//       }
//     }

//     if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
//       event.preventDefault()
//       if (mainSwiperRef.current) {
//         mainSwiperRef.current.slideNext()
//       }
//     }
//   }

//   const handleTouchEnd = () => {
//     if (touchStartX.current === null || touchCurrentX.current === null) return
//     const deltaX = touchCurrentX.current - touchStartX.current
//     const threshold = 50
//     if (Math.abs(deltaX) < threshold) return
//     if (deltaX > 0) {
//       if (mainSwiperRef.current) {
//         mainSwiperRef.current.slidePrev()
//       }
//     } else {
//       if (mainSwiperRef.current) {
//         mainSwiperRef.current.slideNext()
//       }
//     }
//     touchStartX.current = null
//     touchCurrentX.current = null
//   }

//   return (
//     <div className="container">
//       <div className="left">
//         <div className="left_1">
//           {loading ? (
//             <>
//               {[1, 2, 3, 4].map((_, i) => (
//                 <div className="img_wrap" key={i}>
//                   <Skeleton 
//                     variant="rectangular" 
//                     width="100%" 
//                     height="100%" 
//                     animation="wave"
//                   />
//                 </div>
//               ))}
//             </>
//           ) : (
//             <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
//               {images?.map((image, i) => (
//                 <div
//                   key={i}
//                   className={i === activeIndex ? 'img_wrap active' : 'img_wrap'}
//                   onClick={() => handleThumbClick(i)}
//                   style={{
//                     position: 'relative',
//                     cursor: 'pointer',
//                     width: '100%',
//                     aspectRatio: '1/1',
//                     overflow: 'hidden',
//                     border: i === activeIndex ? '2px solid #FB2E86' : '1px solid #ddd',
//                     borderRadius: '8px'
//                   }}
//                 >
//                   {!imageLoaded[i] && (
//                     <Skeleton 
//                       variant="rectangular" 
//                       width="100%" 
//                       height="100%" 
//                       animation="wave"
//                       style={{position: 'absolute', top: 0, left: 0}}
//                     />
//                   )}
//                   <OptimizedImage
//                     src={image}
//                     alt={`Thumbnail ${i + 1}`}
//                     width={120}
//                     height={120}
//                     objectFit="contain"
//                     onLoad={() => handleImageLoad(i)}
//                     onError={() => handleImageLoad(i)}
//                     style={{
//                       display: imageLoaded[i] ? 'block' : 'none',
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'contain'
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div
//           className="left_2"
//           style={{height: '100%', width: '513px', position: 'relative'}}
//           tabIndex={0}
//           role="region"
//           aria-label="Product image slider"
//           onKeyDown={handleKeyDown}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           {loading || images.length === 0 ? (
//             <Skeleton 
//               variant="rectangular" 
//               width="100%" 
//               height={300} 
//               animation="wave"
//             />
//           ) : (
//             <>
//               <Swiper
//                 onSwiper={(swiper) => {
//                   mainSwiperRef.current = swiper
//                 }}
//                 onSlideChange={handleSlideChange}
//                 spaceBetween={0}
//                 slidesPerView={1}
//                 navigation={false}
//                 zoom={true}
//                 modules={[Navigation, Zoom, FreeMode]}
//                 style={{ width: '100%', height: '100%' }}
//                 initialSlide={activeIndex}
//               >
//                 {images.map((image, index) => (
//                   <SwiperSlide key={index}>
//                     <div className="swiper-zoom-container" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <OptimizedImage
//                         src={image}
//                         alt={`Product image ${index + 1}`}
//                         width={513}
//                         height={300}
//                         objectFit="contain"
//                         style={{
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'contain',
//                           cursor: 'zoom-in'
//                         }}
//                       />
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//               {images.length > 1 && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => mainSwiperRef.current?.slidePrev()}
//                     style={{
//                       position: 'absolute',
//                       left: 8,
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       background: 'rgba(0,0,0,0.45)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '50%',
//                       width: 36,
//                       height: 36,
//                       cursor: 'pointer',
//                       zIndex: 20,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontSize: '18px'
//                     }}
//                   >
//                     ◀
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => mainSwiperRef.current?.slideNext()}
//                     style={{
//                       position: 'absolute',
//                       right: 8,
//                       top: '50%',
//                       transform: 'translateY(-50%)',
//                       background: 'rgba(0,0,0,0.45)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '50%',
//                       width: 36,
//                       height: 36,
//                       cursor: 'pointer',
//                       zIndex: 20,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontSize: '18px'
//                     }}
//                   >
//                     ▶
//                   </button>
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//       <div className="right"></div>
//     </div>
//   )



// }

import { useState, useRef, useEffect } from 'react'
import { Skeleton } from '@mui/material'
import { FILE_URL } from 'src/config'
import { OptimizedImage } from 'src/app/common/OptimizedImage/OptimizedImage.component'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/styles.min.css'

import { CSSProperties } from 'react'

export const ZoomSlider = ({
  data,
  onImageSelect,
}: {
  data: any[]
  onImageSelect?: (index: number) => void
}) => {
  const [images, setImages] = useState<string[]>([])
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({})
  const [activeIndex, setActiveIndex] = useState(0)

  const touchStartX = useRef<number | null>(null)
  const touchCurrentX = useRef<number | null>(null)
  const refs = useRef<HTMLDivElement[]>([])

  const resolveProductImageUrl = (rawValue?: string) => {
    if (!rawValue) return ''

    const value = String(rawValue).trim()

    if (/^https?:\/\//i.test(value)) return encodeURI(value)

    const cleaned = value.replace(/^\/+/, '')
    const safePath = encodeURI(cleaned)

    if (cleaned.startsWith('products/')) {
      return `${FILE_URL}/${safePath}`
    }

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

    const imageUrls = data
      ?.map((item: any) => resolveProductImageUrl(item))
      .filter(Boolean)

    setImages(imageUrls)
    setImg(imageUrls?.[0] || '')
    setActiveIndex(0)
    setLoading(false)
  }, [data])

  const hoverHandler = (image: string, i: number) => {
    setImg(image)
    setActiveIndex(i)
    onImageSelect?.(i)
  }

  const addRefs = (el: HTMLDivElement | null) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el)
    }
  }

  const goPrev = () => {
    if (!images.length) return
    const nextIndex = (activeIndex - 1 + images.length) % images.length
    setActiveIndex(nextIndex)
    setImg(images[nextIndex])
    onImageSelect?.(nextIndex)
  }

  const goNext = () => {
    if (!images.length) return
    const nextIndex = (activeIndex + 1) % images.length
    setActiveIndex(nextIndex)
    setImg(images[nextIndex])
    onImageSelect?.(nextIndex)
  }

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }))
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX || null
    touchCurrentX.current = touchStartX.current
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchCurrentX.current = event.touches[0]?.clientX || null
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchCurrentX.current === null) return

    const deltaX = touchCurrentX.current - touchStartX.current
    const threshold = 50

    if (Math.abs(deltaX) >= threshold) {
      deltaX > 0 ? goPrev() : goNext()
    }

    touchStartX.current = null
    touchCurrentX.current = null
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const tag = target?.tagName?.toLowerCase()

    const isEditable =
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select' ||
      target.isContentEditable

    if (isEditable) return

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      goPrev()
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      goNext()
    }
  }

  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return
      el.classList.toggle('active', i === activeIndex)
    })
  }, [activeIndex])

  return (
    <div className="container">
      <div className="left">
        <div className="left_1">
          {loading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <div className="img_wrap" key={i}>
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </div>
              ))}
            </>
          ) : (
            images.map((image, i) => (
              <div
                key={i}
                className={i === activeIndex ? 'img_wrap active' : 'img_wrap'}
                onMouseOver={() => hoverHandler(image, i)}
                onClick={() => hoverHandler(image, i)}
                ref={addRefs}
                style={{
                  position: 'relative',
                  zIndex: i === activeIndex ? 40 : 30,
                }}
              >
                {!imageLoaded[i] && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                )}

                <OptimizedImage
                  src={image}
                  alt={`Thumbnail ${i + 1}`}
                  width={120}
                  height={120}
                  objectFit="contain"
                  // onLoad={() => handleImageLoad(i)}
                  onError={() => handleImageLoad(i)}
                  style={{
                    display: imageLoaded[i] ? 'block' : 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ))
          )}
        </div>

        <div
          className="left_2"
          style={{ height: '100%', width: '513px', position: 'relative' }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {loading || !img ? (
            <Skeleton variant="rectangular" width="100%" height={300} />
          ) : (
            <>
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <InnerImageZoom
                  src={img}
                  zoomSrc={img}
                  zoomType="hover"
                  zoomScale={2.5}
                  fadeDuration={150}
                />
              </div>

              <button onClick={goPrev} type="button" style={navBtnStyle('left')}>
                ◀
              </button>

              <button onClick={goNext} type="button" style={navBtnStyle('right')}>
                ▶
              </button>
            </>
          )}
        </div>
      </div>

      <div className="right" />
    </div>
  )
}




const navBtnStyle = (side: 'left' | 'right'): CSSProperties => ({
  position: 'absolute',
  top: '50%',
  [side]: 8,
  transform: 'translateY(-50%)',
  background: 'rgba(0,0,0,0.45)',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: 36,
  height: 36,
  cursor: 'pointer',
  zIndex: 20,
})

