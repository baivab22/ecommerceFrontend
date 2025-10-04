import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'src/store'
import { getCookie } from 'src/helpers'
import { CartCard } from 'src/app/components'
import {
  createOrderByUserIdAction,
  
  deleteCartByIdAction,
  
  delteProductFromCartAction,
  getCartlistAction,
  updatedCartByProductIdAction
} from './cart.slice'

import { districtArray } from 'src/utils/districtArray'
import {
  Button,
  CheckBox,
  HStack,
  InputField,
  Label,
  SelectField,
  VStack
} from 'src/app/common'
import { getNprPrice } from 'src/helpers/nprPrice.helper'
import toast from 'react-hot-toast'
import { useMeasure, useMedia } from 'src/hooks'
import { TextArea } from 'src/app/common/textArea'
import { CONTACT_NUMBER } from 'src/config/constant.config'

// Types
interface Option {
  id: number | string
  label: string
  value: any
  [key: string]: any
}

interface CartProduct {
  _id: string
  productId: {
    id: string
    discountedPrice: number
  }
  quantity: number
  price: number
}

// Constants
const VALLEY_OPTIONS: Option[] = [
  {
    id: 'inside',
    label: 'Inside Kathmandu Valley',
    value: 'inside'
  },
  {
    id: 'outside',
    label: 'Outside Kathmandu Valley',
    value: 'outside'
  }
]

const DELIVERY_TYPE_OPTIONS: Option[] = [
  {
    id: 'home',
    label: 'Home Delivery',
    value: 'home'
  },
  {
    id: 'office',
    label: 'Office Delivery',
    value: 'office'
  }
]

const PAYMENT_METHODS = {
  PHONE_PAY: 'phonePay',
  CASH_ON_DELIVERY: 'cashOnDelivery'
} as const

export const CartPage = () => {
  const dispatch = useDispatch()
  const datas = useSelector((state: any) => state.cart)
  const media = useMedia()
  const userId = getCookie('userId')

  // Cart related state
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([])

  // Shipping & Location state
  const [selectedValleyOption, setSelectedValleyOption] = useState<Option | null>(null)
  const [selectedDistrictOption, setSelectedDistrictOption] = useState<Option | null>(null)
  const [selectedMunicipalityOption, setSelectedMunicipalityOption] = useState<Option | null>(null)
  const [selectedAreaOption, setSelectedAreaOption] = useState<Option | null>(null)
  const [selectedDeliveryTypeOption, setSelectedDeliveryTypeOption] = useState<Option | null>(null)

  // Form state
  const [shippingLocation, setShippingLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [orderNote, setOrderNote] = useState('')
  const [isShippingSame, setIsShippingSame] = useState(true)

  // Payment state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  // Computed values
  const isOutsideValley = selectedValleyOption?.value === 'outside'
  const isInsideValley = selectedValleyOption?.value === 'inside'
  const isPhonePaySelected = selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY
  const hasProducts = cartProducts.length > 0

  // Check if all required location fields are selected
  const isLocationComplete = !!(
    selectedValleyOption &&
    selectedDistrictOption &&
    selectedMunicipalityOption &&
    selectedAreaOption &&
    selectedDeliveryTypeOption
  )

  // QR Code display logic: Show QR if outside valley OR (inside valley AND phone pay)
  const shouldShowQR = isOutsideValley || (isInsideValley && isPhonePaySelected)

  // Memoized options
  const districtOptions = useMemo(
    () =>
      districtArray?.map((item, index) => ({
        id: index,
        label: item.district,
        value: item.district,
        districtData: item
      })) ?? [],
    []
  )

  const municipalityOptions = useMemo(() => {
    if (!selectedDistrictOption?.districtData) return []

    return (
      selectedDistrictOption.districtData.municipalities?.map((item, index) => ({
        id: index,
        label: item.name,
        value: item.name,
        municipalityData: item
      })) ?? []
    )
  }, [selectedDistrictOption])

  const areaOptions = useMemo(() => {
    if (!selectedMunicipalityOption?.municipalityData?.areas) return []

    return Object.keys(selectedMunicipalityOption.municipalityData.areas).map((key, index) => ({
      id: index,
      label: key.replace(/_/g, ' '),
      value: key,
      areaData: selectedMunicipalityOption.municipalityData.areas[key]
    }))
  }, [selectedMunicipalityOption])

  // FIXED: Correct subtotal calculation using actual unit price * quantity
  const subtotal = useMemo(() => {
    return cartProducts.reduce((acc, item) => {
      // Use unit price * quantity instead of the stored total price
      const unitPrice = item.productId?.discountedPrice || 0
      const quantity = item.quantity || 0
      const itemTotal = unitPrice * quantity
      
      console.log(`Product ${item._id}: Unit Price ${unitPrice} × Quantity ${quantity} = ${itemTotal}`)
      
      return acc + itemTotal
    }, 0)
  }, [cartProducts])

  // Shipping price calculation - only return actual price when location is complete
  const shippingPrice = useMemo(() => {
    // Return 0 if location is not complete
    if (!isLocationComplete) {
      return 0
    }

    // If no area data or delivery type, return 0 (no default charge)
    if (!selectedAreaOption?.areaData || !selectedDeliveryTypeOption) {
      return 0
    }

    const deliveryType = selectedDeliveryTypeOption.value === 'home' ? 'homeDelivery' : 'officeDelivery'
    return selectedAreaOption.areaData[deliveryType] || 0
  }, [selectedAreaOption, selectedDeliveryTypeOption, isLocationComplete])

  const total = subtotal + shippingPrice

  // Effects
  useEffect(() => {
    if (userId) {
      dispatch(getCartlistAction({ userId }))
    }
  }, [dispatch, userId])

  useEffect(() => {
    setCartProducts(datas?.cartData?.[0]?.products ?? [])
  }, [datas?.cartData?.[0]?.products])

  // Clear dependent selections when parent changes
  useEffect(() => {
    setSelectedMunicipalityOption(null)
    setSelectedAreaOption(null)
  }, [selectedDistrictOption])

  useEffect(() => {
    setSelectedAreaOption(null)
  }, [selectedMunicipalityOption])

  // FIXED: Corrected quantity change handler
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
      setCartProducts(prev =>
        prev.map(item =>
          item._id === product._id 
            ? { ...item, quantity: newQuantity, price: updatedPrice } 
            : item
        )
      )

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
          onFailure: () => {
            // Revert optimistic update on failure
            setCartProducts(datas?.cartData?.[0]?.products ?? [])
            toast.error('Failed to update product')
          }
        })
      )
    },
    [dispatch, userId, datas?.cartData?.[0]?.products]
  )

  const handleValleyChange = useCallback((option: Option) => {
    setSelectedValleyOption(option)
    // Clear all location selections when valley type changes
    setSelectedDistrictOption(null)
    setSelectedMunicipalityOption(null)
    setSelectedAreaOption(null)
  }, [])

  // Updated payment method change handler for radio button behavior
  const handlePaymentMethodChange = useCallback((method: string) => {
    console.log('Payment method changed:', method)
    setSelectedPaymentMethod(method)
  }, [])

  const generateOrderId = useCallback(() => {
    const timestamp = Date.now()
    const randomPart = Math.floor(Math.random() * 1000000)
    return `ORD-${timestamp}-${randomPart}`
  }, [])

  const validateForm = useCallback(() => {
    const errors: string[] = []

    if (!hasProducts) errors.push('No products in cart')
    if (!selectedValleyOption) errors.push('Please select location type')
    if (!selectedDistrictOption) errors.push('Please select district')
    if (!selectedMunicipalityOption) errors.push('Please select municipality')
    if (!selectedAreaOption) errors.push('Please select area')
    if (!selectedDeliveryTypeOption) errors.push('Please select delivery type')
    if (!shippingLocation.trim()) errors.push('Please enter shipping address')
    
    // Validate phone number
    if (!phoneNumber.trim()) {
      errors.push('Please enter phone number')
    } else if (!/^[0-9+\-\s()]+$/.test(phoneNumber.trim())) {
      errors.push('Please enter a valid phone number')
    }
    
    if (!selectedPaymentMethod) errors.push('Please select payment method')

    return errors
  }, [
    hasProducts,
    selectedValleyOption,
    selectedDistrictOption,
    selectedMunicipalityOption,
    selectedAreaOption,
    selectedDeliveryTypeOption,
    shippingLocation,
    phoneNumber,
    selectedPaymentMethod
  ])

  // FIXED: Corrected checkout handler with proper price calculations
  const handleCheckout = useCallback(() => {
    const validationErrors = validateForm()

    if (validationErrors.length > 0) {
      // Show only the first error to avoid spam
      toast.error(validationErrors[0])
      return
    }

    if (!userId) {
      toast.error('Please login to continue')
      return
    }

    const orderId = generateOrderId()
    const isPhonePay = selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY

    // FIXED: Calculate correct prices for products in order
    const orderProducts = cartProducts.map(item => {
      const unitPrice = item.productId?.discountedPrice || 0
      const quantity = item.quantity || 0
      const totalPriceForProduct = unitPrice * quantity


      
      
      console.log(`Order Product ${item.productId.id}: Unit ${unitPrice} × Qty ${quantity} = ${totalPriceForProduct}`)
      
      return {
        productId: item.productId.id,
        quantity: quantity,
        price: totalPriceForProduct // This should be total price for this product (unit * quantity)
      }
    })

    console.log('Order Products:', orderProducts)
    console.log('Subtotal:', subtotal)
    console.log('Shipping:', shippingPrice)
    console.log('Total:', total)

    console.log(cartProducts, "cartProducts to be deleted outside")

    dispatch(
      createOrderByUserIdAction({
        userId,
        data: {
          userId,
          products: orderProducts,
          isInsideValley: JSON.stringify(!isOutsideValley),
          OrderedAt: new Date().toLocaleString(),
          productOrderId: orderId,
          shippingLocation: `${selectedDistrictOption?.value}, ${selectedMunicipalityOption?.value}, ${selectedAreaOption?.value}, ${shippingLocation}`,
          paymentMethod: selectedPaymentMethod,
          deliveryType: selectedDeliveryTypeOption?.value,
          phoneNumber: phoneNumber.trim(),
          orderNote: orderNote.trim(),
          shippingPrice: shippingPrice,
          totalAmount: total
        },
        onSuccess: (response) => {
          // Get the order ID from backend response
          const backendOrderId = response?.data?.orderId || response?.orderId || orderId
          
          // Show success message with order ID
          toast.success(
            <div style={{ lineHeight: '1.6' }}>
              <strong>Order placed successfully with orderId </strong>
              <br />
              <span style={{ fontSize: '14px' }}>Order ID: {backendOrderId}</span>
              <br />
              <span style={{ fontSize: '13px', color: '#666' }}>Please contact us for further information</span>
            </div>,
            { duration: 30000 }
          )

          // Clear cart items
          const clearCartItems = async () => {
            dispatch(deleteCartByIdAction({
              cartId: userId,
              onSuccess: () => {
                // Refresh cart after deletion
                dispatch(getCartlistAction({ userId }))
              },
            }))
          }

          clearCartItems()

          // Reset form
          resetForm()

          // Open WhatsApp if phone payment is selected
          if (isPhonePay) {
            setTimeout(() => openWhatsApp(backendOrderId), 1500) // Delay to show success message
          }
        },
        onFailure: error => {
          console.error('Order failed:', error)
          toast.error('Failed to place order. Please try again.')
        }
      })
    )
  }, [
    validateForm,
    userId,
    generateOrderId,
    dispatch,
    cartProducts,
    isOutsideValley,
    selectedDistrictOption,
    selectedMunicipalityOption,
    selectedAreaOption,
    selectedPaymentMethod,
    selectedDeliveryTypeOption,
    phoneNumber,
    orderNote,
    shippingPrice,
    shippingLocation,
    total,
    subtotal
  ])

  const resetForm = useCallback(() => {
    setSelectedValleyOption(null)
    setSelectedDistrictOption(null)
    setSelectedMunicipalityOption(null)
    setSelectedAreaOption(null)
    setSelectedDeliveryTypeOption(null)
    setShippingLocation('')
    setPhoneNumber('')
    setOrderNote('')
    setSelectedPaymentMethod(null)
    setIsShippingSame(true)
  }, [])

  const openWhatsApp = useCallback((orderId: string) => {
    const message = `नमस्ते, मैले यो अर्डर ID को लागि भुक्तानीको फोटो (screenshot) जोडेको छु: ${orderId}।\n\nकृपया मेरो अर्डरको स्टाटस जानकारी दिनुहोस्।`
    const whatsappUrl = `https://wa.me/9779867072373?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }, [])

  // Render QR Code Component
  const QRCodeSection = () => (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Scan QR Code to Pay</p>
      <p style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
        {isOutsideValley
          ? 'Payment required for outside valley delivery'
          : 'Complete payment for your order'}
      </p>
      <img
        src="src/assets/images/qrbanksample.jpg"
        alt="QR Code for Payment"
        className="qrImage"
        style={{
          maxWidth: '200px',
          height: 'auto',
          marginBottom: '10px',
          display: 'block',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
        onError={(e) => {
          console.error('QR Code image failed to load')
          e.currentTarget.style.display = 'none'
        }}
      />
      <p style={{ fontSize: '12px', color: '#888' }}>
        After payment, please send screenshot to WhatsApp for order confirmation.
      </p>
    </div>
  )

  if (!hasProducts) {
    return (
      <div className="cartPage" style={{ width: '100%'}}>
        <VStack gap="$3" align="center" justify="center" style={{ minHeight: '400px',width:'100%' }}>
          <img
            className="noProductOnCart"
            src="src/assets/images/noCart.png"
            alt="Empty cart"
            style={{ maxWidth: '300px', opacity: 0.7 }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <p style={{ fontSize: '18px', color: '#666', textAlign: 'center' }}>Your cart is empty</p>
          <p style={{ fontSize: '14px', color: '#888', textAlign: 'center' }}>
            Add some products to get started!
          </p>
        </VStack>
      </div>
    )
  }

  console.log(selectedPaymentMethod, "selectedPaymentMethod ")
  console.log('Current subtotal calculation:', subtotal)
  console.log('Cart products for debugging:', cartProducts.map(item => ({
    id: item._id,
    unitPrice: item.productId?.discountedPrice,
    quantity: item.quantity,
    storedPrice: item.price,
    calculatedPrice: (item.productId?.discountedPrice || 0) * (item.quantity || 0)
  })))

  return (
    <div className="cartPage">
      {/* Products Section */}
      <VStack gap="$3" style={{ width: media.md ? '55%' : '100%' }}>
        {cartProducts.map((item, index) => (
          <CartCard key={`${item._id}-${index}`} data={item} onChangePrice={handleQuantityChange} />
        ))}
      </VStack>

      {/* Order Summary Section */}
      <VStack style={{ width: media.md ? '40%' : '100%' }} gap="$3">
        <VStack className="cartPage-orderSummary" gap="$5">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="cartPage-orderSummary-title">Order Summary</p>
            <p className="cartPage-orderSummary-itemCount">
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Subtotal */}
          <HStack style={{ width: '100%' }} justify="space-between" align="center">
            <p>Subtotal</p>
            <p>{getNprPrice(subtotal)}</p>
          </HStack>

          {/* Valley Selection */}
          <VStack style={{ width: '100%' }} gap="$2">
            <Label>Location Type *</Label>
            <SelectField
              options={VALLEY_OPTIONS}
              width="100%"
              onChangeValue={handleValleyChange}
              placeholder="Select location type"
              containerStyle={{ width: '100%' }}
              value={selectedValleyOption}
            />
          </VStack>

          {/* Location Selection */}
          <HStack justify="space-between" align="flex-start" style={{ width: '100%', gap: '12px' }}>
            <VStack style={{ flex: 1 }} gap="$2">
              <Label>District *</Label>
              <SelectField
                options={districtOptions}
                width="100%"
                onChangeValue={setSelectedDistrictOption}
                placeholder="Select District"
                containerStyle={{ width: '100%' }}
                value={selectedDistrictOption}
              />
            </VStack>

            <VStack style={{ flex: 1 }} gap="$2">
              <Label>Municipality *</Label>
              <SelectField
                options={municipalityOptions}
                key={`municipality-${selectedDistrictOption?.id || 'none'}`}
                width="100%"
                onChangeValue={setSelectedMunicipalityOption}
                placeholder="Select Municipality"
                containerStyle={{ width: '100%' }}
                value={selectedMunicipalityOption}
                isDisabled={!selectedDistrictOption}
              />
            </VStack>
          </HStack>

          <HStack justify="space-between" align="flex-start" style={{ width: '100%', gap: '12px' }}>
            <VStack style={{ flex: 1 }} gap="$2">
              <Label>Area *</Label>
              <SelectField
                options={areaOptions}
                key={`area-${selectedMunicipalityOption?.id || 'none'}`}
                width="100%"
                onChangeValue={setSelectedAreaOption}
                placeholder="Select Area"
                containerStyle={{ width: '100%' }}
                value={selectedAreaOption}
                isDisabled={!selectedMunicipalityOption}
              />
            </VStack>

            <VStack style={{ flex: 1 }} gap="$2">
              <Label>Delivery Type *</Label>
              <SelectField
                options={DELIVERY_TYPE_OPTIONS}
                width="100%"
                onChangeValue={setSelectedDeliveryTypeOption}
                placeholder="Delivery Type"
                containerStyle={{ width: '100%' }}
                value={selectedDeliveryTypeOption}
              />
            </VStack>
          </HStack>

          {/* Shipping Details */}
          <VStack style={{ width: '100%' }} gap="$2">
            <Label>Shipping Details *</Label>
            <HStack gap="$2" style={{ width: '100%' }}>
              <InputField
                onChange={e => setShippingLocation(e.target.value)}
                placeholder="Full address *"
                value={shippingLocation}
                style={{ flex: 1 }}
              />
              <InputField
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="Phone number *"
                value={phoneNumber}
                style={{ flex: 1 }}
                type="tel"
              />
            </HStack>
          </VStack>

          {/* Shipping Cost - Only show when location is complete and shipping price > 0 */}
          {isLocationComplete && shippingPrice > 0 && (
            <HStack style={{ width: '100%' }} justify="space-between" align="center">
              <p>Shipping Cost</p>
              <p>{getNprPrice(shippingPrice)}</p>
            </HStack>
          )}

          {/* Show "Free Shipping" message when location is complete but shipping is free */}
          {isLocationComplete && shippingPrice === 0 && (
            <HStack style={{ width: '100%' }} justify="space-between" align="center">
              <p>Shipping Cost</p>
              <p style={{ color: '#28a745', fontWeight: 'bold' }}>Free</p>
            </HStack>
          )}

          {/* Shipping Address Checkbox */}
          <CheckBox
            value="shipping-same"
            label="Shipping address same as billing address"
            name="shipping-same"
            check={isShippingSame}
            handleCheckboxChange={setIsShippingSame}
          />

          {/* Total */}
          <HStack
            style={{ width: '100%', fontWeight: 'bold', fontSize: '18px' }}
            justify="space-between"
            align="center"
          >
            <p>Total</p>
            <p>{getNprPrice(total)}</p>
          </HStack>

          {/* Order Note */}
          <VStack style={{ width: '100%' }} gap="$2">
            <Label>Order Note (Optional)</Label>
            <TextArea
              onChange={e => setOrderNote(e.target.value)}
              style={{ width: '100%', fontSize: '14px', minHeight: '80px' }}
              value={orderNote}
              placeholder="Any special instructions..."
            />
          </VStack>

          {/* Payment Methods - Native HTML Radio Buttons */}
          <VStack style={{ width: '100%' }} gap="$3">
            <Label>Payment Method *</Label>

            {/* Phone Pay Option */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                id="payment-phone-pay"
                name="payment-method"
                value={PAYMENT_METHODS.PHONE_PAY}
                checked={selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#007bff'
                }}
              />
              <label 
                htmlFor="payment-phone-pay" 
                style={{ 
                  fontSize: '16px', 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  color: '#333'
                }}
              >
                Phone Pay
              </label>
            </div>

            {/* Cash on Delivery Option */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                id="payment-cash-on-delivery"
                name="payment-method"
                value={PAYMENT_METHODS.CASH_ON_DELIVERY}
                checked={selectedPaymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#007bff'
                }}
              />
              <label 
                htmlFor="payment-cash-on-delivery" 
                style={{ 
                  fontSize: '16px', 
                  cursor: 'pointer', 
                  userSelect: 'none',
                  color: '#333'
                }}
              >
                Cash on Delivery
              </label>
            </div>

            {/* QR Code Display Logic */}
            {shouldShowQR && <QRCodeSection />}
          </VStack>
        </VStack>

        {/* Checkout Button */}
        <div
          className="cartPage-checkout"
          onClick={handleCheckout}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: hasProducts ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: hasProducts ? 'pointer' : 'not-allowed',
            opacity: hasProducts ? 1 : 0.6,
            textAlign: 'center',
          }}
        >
          Place Order
        </div>

        {/* Contact Info */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Need help? For order details{' '}
          <a href={`tel:${CONTACT_NUMBER}`} style={{ color: '#007bff', textDecoration: 'none' }}>
            Call us: {CONTACT_NUMBER}
          </a>
        </p>
      </VStack>
    </div>
  )
}