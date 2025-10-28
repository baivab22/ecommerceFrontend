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
import { fetchHolidayModeAction, selectHolidayMode } from '../../holidayMode/holidayMode.slice'

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

interface LocationCoordinates {
  latitude: number
  longitude: number
  address?: string
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


  const [shippingRate,setShippingRate]=useState(0);
  // Cart related state
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([])

  // Shipping & Location state
  const [selectedValleyOption, setSelectedValleyOption] = useState<Option | null>( 
     {
    id: 'inside',
    label: 'Inside Kathmandu Valley',
    value: 'inside'
  }
  )
  const [selectedDistrictOption, setSelectedDistrictOption] = useState<Option | null>(null)
  const [selectedMunicipalityOption, setSelectedMunicipalityOption] = useState<Option | null>(null)
  const [selectedAreaOption, setSelectedAreaOption] = useState<Option | null>(null)
  const [selectedDeliveryTypeOption, setSelectedDeliveryTypeOption] = useState<Option | null>(null)

  // Geolocation state
  const [locationCoordinates, setLocationCoordinates] = useState<LocationCoordinates | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)

  // Form state
  const [shippingLocation, setShippingLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [orderNote, setOrderNote] = useState('')
  const [isShippingSame, setIsShippingSame] = useState(true)

  // Payment state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  // QR Modal state
  const [showQRModal, setShowQRModal] = useState(false)

  // Holiday mode state
  const settings = useSelector(selectHolidayMode);

  // Fetch holiday mode settings
  useEffect(() => {
    dispatch(fetchHolidayModeAction({
      onSuccess: (data) => {
        console.log('Holiday mode settings fetched:', data);
      }
    }));
  }, [dispatch]);

  // Check if holiday mode is active and orders are not allowed
  const isHolidayModeActive = useMemo(() => {
    return settings?.isActive && !settings?.allowOrders;
  }, [settings]);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

    useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  // Computed values
  const isOutsideValley = selectedValleyOption?.value === 'outside'
  const isInsideValley = selectedValleyOption?.value === 'inside'
  const isPhonePaySelected = selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY
  const isCashOnDelivery = selectedPaymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY
  const isHomeDelivery = selectedDeliveryTypeOption?.value === 'home'
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
  const shouldShowQRModal = isOutsideValley || (isInsideValley && isPhonePaySelected)
  const shouldProceedDirectly = isInsideValley && isCashOnDelivery

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cartProducts.reduce((acc, item) => {
      const unitPrice = item.productId?.discountedPrice || 0
      const quantity = item.quantity || 0
      const itemTotal = unitPrice * quantity
      
      console.log(`Product ${item._id}: Unit Price ${unitPrice} × Quantity ${quantity} = ${itemTotal}`)
      
      return acc + itemTotal
    }, 0)
  }, [cartProducts])

useEffect(() => {
  if (!isLocationComplete) {
    return;
  }

  if (!selectedAreaOption?.areaData || !selectedDeliveryTypeOption) {
    return;
  }

  const deliveryType =
    selectedDeliveryTypeOption.value === 'home'
      ? 'homeDelivery'
      : 'officeDelivery';

  setShippingRate(selectedAreaOption.areaData[deliveryType] || 0);
}, [selectedAreaOption, selectedDeliveryTypeOption, isLocationComplete]);




useEffect(() => {
  if (isInsideValley) {
    if (selectedDeliveryTypeOption?.value === 'home') {
      setShippingRate(120)
    } else {
    setShippingRate(70)
    }
  }
}, [isInsideValley, selectedDeliveryTypeOption]);


  const total = subtotal + shippingRate

  // Geolocation functions
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setIsLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log("location not gotten",latitude,longitude)
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          const address = data.display_name || `${latitude}, ${longitude}`
          
          setLocationCoordinates({
            latitude,
            longitude,
            address
          })
          
          toast.success('Location captured successfully')
        } catch (error) {
          console.error('Error getting address:', error)
          setLocationCoordinates({
            latitude,
            longitude,
            address: `${latitude}, ${longitude}`
          })
          toast.success('Location captured (coordinates only)')
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        console.error('Geolocation error:', error)
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location access.')
            break
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable.')
            break
          case error.TIMEOUT:
            toast.error('Location request timed out.')
            break
          default:
            toast.error('Failed to get location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [])

  const openMapPicker = useCallback(() => {
    setShowMapPicker(true)
  }, [])

  const handleMapLocationSelect = useCallback((lat: number, lng: number, address?: string) => {
    setLocationCoordinates({
      latitude: lat,
      longitude: lng,
      address: address || `${lat}, ${lng}`
    })
    setShowMapPicker(false)
    toast.success('Location selected from map')
  }, [])

  // Effects
  useEffect(() => {
    if (userId) {
      dispatch(getCartlistAction({ userId }))
    }
  }, [dispatch, userId])

  useEffect(() => {

    console.log(datas?.cartData?.[0]?.products,"cart products data effect")
    setCartProducts(datas?.cartData?.[0]?.products ?? [])
  }, [datas?.cartData?.[0]?.products])



  console.log(datas.cartData,cartProducts,"datas and cart datas")

  // Clear dependent selections when parent changes
  useEffect(() => {
    setSelectedMunicipalityOption(null)
    setSelectedAreaOption(null)
  }, [selectedDistrictOption])

  useEffect(() => {
    setSelectedAreaOption(null)
  }, [selectedMunicipalityOption])

  // Clear location when delivery type changes
  useEffect(() => {
    if (selectedDeliveryTypeOption?.value !== 'home') {
      setLocationCoordinates(null)
    }
  }, [selectedDeliveryTypeOption])

  // Quantity change handler
  const handleQuantityChange = useCallback(
    (newQuantity: number, product: CartProduct) => {
      if (!userId) return
      
      if (newQuantity < 1) {
        toast.error('Quantity must be at least 1')
        return
      }

      const unitPrice = product.productId?.discountedPrice || 0
      const updatedPrice = Number(unitPrice * newQuantity)

      console.log(`Updating product ${product._id}: Unit Price ${unitPrice} × New Quantity ${newQuantity} = ${updatedPrice}`,product)

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
    setSelectedDistrictOption(null)
    setSelectedMunicipalityOption(null)
    setSelectedAreaOption(null)
  }, [])

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
    if (!selectedDistrictOption && !isInsideValley) errors.push('Please select district')
    if (!selectedMunicipalityOption && !isInsideValley) errors.push('Please select municipality')
    if (!selectedAreaOption && !isInsideValley) errors.push('Please select area')
    if (!selectedDeliveryTypeOption) errors.push('Please select delivery type')
    
    if (isHomeDelivery && !locationCoordinates) {
      errors.push('Please provide your location for home delivery')
    }
    
    if (!shippingLocation.trim()) errors.push('Please enter shipping address')
    
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
    isHomeDelivery,
    locationCoordinates,
    shippingLocation,
    phoneNumber,
    selectedPaymentMethod
  ])

  const processOrder = useCallback(() => {
    if (!userId) {
      toast.error('Please login to continue')
      return
    }

    const orderId = generateOrderId()
    const isPhonePay = selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY

    const orderProducts = cartProducts.map(item => {
      const unitPrice = item.productId?.discountedPrice || 0
      const quantity = item.quantity || 0
      const totalPriceForProduct = unitPrice * quantity


      console.log(item,"item products ordered")

      console.log(`Order Product ${item.productId.id}: Unit ${unitPrice} × Qty ${quantity} = ${totalPriceForProduct}`)
      
      return {
        productId: item.productId.id,

        //@ts-ignore
        colorName:item.colorName,
        quantity: quantity,
        price: totalPriceForProduct,

      }
    })

    console.log('Order Products:', orderProducts)
    console.log('Subtotal:', subtotal)
    // console.log('Shipping:', shippingPrice)
    console.log('Total:', total)
    console.log('Location Coordinates:',isOutsideValley, locationCoordinates)

    dispatch(
      createOrderByUserIdAction({
        userId,
        data: {
          userId,
          products: orderProducts,
          isInsideValley: JSON.stringify(!isOutsideValley),
          OrderedAt: new Date().toLocaleString(),
          productOrderId: orderId,
          shippingLocation:isOutsideValley===false ? shippingLocation: `${selectedDistrictOption?.value}, ${selectedMunicipalityOption?.value}, ${selectedAreaOption?.value}, ${shippingLocation}`,
          paymentMethod: selectedPaymentMethod,
          deliveryType: selectedDeliveryTypeOption?.value,
          phoneNumber: phoneNumber.trim(),
          orderNote: orderNote.trim(),
          shippingPrice: shippingRate,
          isHomeDelivery:selectedDeliveryTypeOption?.value === 'home',
          totalAmount: total,
          ...({
            latitude: locationCoordinates?.latitude || location.lat,
            longitude: locationCoordinates?.longitude || location.lng,
            locationAddress: locationCoordinates?.address || shippingLocation
          })
        },
        onSuccess: (response) => {
          const backendOrderId = response?.data?.orderId || response?.orderId || orderId
          
          setShowQRModal(false)
          
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

          const clearCartItems = async () => {
            dispatch(deleteCartByIdAction({
              cartId: userId,
              onSuccess: () => {
                dispatch(getCartlistAction({ userId }))
              },
            }))
          }

          clearCartItems()
          resetForm()
          // if (!(isCashOnDelivery && isInsideValley)) {
      openWhatsApp(backendOrderId)
          // }
        },
        onFailure: error => {
          console.error('Order failed:', error)
          setShowQRModal(false)
          toast.error('Failed to place order. Please try again.')
        }
      })
    )
  }, [
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
    shippingRate,
    shippingLocation,
    total,
    subtotal,
    isHomeDelivery,
    locationCoordinates
  ])

  console.log(shippingRate,"shippingPrice value")

  const handleCheckout = useCallback(() => {
    if (isHolidayModeActive) {
      toast.error(settings?.message || 'We are currently on holiday. Orders will be processed after we return.');
      return;
    }

    const validationErrors = validateForm()

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0])
      return
    }

    // If inside valley AND cash on delivery, proceed directly
    if (shouldProceedDirectly) {
      processOrder()
    } else if (shouldShowQRModal) {
      // Show QR modal for payment
      setShowQRModal(true)
    } else {
      // Default case
      processOrder()
    }
  }, [
    isHolidayModeActive,
    settings?.message,
    validateForm,
    shouldProceedDirectly,
    shouldShowQRModal,
    processOrder
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
    setLocationCoordinates(null)
  }, [])

const openWhatsApp = useCallback((orderId: string) => {
  // Determine payment scenario
  const isOutsideValley = isInsideValley === false;
  const isPhonePay = isPhonePaySelected; // Assuming isHomeDelivery true means phone pay
  
  let message = '';


  console.log(isOutsideValley,isPhonePaySelected,"is sssssssss")
  
  if (isOutsideValley) {
     console.log(isOutsideValley,isPhonePaySelected,"is sssssssss.  aaa")

    if(isPhonePaySelected){
          message = `नमस्ते! 🙏

Order ID: ${orderId}

मैले पूरा रकम पेमेन्ट गरिसकेको छु।

Payment Screenshot यसै म्यासेजमा पठाउँदै छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।

धन्यवाद! 🙏`;
    }else{
   // Outside valley - Advance payment (Rs. 300)
    message = `नमस्ते! 🙏

Order ID: ${orderId}

मैले Rs. 300 एडभान्स पेमेन्ट गरिसकेको छु।

Payment Screenshot यसै म्यासेजमा पठाउँदै छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।

धन्यवाद! 🙏`;
    }
 
  } else{


  
    // Inside valley + Phone Pay - Full payment
if(isPhonePaySelected){
 message = `नमस्ते! 🙏

Order ID: ${orderId}

मैले पूरा रकम पेमेन्ट गरिसकेको छु।

Payment Screenshot यसै म्यासेजमा पठाउँदै छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।धन्यवाद! 🙏`;
}
else{
  
     console.log(isOutsideValley,isPhonePaySelected,"is sssssssss.  bbb")
       // Inside valley + COD - No advance payment needed
    message = `नमस्ते! 🙏

Order ID: ${orderId}

मैले Cash on Delivery को लागि अर्डर गरेको छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।

धन्यवाद! 🙏`;


  } }
  
  const whatsappUrl = `https://wa.me/9779867072373?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}, [isInsideValley, isPhonePaySelected]);

  // QR Modal Component
const QRPaymentModal = () => {
  if (!showQRModal) return null;

  // Determine payment scenario
  const isOutsideValleyCOD = isInsideValley===false && isPhonePaySelected===false
  const requiresAdvancePayment = isOutsideValleyCOD;
  const advanceAmount = 300;

  console.log(isInsideValley, isHomeDelivery, "is Inside valley data from model");

  // Get payment amount based on scenario
  const getPaymentAmount = () => {
    if (requiresAdvancePayment) {
      return getNprPrice(advanceAmount);
    }
    return getNprPrice(total);
  };

  // Get payment title based on scenario
  const getPaymentTitle = () => {
    if (requiresAdvancePayment) {
      return "Advance Payment Required";
    }
    return "Amount to Pay";
  };

  // Get steps based on scenario
  const getPaymentSteps = () => {
    if (requiresAdvancePayment) {
      // Outside valley + COD: Advance payment required
      return [
        'Scan / Screenshot this QR code',
        'Open any wallet / mobile banking app',
        `Pay NPR ${advanceAmount} advance payment`,
        // 'Take a screenshot of successful payment',
        'Send payment screenshot to WhatsApp: 977-9861698400',
        // 'Or email the screenshot to confirm order',
        'We will confirm your order via WhatsApp'
      ];
    } else {
      // Inside valley OR outside valley with full phone pay
      return [
        'Scan / Screenshot this QR code',
        'Open any wallet / mobile banking app',
        'Pay the complete amount shown above',
        'Complete the payment transaction',
        'Click "Check Payment" button below'
      ];
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '440px',
        width: '100%',
        maxHeight: '95vh',
        height: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header - Compact */}
        <div style={{
          padding: '20px 20px 16px 20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative'
        }}>
          <img 
            src="/assets/images/fonepay-logo.png" 
            alt="fonepay"
            style={{ 
              height: '28px',
              maxWidth: '120px',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div
            onClick={() => setShowQRModal(false)}
            style={{
              width: '28px',
              position: 'absolute',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#666',
              flexShrink: 0,
              right: '20px'
            }}
          >
            ×
          </div>
        </div>

        {/* Content - Optimized spacing */}
        <div style={{ 
          padding: '24px',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          overflowX: 'hidden'
        }}>
          {/* QR Code - Fixed size */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            flexShrink: 0
          }}>
            <img
              src="/assets/images/qrbanksample.jpg"
              alt="QR Code for Payment"
              style={{
                width: '220px',
                height: '220px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '12px',
                backgroundColor: '#fafafa',
                objectFit: 'contain'
              }}
              onError={(e) => {
                console.error('QR Code image failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Amount - Compact */}
          <div style={{
            backgroundColor: requiresAdvancePayment ? '#fff7ed' : '#f0f9ff',
            border: `2px dashed ${requiresAdvancePayment ? '#f97316' : '#3b82f6'}`,
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
            flexShrink: 0
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: requiresAdvancePayment ? '#c2410c' : '#1e40af',
              marginBottom: '6px',
              fontWeight: '500'
            }}>
              {getPaymentTitle()}
            </div>
            <div style={{ 
              fontSize: '26px', 
              fontWeight: 'bold',
              color: requiresAdvancePayment ? '#9a3412' : '#1e3a8a',
              lineHeight: '1.2'
            }}>
              {getPaymentAmount()}
            </div>
            {requiresAdvancePayment && (
              <div style={{
                fontSize: '13px',
                color: '#9a3412',
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: '#fed7aa',
                borderRadius: '6px',
                fontWeight: '600',
                border: '1px solid #f97316'
              }}>
                Balance {getNprPrice(total - advanceAmount)} payable on delivery
              </div>
            )}
          </div>

          {/* Instructions - Compact */}
          <div style={{ 
            textAlign: 'left', 
            marginBottom: '20px',
            flex: 1,
            minHeight: 0
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1f2937'
            }}>
              {requiresAdvancePayment ? 'Steps to confirm your order:' : 'Steps to complete payment:'}
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              fontSize: '13px'
            }}>
              {getPaymentSteps().map((step, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    flexShrink: 0,
                    marginTop: '1px'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    color: '#4b5563',
                    lineHeight: '1.5'
                  }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Info for COD */}
            {/* {requiresAdvancePayment && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #86efac'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#166534',
                  marginBottom: '6px'
                }}>
                  Contact Information:
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#15803d',
                  lineHeight: '1.6'
                }}>
                  <div>📱 WhatsApp: <strong>977-9861698400</strong></div>
                  <div style={{ marginTop: '4px' }}>
                    ✉️ Email payment screenshot to confirm
                  </div>
                </div>
              </div>
            )} */}
          </div>

          {/* Action Button */}
          {!requiresAdvancePayment ? (
            <button
              onClick={processOrder}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: '#ec4899',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#db2777';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ec4899';
              }}
            >
              Check Payment
            </button>
          ) : (
            <button
              onClick={() => {processOrder();
                setShowQRModal(false)}}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              {/* I've Sent the Payment Screenshot */}

              Place order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
  // Map Picker Modal with Leaflet integration
  const MapPickerModal = () => {
    const [mapCenter, setMapCenter] = React.useState<[number, number]>([27.7172, 85.3240])
    const [selectedPosition, setSelectedPosition] = React.useState<[number, number] | null>(null)
    const mapContainerRef = React.useRef<HTMLDivElement>(null)
    const mapRef = React.useRef<any>(null)
    const markerRef = React.useRef<any>(null)

    React.useEffect(() => {
      if (!showMapPicker || !mapContainerRef.current) return

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      
      script.onload = () => {
        if (mapRef.current) return

        const L = (window as any).L
        
        const map = L.map(mapContainerRef.current).setView(mapCenter, 13)
        mapRef.current = map

        const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        })

        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles © Esri',
          maxZoom: 19
        })

        const hybridLayer = L.layerGroup([
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri',
            maxZoom: 19
          }),
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            opacity: 0.3
          })
        ])

        streetLayer.addTo(map)

        const baseLayers = {
          "Street View": streetLayer,
          "Satellite View": satelliteLayer,
          "Hybrid View": hybridLayer
        }

        L.control.layers(baseLayers).addTo(map)

        const marker = L.marker(mapCenter, { draggable: true }).addTo(map)
        markerRef.current = marker

        marker.on('dragend', function() {
          const position = marker.getLatLng()
          setSelectedPosition([position.lat, position.lng])
        })

        map.on('click', function(e: any) {
          const { lat, lng } = e.latlng
          marker.setLatLng([lat, lng])
          setSelectedPosition([lat, lng])
        })

        setSelectedPosition(mapCenter)

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              const userLocation: [number, number] = [latitude, longitude]
              map.setView(userLocation, 15)
              marker.setLatLng(userLocation)
              setSelectedPosition(userLocation)
            },
            (error) => {
              console.log('Could not get current location:', error)
            }
          )
        }
      }

      document.body.appendChild(script)

      return () => {
        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
          markerRef.current = null
        }
      }
    }, [showMapPicker])

    if (!showMapPicker) return null

    const handleConfirm = async () => {
      if (!selectedPosition) return

      const [lat, lng] = selectedPosition

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await response.json()
        const address = data.display_name || `${lat}, ${lng}`
        handleMapLocationSelect(lat, lng, address)
      } catch (error) {
        console.error('Error getting address:', error)
        handleMapLocationSelect(lat, lng, `${lat}, ${lng}`)
      }
    }

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h3 style={{ marginBottom: '8px', fontSize: '20px', fontWeight: '600' }}>
            Select Delivery Location
          </h3>
          <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
            Click on the map or drag the marker to select your delivery location
          </p>
          
          <div 
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '450px',
              borderRadius: '8px',
              marginBottom: '16px',
              border: '2px solid #e0e0e0'
            }}
          />

          {selectedPosition && (
            <div style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#495057'
            }}>
              <strong>Selected Coordinates:</strong> {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowMapPicker(false)
                if (mapRef.current) {
                  mapRef.current.remove()
                  mapRef.current = null
                  markerRef.current = null
                }
              }}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedPosition}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: selectedPosition ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedPosition ? 'pointer' : 'not-allowed'
              }}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Holiday Mode Banner
  const HolidayModeBanner = () => {
    if (!isHolidayModeActive) return null

    return (
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#856404',
          fontWeight: '600',
          margin: '0',
          fontSize: '16px'
        }}>
          {settings?.message || 'We are currently on holiday. Orders will be processed after we return.'}
        </p>
      </div>
    )
  }

  // Location Picker Section
  const LocationPickerSection = () => {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Label>Delivery Location * (Required for Home Delivery)</Label>
        
        {locationCoordinates ? (
          <div style={{
            padding: '16px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #4caf50'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#2e7d32' }}>
                  ✓ Location Captured
                </p>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Lat: {locationCoordinates.latitude.toFixed(6)}, 
                  Lng: {locationCoordinates.longitude.toFixed(6)}
                </p>
                {locationCoordinates.address && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {locationCoordinates.address}
                  </p>
                )}
              </div>
              <div
                onClick={() => setLocationCoordinates(null)}
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div
                onClick={getCurrentLocation}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  backgroundColor: isLoadingLocation ? '#ccc' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isLoadingLocation ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoadingLocation) {
                    e.currentTarget.style.backgroundColor = '#45a049'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoadingLocation) {
                    e.currentTarget.style.backgroundColor = '#4caf50'
                  }
                }}
              >
                {isLoadingLocation ? (
                  <>
                    <span style={{ 
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '3px solid #ffffff',
                      borderTop: '3px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span>Getting Location...</span>
                    <style dangerouslySetInnerHTML={{
                      __html: `
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `
                    }} />
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>Use Current Location</span>
                  </>
                )}
              </div>

              <div
                onClick={openMapPicker}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1976d2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2196f3'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
                <span>Select Location on Map</span>
              </div>
            </div>
            
            <p style={{
              fontSize: '12px',
              color: '#888',
              textAlign: 'center',
              marginTop: '12px',
              lineHeight: '1.5'
            }}>
              📍 Location is required for accurate home delivery
            </p>
          </>
        )}
      </div>
    )
  }

  if (!hasProducts) {
    return (
      <div className="cartPage" style={{ width: '100%'}}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '400px',
          width:'100%' 
        }}>
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
        </div>
      </div>
    )
  }

  return (
    <div className="cartPage" style={{ 
      display: 'flex', 
      flexDirection: media.md ? 'row' : 'column', 
      gap: '24px',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}>
      <QRPaymentModal />
      <MapPickerModal />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        width: media.md ? '55%' : '100%' 
      }}>
        {cartProducts.map((item, index) => (
          <CartCard key={`${item._id}-${index}`} data={item} onChangePrice={handleQuantityChange} />
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        width: media.md ? '40%' : '100%' 
      }}>
        <div className="cartPage-orderSummary" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="cartPage-orderSummary-title">Order Summary</p>
            <p className="cartPage-orderSummary-itemCount">
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <p>Subtotal</p>
            <p>{getNprPrice(subtotal)}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <Label>Location Type *</Label>
            <SelectField
              options={VALLEY_OPTIONS}
              width="100%"
              onChangeValue={handleValleyChange}
              placeholder="Select location type"
              containerStyle={{ width: '100%' }}
              value={selectedValleyOption}
            />
          </div>

          {!isInsideValley && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              width: '100%', 
              gap: '12px' 
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <Label>District *</Label>
                <SelectField
                  options={districtOptions}
                  width="100%"
                  onChangeValue={setSelectedDistrictOption}
                  placeholder="Select District"
                  containerStyle={{ width: '100%' }}
                  value={selectedDistrictOption}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
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
              </div>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            width: '100%', 
            gap: '12px' 
          }}>
            {!isInsideValley && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
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
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <Label>Delivery Type *</Label>
              <SelectField
                options={DELIVERY_TYPE_OPTIONS}
                width="100%"
                onChangeValue={setSelectedDeliveryTypeOption}
                placeholder="Delivery Type"
                containerStyle={{ width: '100%' }}
                value={selectedDeliveryTypeOption}
              />
            </div>
          </div>

          <LocationPickerSection />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <Label>Shipping Details *</Label>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <InputField
                onChange={(e:any) => setShippingLocation(e.target.value)}
                placeholder="Full address *"
                value={shippingLocation}
                style={{ flex: 1 }}
              />
              <InputField
                onChange={(e:any) => setPhoneNumber(e.target.value)}
                placeholder="Phone number *"
                value={phoneNumber}
                style={{ flex: 1 }}
                type="tel"
              />
            </div>
          </div>

          {isLocationComplete && shippingRate > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <p>Shipping Cost</p>
              <p>{getNprPrice(shippingRate)}</p>
            </div>
          )}

          {isLocationComplete && shippingRate === 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <p>Shipping Cost</p>
              <p style={{ color: '#28a745', fontWeight: 'bold' }}>Free</p>
            </div>
          )}

          <div
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              width: '100%', 
              fontWeight: 'bold', 
              fontSize: '18px' 
            }}
          >
            <p>Total</p>
            <p>{getNprPrice(total)}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <Label>Order Note (Optional)</Label>
            <TextArea
              onChange={e => setOrderNote(e.target.value)}
              style={{ width: '100%', fontSize: '14px', minHeight: '80px' }}
              value={orderNote}
              placeholder="Any special instructions..."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Label>Payment Method *</Label>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
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
            </div>
          </div>
        </div>

        <div
          className="cartPage-checkout"
          onClick={handleCheckout}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: (hasProducts && !isHolidayModeActive) ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (hasProducts && !isHolidayModeActive) ? 'pointer' : 'not-allowed',
            opacity: (hasProducts && !isHolidayModeActive) ? 1 : 0.6,
            textAlign: 'center',
          }}
        >
          {isHolidayModeActive ? 'Orders Temporarily Unavailable' : 'Place Order'}
        </div>
        
        <HolidayModeBanner />

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Need help? For order details{' '}
          <a href={`tel:${CONTACT_NUMBER}`} style={{ color: '#007bff', textDecoration: 'none' }}>
            Call us: {CONTACT_NUMBER}
          </a>
        </p>
      </div>
    </div>
  )
}