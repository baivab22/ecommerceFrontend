import React, {
  useMemo,
  Children,
  useState,
  useLayoutEffect,
  useRef,
  useEffect
} from 'react'

import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineClose
} from 'react-icons/ai'
import {BiFullscreen} from 'react-icons/bi'

import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'
import {Modal} from 'src/app/common'
import {useMedia} from 'src/hooks'

export const CarouselSlider = ({children}: any) => {
  const media = useMedia()
  const [fullScreenVisible, setFullScreenVisible] = useState(false)
  const containerRef = useRef<any>()
  const [current, setCurrent] = useState(0)
  const [translateX, setTranslateX] = useState(0)

  const handleControl = (mode: string) => {
    containerRef.current.style.transitionDuration = '500ms'
    if (mode === 'prev') {
      if (current > 0) {
        setTranslateX(containerRef.current.clientWidth * (current - 1))
        setCurrent((prev) => --prev)
      }
    } else if (mode === 'next') {
      if (current < children?.length - 1) {
        setTranslateX(containerRef.current.clientWidth * (current + 1))
        setCurrent((prev) => ++prev)
      }
    }
  }

  useEffect(() => {
    const transitionEnd = () => {
      if (current <= 1) {
        containerRef.current.style.transitionDuration = '0ms'
        setTranslateX(containerRef.current.clientWidth * current)
      }

      if (current >= children?.length) {
        containerRef.current.style.transitionDuration = '0ms'
        setTranslateX(containerRef.current.clientWidth * children.length)
      }
    }
    document.addEventListener('transitionend', transitionEnd)
    return () => {
      document.removeEventListener('transitionend', transitionEnd)
    }
  }, [current, children])

  //for autoplay
  const slides = useMemo(() => {
    if (children?.length > 1) {
      let items = Children.map(children, (child: any, index: number) => {
        console.log(child, 'child from slides')
        return (
          <li key={index} className="slide">
            {child}
          </li>
        )
      })

      return [
        <li key={children.length + 1} className="slide">
          {children[children.length - 1]}
        </li>,
        ...items,

        <li key={children.length + 2} className="slide">
          {children[0]}
        </li>
      ]
    }
    return <li className="slide">{children?.[0]}</li>
  }, [children])

  useLayoutEffect(() => {
    setTranslateX(containerRef?.current.clientWidth * current)
  }, [])

  return (
    <>
      <div className="carouselContainer">
        <div className="leftIcon" onClick={() => handleControl('prev')}>
          <AiOutlineArrowLeft strokeWidth={2} />
        </div>
        <ul
          ref={containerRef}
          className="carousel"
          style={{
            transform: `translate3d(${-translateX}px, 0, 0)`
          }}
        >
          {slides}
        </ul>
        <div className="rightIcon" onClick={() => handleControl('next')}>
          <AiOutlineArrowRight strokeWidth={2} />
        </div>

        <div className="countInfo">
          {current + 1}/{children?.length}
        </div>
        <div className="fullScreen" onClick={() => setFullScreenVisible(true)}>
          <BiFullscreen />
        </div>
      </div>

      <Modal
        visible={fullScreenVisible}
        height={media.md ? '90vh' : 'auto'}
        width="90vw"
        style={{padding: 0, overflow: 'hidden'}}
        disableScroll={true}
      >
        <div className="fullScreenImageContainer">
          <div className="fullScreenImage">
            <OptimizedImage
              src={
                current === 0
                  ? children?.[children?.length - 1]?.props.src
                  : children[current - 1]?.props.src
              }
              alt="modal image"
              width={900}
              height={900}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              className="image"
            />
          </div>
          <div className="closeIcon">
            <AiOutlineClose
              fill="white"
              size={16}
              onClick={() => {
                setFullScreenVisible(false)
              }}
              cursor="pointer"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
