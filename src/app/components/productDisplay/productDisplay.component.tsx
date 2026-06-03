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
import { useRouter } from 'next/router'
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'
import './_productDisplay.scss'

const ProductDisplay = ({product}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const availableStock = product?.stockQuantity ?? 0
  const isOutOfStock = availableStock <= 0

  useEffect(() => {
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
    if (isOutOfStock) return
    setQuantity(prev => {
      if (availableStock && prev >= availableStock) {
        toast.error(`Only ${availableStock} in stock`)
        return prev
      }
      return prev + 1
    })
  }

  const displayProduct = product 

  const [productImages, setProductImages] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    const ProductImages = product?.images?.map((item: any, index: number) => {
      return item.coloredImage
    })
    setProductImages(ProductImages)
  }, [product])

  const datas = useSelector((state: any) => state.cart)
  const router = useRouter();

  const handleAddToCart = (data: any) => {
    if (!data?.stockQuantity || data.stockQuantity <= 0) {
      toast.error('Product is out of stock')
      return
    }

    const userId = getCookie('userId')
    const roles = getCookie('userRoles')

    if (!!userId && !!roles) {
      const isAlreadyExistData = datas?.cartData?.[0]?.products?.find(
        item => item.productId?.id === data?.id
      );

      if (!!isAlreadyExistData) {
        const desiredQuantity = isAlreadyExistData.quantity + quantity
        if (desiredQuantity > data.stockQuantity) {
          toast.error(`Only ${data.stockQuantity} available`)
          return
        }
        dispatch(
          updatedCartByProductIdAction({
            data: {
              userId,
              productId: data.id,
              quantity: desiredQuantity,
              price: Number(isAlreadyExistData.price * desiredQuantity)
            },
            onSuccess: () => {
              toast.success('Product updated successfully')
              dispatch(getCartlistAction({ userId }))
            },
            onFailure: () => {
              toast.error('Failed to update product')
            }
          })
        )
      } else {
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
            },
            onFailure: (error: any) => {
              toast.error(String(error?.message || error || 'Failed to add product to cart'))
            }
          })
        )
      }
    } else {
      router.push('/login')
      toast.error('Please login first to add product')
    }
  }

  const handleLoggedOutAddItemToCart = () => {
    toast.error('Please login first to add products')
    router.push('/login')
  }

  const {auth} = useAuth()

  return (
    <div className="product-display">
      {/* Product Gallery */}
      <div className="product-gallery">
        <div className="product-image-main">
          {product?.images?.length > 0 ? (
            <OptimizedImage
              src={`${FILE_URL}/products/${productImages?.[selectedImage]}`}
              alt={product.name || 'Product image'}
              width={600}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div className="placeholder">No Image Available</div>
          )}
        </div>
        
        {product?.images?.length > 1 && (
          <div className="product-thumbnails">
            {productImages?.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <OptimizedImage 
                  src={`${FILE_URL}/products/${img}`} 
                  alt={`${product.name} view ${idx + 1}`}
                  width={100}
                  height={100}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="product-details">
        <h1 className="product-title">{product?.name}</h1>
        
        <div className="price-section">
          <div className="price-container">
            <span className="price-discounted">₹{product?.discountedPrice?.toLocaleString()}</span>
            <span className="price-original">₹{product?.originalPrice?.toLocaleString()}</span>
            {/* <span className="discount-badge">
              {product?.discountPercentage}% OFF
            </span> */}
          </div>
          {/* <p className="shipping-text">Free shipping on orders above ₹999</p> */}
        </div>

        <div className="category-breadcrumb">
          <span className="category">{product?.category?.name}</span>
          <span className="separator">›</span>
          <span className="subcategory">{product?.subCategory?.name}</span>
        </div>

        <div className="stock-status">
          <div className={`stock-indicator ${isOutOfStock ? 'out' : 'in'}`}>
            {isOutOfStock ? 'Out of Stock' : `In Stock: ${availableStock} units`}
          </div>
        </div>

        <div className="quantity-section">
          <label>Quantity:</label>
          <div className="quantity-container">
            <button onClick={decreaseQuantity} className="quantity-button" disabled={quantity <= 1 || isOutOfStock}>
              −
            </button>
            <div className="quantity-display">{quantity}</div>
            <button onClick={increaseQuantity} className="quantity-button" disabled={isOutOfStock}>
              +
            </button>
          </div>
        </div>

        <button
          className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''}`}
          disabled={isOutOfStock}
          onClick={() => {
            !!auth.isLoggedin
              ? handleAddToCart(product)
              : handleLoggedOutAddItemToCart()
          }}
        >
          {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
          {!isOutOfStock && <span className="cart-icon">🛒</span>}
        </button>

        {product?.features && product.features.length > 0 && (
          <div className="features-section">
            <h3>Product Features</h3>
            <ul className="features-list">
              {product.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDisplay