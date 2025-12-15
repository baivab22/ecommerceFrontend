import React, {useEffect, useState} from 'react'
import {FaCartArrowDown} from 'react-icons/fa'
import {Chip, HStack, VStack} from 'src/app/common'
import ReactStarsRating from 'react-awesome-stars-rating'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'src/store'
import {createCartByUserId} from 'src/app/pages/web/cart/cart.service'
import {createCartByUserIdAction} from 'src/app/pages/web/cart/cart.slice'
import {getCookie} from 'src/helpers'
import toast from 'react-hot-toast'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import {FiEye, FiShoppingCart} from 'react-icons/fi'
import {FILE_URL} from 'src/config'
import { fetchHolidayModeAction, selectHolidayMode } from 'src/app/pages/holidayMode/holidayMode.slice'

export const ProductCard = ({data}: {data: any}) => {
  const [activeImage, setActiveImage] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [productImages, setProductImages] = useState([])


  console.log(data,"data aray")




  useEffect(() => {
    const ProductImages = data?.images?.map((item: any) => item.coloredImage)
    setProductImages(ProductImages)
  }, [data])

  const discountPercentage = data?.originalPrice 
    ? Math.round(((data.originalPrice - data.discountedPrice) / data.originalPrice) * 100)
    : 0

  return (
    <div
      className="productCard-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() =>{
        
        console.log("product clicked")
        navigate(`/products/view/${data?.id}`)
      }}
    >
      <VStack className="productCard" gap="$3">
        <div className="productCard-image-wrapper">
          <div className="productCard-image">
            <img
              src={
                productImages.length > 0
                  ?
                  
                  `http://localhost:8000/uploads/products/${productImages?.[0]}` : '/assets/images/defaultProduct.jpeg'  }

                        alt={data?.name}
            
          
            />
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="productCard-discount-badge">
                -{discountPercentage}%
              </div>
            )}

            {/* Stock Indicator */}
            { data?.stockQuantity > 0 && (
              <div className="productCard-stock-badge low-stock">
                Only {data?.stockQuantity} left
              </div>
            )}
            
            {data?.stockQuantity === 0 && (
              <div className="productCard-stock-badge out-of-stock">
                Out of Stock
              </div>
            )}

            {/* Quick Actions Overlay */}
            <div className={`productCard-overlay ${isHovered ? 'active' : ''}`}>
              <button 
                className="productCard-action-btn primary"
                onClick={(e) => {
                  // e.stopPropagation()
           
                }}
              >
                <FiEye size={20} />
                <span>Quick View</span>
              </button>
            </div>
          </div>
        </div>

        <VStack className="productCard-content" gap="$2">
          <HStack justify="space-between" align="center" style={{width: '100%'}}>
            <Chip
              title={data?.subCategory?.name}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600'
              }}
              color="rgba(99, 102, 241, 0.1)"
            />
          </HStack>

          <div className="productCard-title-wrapper">
            <h3 className="productCard-title">{data?.name}</h3>
          </div>

          {/* <div className="productCard-rating">
            <ReactStarsRating
              size={14}
              value={4.5}
              primaryColor="hsl(29, 90%, 65%)"
              isEdit={false}
            />
            <span className="productCard-review-count">(125)</span>
          </div> */}

          <HStack align="center" gap="$2" className="productCard-price-wrapper">
            <div className="productCard-price-current">
              {getNprPrice(data?.discountedPrice)}
            </div>
            {data?.originalPrice > data?.discountedPrice && (
              <div className="productCard-price-original">
                {getNprPrice(data?.originalPrice)}
              </div>
            )}
          </HStack>
        </VStack>

        {/* <div 
          className="productCard-footer"

        >
          <span>View Details</span>
          <FiEye size={16} />
        </div> */}
      </VStack>
    </div>
  )
}