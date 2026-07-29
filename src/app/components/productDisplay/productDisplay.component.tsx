import React, {useEffect, useState} from 'react'
import {
  createCartByUserIdAction,
  getCartlistAction,
  updatedCartByProductIdAction
} from 'src/app/pages/web/cart/cart.slice'
import {FILE_URL} from 'src/config'
import {getCookie} from 'src/helpers'
import toast from 'react-hot-toast'
import {useDispatch, useSelector} from 'src/store'
import {useAuth} from 'src/app/routing'
import { useNavigate } from 'react-router-dom'
// import './ProductDisplay.scss'

const ProductDisplay = ({product}) => {
  const [quantity, setQuantity] = useState(1)

  const availableStock = product?.stockQuantity ?? 0
  const isOutOfStock = availableStock <= 0

  useEffect(() => {
    // Keep quantity within available stock and avoid showing 1 when out of stock
    if (isOutOfStock) {
      setQuantity(0)
      return
    }
    setQuantity(prev => (availableStock && prev > availableStock ? availableStock : Math.max(prev, 1)))
  }, [isOutOfStock, availableStock])

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    // Prevent selecting more than available stock
    if (isOutOfStock) return
    setQuantity(prev => {
      if (availableStock && prev >= availableStock) {
        toast.error(`Only ${availableStock} in stock`)
        return prev
      }
      return prev + 1
    })
  }

  // Default product data if none is provided
  const defaultProduct = {
    name: 'Abhushan Gallery Panchadhatu Gold Plated Red Muga Earring With Multi Zircon For Women',
    originalPrice: 1300,
    discountedPrice: 799,
    discountPercentage: 39,
    stockQuantity: 0,
    image: '/api/placeholder/400/400',
    variant: 'Gold',
    features: [
      'Beautiful Ring , Feels special',
      'wow design',
      'best quality',
      'trendy',
      'design to die for'
    ]
  }

  console.log(product, 'data values')

  // Use provided product data or default
  const displayProduct = product || defaultProduct

  const [productImages, setProductImages] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    const ProductImages = product?.images?.map((item: any, index: number) => {
      console.log(item.coloredImage, 'coloredimage')
      return item.coloredImage
    })

    setProductImages(ProductImages)
  }, [product])

   const datas = useSelector((state: any) => state.cart)
const navigate=useNavigate();


  const handleAddToCart = (data: any) => {
    if (!data?.stockQuantity || data.stockQuantity <= 0) {
      toast.error('Product is out of stock')
      return
    }

    const userId = getCookie('userId')

    const roles = getCookie('userRoles')





    if (!!userId && !!roles) {
    console.log(data,datas.cartData,!!userId && !!roles, 'user id and roles')
    console.log(Array.isArray(data?.cartData?.[0]?.products), data?.cartData?.[0]?.products,"kharab");

const isAlreadyExistData = datas?.cartData?.[0]?.products?.find(
    item => {
      console.log(item.productId?.id,data?.id,item,"comparing ids")
      
      return item.productId?.id === data?.id}
);

        console.log(isAlreadyExistData,!!isAlreadyExistData, 'isAlreadyExistData final hai')

if(!!isAlreadyExistData){
      const desiredQuantity = isAlreadyExistData.quantity + quantity
      if (desiredQuantity > data.stockQuantity) {
        toast.error(`Only ${data.stockQuantity} available`)
        return
      }
      dispatch(
        updatedCartByProductIdAction({
          data: {
            userId,
            productId:data.id,
            quantity: desiredQuantity,
            price:  Number(isAlreadyExistData.price * desiredQuantity)
          },
          onSuccess: () => {
            toast.success('Product updated successfully')
            dispatch(getCartlistAction({ userId }))
          },
          onFailure: () => {
            // setCartProducts(datas?.cartData?.[0]?.products ?? [])
            toast.error('Failed to update product')
          }
        })
      )

}else{
      const desiredQuantity = quantity
      if (desiredQuantity > data.stockQuantity) {
        toast.error(`Only ${data.stockQuantity} available`)
        return
      }

  const cartData = {
        userId,
        products: [
          {
            productId: data?.id,
            quantity: desiredQuantity,
            price: data?.discountedPrice
          }
        ]
      }

      dispatch(
        createCartByUserIdAction({
          userId: userId,
          data: cartData,
          onSuccess: () => {
            toast.success('Product added to cart Successfully!')
            const userId = getCookie('userId')
            userId && dispatch(getCartlistAction({userId: userId}))
          }
        })
      )
}

    
    } else {
      navigate('/login')
      toast.error('Please login first to add product')
    }
  }


    const handleLoggedOutAddItemToCart=()=>{
         toast.error('Please login first to add products')
    navigate('/login')
  }

  const {auth} = useAuth()
  return (
    <div className="product-display">
      {/* Product Image */}
      <div className="product-image">
        {product?.images?.length > 0 ? (
          <img
            src={`${FILE_URL}/products/${productImages?.[0]}`}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="placeholder">No Image Available</div>
        )}
      </div>

      {/* Product Details */}
      <div className="product-details">
        <h1 className="product-title" style={{fontSize: '18px'}}>
          {product?.name}
        </h1>
        <div className="price-container">
          <span className="price-original">₹{product?.originalPrice}</span>
          <span className="price-discounted">₹{product?.discountedPrice}</span>
          <span className="discount-badge">
            {product?.discountPercentage}% OFF
          </span>
        </div>
        <p className="shipping-text">Shipping is calculated at checkout</p>

        {/* Category and Subcategory */}
        <div className="category-info">
          <p>{product?.category?.name}</p>
          <p>{product?.subCategory?.name}</p>
        </div>

        <p className="stock-info-text">
          {isOutOfStock ? 'Out of stock' : `In stock: ${availableStock}`}
        </p>

        <div className="quantity-container">
          <button onClick={decreaseQuantity} className="quantity-button">
            −
          </button>
          <div className="quantity-display">{quantity}</div>
          <button onClick={increaseQuantity} className="quantity-button">
            +
          </button>
        </div>

        <button
          className="add-to-cart-button"
          disabled={isOutOfStock}
          onClick={() => {
            !!auth.isLoggedin
              ? handleAddToCart(product)
              :
           handleLoggedOutAddItemToCart()
          }}
        >
          {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  )
}

export default ProductDisplay
