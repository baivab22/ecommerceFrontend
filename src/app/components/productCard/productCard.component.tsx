import React, {useEffect, useState} from 'react'
import {FaCartArrowDown} from 'react-icons/fa'
import {Chip, HStack, VStack} from 'src/app/common'
import ReactStarsRating from 'react-awesome-stars-rating'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'src/store'
import {createCartByUserId} from 'src/app/pages/web/cart/cart.service'
import {createCartByUserIdAction} from 'src/app/pages/web/cart/cart.slice'
import {getCookie} from 'src/helpers'
import toast from 'react-hot-toast'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import {FiEye} from 'react-icons/fi'
import {FILE_URL} from 'src/config'

const productImages = [
  // 'src/assets/images/products/jewellery-1.jpg',
  // 'src/assets/images/products/jewellery-2.jpg',
  // 'src/assets/images/products/jewellery-3.jpg',
  // 'src/assets/images/products/perfume.jpg'
]

export const ProductCard = ({data}: {data: any}) => {
  const [activeImage, setActiveImage] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [productImages, setProductImages] = useState([])

  console.log(productImages?.[0], data, 'product images value')

  useEffect(() => {
    const ProductImages = data?.images?.map((item: any, index: number) => {
      console.log(item.coloredImage, 'coloredimage')
      return item.coloredImage
    })

    setProductImages(ProductImages)
  }, [data])

  // const ProductImages = data?.images?.map((item: any, index: number) => {
  //   console.log(item.coloredImage[0], 'coloredimage')
  //   return item.coloredImage[0]
  // })

  return (
    <div
      className="productCard-container"
      onClick={() => navigate(`/product/view/${data?.id}`)}
      onMouseOver={() => setActiveImage(1)}
      onMouseLeave={() => setActiveImage(0)}
    >
      <VStack className="productCard" gap="$3">
        <div className="productCard-image">
          {/* <img src={productImages[activeImage]}></img> */}
          {/* <img src="http://localhost:8000/1705164295377-htmlimage.jpg"></img> */}

          <img
            src={
              productImages.length > 0
                ? `${FILE_URL}/products/${productImages?.[0]}`
                : '/assets/images/defaultProduct.jpeg'
            }
          />
        </div>

        <HStack className="productCard-tags" gap="$2">
          <HStack align="center" gap="$2">
            {/* <p className="">Best Selling</p> */}
            {/* <Chip
              title="Best Selling"
              color="rgb(241 233 214)"
              icon={<FaCartArrowDown size={12} fill="black" />}

              // style={{color: 'black'}}
            ></Chip> */}
            {/* <Chip
              title="New Arrivals"
              color="rgb(219 247 241)"
              icon={<FaCartArrowDown size={12} fill="black" />}

              // style={{color: 'black'}}
            ></Chip> */}
          </HStack>
        </HStack>

        <VStack className="productCard-titleDescription" gap="$2">
          <HStack justify="space-between" style={{width: '100%'}}>
            <Chip
              title={data?.category?.name}
              style={{padding: '4px 6px'}}
              // color="rgb(241 233 214)"
              color="rgb(219 247 241)"
              // style={{width: 'max-content'}}

              // icon={<FaCartArrowDown size={12} fill="black" />}

              // style={{color: 'black'}}
            ></Chip>

            <Chip
              title={data?.stockQuantity}
              style={{padding: '4px 6px'}}
              // color="rgb(241 233 214)"
              color="rgb(219 247 241)"
              // style={{width: 'max-content'}}

              // icon={<FaCartArrowDown size={12} fill="black" />}

              // style={{color: 'black'}}
            ></Chip>
          </HStack>

          <HStack justify="space-between">
            <p className="productCard-titleDescription-title">{data?.name}</p>
          </HStack>
          <div>
            {/* <ReactStarsRating
              size={15}
              value={3}
              primaryColor="hsl(29, 90%, 65%)"
              isEdit={false}

              // secondaryColor="blue"
            /> */}
          </div>
          <HStack align="center" gap="$3">
            <div className="productCard-titleDescription-price">
              {getNprPrice(data?.discountedPrice)}
            </div>
            <div
              style={{color: 'hsl(0, 0%, 47%)', textDecoration: 'line-through'}}
            >
              {getNprPrice(data?.originalPrice)}
            </div>
          </HStack>

          {/* <p
            className="productCard-titleDescription-description"
            // dangerouslySetInnerHTML={data?.description

            dangerouslySetInnerHTML={{
              __html: data?.description
            }}
          ></p> */}
        </VStack>

        <HStack
          className="productCard-footer"
          justify="center"
          align="center"
          gap="$3"
        >
          <div>
            <FiEye size={20} />
          </div>
          <div className="productCard-footer-right">View Details</div>
        </HStack>
      </VStack>
    </div>
  )
}
