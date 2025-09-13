import React, {useCallback, useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {AiOutlineClose, AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai'
import {HStack, InputField, VStack} from 'src/app/common'
import {
  delteProductFromCartAction,
  getCartlistAction,
  updatedCartByProductIdAction
} from 'src/app/pages/web/cart/cart.slice'
import {FILE_URL} from 'src/config'
import {getCookie} from 'src/helpers'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import {useDispatch} from 'src/store'


interface CartProduct {
  _id: string
  productId: {
    id: string
    discountedPrice: number
  }
  quantity: number
  price: number
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



  const handleQuantityChange = useCallback(
    (newQuantity: number, product: CartProduct) => {
      if (!userId) return
      
      // Validate quantity
      if (newQuantity < 1) {
        toast.error('Quantity must be at least 1')
        return
      }

      // FIXED: Calculate price correctly using unit price
      const unitPrice = product.productId?.discountedPrice || 0
      const updatedPrice = Number(unitPrice * newQuantity)

      console.log(`Updating product ${product._id}: Unit Price ${unitPrice} × New Quantity ${newQuantity} = ${updatedPrice}`)

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
            productId: product.productId.id,
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
    console.log('delete product called')
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
            <img
              src={`${FILE_URL}/products/${data?.productId?.images[0]?.coloredImage}`}
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
