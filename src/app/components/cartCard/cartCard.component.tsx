import React, {useCallback, useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {AiOutlineClose, AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai'
import {HStack, InputField, VStack} from 'src/app/common'
import {
  delteProductFromCartAction,
  getCartlistAction,
  updatedCartByProductIdAction
} from 'src/app/pages/web/cart/cart.slice'
import {BASE_URL, FILE_URL} from 'src/config'
import {getCookie} from 'src/helpers'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import {useDispatch} from 'src/store'
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'


interface CartProduct {
  _id: string
  productId: {
    id: string
    discountedPrice: number
    stockQuantity?: number
    images?: Array<{
      colorName?: string
    }>
    colorName?: string
  }
  quantity: number
  price: number
  colorName?: string
}

export const CartCard = ({
  data,
  onChangePrice
}: {
  data: any
  onChangePrice: (e: any, data: any) => void
}) => {
  const [quantity, setQuantity] = useState(1)
  const dispatch = useDispatch()
  const userId = getCookie('userId')


  console.log(data,"data value in cart card")



  const handleQuantityChange = useCallback(
    (newQuantity: number, product: CartProduct) => {

      console.log(product,"product value final")
      if (!userId) return
      
      // Validate quantity
      if (newQuantity < 1) {
        toast.error('Quantity must be at least 1')
        return
      }

      // Check stock quantity
      const stockQuantity = product.productId?.stockQuantity || 0
      if (newQuantity > stockQuantity) {
        toast.error(`Only ${stockQuantity} items available in stock`)
        return
      }

      // FIXED: Calculate price correctly using unit price
      const unitPrice = product.productId?.discountedPrice || 0
      const updatedPrice = Number(unitPrice * newQuantity)

      console.log(`Updating product ${product._id}: Unit Price ${unitPrice} × New Quantity ${newQuantity} = ${updatedPrice}`,product)

      // Optimistic update
      // setCartProducts(prev =>
      //   prev.map(item =>
      //     item._id === product._id 
      //       ? { ...item, quantity: newQuantity, price: updatedPrice } 
      //       : item
      //   )
      // )

      dispatch(
        updatedCartByProductIdAction({
          data: {
            userId,
            productId: data?.id,
            quantity: newQuantity,
            price: updatedPrice
          },
          onSuccess: () => {
            toast.success('Product updated successfully')
            dispatch(getCartlistAction({ userId }))
          },
          // onFailure: () => {
          //   // Revert optimistic update on failure
          //   // setCartProducts(datas?.cartData?.[0]?.products ?? [])
          //   toast.error('Failed to update product')
          // }
        })
      )
    },
    [dispatch, userId, data?.cartData?.[0]?.products]
  )

  const deleteProductFromCart = () => {
    console.log('delete product called',data?._id)
    dispatch(
      delteProductFromCartAction({
        userId: userId,
        productId: data?._id,
        onSuccess: () => {
          dispatch(getCartlistAction({userId: userId}))
          toast.success('Product Deleted from cart Successfully')
        }
      })
    )
  }

  console.log(data, 'cart data value')

  useEffect(() => {
    setQuantity(data?.quantity)
  }, [data])

  return (
    <div className="cartCard-container">
      <div className="cartCard">
        <HStack className="cartCard-left" gap="$3">
          <HStack className="cartCard-left-image">
            <OptimizedImage
              src={`${FILE_URL}/products/${data?.productId?.images[0]?.coloredImage}`}
              alt={data?.productId?.name || 'Cart product image'}
              width={86}
              height={86}
              style={{ width: '86px', height: '86px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </HStack>
          <VStack className="cartCard-left-detail">
            <p className="cartCard-left-detail-name">{data?.productId?.name}</p>
            <p className="cartCard-left-detail-color">
              <span>Color:</span>Red,White
            </p>
          </VStack>
        </HStack>
        <HStack className="cartCard-right" justify="space-between">
          <HStack className="cartCard-right-price" align="center" gap="$4">
            <p className="eachItemPrice">
              {getNprPrice(data?.productId?.discountedPrice)}
            </p>
          </HStack>
          <HStack className="cartCard-right-quantity" align="center" gap="$3">
            {/* <p>Quantity:</p> */}
            <div
              style={{cursor: 'pointer', fontWeight: 'bold'}}
              onClick={() => {
                const stockQuantity = data?.productId?.stockQuantity || 0
                if (Number(quantity) + 1 > stockQuantity) {
                  toast.error(`Only ${stockQuantity} items available in stock`)
                  return
                }
                setQuantity((prev) => Number(prev) + 1)
                onChangePrice(quantity + 1, data)
              }}
            >
              <AiOutlinePlus />
            </div>
            <InputField
              // style={{width: '40%'}}
              type="number"
              onChange={(e: any) => {
                console.log(e.target.value, 'value changes hai')
                setQuantity(e.target.value)
                onChangePrice(e.target.value, data)
              }}
              placeholder="item quantity"
              value={quantity}
            ></InputField>
            <div
              style={{cursor: 'pointer', fontWeight: 'bold'}}
              onClick={() => {
                setQuantity((prev) => Number(prev - 1))
                onChangePrice(quantity - 1, data)
              }}
            >
              <AiOutlineMinus />
            </div>
          </HStack>
          <HStack align="center" className="totalltemPrice">
            {getNprPrice(Number(data?.productId?.discountedPrice) * quantity)}
          </HStack>

          <HStack className="cartCard-right-cancel" align="center" gap="$3">
            <AiOutlineClose
              size={20}
              onClick={deleteProductFromCart}
            ></AiOutlineClose>
          </HStack>
        </HStack>
      </div>
    </div>
  )
}
