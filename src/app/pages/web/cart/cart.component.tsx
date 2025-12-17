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

const PAYMENT_OPTIONS = {
  ESEWA: 'esewa',
  BANK_TRANSFER: 'bankTransfer'
} as const

// Gift Box Configuration
const GIFT_BOX_IMAGES = [
  { id: 1, src: '/assets/images/giftBox1.jpeg', alt: 'Elegant Gift Box' },
  { id: 2, src: '/assets/images/giftBox2.jpeg', alt: 'Premium Gift Box' }
] as const

const GIFT_BOX_CHARGE = 400 // NPR

// Red Zone Areas (THU EXPRESS) - Updated list
const RED_ZONE_AREAS = [
  'CHAPAGAUN',
  'BRAMHAKHEL',
  'SANKHU',
  'PALANSE, BANEPA, DHULIKHEL',
  'BAJRABARAHI, GODAWARI',
  'GOKARNA',
  'CHANDRAGIRI CABLE CAR, CHANDRAGIRI',
  'GOKARNA, SUNTAKHAN',
  'GOLDHUNGA PETROL PUMP',
  'GOKARNESHWOR, NAYAPATI, SUNDARIJAL',
  'GOKARNESHWOR',
  'DANCHHI, SANKHU',
  'BUNGAMATI',
  'LAMATAR',
  'KIRTIPUR, MACHHEGAUN, CHAMPADEVI BUS PARK',
  'KIRTIPUR, BISTA GAUN',
  'KIRTIPUR, BHATKEKOPATI',
  'KIRTIPUR, DAHACHOWK KHAHARE',
  'KIRTIPUR, SALYANSTHAN',
  'TAULING CHAUTRA, BUDHANILKANTHA',
  'WASIK, BUDHANILKANTHA',
  'NARAYANTHAN, BUDANILKANTHA',
  'BADELI, BUDHANILKANTHA',
  'CHUNIKHEL, BUDHANILKANTHA',
  'GODAMCHAUR, FOOTBALL',
  'HEALTHPOST, BHAKTAPUR',
  'GUNDU, BHAKTAPUR',
  'DHUNGIN BUSPARK',
  'GANKHU, BHAKTAPUR',
  'KHARIPATI, KAMALBINAYAK, KHARIPATI AREA, BKT'
]

// Delivery Partner Options for Red Zones
const DELIVERY_PARTNER_OPTIONS = [
  {
    id: 'ncm',
    label: 'NCM Delivery',
    value: 'ncm',
    price: 120,
    description: 'Same day if ordered before 12:00 PM, otherwise tomorrow',
    deliveryTime: 'Same day/Tomorrow'
  },
  {
    id: 'third_party',
    label: 'Third Party Express (Thu Express)',
    value: 'third_party',
    price: 200,
    description: 'Tomorrow if ordered before 12:00 PM, otherwise 1-2 days',
    deliveryTime: 'Tomorrow/1-2 days'
  }
]

// Shipping Rates
const NORMAL_ZONE_HOME_DELIVERY = 100 // NPR
const OFFICE_DELIVERY = 70 // NPR

export const CartPage = () => {
  const dispatch = useDispatch()
  const datas = useSelector((state: any) => state.cart)
  const media = useMedia()
  const userId = getCookie('userId')

  const [shippingRate, setShippingRate] = useState(0)
  
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
  const [selectedQRPaymentMethod, setSelectedQRPaymentMethod] = useState<string>(PAYMENT_OPTIONS.ESEWA)

  // QR Modal state
  const [showQRModal, setShowQRModal] = useState(false)

  // Holiday mode state
  const settings = useSelector(selectHolidayMode);

  // Gift Box state
  const [includeGiftBox, setIncludeGiftBox] = useState(false)
  const [showGiftBoxModal, setShowGiftBoxModal] = useState(false)
  const [selectedGiftBoxIndex, setSelectedGiftBoxIndex] = useState<number>(0)

  // Red Zone state
  const [isRedZone, setIsRedZone] = useState(false)
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<string>('ncm')
  const [deliveryTimeMessage, setDeliveryTimeMessage] = useState<string>('Same day if ordered before 12:00 PM, otherwise tomorrow')
  const [deliveryPartnerPrice, setDeliveryPartnerPrice] = useState<number>(120)

  // Generate UUID for payment reference
  const generatePaymentReference = useCallback(() => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }, [])

  const [paymentReferenceId, setPaymentReferenceId] = useState<string>('')

  // Initialize payment reference ID
  useEffect(() => {
    setPaymentReferenceId(generatePaymentReference())
  }, [generatePaymentReference])

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
  const currentHour = new Date().getHours()
  const currentMinute = new Date().getMinutes()
  const isBefore12PM = currentHour < 12 || (currentHour === 12 && currentMinute === 0)

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
    return cartProducts?.reduce((acc, item) => {
      const unitPrice = item.productId?.discountedPrice || 0
      const quantity = item.quantity || 0
      const itemTotal = unitPrice * quantity
      
      console.log(`Product ${item._id}: Unit Price ${unitPrice} × Quantity ${quantity} = ${itemTotal}`)
      
      return acc + itemTotal
    }, 0)
  }, [cartProducts])

  // Gift box charge
  const giftBoxCharge = useMemo(() => {
    return includeGiftBox ? GIFT_BOX_CHARGE : 0
  }, [includeGiftBox])

  // Helper function to check if location is in red zone
  const checkRedZone = useCallback((location: string): boolean => {
    if (!location || !location.trim()) return false
    
    const locationUpper = location.toUpperCase().trim()
    
    // Normalize the location by removing extra spaces and special characters
    const normalizedLocation = locationUpper
      .replace(/[^\w\s,]/g, '') // Remove special characters except commas
      .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
      .trim()
    
    // Check if any red zone area matches the location
    return RED_ZONE_AREAS.some(redZone => {
      const normalizedRedZone = redZone
        .toUpperCase()
        .replace(/[^\w\s,]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      
      // Split into individual area names
      const redZoneParts = normalizedRedZone.split(/[,\s]+/).filter(part => part.length > 2)
      const locationParts = normalizedLocation.split(/[,\s]+/).filter(part => part.length > 2)
      
      // Check for exact match
      if (normalizedLocation.includes(normalizedRedZone) || 
          normalizedRedZone.includes(normalizedLocation)) {
        return true
      }
      
      // Check if any significant part of red zone appears in location
      return redZoneParts.some(part => {
        if (part.length < 3) return false
        return locationParts.some(locationPart => 
          locationPart.includes(part) || part.includes(locationPart)
        )
      })
    })
  }, [])

  // Get delivery time message based on selected partner and current time
  const getDeliveryTimeMessage = useCallback((partnerId: string): string => {
    const isNCM = partnerId === 'ncm'
    
    if (isBefore12PM) {
      return isNCM 
        ? 'Same day delivery (Ordered before 12:00 PM)'
        : 'Tomorrow delivery (Ordered before 12:00 PM)'
    } else {
      return isNCM
        ? 'Tomorrow delivery (Ordered after 12:00 PM)'
        : '1-2 days delivery (Ordered after 12:00 PM)'
    }
  }, [isBefore12PM])

  // Update shipping rate based on location and delivery partner
  useEffect(() => {
    if (!isInsideValley) {
      // For outside valley, keep existing logic
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
      return;
    }

    // Inside valley logic
    if (selectedDeliveryTypeOption?.value === 'home') {
      if (isRedZone) {
        // For red zone, use delivery partner price
        const selectedPartner = DELIVERY_PARTNER_OPTIONS.find(
          partner => partner.value === selectedDeliveryPartner
        )
        const partnerPrice = selectedPartner?.price || 120
        setDeliveryPartnerPrice(partnerPrice)
        setShippingRate(partnerPrice)
        
        // Update delivery time message
        setDeliveryTimeMessage(getDeliveryTimeMessage(selectedDeliveryPartner))
      } else {
        // Normal inside valley home delivery
        setShippingRate(NORMAL_ZONE_HOME_DELIVERY)
      }
    } else {
      // Office delivery
      setShippingRate(OFFICE_DELIVERY)
    }
  }, [
    isInsideValley,
    selectedDeliveryTypeOption,
    isRedZone,
    selectedDeliveryPartner,
    isLocationComplete,
    selectedAreaOption,
    getDeliveryTimeMessage
  ])

  // Check red zone when shipping location changes
useEffect(() => {
  if (isInsideValley && selectedDeliveryTypeOption?.value === 'home') {
    const redZoneCheck = checkRedZone(shippingLocation)
    setIsRedZone(redZoneCheck)

    if (redZoneCheck) {
      const defaultPartner = DELIVERY_PARTNER_OPTIONS[0]
      setSelectedDeliveryPartner(defaultPartner.value)
      setDeliveryTimeMessage(getDeliveryTimeMessage(defaultPartner.value))
      setDeliveryPartnerPrice(defaultPartner.price)

      toast.success(
        'Red zone area detected. Special delivery options available.',
        {
          id: 'red-zone-toast',   // 👈 prevents duplicate toasts
          icon: '⚠️',
          duration: 3000,
        }
      )
    } else {
      setSelectedDeliveryPartner('ncm')
      setDeliveryTimeMessage('Standard delivery')

      // Optional: remove red-zone toast when user leaves red zone
      toast.dismiss('red-zone-toast')
    }
  } else {
    setIsRedZone(false)
    setSelectedDeliveryPartner('ncm')
    toast.dismiss('red-zone-toast')
  }
}, [
  shippingLocation,
  isInsideValley,
  selectedDeliveryTypeOption,
  checkRedZone,
  getDeliveryTimeMessage
])


  // Handle delivery partner change
  const handleDeliveryPartnerChange = useCallback((partnerId: string) => {
    const selectedPartner = DELIVERY_PARTNER_OPTIONS.find(
      partner => partner.value === partnerId
    )
    
    if (selectedPartner) {
      setSelectedDeliveryPartner(selectedPartner.value)
      const timeMessage = getDeliveryTimeMessage(selectedPartner.value)
      setDeliveryTimeMessage(timeMessage)
      setDeliveryPartnerPrice(selectedPartner.price)
      
      // Update shipping rate immediately
      if (isRedZone) {
        setShippingRate(selectedPartner.price)
      }
      
      toast.success(`Delivery option updated: ${selectedPartner.label}`, {
        duration: 2000
      })
    }
  }, [isRedZone, getDeliveryTimeMessage])

  // Total calculation including gift box charge
  const total = subtotal + shippingRate + giftBoxCharge

  // Gift box selection handler
  const handleGiftBoxToggle = useCallback(() => {
    setIncludeGiftBox(!includeGiftBox)
    toast.success(
      includeGiftBox 
        ? 'Gift box removed from your order' 
        : 'Gift box added to your order! +400 NPR'
    )
  }, [includeGiftBox])

  const handleGiftBoxImageClick = useCallback(() => {
    setShowGiftBoxModal(true)
  }, [])

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
          
          // Check if this address is in red zone
          const redZoneCheck = checkRedZone(address)
          setIsRedZone(redZoneCheck)
          
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
  }, [checkRedZone])

  const openMapPicker = useCallback(() => {
    setShowMapPicker(true)
  }, [])

  const handleMapLocationSelect = useCallback((lat: number, lng: number, address?: string) => {
    setLocationCoordinates({
      latitude: lat,
      longitude: lng,
      address: address || `${lat}, ${lng}`
    })
    
    // Check if this address is in red zone
    if (address) {
      const redZoneCheck = checkRedZone(address)
      setIsRedZone(redZoneCheck)
    }
    
    setShowMapPicker(false)
    toast.success('Location selected from map')
  }, [checkRedZone])

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
    setIsRedZone(false)
    setSelectedDeliveryPartner('ncm')
  }, [])

  const handlePaymentMethodChange = useCallback((method: string) => {
    console.log('Payment method changed:', method)
    setSelectedPaymentMethod(method)
  }, [])

  const handleQRPaymentMethodChange = useCallback((method: string) => {
    setSelectedQRPaymentMethod(method)
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

    console.log(shouldProceedDirectly,shouldShowQRModal,"checkouttttttt")
    if (!userId) {
      toast.error('Please login to continue')
      return
    }

    const orderId = generateOrderId()
    const isPhonePay = selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY

    const orderProducts = cartProducts?.map(item => {
      const unitPrice = item.productId?.discountedPrice || 0
      const quantity = item.quantity || 0
      const totalPriceForProduct = unitPrice * quantity

      console.log(item,"item products ordered")
      console.log(`Order Product ${item.productId?.id}: Unit ${unitPrice} × Qty ${quantity} = ${totalPriceForProduct}`)
      
      return {
        productId: item?.productId?.id,
        //@ts-ignore
        colorName: item?.colorName,
        quantity: quantity,
        price: totalPriceForProduct,
      }
    })

    console.log('Order Products:', orderProducts)
    console.log('Subtotal:', subtotal)
    console.log('Gift Box Charge:', giftBoxCharge)
    console.log('Total:', total)
    console.log('Location Coordinates:', isOutsideValley, locationCoordinates)
    console.log('Payment Reference ID:', paymentReferenceId)
    console.log('Red Zone:', isRedZone)
    console.log('Delivery Partner:', selectedDeliveryPartner)
    console.log('Delivery Partner Price:', deliveryPartnerPrice)
    console.log('Delivery Time Message:', deliveryTimeMessage)
    console.log('Ordered Before 12 PM:', isBefore12PM)

    dispatch(
      createOrderByUserIdAction({
        userId,
        data: {
          userId,
          products: orderProducts,
          isInsideValley: JSON.stringify(!isOutsideValley),
          OrderedAt: new Date().toLocaleString(),
          productOrderId: orderId,
          paymentReferenceId: paymentReferenceId,
          shippingLocation: isOutsideValley === false ? shippingLocation : `${selectedDistrictOption?.value}, ${selectedMunicipalityOption?.value}, ${selectedAreaOption?.value}, ${shippingLocation}`,
          paymentMethod: selectedPaymentMethod,
          deliveryType: selectedDeliveryTypeOption?.value,
          phoneNumber: phoneNumber.trim(),
          orderNote: orderNote.trim(),
          shippingPrice: shippingRate,
          giftBoxCharge: giftBoxCharge,
          includeGiftBox: includeGiftBox,
          isHomeDelivery: selectedDeliveryTypeOption?.value === 'home',
          totalAmount: total,
          isRedZone: isRedZone,
          deliveryPartner: isRedZone ? selectedDeliveryPartner : null,
          deliveryTimeMessage: isRedZone ? deliveryTimeMessage : null,
          deliveryPartnerPrice: isRedZone ? deliveryPartnerPrice : null,
          orderedBefore12PM: isBefore12PM,
          ...({
            latitude: locationCoordinates?.latitude || location.lat,
            longitude: locationCoordinates?.longitude || location.lng,
            locationAddress: locationCoordinates?.address || shippingLocation
          })
        },
        onSuccess: (response) => {
          const backendOrderId = response?.data?.orderId || response?.orderId || orderId
          
          setShowQRModal(false)
          
          let successMessage = ''
          if (isRedZone && selectedDeliveryPartner === 'third_party') {
            successMessage = `
              <div style="line-height: 1.6;">
                <strong>🎉 Order placed successfully with Thu Express!</strong><br/>
                <span style="font-size: 14px;">Order ID: ${backendOrderId}</span><br/>
                <span style="font-size: 13px; color: #059669; font-weight: 600;">${deliveryTimeMessage}</span><br/>
                <span style="font-size: 13px; color: #666;">Delivery charge: ${getNprPrice(deliveryPartnerPrice)}</span>
              </div>
            `
          } else if (isRedZone) {
            successMessage = `
              <div style="line-height: 1.6;">
                <strong>✅ Order placed successfully with NCM Delivery!</strong><br/>
                <span style="font-size: 14px;">Order ID: ${backendOrderId}</span><br/>
                <span style="font-size: 13px; color: #059669; font-weight: 600;">${deliveryTimeMessage}</span><br/>
                <span style="font-size: 13px; color: #666;">Delivery charge: ${getNprPrice(deliveryPartnerPrice)}</span>
              </div>
            `
          } else if (isInsideValley && isHomeDelivery) {
            successMessage = `
              <div style="line-height: 1.6;">
                <strong>✅ Order placed successfully!</strong><br/>
                <span style="font-size: 14px;">Order ID: ${backendOrderId}</span><br/>
                <span style="font-size: 13px; color: #059669; font-weight: 600;">Standard delivery area</span><br/>
                <span style="font-size: 13px; color: #666;">Delivery charge: ${getNprPrice(shippingRate)}</span>
              </div>
            `
          } else {
            successMessage = `
              <div style="line-height: 1.6;">
                <strong>✅ Order placed successfully!</strong><br/>
                <span style="font-size: 14px;">Order ID: ${backendOrderId}</span><br/>
                <span style="font-size: 13px; color: #666;">Please contact us for further information</span>
              </div>
            `
          }
          
          toast.success(
          `Ordered Placed Successfully orderId: ${backendOrderId}.`,
            { duration: 10000 }
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
          openWhatsApp(backendOrderId)
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
    giftBoxCharge,
    includeGiftBox,
    shippingLocation,
    total,
    subtotal,
    isHomeDelivery,
    locationCoordinates,
    paymentReferenceId,
    location,
    isRedZone,
    selectedDeliveryPartner,
    deliveryTimeMessage,
    deliveryPartnerPrice,
    isBefore12PM
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

    // Regenerate payment reference for each checkout attempt
    setPaymentReferenceId(generatePaymentReference())

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
    processOrder,
    generatePaymentReference
  ])

  const resetForm = useCallback(() => {
    setSelectedValleyOption({
      id: 'inside',
      label: 'Inside Kathmandu Valley',
      value: 'inside'
    })
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
    setIncludeGiftBox(false)
    setIsRedZone(false)
    setSelectedDeliveryPartner('ncm')
    setDeliveryTimeMessage('Same day if ordered before 12:00 PM, otherwise tomorrow')
    setDeliveryPartnerPrice(120)
    setPaymentReferenceId(generatePaymentReference())
  }, [generatePaymentReference])

  const openWhatsApp = useCallback((orderId: string) => {
    // Determine payment scenario
    const isOutsideValley = isInsideValley === false;
    const isPhonePay = isPhonePaySelected;
    
    let message = '';

    console.log(isOutsideValley, isPhonePaySelected, "is sssssssss")
    
    if (isOutsideValley) {
      console.log(isOutsideValley, isPhonePaySelected, "is sssssssss.  aaa")

      if(isPhonePaySelected){
        message = `नमस्ते! 🙏

Order ID: ${orderId}
Payment Reference: ${paymentReferenceId}

मैले पूरा रकम पेमेन्ट गरिसकेको छु।

Payment Screenshot यसै म्यासेजमा पठाउँदै छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।

धन्यवाद! 🙏`;
      } else {
        message = `नमस्ते! 🙏

Order ID: ${orderId}
Payment Reference: ${paymentReferenceId}

मैले Rs. ${shippingRate} एडभान्स पेमेन्ट गरिसकेको छु।

Payment Screenshot यसै म्यासेजमा पठाउँदै छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।

धन्यवाद! 🙏`;
      }
    } else {
      if(isPhonePaySelected){
        message = `नमस्ते! 🙏

Order ID: ${orderId}
Payment Reference: ${paymentReferenceId}

मैले पूरा रकम पेमेन्ट गरिसकेको छु।

Payment Screenshot यसै म्यासेजमा पठाउँदै छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।धन्यवाद! 🙏`;
      } else {
        console.log(isOutsideValley, isPhonePaySelected, "is sssssssss.  bbb")
        
        // Add red zone info to message if applicable
        let deliveryInfo = '';
        if (isRedZone) {
          const partnerName = selectedDeliveryPartner === 'third_party' ? 'Thu Express' : 'NCM Delivery';
          deliveryInfo = `\nDelivery Partner: ${partnerName}\nDelivery Time: ${deliveryTimeMessage}`;
        }
        
        message = `नमस्ते! 🙏

Order ID: ${orderId}
${deliveryInfo}

मैले Cash on Delivery को लागि अर्डर गरेको छु।

कृपया मेरो अर्डर कन्फर्म गरिदिनुहोस्।

धन्यवाद! 🙏`;
      }
    }
    
    const whatsappUrl = `https://wa.me/9779867072373?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, [isInsideValley, isPhonePaySelected, paymentReferenceId, isRedZone, selectedDeliveryPartner, deliveryTimeMessage, shippingRate])

  // Gift Box Modal Component (unchanged from your original)
  const GiftBoxModal = () => {
    if (!showGiftBoxModal) return null

    const selectedImage = GIFT_BOX_IMAGES[selectedGiftBoxIndex]

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        padding: '20px',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc'
          }}>
            <div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Gift Box Preview
              </h3>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '14px', 
                color: '#6b7280'
              }}>
                Click image to switch between views
              </p>
            </div>
            
            <div
              onClick={() => setShowGiftBoxModal(false)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                color: 'white',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
              }}
            >
              ×
            </div>
          </div>

          {/* Main Image */}
          <div style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            cursor: 'pointer'
          }}
          onClick={() => {
            setSelectedGiftBoxIndex((prev) => (prev + 1) % GIFT_BOX_IMAGES.length)
          }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              height: '400px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              backgroundColor: 'white'
            }}>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '16px'
                }}
                onError={(e) => {
                  console.error('Gift box image failed to load');
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div style="
                      width: 100%;
                      height: 100%;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                      color: #92400e;
                      font-weight: bold;
                      font-size: 20px;
                      text-align: center;
                    ">
                      <div style="font-size: 48px; margin-bottom: 16px;">🎁</div>
                      <div>Premium Gift Box</div>
                      <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">Click to view other angle</div>
                    </div>
                  `;
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                View {selectedGiftBoxIndex + 1}/{GIFT_BOX_IMAGES.length}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f8fafc',
            textAlign: 'center'
          }}>
            <p style={{ 
              margin: '0 0 12px 0', 
              fontSize: '14px', 
              color: '#6b7280'
            }}>
              Click on the image above to switch between different views of our premium gift box
            </p>
            <button
              onClick={() => setShowGiftBoxModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    )
  }

// Enhanced QR Payment Modal Component - Full Width, No Scroll
const QRPaymentModal = () => {
  if (!showQRModal) return null;

  // Determine payment scenario
  const isOutsideValleyCOD = isInsideValley === false && isPhonePaySelected === false
  const requiresAdvancePayment = isOutsideValleyCOD;
  const advanceAmount = shippingRate;

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

  // Get QR image based on selection
  const getQRImage = () => {
    if (selectedQRPaymentMethod === PAYMENT_OPTIONS.ESEWA) {
      return "/assets/images/abhusanEsewa.jpeg";
    }
    return "/assets/images/qrbanksample.jpeg";
  };

  // Get payment method name
  const getPaymentMethodName = () => {
    if (selectedQRPaymentMethod === PAYMENT_OPTIONS.ESEWA) {
      return "eSewa";
    }
    return "Bank Transfer";
  };

  // Get steps based on scenario
  const getPaymentSteps = () => {
    if (requiresAdvancePayment) {
      return [
        'Scan / Screenshot this QR code',
        `Open ${getPaymentMethodName()} app`,
        `Pay NPR ${advanceAmount} advance payment`,
        `Add Payment Reference: ${paymentReferenceId} in remarks`,
        'Send payment screenshot to WhatsApp: 977-9861698400',
        'We will confirm your order via WhatsApp'
      ];
    } else {
      return [
        'Scan / Screenshot this QR code',
        `Open ${getPaymentMethodName()} app`,
        'Pay the complete amount shown above',
        `Add Payment Reference: ${paymentReferenceId} in remarks`,
        'Complete the payment transaction',
        'Click "Complete Payment" button below'
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
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1400px',
        height: '90vh',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          // padding: '20px 32px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          flexShrink: 0
        }}>
          {/* <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '22px', 
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              Complete Your Payment
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              opacity: 0.9 
            }}>
              Choose your preferred payment method
            </p>
          </div> */}
      
        </div>

            <div
            onClick={() => setShowQRModal(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '24px',
              color: 'white',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
          >
            ×
          </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: !media?.md?'column':'row',
          // overflow: !media?.md?'unset':'hidden',
          // minHeight: 0
        }}>
          {/* Left Side - QR Code & Amount */}
          <div style={{
            // width: '45%',
            // padding: '32px',

                   width: !media?.md?'100%':'45%',
            padding:'20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            borderRight: '1px solid #e5e7eb',
            gap: '24px'
          }}>
            {/* Payment Method Selection */}
            <div style={{ width: '100%' }}>
              <Label style={{ 
                marginBottom: '12px', 
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                display: 'block'
              }}>
                Select Payment Method:
              </Label>
              <div style={{ 
                display: 'flex', 
                gap: '12px'
              }}>
                <div 
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    border: `2px solid ${
                      selectedQRPaymentMethod === PAYMENT_OPTIONS.ESEWA ? '#10b981' : '#e5e7eb'
                    }`,
                    borderRadius: '12px',
                    backgroundColor: selectedQRPaymentMethod === PAYMENT_OPTIONS.ESEWA ? '#f0fdf4' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                  onClick={() => handleQRPaymentMethodChange(PAYMENT_OPTIONS.ESEWA)}
                >
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '600',
                    color: selectedQRPaymentMethod === PAYMENT_OPTIONS.ESEWA ? '#059669' : '#6b7280'
                  }}>
                    eSewa
                  </div>
                </div>
                <div 
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    border: `2px solid ${
                      selectedQRPaymentMethod === PAYMENT_OPTIONS.BANK_TRANSFER ? '#3b82f6' : '#e5e7eb'
                    }`,
                    borderRadius: '12px',
                    backgroundColor: selectedQRPaymentMethod === PAYMENT_OPTIONS.BANK_TRANSFER ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                  onClick={() => handleQRPaymentMethodChange(PAYMENT_OPTIONS.BANK_TRANSFER)}
                >
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '600',
                    color: selectedQRPaymentMethod === PAYMENT_OPTIONS.BANK_TRANSFER ? '#1d4ed8' : '#6b7280'
                  }}>
                    Bank Transfer
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{
                position: 'relative',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '3px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={getQRImage()}
                  alt={`${getPaymentMethodName()} QR Code`}
                  style={{
                    width: '280px',
                    height: '280px',
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.error('QR Code image failed to load');
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {getPaymentMethodName()}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div style={{
              width: '100%',
              backgroundColor: requiresAdvancePayment ? '#fff7ed' : '#f0f9ff',
              border: `2px solid ${requiresAdvancePayment ? '#f59e0b' : '#3b82f6'}`,
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '14px', 
                color: requiresAdvancePayment ? '#d97706' : '#1e40af',
                marginBottom: '8px',
                fontWeight: '600'
              }}>
                {getPaymentTitle()}
              </div>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold',
                color: requiresAdvancePayment ? '#92400e' : '#1e3a8a',
                lineHeight: '1.2'
              }}>
                {getPaymentAmount()}
              </div>
              {requiresAdvancePayment && (
                <div style={{
                  fontSize: '13px',
                  color: '#92400e',
                  marginTop: '12px',
                  padding: '10px 14px',
                  backgroundColor: '#fed7aa',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: '1px solid #fdba74'
                }}>
                  Balance {getNprPrice(total - advanceAmount)} payable on delivery
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Instructions */}
          <div style={{
            // width: '55%',

                 width: !media?.md?'100%':'55%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'hidden'
          }}>
            {/* Payment Reference ID */}
            <div style={{
              backgroundColor: 'rgb(255 237 254)',
              border: '2px dashed #f59e0b',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              flexShrink: 0
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#d97706',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📝</span>
                Payment Reference ID (Required)
              </div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700',
                color: '#92400e',
                fontFamily: 'monospace',
                backgroundColor: '#fed7aa',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #fdba74',
                wordBreak: 'break-all'
              }}>
                {paymentReferenceId}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#b45309',
                marginTop: '10px',
                lineHeight: '1.5',
                fontWeight:'bold'
              }}>
                <strong>Important:</strong> You MUST add this Reference ID in the remarks/notes section when making the payment.
              </div>
            </div>

            {/* Instructions */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0
              }}>
                <span>📋</span>
                {requiresAdvancePayment ? 'Steps to confirm your order:' : 'Steps to complete payment:'}
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: !media.md?'repeat(1, 1fr)':'repeat(2, 1fr)',
              
                gap: '12px',
                fontSize: '14px',
                flex: 1,
                alignContent: 'start'
              }}>
                {getPaymentSteps().map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: index === 3 ? 'rgb(255, 237, 254)' : 'white',
                    borderRadius: '10px',
                    border: index === 3 ? '2px solid rgb(255 237 254)' : '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor:  '#22c55e',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <div style={{
                      color: index === 3 ? '#92400e' : '#4b5563',
                      lineHeight: '1.5',
                      fontWeight: index === 3 ? '600' : '400',
                      fontSize: '13px'
                    }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div style={{ flexShrink: 0, marginTop: '24px' }}>
              {!requiresAdvancePayment ? (
                <button
                  onClick={processOrder}
                  style={{
                    width: '100%',
                    padding: '18px',
                    fontSize: '16px',
                    fontWeight: '700',
                    backgroundColor: '#ec4899',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#db2777';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(236, 72, 153, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ec4899';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.3)';
                  }}
                >
                  Complete Payment
                </button>
              ) : (
                <button
                  onClick={() => {
                    processOrder();
                    setShowQRModal(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '18px',
                    fontSize: '16px',
                    fontWeight: '700',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  📱 I've Sent the Payment Screenshot
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  // Map Picker Modal (unchanged from your original)
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
            <div style={{ display: 'flex', gap: '8px', flexDirection:!media.sm ? 'column' : 'row' }}>
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
              // marginTop: '12px',
              lineHeight: '1.5'
            }}>
              📍 Location is required for accurate home delivery
            </p>
          </>
        )}
      </div>
    )
  }

  // Red Zone Delivery Partner Section
const RedZoneDeliverySection = () => {
  if (!isRedZone || !isInsideValley || selectedDeliveryTypeOption?.value !== 'home') {
    return null
  }

  const getProbableDeliveryTime = (partnerValue: string) => {
    // You already have logic inside getDeliveryTimeMessage
    // Just reuse it but rename for UX clarity
    return getDeliveryTimeMessage(partnerValue)
  }

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: 'rgb(250 237 255)',
        borderRadius: '14px',
        border: '2px solid rgb(245 11 161)',
        marginBottom: '20px'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '18px'
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            backgroundColor: 'rgb(250 237 255)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          🚚
        </div>

        <div>
          <h4
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 700,
              color: '#92400e'
            }}
          >
            Delivery Availability (Red Zone)
          </h4>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '14px',
              color: '#b45309'
            }}
          >
            Choose the delivery option that works best for you
          </p>
        </div>
      </div>

      {/* Delivery Partner Cards */}
      <Label
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '12px',
          display: 'block'
        }}
      >
        Select Delivery Partner
      </Label>

      <div
        style={{
          display: 'flex',
          flexDirection: !media.sm ? 'column' : 'row',
          gap: '14px'
        }}
      >
        {DELIVERY_PARTNER_OPTIONS.map((partner) => {
          const isSelected = selectedDeliveryPartner === partner.value
          const probableDeliveryTime = getProbableDeliveryTime(partner.value)

          return (
            <div
              key={partner.id}
              onClick={() => handleDeliveryPartnerChange(partner.value)}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: `2px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
                backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Top */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: isSelected ? '#059669' : '#374151'
                    }}
                  >
                    {partner.label}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      marginTop: '2px'
                    }}
                  >
                    {/* {partner.description} */}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: isSelected ? '#059669' : '#111827'
                  }}
                >
                  {getNprPrice(partner.price)}
                </div>
              </div>

              {/* Delivery Time */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#dcfce7' : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: '13px',
                  color: isSelected ? '#065f46' : '#374151',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ⏱️ Probable Delivery:
                <span>{probableDeliveryTime}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


  // Compact Gift Box Section Component
  const GiftBoxSection = () => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        backgroundColor: 'rgb(250 237 255)',
        borderRadius: '12px',
        border: '2px solid rgb(245 11 161)',
        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.1)',
        height: 'auto',
        minHeight: '220px'
      }}>
        {/* Header with Toggle */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          flexDirection:!media.md ? 'column' : 'row',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              backgroundColor: '#fef3c7',
              borderRadius: '10px',
              fontSize: '24px',
              boxShadow: '0 3px 8px rgba(249, 115, 22, 0.2)'
            }}>
              🎁
            </div>
            <div>
              <h4 style={{ 
                margin: 0, 
                fontSize: '17px', 
                fontWeight: '700',
                color: '#92400e'
              }}>
                Add Gift Box
              </h4>
              <p style={{ 
                margin: '2px 0 0 0', 
                fontSize: '13px', 
                color: '#b45309'
              }}>
                Make your order extra special
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#f59e0b',
              color: 'white',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              boxShadow: '0 3px 8px rgba(245, 158, 11, 0.3)'
            }}>
              +{getNprPrice(GIFT_BOX_CHARGE)}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
            onClick={handleGiftBoxToggle}
            >
              <div style={{
                width: '40px',
                height: '20px',
                backgroundColor: includeGiftBox ? '#10b981' : '#d1d5db',
                borderRadius: '10px',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: includeGiftBox ? '22px' : '2px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Gift Box Preview - Compact Single Display */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          marginTop: '4px'
        }}>
          <div
            style={{
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#f3f4f6',
              position: 'relative',
              cursor: 'pointer',
              border: '2px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}
            onClick={handleGiftBoxImageClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#93c5fd';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%'
            }}>
              {/* Main image */}
              <img
                src={GIFT_BOX_IMAGES[0].src}
                alt="Premium Gift Box"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit:'contain'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div style="
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                      color: #92400e;
                    ">
                      <div style="text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">🎁</div>
                        <div style="font-weight: bold; font-size: 16px;">Premium Gift Box</div>
                        <div style="font-size: 12px; margin-top: 4px;">Click to preview</div>
                      </div>
                    </div>
                  `;
                }}
              />
              
              {/* Overlay with info */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                color: 'white',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#1f2937',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  Click to View
                </div>
              </div>
              
              {/* Multiple images indicator */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '700'
              }}>
                2 Views
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        {includeGiftBox && (
          <div style={{
            padding: '6px 12px',
            backgroundColor: '#dcfce7',
            borderRadius: '6px',
            border: '1px solid #86efac',
            marginTop: '4px',
            textAlign: 'center'
          }}>
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: '600',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '14px' }}>✓</span>
              Gift box added! Your order will be beautifully packaged.
            </p>
          </div>
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
      alignItems: 'flex-start',
      padding: media.sm ? '16px' : '24px',
      // maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <QRPaymentModal />
      <GiftBoxModal />
      <MapPickerModal />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        width: media.md ? '50%' : '100%' 
      }}>
        {cartProducts.map((item, index) => (
          <CartCard key={`${item._id}-${index}`} data={item} onChangePrice={handleQuantityChange} />
        ))}
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        width: media.md ? '50%' : '100%',
        position: media.md ? 'sticky' : 'static',
        top: media.md ? '20px' : 'auto'
      }}>
        <div className="cartPage-orderSummary" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="cartPage-orderSummary-title" style={{ 
              fontSize: '20px', 
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Order Summary
            </p>
            <p className="cartPage-orderSummary-itemCount" style={{
              fontSize: '14px',
              color: '#64748b',
              backgroundColor: '#e2e8f0',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: '500',
              margin: 0
            }}>
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%',
            paddingBottom: '12px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: 0, fontSize: '16px', color: '#475569' }}>Subtotal</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{getNprPrice(subtotal)}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Label style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>Location Type *</Label>
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
              flexDirection: !media.sm ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              width: '100%', 
              gap: '12px'
            }}
              className='cart-delivery'
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%' }}>
                <Label style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>District *</Label>
                <SelectField
                  options={districtOptions}
                  width="100%"
                  onChangeValue={setSelectedDistrictOption}
                  placeholder="Select District"
                  containerStyle={{ width: '100%' }}
                  value={selectedDistrictOption}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%' }}>
                <Label style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>Municipality *</Label>
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
            flexDirection: !media.sm ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            width: '100%', 
            gap: '12px' 
          }}
          className='cart-delivery'
          >
            {!isInsideValley && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%' }}>
                <Label style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>Area *</Label>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%' }}>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}
            //  title="Delivery Type"   
              >Delivery Type *</p>
              <SelectField
                options={
                  selectedValleyOption?.id === 'inside'
                  ?[ {
                    id: 'home',
                    label: 'Home Delivery',
                    value: 'home'
                  }]: DELIVERY_TYPE_OPTIONS}
                width="100%"
                onChangeValue={setSelectedDeliveryTypeOption}
                placeholder="Delivery Type"
                containerStyle={{ width: '100%' }}
                value={selectedDeliveryTypeOption}
              />
            </div>
          </div>

                {/* Location Picker Section (for home delivery) */}
          {selectedDeliveryTypeOption?.value === 'home' && (
            <LocationPickerSection />
          )}

      


          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Label style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>Shipping Details *</Label>
            <div style={{ display: 'flex', flexDirection: !media.sm ? 'column' : 'row', gap: '12px', width: '100%' }}>
              <div style={{ flex: 1, width: '100%' }}>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}
            //  title="Delivery Type"   
              >Exact Location </p>
                <InputField
                  onChange={(e:any) => setShippingLocation(e.target.value)}
                  placeholder="Full address *"
                  value={shippingLocation}
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                />
                {isInsideValley && selectedDeliveryTypeOption?.value === 'home' && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: isRedZone ? '#d97706' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isRedZone ? (
                      <>
                        <span>⚠️</span>
                        <span>Red zone area detected. Special delivery options available above.</span>
                      </>
                    ) : (
                      <>
                        <span>📍</span>
                        <span>Normal delivery area. Standard rates apply.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, width: '100%' }}>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}
            //  title="Delivery Type"   
              >Phone Number </p>
                <InputField
                  onChange={(e:any) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number *"
                  value={phoneNumber}
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                  type="tel"
                />
              </div>
            </div>
          </div>
    {/* Red Zone Delivery Section */}
                    <RedZoneDeliverySection />

    

          {/* Compact Gift Box Section */}
          <GiftBoxSection />

          {/* Display Gift Box Charge */}
          {includeGiftBox && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              width: '100%',
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', color: '#92400e', fontWeight: '600' }}>🎁</span>
                <p style={{ margin: 0, fontSize: '16px', color: '#92400e' }}>Gift Box Packaging</p>
              </div>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#92400e' }}>{getNprPrice(giftBoxCharge)}</p>
            </div>
          )}

          {/* Shipping Cost Display */}
          {isLocationComplete && (
            shippingRate === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <p style={{ margin: 0, fontSize: '16px', color: '#475569' }}>Shipping Cost</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>Free</p>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '16px', color: '#475569' }}>Shipping Cost</p>
                  {isRedZone && (
                    <span style={{
                      fontSize: '11px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {selectedDeliveryPartner === 'third_party' ? 'Thu Express' : 'NCM Delivery'}
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                  {getNprPrice(shippingRate)}
                </p>
              </div>
            )
          )}
{
  isInsideValley &&       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
  <p>Shipping Cost</p>
  <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                  {getNprPrice(shippingRate)}
                </p>
</div>
}
    

          <div
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              width: '100%', 
              fontWeight: 'bold', 
              fontSize: '18px',
              paddingTop: '12px',
              borderTop: '2px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ margin: 0, color: '#1e293b' }}>Total</p>
              {isRedZone && (
                <p style={{ 
                  margin: '4px 0 0 0', 
                  fontSize: '12px', 
                  color: '#92400e',
                  fontWeight: 'normal'
                }}>
                  {deliveryTimeMessage}
                </p>
              )}
            </div>
            <p style={{ margin: 0, color: '#1e293b' }}>{getNprPrice(total)}</p>
          </div>


            

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Label style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>Order Note (Optional)</Label>
            <TextArea
              onChange={e => setOrderNote(e.target.value)}
              style={{ 
                width: '100%', 
                fontSize: '15px', 
                minHeight: '100px',
                padding: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                resize: 'vertical'
              }}
              value={orderNote}
              placeholder="Any special instructions or delivery notes..."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <Label style={{ fontSize: '15px', fontWeight: '600', color: '#374151' }}>Payment Method *</Label>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: !media.sm ? 'column' : 'row',
              gap: '16px', 
              width: '100%' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer',
                padding: '16px',
                border: `2px solid ${selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY ? '#007bff' : '#e5e7eb'}`,
                borderRadius: '12px',
                backgroundColor: selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY ? '#f0f9ff' : '#f9fafb',
                transition: 'all 0.2s ease',
                flex: 1
              }}
              onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.PHONE_PAY)}
              >
                <input
                  type="radio"
                  id="payment-phone-pay"
                  name="payment-method"
                  value={PAYMENT_METHODS.PHONE_PAY}
                  checked={selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  style={{
                    width: '20px',
                    height: '20px',
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
                    color: selectedPaymentMethod === PAYMENT_METHODS.PHONE_PAY ? '#007bff' : '#374151',
                    fontWeight: '600',
                    flex: 1,
                    margin: 0
                  }}
                >
                  Phone Pay
                </label>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                cursor: 'pointer',
                padding: '16px',
                border: `2px solid ${selectedPaymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? '#10b981' : '#e5e7eb'}`,
                borderRadius: '12px',
                backgroundColor: selectedPaymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? '#f0fdf4' : '#f9fafb',
                transition: 'all 0.2s ease',
                flex: 1
              }}
              onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.CASH_ON_DELIVERY)}
              >
                <input
                  type="radio"
                  id="payment-cash-on-delivery"
                  name="payment-method"
                  value={PAYMENT_METHODS.CASH_ON_DELIVERY}
                  checked={selectedPaymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY}
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: '#10b981'
                  }}
                />
                <label 
                  htmlFor="payment-cash-on-delivery" 
                  style={{ 
                    fontSize: '16px', 
                    cursor: 'pointer', 
                    userSelect: 'none',
                    color: selectedPaymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY ? '#059669' : '#374151',
                    fontWeight: '600',
                    flex: 1,
                    margin: 0
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
            padding: '10px',
            fontSize: '18px',
            fontWeight: '700',
            backgroundColor: (hasProducts && !isHolidayModeActive) ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: (hasProducts && !isHolidayModeActive) ? 'pointer' : 'not-allowed',
            opacity: (hasProducts && !isHolidayModeActive) ? 1 : 0.6,
            textAlign: 'center',
            transition: 'all 0.3s ease',
            boxShadow: (hasProducts && !isHolidayModeActive) ? '0 4px 12px rgba(0, 123, 255, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (hasProducts && !isHolidayModeActive) {
              e.currentTarget.style.backgroundColor = '#0056b3';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (hasProducts && !isHolidayModeActive) {
              e.currentTarget.style.backgroundColor = '#007bff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
            }
          }}
        >
          {isHolidayModeActive ? 'Orders Temporarily Unavailable' : 
           isRedZone && selectedDeliveryPartner === 'third_party' ? 'Place Order with Thu Express' : 
           'Place Order'}
        </div>
        
        <HolidayModeBanner />

        <p style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666',
          lineHeight: '1.6'
        }}>
          Need help? For order details{' '}
          <a 
            href={`tel:${CONTACT_NUMBER}`} 
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Call us: {CONTACT_NUMBER}
          </a>
        </p>
      </div>
    </div>
  )
}