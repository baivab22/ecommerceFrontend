import React, {useEffect, useState, useMemo, useCallback} from 'react'
import {useDispatch, useSelector} from 'src/store'
import {getCookie} from 'src/helpers'
import {CartCard} from 'src/app/components'
import {
  createOrderByUserIdAction,
  delteProductFromCartAction,
  getCartlistAction,
  updatedCartByProductIdAction
} from './cart.slice'

import {districtArray} from 'src/utils/districtArray'
import {
  Button,
  CheckBox,
  HStack,
  InputField,
  Label,
  SelectField,
  VStack
} from 'src/app/common'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import toast from 'react-hot-toast'
import {useMeasure, useMedia} from 'src/hooks'
import {TextArea} from 'src/app/common/textArea'
import {CONTACT_NUMBER} from 'src/config/constant.config'

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

const DEFAULT_SHIPPING_PRICE = 200

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
  const isHomeDelivery = selectedDeliveryTypeOption?.value === 'home'
  const hasProducts = cartProducts.length > 0
  const shouldShowQR = isOutsideValley || (isHomeDelivery && selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY)

  // Memoized options
  const districtOptions = useMemo(() => 
    districtArray?.map((item, index) => ({
      id: index,
      label: item.district,
      value: item.district,
      districtData: item
    })) ?? []
  , [])

  const municipalityOptions = useMemo(() => {
    if (!selectedDistrictOption?.districtData) return []
    
    return selectedDistrictOption.districtData.municipalities?.map((item, index) => ({
      id: index,
      label: item.name,
      value: item.name,
      municipalityData: item
    })) ?? []
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

  // Calculated values
  const subtotal = useMemo(() => {
    return cartProducts.reduce((acc, item) => acc + (item.price || 0), 0)
  }, [cartProducts])

  const shippingPrice = useMemo(() => {
    if (!selectedAreaOption?.areaData || !selectedDeliveryTypeOption) {
      return DEFAULT_SHIPPING_PRICE
    }

    const deliveryType = selectedDeliveryTypeOption.value === 'home' ? 'homeDelivery' : 'officeDelivery'
    return selectedAreaOption.areaData[deliveryType] || DEFAULT_SHIPPING_PRICE
  }, [selectedAreaOption, selectedDeliveryTypeOption])

  const total = subtotal + shippingPrice

  // Effects
  useEffect(() => {
    if (userId) {
      dispatch(getCartlistAction({userId}))
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

  // Handlers
  const handleQuantityChange = useCallback((newQuantity: number, product: CartProduct) => {
    if (!userId) return

    const updatedPrice = Number(product.productId.discountedPrice * newQuantity)
    
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
          dispatch(getCartlistAction({userId}))
        },
        onFailure: () => {
          // Revert optimistic update on failure
          setCartProducts(datas?.cartData?.[0]?.products ?? [])
          toast.error('Failed to update product')
        }
      })
    )
  }, [dispatch, userId, datas?.cartData?.[0]?.products])

  const handleValleyChange = useCallback((option: Option) => {
    setSelectedValleyOption(option)
    // Clear location selections when valley type changes
    setSelectedDistrictOption(null)
    setSelectedMunicipalityOption(null)
    setSelectedAreaOption(null)
  }, [])

  const handlePaymentMethodChange = useCallback((method: string, checked: boolean) => {
    if (checked) {
      setSelectedPaymentMethod(method)
    } else if (selectedPaymentMethod === method) {
      setSelectedPaymentMethod(null)
    }
  }, [selectedPaymentMethod])

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
    if (!phoneNumber.trim()) errors.push('Please enter phone number')
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

  const handleCheckout = useCallback(() => {
    const validationErrors = validateForm()
    
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      return
    }

    if (!userId) {
      toast.error('Please login to continue')
      return
    }

    const orderId = generateOrderId()

    dispatch(
      createOrderByUserIdAction({
        userId,
        data: {
          userId,
          products: cartProducts.map(item => ({
            productId: item.productId.id,
            quantity: item.quantity,
            price: Number(item.productId.discountedPrice * item.quantity)
          })),
          isInsideValley: JSON.stringify(!isOutsideValley),
          OrderedAt: new Date().toLocaleString(),
          productOrderId: orderId,
          shippingLocation: `${selectedDistrictOption?.value}, ${selectedMunicipalityOption?.value}, ${selectedAreaOption?.value}`,
          paymentMethod: selectedPaymentMethod,
          deliveryType: selectedDeliveryTypeOption?.value,
          phoneNumber: phoneNumber.trim(),
          orderNote: orderNote.trim()
        },
        onSuccess: () => {
          toast.success('Order placed successfully!')
          
          // Clear cart
          cartProducts.forEach(item => {
            dispatch(
              delteProductFromCartAction({
                userId,
                productId: item._id,
                onSuccess: () => {
                  dispatch(getCartlistAction({userId}))
                }
              })
            )
          })

          // Reset form
          resetForm()
          
          // Open WhatsApp if phone payment
          if (selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY) {
            openWhatsApp(orderId)
          }
        },
        onFailure: (error) => {
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
    orderNote
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
    <div style={{marginTop: '20px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
      <p style={{fontWeight: 'bold', marginBottom: '10px'}}>Scan QR Code to Pay</p>
      <p style={{fontSize: '14px', marginBottom: '10px', color: '#666'}}>
        {isOutsideValley 
          ? 'Payment required for outside valley delivery' 
          : 'Complete payment for home delivery'
        }
      </p>
      <img
        src="src/assets/images/qrbanksample.jpg"
        alt="QR Code for Payment"
        className="qrImage"
        style={{
          maxWidth: '200px',
          height: 'auto',
          marginBottom: '10px',
          display: 'block'
        }}
      />
      <p style={{fontSize: '12px', color: '#888'}}>
        After payment, please send screenshot to WhatsApp for order confirmation.
      </p>
    </div>
  )

  if (!hasProducts) {
    return (
      <div className="cartPage">
        <VStack gap="$3" align="center" justify="center" style={{minHeight: '400px'}}>
          <img
            className="noProductOnCart"
            src="src/assets/images/noCart.png"
            alt="Empty cart"
            style={{maxWidth: '300px', opacity: 0.7}}
          />
          <p style={{fontSize: '18px', color: '#666', textAlign: 'center'}}>
            Your cart is empty
          </p>
          <p style={{fontSize: '14px', color: '#888', textAlign: 'center'}}>
            Add some products to get started!
          </p>
        </VStack>
      </div>
    )
  }

  return (
    <div className="cartPage">
      {/* Products Section */}
      <VStack gap="$3" style={{width: media.md ? '55%' : '100%'}}>
        {cartProducts.map((item, index) => (
          <CartCard
            key={`${item._id}-${index}`}
            data={item}
            onChangePrice={handleQuantityChange}
          />
        ))}
      </VStack>

      {/* Order Summary Section */}
      <VStack style={{width: media.md ? '40%' : '100%'}} gap="$3">
        <VStack className="cartPage-orderSummary" gap="$5">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <p className="cartPage-orderSummary-title">Order Summary</p>
            <p className="cartPage-orderSummary-itemCount">
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Subtotal */}
          <HStack style={{width: '100%'}} justify="space-between" align="center">
            <p>Subtotal</p>
            <p>{getNprPrice(subtotal)}</p>
          </HStack>

          {/* Valley Selection */}
          <VStack style={{width: '100%'}} gap="$2">
            <Label>Location Type *</Label>
            <SelectField
              options={VALLEY_OPTIONS}
              width="100%"
              onChangeValue={handleValleyChange}
              placeholder="Select location type"
              containerStyle={{width: '100%'}}
              value={selectedValleyOption}
            />
          </VStack>

          {/* Location Selection */}
          <HStack justify="space-between" align="flex-start" style={{width: '100%', gap: '12px'}}>
            <VStack style={{flex: 1}} gap="$2">
              <Label>District *</Label>
              <SelectField
                options={districtOptions}
                width="100%"
                onChangeValue={setSelectedDistrictOption}
                placeholder="Select District"
                containerStyle={{width: '100%'}}
                value={selectedDistrictOption}
              />
            </VStack>

            <VStack style={{flex: 1}} gap="$2">
              <Label>Municipality *</Label>
              <SelectField
                options={municipalityOptions}
                key={`municipality-${selectedDistrictOption?.id || 'none'}`}
                width="100%"
                onChangeValue={setSelectedMunicipalityOption}
                placeholder="Select Municipality"
                containerStyle={{width: '100%'}}
                value={selectedMunicipalityOption}
                isDisabled={!selectedDistrictOption}
              />
            </VStack>
          </HStack>

          <HStack justify="space-between" align="flex-start" style={{width: '100%', gap: '12px'}}>
            <VStack style={{flex: 1}} gap="$2">
              <Label>Area *</Label>
              <SelectField
                options={areaOptions}
                key={`area-${selectedMunicipalityOption?.id || 'none'}`}
                width="100%"
                onChangeValue={setSelectedAreaOption}
                placeholder="Select Area"
                containerStyle={{width: '100%'}}
                value={selectedAreaOption}
                isDisabled={!selectedMunicipalityOption}
              />
            </VStack>

            <VStack style={{flex: 1}} gap="$2">
              <Label>Delivery Type *</Label>
              <SelectField
                options={DELIVERY_TYPE_OPTIONS}
                width="100%"
                onChangeValue={setSelectedDeliveryTypeOption}
                placeholder="Delivery Type"
                containerStyle={{width: '100%'}}
                value={selectedDeliveryTypeOption}
              />
            </VStack>
          </HStack>

          {/* Shipping Details */}
          <VStack style={{width: '100%'}} gap="$2">
            <Label>Shipping Details *</Label>
            <HStack gap="$2" style={{width: '100%'}}>
              <InputField
                onChange={(e) => setShippingLocation(e.target.value)}
                placeholder="Full address *"
                value={shippingLocation}
                style={{flex: 1}}
              />
              <InputField
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number *"
                value={phoneNumber}
                style={{flex: 1}}
                type="tel"
              />
            </HStack>
          </VStack>

          {/* Shipping Cost */}
          <HStack style={{width: '100%'}} justify="space-between" align="center">
            <p>Shipping Cost</p>
            <p>{getNprPrice(shippingPrice)}</p>
          </HStack>

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
            style={{width: '100%', fontWeight: 'bold', fontSize: '18px'}}
            justify="space-between"
            align="center"
          >
            <p>Total</p>
            <p>{getNprPrice(total)}</p>
          </HStack>

          {/* Order Note */}
          <VStack style={{width: '100%'}} gap="$2">
            <Label>Order Note (Optional)</Label>
            <TextArea
              onChange={(e) => setOrderNote(e.target.value)}
              style={{width: '100%', fontSize: '14px', minHeight: '80px'}}
              value={orderNote}
              placeholder="Any special instructions..."
            />
          </VStack>

          {/* Payment Methods */}
          <VStack style={{width: '100%'}} gap="$3">
            <Label>Payment Method *</Label>
            
            <CheckBox
              value={PAYMENT_METHODS.PHONE_PAY}
              label="Phone Pay"
              name="payment-method"
              check={selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY}
              handleCheckboxChange={(checked) => 
                handlePaymentMethodChange(PAYMENT_METHODS.PHONE_PAY, checked)
              }
            />

            <CheckBox
              value={PAYMENT_METHODS.CASH_ON_DELIVERY}
              label="Cash on Delivery"
              name="payment-method"
              check={selectedPaymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY}
              handleCheckboxChange={(checked) => 
                handlePaymentMethodChange(PAYMENT_METHODS.CASH_ON_DELIVERY, checked)
              }
            />

            {/* QR Code Display Logic */}
            {shouldShowQR && <QRCodeSection />}
          </VStack>
        </VStack>

        {/* Checkout Button */}
        <Button
          className="cartPage-checkout"
          onClick={handleCheckout}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Place Order
        </Button>

        {/* Contact Info */}
        <p style={{textAlign: 'center', fontSize: '14px', color: '#666'}}>
          Need help? For order details{' '}
          <a 
            href={`tel:${CONTACT_NUMBER}`}
            style={{color: '#007bff', textDecoration: 'none'}}
          >
            Call us: {CONTACT_NUMBER}
          </a>
        </p>
      </VStack>
    </div>
  )
}