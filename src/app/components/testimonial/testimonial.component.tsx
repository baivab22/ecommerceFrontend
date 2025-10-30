import React, {useState} from 'react'
import {FaChevronLeft, FaChevronRight, FaQuoteRight} from 'react-icons/fa'
import {Text, Title} from 'src/app/common'
import {FILE_URL} from 'src/config'

// Testimonial Skeleton Component
const TestimonialSkeleton = () => {
  const skeletonStyle: React.CSSProperties = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }

  const headerSkeletonStyle: React.CSSProperties = {
    height: '32px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    width: '280px',
    margin: '0 auto 40px',
    ...skeletonStyle
  }

  const reviewContainerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px',
    textAlign: 'center'
  }

  const imgContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '150px',
    height: '150px',
    margin: '0 auto 24px'
  }

  const imgSkeletonStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '50%',
    ...skeletonStyle
  }

  const quoteIconStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    right: '-8px',
    width: '40px',
    height: '40px',
    backgroundColor: '#e5e7eb',
    borderRadius: '50%',
    ...skeletonStyle
  }

  const textLineStyle: React.CSSProperties = {
    height: '16px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    marginBottom: '12px',
    ...skeletonStyle
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '32px'
  }

  const buttonSkeletonStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    ...skeletonStyle
  }

  return (
    <>
      <div style={headerSkeletonStyle}></div>
      <article style={reviewContainerStyle}>
        <div style={imgContainerStyle}>
          <div style={imgSkeletonStyle}></div>
          <span style={quoteIconStyle}></span>
        </div>

        {/* Text lines skeleton */}
        <div style={{maxWidth: '500px', margin: '0 auto'}}>
          <div style={{...textLineStyle, width: '100%'}}></div>
          <div style={{...textLineStyle, width: '95%', margin: '0 auto 12px'}}></div>
          <div style={{...textLineStyle, width: '85%', margin: '0 auto 12px'}}></div>
          <div style={{...textLineStyle, width: '75%', margin: '0 auto 12px'}}></div>
        </div>

        {/* Button container skeleton */}
        <div style={buttonContainerStyle}>
          <div style={buttonSkeletonStyle}></div>
          <div style={buttonSkeletonStyle}></div>
        </div>
      </article>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </>
  )
}

export const TestimonailSection = ({reviews, loading}: {reviews: any[]; loading?: boolean}) => {
  const [index, setIndex] = useState(0)

  // Show skeleton while loading or no reviews
  if (loading || !reviews || reviews.length === 0) {
    return <TestimonialSkeleton />
  }

  const {description, image} = reviews[index]

  const checkNumber = (number) => {
    if (number > reviews.length - 1) {
      return 0
    } else if (number < 0) {
      return reviews.length - 1
    }
    return number
  }

  const nextPerson = () => {
    setIndex((index) => {
      let newIndex = index + 1
      return checkNumber(newIndex)
    })
  }

  const prevPerson = () => {
    setIndex((index) => {
      let newIndex = index - 1
      return checkNumber(newIndex)
    })
  }

  const randomPerson = () => {
    let randomNumber = Math.floor(Math.random() * reviews.length)
    if (randomNumber === index) {
      randomNumber = index + 1
    }
    setIndex(checkNumber(randomNumber))
  }

  return (
    <>
      <div className="jobsSectionContainer-header">WHAT OUR CUSTOMER SAYS</div>
      <article className="review">
        <div className="img-container">
          <img
            src={`https://abhushangallery.com/testimonial/${image?.[0]}`}
            className="person-img"
            alt="Customer testimonial"
          />
          <span className="quote-icon">
            <FaQuoteRight />
          </span>
        </div>
        <p className="info">{reviews[index].description}</p>
        <div className="button-container">
          <button className="prev-btn" onClick={prevPerson}>
            <FaChevronLeft />
          </button>
          <button className="next-btn" onClick={nextPerson}>
            <FaChevronRight />
          </button>
        </div>
      </article>
    </>
  )
}