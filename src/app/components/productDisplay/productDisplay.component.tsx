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

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Default product data if none is provided
  const defaultProduct = {
    name: 'Abhushan Gallery Panchadhatu Gold Plated Red Muga Earring With Multi Zircon For Women',
    originalPrice: 1300,
    discountedPrice: 799,
    discountPercentage: 39,
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
      dispatch(
        updatedCartByProductIdAction({
          data: {
            userId,
            productId:data.id,
            quantity: isAlreadyExistData.quantity+quantity,
            price:  Number(isAlreadyExistData.price * (isAlreadyExistData.quantity+quantity))
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
  const cartData = {
        userId,
        products: [
          {
            productId: data?.id,
            quantity: quantity,
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
            src={`https://abhushangallery.com/products/${productImages?.[0]}`}
            alt={product.name}
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
          onClick={() => {
            !!auth.isLoggedin
              ? handleAddToCart(product)
              :
           handleLoggedOutAddItemToCart()
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default ProductDisplay
