
// import React, { useEffect, useState, useCallback, useMemo } from 'react'
// import { useDispatch } from 'src/store'
// import ReactDOM from 'react-dom/client'
// import { useSelector } from 'react-redux'
// import {
//   Box,
//   Button,
//   CheckBox,
//   HStack,
//   Modal,
//   SelectField,
//   Table
// } from 'src/app/common'
// import { useNavigate } from 'react-router-dom'

// import { getOrderListAction, updateOrderByIdAction } from '../web/cart/cart.slice'
// import { getNprPrice } from 'src/helpers/nprPrice.helper'
// import QRCode from 'qrcode'
// import JsBarcode from 'jsbarcode'

// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   PDFViewer,
//   Font,
//   Image,
//   Canvas
// } from '@react-pdf/renderer'
// import { AiOutlineClose } from 'react-icons/ai'
// import { MdCheckBoxOutlineBlank } from 'react-icons/md'
// import { IoCheckboxOutline } from 'react-icons/io5'
// import toast from 'react-hot-toast'
// import { AxiosResponse } from 'axios'
// import { EditIcon, Eye, Trash2 } from 'lucide-react'
// import { BASE_URL, FILE_URL } from 'src/config'

// export const OrderListPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const [orderList, setOrderLists] = useState<any>()
//   const [selectedCategory, setSelectedCategory] = useState<any>()

//   // Backend-driven orders state
//   const [orders, setOrders] = useState<any[]>([])
//   const [totalOrders, setTotalOrders] = useState<number>(0)
//   const [page, setPage] = useState<number>(1)
//   const [limit, setLimit] = useState<number>(10)
//   const [loading, setLoading] = useState<boolean>(false)

//   // Date filter states
//   const [startDate, setStartDate] = useState<string>('')
//   const [endDate, setEndDate] = useState<string>('')
//   const [dateFilterType, setDateFilterType] = useState<string>('all')
//   const [showCustomDateInputs, setShowCustomDateInputs] = useState<boolean>(false)
  
//   // Search state
//   const [searchQuery, setSearchQuery] = useState<string>('')

//   // Delivery partner states
//   const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
//   const [deliveryPartner, setDeliveryPartner] = useState<string>('')
//   const [isUpdating, setIsUpdating] = useState<boolean>(false)
//   const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)
//   const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null)
//   const [editingNcmOrderId, setEditingNcmOrderId] = useState<string | null>(null)
//   const [ncmDestinationBranch, setNcmDestinationBranch] = useState<string>('')
//   const [ncmBranches, setNcmBranches] = useState<string[]>([])
//   const [isLoadingNcmBranches, setIsLoadingNcmBranches] = useState<boolean>(false)
//   const [updatingNcmBranchOrderId, setUpdatingNcmBranchOrderId] = useState<string | null>(null)


//   // Fetch orders from backend on filter/search/page change

//   const fetchOrders = useCallback(async () => {
//     setLoading(true)
//     try {
//       // Build query params
//       const params = new URLSearchParams();
//       params.set('page', String(page));
//       params.set('limit', String(limit));
//       if (searchQuery) params.set('search', searchQuery);
//       if (dateFilterType && dateFilterType !== 'all') {
//         params.set('dateFilter', dateFilterType);
//         if (dateFilterType === 'custom') {
//           if (startDate) params.set('startDate', startDate);
//           if (endDate) params.set('endDate', endDate);
//         }
//       }
//       const query = params.toString() ? `?${params.toString()}` : '';
//       const res = await fetch(`${BASE_URL}/order${query}`);
//       const data = await res.json();
//       setOrders(data.orders || data.orderData || []);
//       setTotalOrders(data.totalCount || data.total || 0);
//     } catch (err) {
//       setOrders([]);
//       setTotalOrders(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, limit, searchQuery, dateFilterType, startDate, endDate]);

//   useEffect(() => {
//     fetchOrders()
//     // eslint-disable-next-line
//   }, [fetchOrders])

//   const [showDetails, setShowDetails] = useState<boolean>(false)
//   const [activeOrderDetails, setActiveOrderDetails] = useState<any>(undefined)
//   const [activeData, setActiveData] = useState<any>([{}])

//   const [showOrderModal, setShowOrderModal] = useState(false)
//   const [modalOrder, setModalOrder] = useState<any>(null)
//   const [modalTracking, setModalTracking] = useState<any>(null)
//   const [modalTrackingLoading, setModalTrackingLoading] = useState<boolean>(false)

//   const orderPdf = useMemo(() => {
//     if (!!activeOrderDetails) {
//       return <OrderPDF data={activeData} />
//     }
//   }, [activeOrderDetails, showDetails])

//   const [dataToPrint, setDataToPrint] = useState<any>([])

//   const BulkActionHandler = (value, ordersData) => {
//     if (value) {
//       setDataToPrint((prev: any) => [
//         ...prev,
//         { data: ordersData, isPrinting: value }
//       ])
//     }
//   }

//   // Helper function to parse date from OrderedAt string
//   const parseOrderDate = (dateString: string) => {
//     return parseDate(dateString)
//   }

//   // Helper function to get date range based on filter type
//   const parseDate = (dateStr: string): Date | null => {
//     if (!dateStr) return null

//     // Try native parser first (works for MM/DD/YYYY)
//     let date = new Date(dateStr)
//     if (!isNaN(date.getTime())) return date

//     // Handle DD/MM/YYYY or DD/MM/YYYY, HH:mm:ss formats
//     const [datePart, timePart] = dateStr.split(',')
//     const [day, month, year] = datePart.trim().split(/[\/\-]/).map(Number)

//     if (!day || !month || !year) return null

//     let [hours, minutes, seconds] = [0, 0, 0]
//     if (timePart) {
//       [hours, minutes, seconds] = timePart.trim().split(':').map(Number)
//       seconds = seconds || 0
//     }

//     return new Date(year, month - 1, day, hours, minutes, seconds)
//   }

//   const getDateRange = (
//     filterType: string,
//     startDate?: string,
//     endDate?: string
//   ) => {
//     const now = new Date()
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

//     switch (filterType) {
//       case 'today':
//         return {
//           start: today,
//           end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
//         }

//       case 'last1hour': {
//         const start = new Date(now.getTime() - 60 * 60 * 1000)
//         return { start, end: now }
//       }

//       case 'week':
//         const weekStart = new Date(today)
//         weekStart.setDate(today.getDate() - today.getDay())
//         return {
//           start: weekStart,
//           end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
//         }

//       case 'last7days': {
//         const start = new Date(now)
//         start.setDate(now.getDate() - 7)
//         return { start, end: now }
//       }

//       case 'month':
//         const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
//         return {
//           start: monthStart,
//           end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
//         }

//       case 'custom':
//         const parsedStart = parseDate(startDate || '')
//         const parsedEnd = parseDate(endDate || '')
//         return {
//           start: parsedStart,
//           end: parsedEnd ? new Date(parsedEnd.getTime() + 24 * 60 * 60 * 1000) : null,
//         }

//       default:
//         return { start: null, end: null }
//     }
//   }


//   // Remove local filtering: use backend orders

//   // Helper function to get total quantity for an order
//   const getTotalQuantity = (products: any[]) => {
//     return products?.reduce((total, product) => total + product.quantity, 0) || 0
//   }

//   // Helper function to get total price for an order
//   const getTotalPrice = (products: any[]) => {
//     return products?.reduce((total, product) => total + product.price, 0) || 0
//   }

//   // Helper function to open Google Maps location
//   const openGoogleMaps = (latitude: number, longitude: number) => {
//     if (latitude && longitude) {
//       const url = `https://www.google.com/maps?q=${latitude},${longitude}`
//       window.open(url, '_blank')
//     }
//   }

//   const toSafeList = (value: any): any[] => {
//     if (Array.isArray(value)) return value
//     if (value && typeof value === 'object') return Object.values(value)
//     return []
//   }

//   const takeFirst = (value: any, count: number): any[] => {
//     const list = toSafeList(value)
//     const max = Math.max(0, Number(count || 0))
//     const result: any[] = []
//     for (let i = 0; i < list.length && i < max; i += 1) {
//       result.push(list[i])
//     }
//     return result
//   }

//   const formatDateTime = (value: any) => {
//     if (!value) return '-'
//     const parsed = new Date(value)
//     if (Number.isNaN(parsed.getTime())) return String(value)
//     return parsed.toLocaleString()
//   }

//   // Helper function to get location display name
//   const getLocationDisplayName = (order: any) => {
//     if (order.locationAddress) {
//       return order.locationAddress
//     }
//     if (order.latitude && order.longitude) {
//       return `${order.latitude.toFixed(6)}, ${order.longitude.toFixed(6)}`
//     }
//     return 'No location data'
//   }

//   // Confirm order from admin panel, then optionally open WhatsApp helper.
//   const sendWhatsAppMessage = async (order: any) => {
//     console.log(order,"order finally")

//     if (!order?._id) {
//       toast.error('Invalid order')
//       return
//     }

//     if (confirmingOrderId) {
//       return
//     }

//     if (order?.isConfirmed) {
//       toast('This order is already confirmed.')
//       return
//     }

//     setConfirmingOrderId(order._id)
//     try {
//       let confirmationUpdated = false
//       let ncmMeta: any = null
//       await dispatch(
//         updateOrderByIdAction({
//           id: String(order._id),
//           data: {
//             isConfirmed: true,
//             confirmedAt: new Date().toISOString()
//           },
//           onSuccess: (response: AxiosResponse) => {
//             confirmationUpdated = true
//             ncmMeta = response?.data?.ncm || null
//           }
//         })
//       )

//       if (!confirmationUpdated) {
//         toast.error('Failed to confirm order. Please try again.')
//         return
//       }

//       if (ncmMeta?.success) {
//         const pickupText = ncmMeta?.skipped
//           ? `NCM pickup already existed (#${ncmMeta?.ncmOrderId || 'N/A'})`
//           : `NCM pickup created (#${ncmMeta?.ncmOrderId || 'N/A'})`
//         toast.success(`Order confirmed. ${pickupText}. Confirmation email has been sent to customer.`)
//       } else {
//         toast.success('Order confirmed. Confirmation email has been sent to customer.')
//         if (ncmMeta?.error) {
//           const shortError = String(ncmMeta.error).slice(0, 160)
//           toast.error(`NCM pickup sync failed: ${shortError}`)
//         }
//       }
//       await fetchOrders()
    
//     const phoneNumber = order.phoneNumber || '9841934343'
//     const customerName = order.userId?.name || order.userId?.email || 'Customer'
//     const orderId = order.productOrderId || order._id
    
//     const productsList = order.products?.map((product, index) => 
//       `${index + 1}. ${product.productId?.name} (Qty: ${product.quantity}, Price: ${getNprPrice(product.price)})`
//     ).join('\n') || 'No products listed'
    
//     const totalAmount = getNprPrice(order.totalAmount)
//     const shippingLocation = order.shippingLocation || order.locationAddress
//     const deliveryType = order.isInsideValley ? 'Home Delivery (Inside Valley)' : 'Office Delivery (Outside Valley)'
//     const paymentType = order.paymentMethod === 'phonepay' ? 'PhonePay' : 'Cash on Delivery (COD)'
    
//     let locationInfo = ''
//     if (order.latitude && order.longitude) {
//       locationInfo = `\n📍 *Location:* https://www.google.com/maps?q=${order.latitude},${order.longitude}`
//     }
    
//     const message = `🎉 *ORDER CONFIRMED* 🎉

// Dear ${customerName},

// Your order has been confirmed and is being processed!

// 📋 *Order Details:*
// Order ID: ${orderId}
// ${productsList}

// 💰 *Payment Summary:*
// Total Amount: ${totalAmount}
// Payment Method: ${paymentType}

// 🚚 *Delivery Information:*
// Delivery Type: ${deliveryType}
// Address: ${shippingLocation}${locationInfo}
// Estimated Delivery: ${order.isInsideValley ? "1 day" : "2–5 working days"}

// 📧 *Confirmation Email Sent:*
// We've sent your confirmation details and invoice image by email.

// Thank you for shopping with us! 
// We'll keep you updated on your order status.

// Best regards,
// Aabhushan Gallery Team`

//       const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
//       window.open(whatsappUrl, '_blank')
//     } catch (error) {
//       console.error('Error confirming order:', error)
//       toast.error('Failed to confirm order. Please try again.')
//     } finally {
//       setConfirmingOrderId(null)
//     }
//   }

//   // Function to handle delivery partner update
//   const handleDeliveryPartnerUpdate = async (orderId: string) => {
//     if (!deliveryPartner) {
//       toast.error('Please select a delivery partner')
//       return
//     }

//     setIsUpdating(true)
//     try {
//       await dispatch(
//         updateOrderByIdAction({
//           id: String(orderId),
//           data: { deliveryPartner },
//           onSuccess: (response: AxiosResponse) => {
//             toast.success('Delivery partner updated successfully')
//             setEditingOrderId(null)
//             setDeliveryPartner('')
            
//             // Refresh order list
//             dispatch(
//               getOrderListAction({
//                 onSuccess: () => console.log('Order list refreshed')
//               })
//             )
//           },
//           // onError: (error: any) => {
//           //   toast.error('Failed to update delivery partner: ' + error.message)
//           // }
//         })
//       )
//     } catch (error) {
//       toast.error('Error updating delivery partner')
//       console.error('Update error:', error)
//     } finally {
//       setIsUpdating(false)
//     }
//   }

//   // Function to start editing delivery partner
//   const startEditingDeliveryPartner = (order: any) => {
//     setEditingOrderId(order._id)
//     setDeliveryPartner(order.deliveryPartner || '')
//   }

//   // Function to cancel editing
//   const cancelEditing = () => {
//     setEditingOrderId(null)
//     setDeliveryPartner('')
//   }

//   const handleDeleteOrder = async (order: any) => {
//     const orderId = order?._id
//     const displayId = order?.productOrderId || orderId

//     if (!orderId) {
//       toast.error('Invalid order ID')
//       return
//     }

//     const shouldDelete = window.confirm(`Delete order ${displayId}? This cannot be undone.`)
//     if (!shouldDelete) return

//     setDeletingOrderId(orderId)

//     try {
//       const response = await fetch(`${BASE_URL}/order/${orderId}`, {
//         method: 'DELETE',
//       })

//       const data = await response.json().catch(() => ({}))

//       if (!response.ok || data?.success === false) {
//         throw new Error(data?.message || 'Failed to delete order')
//       }

//       toast.success(`Order ${displayId} deleted successfully`)

//       if (modalOrder?._id === orderId) {
//         closeOrderModal()
//       }

//       await fetchOrders()
//     } catch (error: any) {
//       toast.error(error?.message || 'Failed to delete order')
//     } finally {
//       setDeletingOrderId(null)
//     }
//   }

//   const fetchNcmBranches = useCallback(async () => {
//     if (ncmBranches.length > 0 || isLoadingNcmBranches) {
//       return
//     }

//     setIsLoadingNcmBranches(true)
//     try {
//       const response = await fetch(`${BASE_URL}/order/ncm/assigned-branches`)
//       const data = await response.json().catch(() => ({}))
//       if (!response.ok) {
//         throw new Error(data?.error || 'Failed to fetch NCM branches')
//       }

//       const branches = Array.isArray(data?.branches)
//         ? data.branches.map((item: any) => String(item).trim()).filter(Boolean)
//         : []

//       setNcmBranches(branches)
//     } catch (error: any) {
//       toast.error(error?.message || 'Failed to fetch NCM branches')
//     } finally {
//       setIsLoadingNcmBranches(false)
//     }
//   }, [ncmBranches, isLoadingNcmBranches])

//   const startEditingNcmBranch = async (order: any) => {
//     setEditingNcmOrderId(order._id)
//     setNcmDestinationBranch(order?.ncmDestinationBranch || '')
//     await fetchNcmBranches()
//   }

//   const cancelEditingNcmBranch = () => {
//     setEditingNcmOrderId(null)
//     setNcmDestinationBranch('')
//   }

//   const handleNcmBranchUpdate = async (orderId: string) => {
//     if (!orderId) return

//     setUpdatingNcmBranchOrderId(orderId)
//     try {
//       await dispatch(
//         updateOrderByIdAction({
//           id: String(orderId),
//           data: {
//             ncmDestinationBranch: ncmDestinationBranch ? ncmDestinationBranch.trim().toUpperCase() : '',
//           },
//           onSuccess: () => {
//             toast.success('NCM destination branch updated')
//             setEditingNcmOrderId(null)
//             setNcmDestinationBranch('')
//           },
//         })
//       )

//       await fetchOrders()
//     } catch (error: any) {
//       toast.error(error?.message || 'Failed to update NCM destination branch')
//     } finally {
//       setUpdatingNcmBranchOrderId(null)
//     }
//   }

//   // Helper function to render products list in a compact way
//   const renderProductsList = (products: any[]) => {
//     if (!products || products.length === 0) return <div>No products</div>
    
//     return (
//       <div style={{minWidth: '200px', maxWidth: '300px'}}>
//         {products.map((product, index) => (
//           <div key={index} style={{
//             marginBottom: '6px', 
//             fontSize: '12px',
//             lineHeight: '1.3'
//           }}>
//             <div style={{
//               fontWeight: 'bold',
//               marginBottom: '2px',
//               wordBreak: 'break-word',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               display: '-webkit-box',
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: 'vertical'
//             }}>
//               {product.productId?.name || 'Unknown Product'}
//             </div>
//             <div style={{
//               fontSize: '11px',
//               color: '#666',
//               display: 'flex',
//               justifyContent: 'space-between'
//             }}>
//               <span>Qty: {product.quantity}</span>
//               <div>
//                 Variant:
//                 <span
//                   style={{
//                     display: 'inline-block',
//                     height: '20px',
//                     width: '20px',
//                     backgroundColor: product.colorName,
//                     marginLeft: '8px',
//                     border: '1px solid #ccc',
//                     borderRadius: '4px'
//                   }}
//                 ></span>
//               </div>
//               <span>{getNprPrice(product.price)}</span>
//             </div>
//             {index < products.length - 1 && (
//               <hr style={{margin: '4px 0', opacity: 0.3, border: 'none', borderTop: '1px solid #eee'}} />
//             )}
//           </div>
//         ))}
//       </div>
//     )
//   }

//   // Format date helper
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '-'
    
//     try {
//       let date: Date

//       // Normalize commas and trim spaces
//       const cleanDate = dateString.replace(',', '').trim()

//       // Case 1: "10/29/2025, 10:58:40 AM" (MM/DD/YYYY)
//       if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(cleanDate)) {
//         date = new Date(cleanDate)
//       } 
//       // Case 2: "29/10/2025 12:29:09" (DD/MM/YYYY)
//       else if (/^\d{2}\/\d{2}\/\d{4}/.test(cleanDate)) {
//         const [day, month, yearAndTime] = cleanDate.split('/')
//         const [year, time] = yearAndTime.split(' ')
//         const isoString = `${year}-${month}-${day}T${time || '00:00:00'}`
//         date = new Date(isoString)
//       } 
//       else {
//         // fallback: try native parsing
//         date = new Date(cleanDate)
//       }

//       if (isNaN(date.getTime())) return dateString

//       return (
//         date.toLocaleDateString('en-GB') +
//         ' ' +
//         date.toLocaleTimeString('en-US', {
//           hour12: false,
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//         })
//       )
//     } catch {
//       return dateString
//     }
//   }

//   // Truncate text helper
//   const truncateText = (text: string, maxLength: number = 30) => {
//     if (!text) return 'N/A'
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
//   }

//   // Clear date filter
//   const clearDateFilter = () => {
//     setDateFilterType('all')
//     setStartDate('')
//     setEndDate('')
//     setShowCustomDateInputs(false)
//   }

//   // Clear search
//   const clearSearch = () => {
//     setSearchQuery('')
//   }

//   // Clear all filters
//   const clearAllFilters = () => {
//     clearDateFilter()
//     clearSearch()
//   }

//   // Handle custom date filter toggle
//   const handleCustomDateFilterToggle = () => {
//     if (dateFilterType === 'custom') {
//       setShowCustomDateInputs(!showCustomDateInputs)
//     } else {
//       setDateFilterType('custom')
//       setShowCustomDateInputs(true)
//     }
//   }

//   // Handle start date change
//   const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value
//     setStartDate(newValue)
//   }, [])

//   // Handle end date change
//   const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value
//     setEndDate(newValue)
//   }, [])

//   const fetchOrderTracking = useCallback(async (orderId: string) => {
//     setModalTrackingLoading(true)
//     try {
//       const response = await fetch(`${BASE_URL}/order/${orderId}/tracking`)
//       const json = await response.json()
//       if (!response.ok) {
//         throw new Error(json?.error || 'Failed to fetch tracking details')
//       }
//       setModalTracking(json)
//     } catch (_error) {
//       setModalTracking(null)
//     } finally {
//       setModalTrackingLoading(false)
//     }
//   }, [])

//   const openOrderModal = useCallback((order: any) => {
//     setModalOrder(order)
//     setShowOrderModal(true)
//     fetchOrderTracking(order._id)
//   }, [fetchOrderTracking])

//   const closeOrderModal = useCallback(() => {
//     setShowOrderModal(false)
//     setModalOrder(null)
//     setModalTracking(null)
//     setModalTrackingLoading(false)
//   }, [])

//   useEffect(() => {
//     if (!showOrderModal || !modalOrder?._id) return
//     const trackerPoll = setInterval(() => {
//       fetchOrderTracking(modalOrder._id)
//     }, 30 * 1000)
//     return () => clearInterval(trackerPoll)
//   }, [showOrderModal, modalOrder?._id, fetchOrderTracking])



//   return (
//     <div>
//       <Box>
//         <HStack justify="space-between" style={{margin: '20px 0'}}>
//           <Button
//             title="Add Order list"
//             onClick={() => console.log('add order list')}
//           />

//           <Button
//             title="Print Selected Orders"
//             onClick={() => {
//               const filteredData = activeData.filter(item => Object.keys(item).length !== 0)
//               if (filteredData.length > 0) {
//                 setShowDetails(true)
//                 setActiveOrderDetails(filteredData)
//               }
//             }}
//             disabled={activeData.filter(item => Object.keys(item).length !== 0).length === 0}
//           />
//         </HStack>

//         {/* Date Filter Section */}
//         {!showDetails && (
//           <div style={{
//             margin: '20px 0',
//             padding: '16px',
//             backgroundColor: '#f5f5f5',
//             borderRadius: '8px',
//             border: '1px solid #e0e0e0'
//           }}>
//             {/* Search Bar */}
//             <div style={{
//               marginBottom: '16px',
//               display: 'flex',
//               gap: '8px',
//               alignItems: 'center'
//             }}>
//               <input
//                 type="text"
//                 placeholder="Search by Order ID, Customer, Product, Location, Phone, Delivery Partner..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{
//                   flex: 1,
//                   padding: '10px 14px',
//                   borderRadius: '6px',
//                   border: '1px solid #ccc',
//                   fontSize: '14px',
//                   outline: 'none',
//                   transition: 'border-color 0.2s'
//                 }}
//                 onFocus={(e) => e.target.style.borderColor = '#1976d2'}
//                 onBlur={(e) => e.target.style.borderColor = '#ccc'}
//               />
//               {searchQuery && (
//                 <button
//                   onClick={clearSearch}
//                   style={{
//                     padding: '10px 16px',
//                     borderRadius: '6px',
//                     border: '1px solid #ccc',
//                     backgroundColor: 'white',
//                     cursor: 'pointer',
//                     fontSize: '13px',
//                     color: '#666'
//                   }}
//                 >
//                   Clear Search
//                 </button>
//               )}
//             </div>

//             <div style={{
//               display: 'flex',
//               alignItems: 'flex-start',
//               gap: '12px',
//               flexWrap: 'wrap'
//             }}>
//               <div style={{ fontWeight: 'bold', fontSize: '14px', paddingTop: '6px' }}>
//                 Filter by Date:
//               </div>
              
//               {/* Quick Filter Buttons */}
//               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
//                 <button
//                   onClick={() => {
//                     setDateFilterType('all');
//                     setShowCustomDateInputs(false);
//                     if (page !== 1) {
//                       setPage(1);
//                       // Preserve hash and path for SPA routing
//                       const hash = window.location.hash || '';
//                       let [hashPath, hashQuery] = hash.replace(/^#/, '').split('?');
//                       hashPath = hashPath || '/dash-orders';
//                       const params = new URLSearchParams(hashQuery || '');
//                       params.set('page', '1');
//                       window.location.hash = `${hashPath}?${params.toString()}`;
//                     }
//                   }}
//                   style={{
//                     padding: '6px 12px',
//                     borderRadius: '4px',
//                     border: dateFilterType === 'all' ? '2px solid #1976d2' : '1px solid #ccc',
//                     backgroundColor: dateFilterType === 'all' ? '#e3f2fd' : 'white',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     fontWeight: dateFilterType === 'all' ? 'bold' : 'normal'
//                   }}
//                 >
//                   All Orders
//                 </button>

//                 <button
//                   onClick={() => {
//                     setDateFilterType('last1hour');
//                     setShowCustomDateInputs(false);
//                     if (page !== 1) {
//                       setPage(1);
//                       const params = new URLSearchParams(window.location.search);
//                       params.set('page', '1');
//                       window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
//                     }
//                   }}
//                   style={{
//                     padding: '6px 12px',
//                     borderRadius: '4px',
//                     border: dateFilterType === 'last1hour' ? '2px solid #1976d2' : '1px solid #ccc',
//                     backgroundColor: dateFilterType === 'last1hour' ? '#e3f2fd' : 'white',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     fontWeight: dateFilterType === 'last1hour' ? 'bold' : 'normal'
//                   }}
//                 >
//                   Last 1 Hour
//                 </button>

//                 <button
//                   onClick={() => {
//                     setDateFilterType('last7days');
//                     setShowCustomDateInputs(false);
//                     if (page !== 1) {
//                       setPage(1);
//                       const params = new URLSearchParams(window.location.search);
//                       params.set('page', '1');
//                       window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
//                     }
//                   }}
//                   style={{
//                     padding: '6px 12px',
//                     borderRadius: '4px',
//                     border: dateFilterType === 'last7days' ? '2px solid #1976d2' : '1px solid #ccc',
//                     backgroundColor: dateFilterType === 'last7days' ? '#e3f2fd' : 'white',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     fontWeight: dateFilterType === 'last7days' ? 'bold' : 'normal'
//                   }}
//                 >
//                   Last 7 Days
//                 </button>

//                 <button
//                   onClick={() => {
//                     handleCustomDateFilterToggle();
//                     if (page !== 1) {
//                       setPage(1);
//                       const params = new URLSearchParams(window.location.search);
//                       params.set('page', '1');
//                       window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
//                     }
//                   }}
//                   style={{
//                     padding: '6px 12px',
//                     borderRadius: '4px',
//                     border: dateFilterType === 'custom' ? '2px solid #1976d2' : '1px solid #ccc',
//                     backgroundColor: dateFilterType === 'custom' ? '#e3f2fd' : 'white',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     fontWeight: dateFilterType === 'custom' ? 'bold' : 'normal'
//                   }}
//                 >
//                   Custom Range
//                 </button>
//               </div>

//               {/* Clear All Filters Button */}
//               {(dateFilterType !== 'all' || searchQuery) && (
//                 <button
//                   onClick={clearAllFilters}
//                   style={{
//                     padding: '6px 12px',
//                     borderRadius: '4px',
//                     border: '1px solid #d32f2f',
//                     backgroundColor: '#ffebee',
//                     color: '#d32f2f',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     fontWeight: 'bold'
//                   }}
//                 >
//                   Clear All Filters
//                 </button>
//               )}
//             </div>

//             {/* Custom Date Range Inputs */}
//             {dateFilterType === 'custom' && showCustomDateInputs && (
//               <div style={{ 
//                 display: 'flex', 
//                 gap: '12px', 
//                 alignItems: 'center', 
//                 marginTop: '12px',
//                 padding: '12px',
//                 backgroundColor: 'white',
//                 borderRadius: '6px',
//                 border: '1px solid #ccc'
//               }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <label htmlFor="start-date-filter" style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', minWidth: '40px' }}>
//                     From:
//                   </label>
//                   <input
//                     id="start-date-filter"
//                     type="text"
//                     placeholder="YYYY-MM-DD"
//                     value={startDate}
//                     onChange={handleStartDateChange}
//                     style={{
//                       padding: '8px 12px',
//                       borderRadius: '4px',
//                       border: '1px solid #ccc',
//                       fontSize: '13px',
//                       minWidth: '140px',
//                       fontFamily: 'monospace'
//                     }}
//                   />
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <label htmlFor="end-date-filter" style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', minWidth: '25px' }}>
//                     To:
//                   </label>
//                   <input
//                     id="end-date-filter"
//                     type="text"
//                     placeholder="YYYY-MM-DD"
//                     value={endDate}
//                     onChange={handleEndDateChange}
//                     style={{
//                       padding: '8px 12px',
//                       borderRadius: '4px',
//                       border: '1px solid #ccc',
//                       fontSize: '13px',
//                       minWidth: '140px',
//                       fontFamily: 'monospace'
//                     }}
//                   />
//                 </div>
//                 <button
//                   onClick={() => setShowCustomDateInputs(false)}
//                   style={{
//                     padding: '8px 16px',
//                     borderRadius: '4px',
//                     border: '1px solid #ccc',
//                     backgroundColor: '#f5f5f5',
//                     cursor: 'pointer',
//                     fontSize: '12px',
//                     color: '#666',
//                     marginLeft: 'auto'
//                   }}
//                 >
//                   Hide
//                 </button>
//               </div>
//             )}

//             {/* Filter Summary */}
//             <div style={{
//               marginTop: '12px',
//               fontSize: '12px',
//               color: '#666',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               flexWrap: 'wrap',
//               gap: '8px'
//             }}>
//               <span>
//                 Showing <strong>{orders.length}</strong> of <strong>{totalOrders}</strong> orders
//               </span>
//               <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//                 {searchQuery && (
//                   <span style={{ 
//                     fontStyle: 'italic',
//                     backgroundColor: '#e3f2fd',
//                     padding: '2px 8px',
//                     borderRadius: '4px',
//                     fontSize: '11px'
//                   }}>
//                     🔍 Searching: "${searchQuery.substring(0, 30)}{searchQuery.length > 30 ? '...' : ''}"
//                   </span>
//                 )}
//                 {dateFilterType !== 'all' && (
//                   <span style={{ 
//                     fontStyle: 'italic',
//                     backgroundColor: '#fff3e0',
//                     padding: '2px 8px',
//                     borderRadius: '4px',
//                     fontSize: '11px'
//                   }}>
//                     📅 {dateFilterType === 'custom' && startDate && endDate
//                       ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
//                       : dateFilterType.charAt(0).toUpperCase() + dateFilterType.slice(1)
//                     }
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {!showDetails && (
//           <div style={{
//             maxHeight: 'calc(100vh - 200px)',
//             overflowY: 'auto',
//             overflowX: 'auto',
//             border: '1px solid #e0e0e0',
//             borderRadius: '8px'
//           }}>
//             <Table
//               columns={[
//                 {
//                   field: 'select',
//                   name: 'Select',
//                   colStyle: { width: '60px', minWidth: '60px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (_, itemvalue) => {
//                     const isSelected = activeData?.find((item) => item._id === itemvalue._id) !== undefined
                    
//                     return (
//                       <div
//                         onClick={() => {
//                           if (isSelected) {
//                             setActiveData(
//                               activeData.filter((item) => item._id !== itemvalue._id)
//                             )
//                           } else {
//                             setActiveData((prev) => [...prev, itemvalue])
//                             BulkActionHandler(true, itemvalue)
//                           }
//                         }}
//                         style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
//                       >
//                         {isSelected ? (
//                           <IoCheckboxOutline size={20} color="#1976d2" />
//                         ) : (
//                           <MdCheckBoxOutlineBlank size={20} color="#666" />
//                         )}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'productOrderId',
//                   name: 'Order ID',
//                   colStyle: { width: '140px', minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (orderId) => {
//                     return (
//                       <div style={{ 
//                         fontFamily: 'monospace', 
//                         fontSize: '12px',
//                         fontWeight: 'bold',
//                       }}>
//                         {orderId}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'products',
//                   name: 'Products',
//                   colStyle: { width: '300px', minWidth: '250px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (products) => {
//                     return renderProductsList(products)
//                   }
//                 },
//                 {
//                   field: 'userId',
//                   name: 'Customer',
//                   colStyle: { width: '180px', minWidth: '150px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (userData) => {
//                     return (
//                       <div style={{ fontSize: '12px' }}>
//                         <div style={{ fontWeight: '500' }}>
//                           {truncateText(userData?.email || 'N/A', 25)}
//                         </div>
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'products',
//                   name: 'Qty',
//                   colStyle: { width: '60px', minWidth: '60px', textAlign: 'center', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (products) => {
//                     return (
//                       <div style={{ 
//                         fontWeight: 'bold', 
//                         fontSize: '14px',
//                         textAlign: 'center'
//                       }}>
//                         {getTotalQuantity(products)}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'totalAmount',
//                   name: 'Total Amount',
//                   colStyle: { width: '120px', minWidth: '120px', textAlign: 'right', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (totalAmount) => {
//                     return (
//                       <div style={{ 
//                         fontWeight: 'bold', 
//                         fontSize: '13px',
//                         color: '#2e7d32',
//                         textAlign: 'right'
//                       }}>
//                         {getNprPrice(totalAmount)}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'shippingLocation',
//                   name: 'Destination',
//                   colStyle: { width: '160px', minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (location) => {
//                     return (
//                       <div style={{ 
//                         fontSize: '12px',
//                         lineHeight: '1.3'
//                       }}>
//                         {truncateText(location, 25)}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: '_id',
//                   name: 'Exact Location',
//                   colStyle: { width: '160px', minWidth: '150px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (_, item) => {
//                     const hasLocation = item.latitude && item.longitude
                    
//                     if (!hasLocation) {
//                       return (
//                         <div style={{ 
//                           fontSize: '11px',
//                           color: '#999',
//                           fontStyle: 'italic'
//                         }}>
//                           No GPS data
//                         </div>
//                       )
//                     }
                    
//                     const displayText = item.locationAddress 
//                       ? truncateText(item.locationAddress, 20)
//                       : `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                    
//                     return (
//                       <a
//                         href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{
//                           fontSize: '11px',
//                           color: '#1976d2',
//                           textDecoration: 'none',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '4px'
//                         }}
//                         onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
//                         onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
//                       >
//                         <span>📍</span>
//                         <span>{displayText}</span>
//                       </a>
//                     )
//                   }
//                 },
//                 {
//                   field: 'isInsideValley',
//                   name: 'Valley',
//                   colStyle: { width: '80px', minWidth: '80px', textAlign: 'center', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (isInsideValley) => {
//                     return (
//                       <div style={{
//                         padding: '2px 8px',
//                         borderRadius: '4px',
//                         fontSize: '11px',
//                         fontWeight: 'bold',
//                         textAlign: 'center',
//                         backgroundColor: isInsideValley ? '#e8f5e8' : '#fff3e0',
//                         color: isInsideValley ? '#2e7d32' : '#f57c00'
//                       }}>
//                         {isInsideValley ? 'Yes' : 'No'}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'OrderedAt',
//                   name: 'Order Date',
//                   colStyle: { width: '130px', minWidth: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (orderedAt) => {
//                     return (
//                       <div style={{ 
//                         fontSize: '11px',
//                         color: '#666'
//                       }}>
//                         {orderedAt}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'phoneNumber',
//                   name: 'Mobile Number',
//                   colStyle: { width: '130px', minWidth: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (phoneNumber) => {
//                     return (
//                       <div style={{ 
//                         fontSize: '11px',
//                         color: '#666'
//                       }}>
//                         {phoneNumber ?? '-'}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'shippingPrice',
//                   name: 'Shipping',
//                   colStyle: { width: '100px', minWidth: '100px', textAlign: 'right', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (shippingPrice) => {
//                     return (
//                       <div style={{ 
//                         fontSize: '12px',
//                         color: '#666',
//                         textAlign: 'right'
//                       }}>
//                         {getNprPrice(shippingPrice)}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'ncmLastStatus',
//                   name: 'Delivery Status',
//                   colStyle: { width: '170px', minWidth: '170px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (_status, item) => {
//                     const statusText = item?.ncmLastStatus || (item?.isConfirmed ? 'Confirmed' : 'Pending Confirmation')
//                     return (
//                       <div style={{
//                         padding: '4px 8px',
//                         borderRadius: '12px',
//                         fontSize: '11px',
//                         fontWeight: 700,
//                         display: 'inline-block',
//                         backgroundColor: '#eef2ff',
//                         color: '#3730a3',
//                         border: '1px solid #c7d2fe',
//                       }}>
//                         {statusText}
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'deliveryPartner',
//                   name: 'Delivery Partner',
//                   colStyle: { width: '160px', minWidth: '160px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (deliveryPartner, item) => {
//                     const isEditing = editingOrderId === item._id
                    
//                     if (isEditing) {
//                       return (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                           <select
//                             value={deliveryPartner}
//                             onChange={(e) => setDeliveryPartner(e.target.value)}
//                             style={{
//                               padding: '4px 8px',
//                               borderRadius: '4px',
//                               border: '1px solid #1976d2',
//                               fontSize: '12px',
//                               outline: 'none',
//                               width: '100%'
//                             }}
//                           >
//                             <option value="">Select Partner</option>
//                             <option value="NCM">NCM</option>
//                             <option value="NOT NCM">NOT NCM</option>
//                             {/* <option value="Self Pickup">Self Pickup</option>
//                             <option value="Third Party">Third Party</option> */}
//                           </select>
//                           <div style={{ display: 'flex', gap: '4px' }}>
//                             <button
//                               onClick={() => handleDeliveryPartnerUpdate(item._id)}
//                               disabled={isUpdating}
//                               style={{
//                                 padding: '2px 8px',
//                                 borderRadius: '3px',
//                                 border: 'none',
//                                 backgroundColor: '#1976d2',
//                                 color: 'white',
//                                 fontSize: '10px',
//                                 cursor: 'pointer',
//                                 flex: 1
//                               }}
//                             >
//                               {isUpdating ? 'Updating...' : 'Update'}
//                             </button>
//                             <button
//                               onClick={cancelEditing}
//                               style={{
//                                 padding: '2px 8px',
//                                 borderRadius: '3px',
//                                 border: '1px solid #ccc',
//                                 backgroundColor: 'white',
//                                 fontSize: '10px',
//                                 cursor: 'pointer'
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       )
//                     }
                    
//                     return (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                         <div style={{
//                           padding: '4px 8px',
//                           borderRadius: '4px',
//                           fontSize: '11px',
//                           backgroundColor: deliveryPartner ? '#e3f2fd' : '#f5f5f5',
//                           color: deliveryPartner ? '#1976d2' : '#666',
//                           fontWeight: deliveryPartner ? 'bold' : 'normal',
//                           border: `1px solid ${deliveryPartner ? '#1976d2' : '#ddd'}`,
//                           minWidth: '80px',
//                           textAlign: 'center'
//                         }}>
//                           {deliveryPartner || 'Not Set'}
//                         </div>
//                         <button
//                           onClick={() => startEditingDeliveryPartner(item)}
//                           style={{
//                             padding: '2px 6px',
//                             borderRadius: '3px',
//                             border: '1px solid #1976d2',
//                             backgroundColor: 'white',
//                             color: '#1976d2',
//                             fontSize: '10px',
//                             cursor: 'pointer',
//                             whiteSpace: 'nowrap'
//                           }}
//                         >
//                           <EditIcon fontSize="10px" />
//                         </button>
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'ncmDestinationBranch',
//                   name: 'NCM Destination Branch',
//                   colStyle: { width: '210px', minWidth: '210px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (ncmBranch, item) => {
//                     const isEditingNcmBranch = editingNcmOrderId === item._id

//                     if (isEditingNcmBranch) {
//                       return (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                           <select
//                             value={ncmDestinationBranch}
//                             onChange={(e) => setNcmDestinationBranch(e.target.value)}
//                             style={{
//                               padding: '4px 8px',
//                               borderRadius: '4px',
//                               border: '1px solid #1976d2',
//                               fontSize: '12px',
//                               outline: 'none',
//                               width: '100%'
//                             }}
//                             disabled={isLoadingNcmBranches}
//                           >
//                             <option value="">Use Global Default</option>
//                             {ncmBranches.map((branch) => (
//                               <option key={branch} value={branch}>{branch}</option>
//                             ))}
//                           </select>
//                           <div style={{ display: 'flex', gap: '4px' }}>
//                             <button
//                               onClick={() => handleNcmBranchUpdate(item._id)}
//                               disabled={updatingNcmBranchOrderId === item._id || isLoadingNcmBranches}
//                               style={{
//                                 padding: '2px 8px',
//                                 borderRadius: '3px',
//                                 border: 'none',
//                                 backgroundColor: '#1976d2',
//                                 color: 'white',
//                                 fontSize: '10px',
//                                 cursor: 'pointer',
//                                 flex: 1
//                               }}
//                             >
//                               {updatingNcmBranchOrderId === item._id ? 'Saving...' : 'Save'}
//                             </button>
//                             <button
//                               onClick={cancelEditingNcmBranch}
//                               style={{
//                                 padding: '2px 8px',
//                                 borderRadius: '3px',
//                                 border: '1px solid #ccc',
//                                 backgroundColor: 'white',
//                                 fontSize: '10px',
//                                 cursor: 'pointer'
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         </div>
//                       )
//                     }

//                     return (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                         <div style={{
//                           padding: '4px 8px',
//                           borderRadius: '4px',
//                           fontSize: '11px',
//                           backgroundColor: ncmBranch ? '#e8f5e9' : '#f5f5f5',
//                           color: ncmBranch ? '#2e7d32' : '#666',
//                           fontWeight: ncmBranch ? 'bold' : 'normal',
//                           border: `1px solid ${ncmBranch ? '#2e7d32' : '#ddd'}`,
//                           minWidth: '120px',
//                           textAlign: 'center'
//                         }}>
//                           {ncmBranch || 'Global Default'}
//                         </div>
//                         <button
//                           onClick={() => startEditingNcmBranch(item)}
//                           style={{
//                             padding: '2px 6px',
//                             borderRadius: '3px',
//                             border: '1px solid #2e7d32',
//                             backgroundColor: 'white',
//                             color: '#2e7d32',
//                             fontSize: '10px',
//                             cursor: 'pointer',
//                             whiteSpace: 'nowrap'
//                           }}
//                         >
//                           <EditIcon fontSize="10px" />
//                         </button>
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: '_id',
//                   name: 'Actions',
//                   colStyle: { width: '140px', minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (_, item) => {
//                     return (
//                       <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
//                         <div style={{ display: 'flex', gap: '6px' }}>
//                           <button
//                             aria-label="View order details"
//                             onClick={() => openOrderModal(item)}
//                             style={{
//                               border: '1px solid #1976d2',
//                               background: 'white',
//                               color: '#1976d2',
//                               borderRadius: '4px',
//                               padding: '4px 6px',
//                               display: 'inline-flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               cursor: 'pointer'
//                             }}
//                           >
//                             <Eye size={14} />
//                           </button>
//                           <Button
//                             title="Print Details"
//                             onClick={() => {
//                               setShowDetails(true)
//                               setActiveOrderDetails(item)
//                               setActiveData([item])
//                             }}
//                             style={{
//                               fontSize: '10px',
//                               padding: '2px 6px',
//                               minHeight: '24px'
//                             }}
//                           />
//                         </div>
//                         <Button
//                           title={
//                             confirmingOrderId === item._id
//                               ? 'Confirming...'
//                               : item?.isConfirmed
//                                 ? 'Confirmed'
//                                 : 'Confirm Order'
//                           }
//                           onClick={() => sendWhatsAppMessage(item)}
//                           disabled={confirmingOrderId === item._id || item?.isConfirmed}
//                           style={{
//                             fontSize: '10px',
//                             padding: '4px 8px',
//                             minHeight: '28px',
//                             borderRadius: '6px',
//                             fontWeight: 700,
//                             letterSpacing: '0.2px',
//                             background: item?.isConfirmed
//                               ? '#10b981'
//                               : confirmingOrderId === item._id
//                                 ? '#7c3aed'
//                                 : 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
//                             color: 'white',
//                             boxShadow: item?.isConfirmed
//                               ? '0 2px 8px rgba(16,185,129,0.25)'
//                               : '0 2px 8px rgba(124,58,237,0.25)',
//                             cursor: confirmingOrderId === item._id || item?.isConfirmed ? 'not-allowed' : 'pointer',
//                             opacity: confirmingOrderId === item._id || item?.isConfirmed ? 0.9 : 1
//                           }}
//                         />
//                         <button
//                           onClick={() => handleDeleteOrder(item)}
//                           disabled={deletingOrderId === item._id}
//                           style={{
//                             fontSize: '10px',
//                             padding: '4px 6px',
//                             minHeight: '24px',
//                             border: '1px solid #DC2626',
//                             borderRadius: '4px',
//                             backgroundColor: deletingOrderId === item._id ? '#FEE2E2' : '#FEF2F2',
//                             color: '#B91C1C',
//                             cursor: deletingOrderId === item._id ? 'not-allowed' : 'pointer',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             gap: '4px'
//                           }}
//                         >
//                           <Trash2 size={12} />
//                           {deletingOrderId === item._id ? 'Deleting...' : 'Delete'}
//                         </button>
//                       </div>
//                     )
//                   }
//                 },
//                 {
//                   field: 'isScanned',
//                   name: 'Is Scanned already?',
//                   colStyle: { width: '130px', minWidth: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (isScanned) => {
//                     return (
//                       <div style={{ 
//                         fontSize: '11px',
//                         color: '#666'
//                       }}>
//                         {isScanned ? 'scanned already' : 'not scanned'}
//                       </div>
//                     )
//                   }
//                 },
//               ]}
//               data={orders ?? []}
//               actions={{}}
//               pagination={{
//                 totalCount: totalOrders,
//                 perPage: limit
//               }}
//               onPageChange={(newPage: number) => setPage(newPage)}
//               pageFe={false}
//               loading={loading}
//             />
//           </div>
//         )}

//         {modalOrder && (
//           <Modal
//             visible={showOrderModal}
//             modalSize="lg"
//             width="720px"
//             overlayBlur={6}
//             closeModal={closeOrderModal}
//           >
//             <div style={{ padding: '20px', maxHeight: '85vh', overflowY: 'auto', backgroundColor: '#fafafa',width:'100%' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #ddd' }}>
//                 <div style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>Order Details</div>
//                 <button
//                   onClick={closeOrderModal}
//                   style={{ border: 'none', background: '#f5f5f5', fontSize: '20px', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//                   aria-label="Close order details"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Order Info Section */}
//               <div style={{ background: 'white', padding: '16px', borderRadius: 8, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: 12, color: '#333' }}>Order Information</div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
//                   <div>
//                     <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Order ID</div>
//                     <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{modalOrder.productOrderId || modalOrder._id}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Placed At</div>
//                     <div style={{ fontSize: '13px' }}>{formatDate(modalOrder.OrderedAt)}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Customer</div>
//                     <div style={{ fontSize: '13px', fontWeight: 500 }}>{modalOrder.userId?.name || modalOrder.userId?.email || 'N/A'}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Phone</div>
//                     <div style={{ fontSize: '13px' }}>{modalOrder.phoneNumber || modalOrder.userId?.phone || '-'}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Payment Method</div>
//                     <div style={{ fontSize: '13px', fontWeight: 500 }}>{modalOrder.paymentMethod || '-'}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Valley Status</div>
//                     <div style={{ fontSize: '13px', fontWeight: 500, color: modalOrder.isInsideValley ? '#2e7d32' : '#f57c00' }}>
//                       {modalOrder.isInsideValley ? 'Inside Valley' : 'Outside Valley'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Delivery Section */}
//               <div style={{ background: 'white', padding: '16px', borderRadius: 8, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: 12, color: '#333' }}>Delivery Information</div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
//                   <div>
//                     <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Shipping Location</div>
//                     <div style={{ fontSize: '13px' }}>{modalOrder.shippingLocation || modalOrder.locationAddress || '-'}</div>
//                   </div>
//                   {modalOrder.deliveryPartner && (
//                     <div>
//                       <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Delivery Partner</div>
//                       <div style={{ fontSize: '13px', fontWeight: 500 }}>{modalOrder.deliveryPartner}</div>
//                     </div>
//                   )}
//                   {modalOrder.isRedZone && (
//                     <div>
//                       <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Red Zone</div>
//                       <div style={{ fontSize: '13px', color: '#d32f2f', fontWeight: 600 }}>Yes</div>
//                     </div>
//                   )}
//                   {(modalOrder.latitude && modalOrder.longitude) && (
//                     <div>
//                       <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>GPS Location</div>
//                       <a
//                         href={`https://www.google.com/maps?q=${modalOrder.latitude},${modalOrder.longitude}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{ fontSize: '13px', color: '#1976d2', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
//                       >
//                         📍 View on Google Maps
//                       </a>
//                     </div>
//                   )}
//                   {modalOrder.orderNote && (
//                     <div>
//                       <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Order Note</div>
//                       <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#555' }}>{modalOrder.orderNote}</div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* NCM Tracking Section */}
//               <div style={{ background: 'white', padding: '16px', borderRadius: 8, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: 12, color: '#333' }}>NCM Tracking</div>

//                 {modalTrackingLoading ? (
//                   <div style={{ fontSize: '13px', color: '#666' }}>Loading live tracking...</div>
//                 ) : (
//                   <>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
//                       <div>
//                         <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Pickup Created</div>
//                         <div style={{ fontSize: '13px', fontWeight: 600 }}>{formatDateTime(modalTracking?.ncm?.summary?.pickupCreatedAt || modalOrder?.ncmPickupCreatedAt)}</div>
//                       </div>
//                       <div>
//                         <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Pickup Completed</div>
//                         <div style={{ fontSize: '13px', fontWeight: 600, color: modalTracking?.ncm?.summary?.pickupCompleted ? '#2e7d32' : '#f57c00' }}>
//                           {modalTracking?.ncm?.summary?.pickupCompleted ? 'Yes' : 'No'}
//                         </div>
//                       </div>
//                       <div>
//                         <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>Delivered</div>
//                         <div style={{ fontSize: '13px', fontWeight: 600, color: modalTracking?.ncm?.summary?.delivered ? '#2e7d32' : '#f57c00' }}>
//                           {modalTracking?.ncm?.summary?.delivered ? 'Yes' : 'No'}
//                         </div>
//                       </div>
//                     </div>

//                     <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: 8 }}>Latest Delivery Status Timeline</div>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
//                       {takeFirst(modalTracking?.ncm?.statuses, 10).map((statusItem: any, index: number) => (
//                         <div key={index} style={{ border: '1px solid #eee', borderRadius: 8, padding: 8, background: '#fafafa' }}>
//                           <div style={{ fontSize: '13px', fontWeight: 600 }}>{statusItem?.status || '-'}</div>
//                           <div style={{ fontSize: '11px', color: '#777' }}>{statusItem?.added_time || '-'}</div>
//                           {!!statusItem?.location && (
//                             <div style={{ fontSize: '11px', color: '#888' }}>Location: {statusItem.location}</div>
//                           )}
//                         </div>
//                       ))}
//                       {toSafeList(modalTracking?.ncm?.statuses).length === 0 && (
//                         <div style={{ fontSize: '12px', color: '#888' }}>No status updates available yet.</div>
//                       )}
//                     </div>

//                     <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: 8 }}>Latest Comments</div>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                       {takeFirst(modalTracking?.ncm?.comments, 8).map((commentItem: any, index: number) => (
//                         <div key={index} style={{ border: '1px solid #eee', borderRadius: 8, padding: 8, background: '#fafafa' }}>
//                           <div style={{ fontSize: '12px', color: '#222' }}>{commentItem?.comments || '-'}</div>
//                           <div style={{ fontSize: '11px', color: '#777' }}>
//                             {commentItem?.addedBy || '-'} • {commentItem?.added_time || '-'}
//                           </div>
//                         </div>
//                       ))}
//                       {toSafeList(modalTracking?.ncm?.comments).length === 0 && (
//                         <div style={{ fontSize: '12px', color: '#888' }}>No comments available yet.</div>
//                       )}
//                     </div>

//                   </>
//                 )}
//               </div>

//               {/* Products Section */}
//               <div style={{ background: 'white', padding: '16px', borderRadius: 8, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: 12, color: '#333' }}>Products ({(modalOrder.products || []).length})</div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                   {(modalOrder.products || []).map((product: any, index: number) => {
//                     // Resolve only the image for the color variant added in cart
//                     const images = product?.productId?.images || [];
//                     const targetColor = (product?.colorName || '').toString().trim().toLowerCase();
//                     let imageUrl: string | null = null;

//                     if (Array.isArray(images) && images.length > 0) {
//                       const first = images[0] as any;
//                       if (typeof first === 'string') {
//                         // Legacy: images as plain URLs
//                         imageUrl = first;
//                       } else {
//                         // Expected: images as objects with colorName + coloredImage
//                         const matched = images.find((img: any) => (img?.colorName || '').toString().trim().toLowerCase() === targetColor);
//                         const chosen = matched || images[0];
//                         const colored = (chosen as any)?.coloredImage || (chosen as any)?.image || null;
//                         if (colored) {
//                           imageUrl = `${FILE_URL}/products/${colored}`;
//                         }
//                       }
//                     }

//                     return (
//                       <div key={index} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '12px', backgroundColor: '#fafafa' }}>
//                         <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
//                           {imageUrl ? (
//                             <img
//                               src={imageUrl}
//                               alt={product.productId?.name || 'Product'}
//                               style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd', flexShrink: 0 }}
//                               onError={(e) => {
//                                 const img = e.currentTarget as HTMLImageElement
//                                 if ((img as any)._fallbackApplied) return
//                                 ;(img as any)._fallbackApplied = true
//                                 img.src = '/assets/images/defaultProduct.jpeg'
//                               }}
//                             />
//                           ) : (
//                             <img
//                               src={'/assets/images/defaultProduct.jpeg'}
//                               alt="No Image"
//                               style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd', flexShrink: 0, background: '#f0f0f0' }}
//                             />
//                           )}

//                           {/* Product Details */}
//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: 6, color: '#333' }}>{product.productId?.name || 'Unknown Product'}</div>

//                             {/* Variant Information */}
//                             <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px', fontSize: '12px' }}>
//                               {product.colorName && (
//                                 <>
//                                   <span style={{ color: '#666', fontWeight: 500 }}>Color:</span>
//                                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                                     <span style={{ display: 'inline-block', width: 24, height: 24, borderRadius: 4, background: product.colorName, border: '2px solid #ccc' }} />
//                                     <span style={{ color: '#555' }}>{product.colorName}</span>
//                                   </div>
//                                 </>
//                               )}
//                               {product.size && (
//                                 <>
//                                   <span style={{ color: '#666', fontWeight: 500 }}>Size:</span>
//                                   <span style={{ color: '#555' }}>{product.size}</span>
//                                 </>
//                               )}
//                               {product.sku && (
//                                 <>
//                                   <span style={{ color: '#666', fontWeight: 500 }}>SKU:</span>
//                                   <span style={{ color: '#555', fontFamily: 'monospace' }}>{product.sku}</span>
//                                 </>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Quantity and Price */}
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #ddd' }}>
//                           <div style={{ fontSize: '13px', color: '#666' }}>Qty: <span style={{ fontWeight: 600, color: '#333' }}>{product.quantity || 0}</span></div>
//                           <div style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 700 }}>{getNprPrice(product.price || 0)}</div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Order Summary */}
//               <div style={{ background: 'white', padding: '16px', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
//                 <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: 12, color: '#333' }}>Order Summary</div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
//                     <span style={{ color: '#666' }}>Subtotal</span>
//                     <span style={{ fontWeight: 600 }}>{getNprPrice(getTotalPrice(modalOrder.products || []))}</span>
//                   </div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
//                     <span style={{ color: '#666' }}>Shipping</span>
//                     <span style={{ fontWeight: 600 }}>{getNprPrice(modalOrder.shippingPrice || 0)}</span>
//                   </div>
             
//                   {modalOrder.giftBoxCharge > 0 && (
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
//                       <span style={{ color: '#666' }}>Gift Box</span>
//                       <span style={{ fontWeight: 600 }}>{getNprPrice(modalOrder.giftBoxCharge)}</span>
//                     </div>
//                   )}
//                   {modalOrder.deliveryPartnerPrice > 0 && (
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
//                       <span style={{ color: '#666' }}>Delivery Partner Charge</span>
//                       <span style={{ fontWeight: 600 }}>{getNprPrice(modalOrder.deliveryPartnerPrice)}</span>
//                     </div>
//                   )}
//                   <div style={{ borderTop: '2px solid #ddd', paddingTop: 8, marginTop: 4 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
//                       <span style={{ fontWeight: 700 }}>Total</span>
//                       <span style={{ fontWeight: 700, color: '#2e7d32' }}>{getNprPrice(modalOrder.totalAmount || 0)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Modal>
//         )}

//         {orderPdf}

//         {showDetails && (
//           <AiOutlineClose
//             fill="red"
//             style={{
//               position: 'fixed', 
//               right: '20px', 
//               top: '20px', 
//               zIndex: '20',
//               cursor: 'pointer',
//               fontSize: '24px',
//               backgroundColor: 'white',
//               borderRadius: '50%',
//               padding: '8px',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
//             }}
//             onClick={() => {
//               setShowDetails(false)
//               setActiveOrderDetails(undefined)
//               setActiveData([{}])
//             }}
//           />
//         )}
//       </Box>
//     </div>
//   )
// }

// const OrderPDF = ({data}) => {
//   const currentDate = new Date()

//   const truncateOrderNote = (note: string, limit = 50) => {
//     if (!note) return 'No note provided'
//     const trimmed = String(note).trim()
//     if (trimmed.length <= limit) return trimmed
//     return `${trimmed.slice(0, limit)}...`
//   }

//   const generateQrCodeUrl = async (text: string) => {
//     try {
//       const image = await QRCode.toDataURL(text, {
//         width: 280,
//         errorCorrectionLevel: 'M'
//       })
//       return image
//     } catch (err) {
//       console.error(err)
//       return ''
//     }
//   }

//   // Generate barcode data URL
//   const generateBarcodeUrl = (text: string) => {
//     try {
//       const canvas = document.createElement('canvas')
//       JsBarcode(canvas, text, {
//         format: "CODE128",
//         width: 2,
//         height: 60,
//         displayValue: false,
//         margin: 0
//       })
//       return canvas.toDataURL('image/png')
//     } catch (err) {
//       console.error('Barcode generation error:', err)
//       return ''
//     }
//   }

//   const calculateOrderTotals = (products) => {
//     if (!products || products.length === 0) return { totalQuantity: 0, totalPrice: 0 }
    
//     const totalQuantity = products?.reduce((sum, product) => sum + (product.quantity || 0), 0)
//     const totalPrice = products?.reduce((sum, product) => sum + (product.price || 0), 0)
    
//     return { totalQuantity, totalPrice }
//   }

//   const generateLocationQrUrl = (latitude: number, longitude: number) => {
//     if (latitude && longitude) {
//       return `https://www.google.com/maps?q=${latitude},${longitude}`
//     }
//     return 'No location available'
//   }

//   return (
//     <PDFViewer style={styles.viewer}>
//       <Document>
//         {data
//           ?.filter((item) => Object.keys(item).length !== 0)
//           ?.map((item, index) => {
//             const { totalQuantity, totalPrice } = calculateOrderTotals(item?.products || [])
//             const locationQrData = generateLocationQrUrl(item.latitude, item.longitude)
//             const orderId = item.productOrderId || item._id

//             return (
//               <Page size="A5" style={styles.page} key={index}>
//                 {/* Elegant Header with Barcode */}
//                 <View style={styles.header}>
//                   <View style={styles.brandSection}>
//                     <Image style={styles.logo} src="/assets/images/logosss.png" />
//                     {/* <View>
//                       <Text style={styles.tagline}>AABHUSHAN GALLERY</Text>
//                     </View> */}
//                   </View>
//                   <View style={styles.orderSection}>
//                     {/* Removed ORDER text */}
//                     <Text style={styles.orderNumber}>{orderId}</Text>
//                     {/* Barcode Container - Full Width */}
//                     <View style={styles.barcodeContainer}>
//                       <Image 
//                         style={styles.barcode} 
//                         src={generateBarcodeUrl(orderId)} 
//                       />
//                     </View>
//                   </View>
//                 </View>

//                 {/* Shipping Information Grid */}
//                 <View style={styles.shippingGrid}>
//                   <View style={styles.addressCard}>
//                     <Text style={styles.addressTitle}>ORIGIN</Text>
//                     <View style={styles.divider} />
//                     <Text style={styles.name}>Aabhushan Gallery</Text>
//                     <Text style={styles.address}> Kathmandu</Text>
//                     <Text style={styles.address}>Nepal 44600</Text>
//                     <Text style={styles.contact}>T: 9861698400</Text>
//                   </View>

//                   <View style={[styles.addressCard, styles.destinationCard]}>
//                     <View style={styles.destinationHeader}>
//                       <Text style={styles.deliveryType}>{item?.isHomeDelivery ? 'HOME DELIVERY' : 'OFFICE DELIVERY'}</Text>
//                       <Text style={styles.deliveryType}>{item?.paymentMethod === 'phonePay' ? 'Phone Pay' : 'Cash on Delivery'}</Text>
//                     </View>
//                     {item.deliveryPartner && (
//                       <View style={styles.deliveryPartnerBadge}>
//                         <Text style={styles.deliveryPartnerText}>
//                           Partner: {item.deliveryPartner}
//                         </Text>
//                       </View>
//                     )}
//                     <View style={styles.divider} />
//                     <Text style={styles.name}>{item.customerName || 'Customer'}</Text>
//                     <Text style={styles.address}>Address by user:{item.shippingLocation}</Text>
//                     {item.locationAddress && <Text style={styles.address}>Address From Map:{item.locationAddress}</Text>}
//                     <Text style={styles.contact}>T: {item.phoneNumber}</Text>
//                   </View>
//                 </View>

//                 {/* Order Note */}
//                 <View style={styles.noteSection}>
//                   <Text style={styles.noteTitle}>ORDER NOTE</Text>
//                   <View style={styles.divider} />
//                   <Text style={styles.noteText}>{truncateOrderNote(item?.orderNote)}</Text>
//                 </View>

//                 {/* Financial Summary - Highlighted */}
//                 <View style={styles.financialSection}>
//                   <View style={styles.summaryGrid}>
//                     <View style={styles.summaryItem}>
//                       <Text style={styles.summaryLabel}>ITEMS</Text>
//                       <Text style={styles.summaryValue}>{item?.products?.length || 0}</Text>
//                     </View>
//                     <View style={styles.summaryItem}>
//                       <Text style={styles.summaryLabel}>QTY</Text>
//                       <Text style={styles.summaryValue}>{totalQuantity}</Text>
//                     </View>



//                     <View style={styles.summaryItem}>
//                       <Text style={styles.summaryLabel}>SUBTOTAL</Text>
//                       <Text style={styles.summaryValue}>Rs. {totalPrice.toFixed(2)}</Text>
//                     </View>
// {
//   !!item.includeGiftBox &&     <View style={styles.summaryItem}>
//                       <Text style={styles.summaryLabel}>GiftBox Charge</Text>
//                       <Text style={styles.summaryValue}>Rs.400</Text>
//                     </View>
// }
                  
//                     <View style={styles.summaryItem}>
//                       <Text style={styles.summaryLabel}>SHIPPING</Text>
//                       <Text style={styles.summaryValue}>Rs. {item?.shippingPrice || 0}</Text>
//                     </View>
//                   </View>

//                   <View style={styles.totalSection}>
//                     <View style={styles.totalRow}>
//                       <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
//                       <Text style={styles.totalAmount}>Rs. {item?.totalAmount?.toFixed(2) || 0}</Text>
//                     </View>
//                   </View>

//                   {item.isInsideValley === false && (
//                     <View style={styles.paymentHighlight}>
//                       <View style={styles.paymentRow}>
//                         <Text style={styles.paymentLabel}>ADVANCE PAID</Text>
//                         <Text style={styles.paymentValue}>Rs. ${item?.shippingPrice}</Text>
//                       </View>
//                       <View style={[styles.paymentRow, styles.balanceRow]}>
//                         <Text style={styles.balanceLabel}>BALANCE DUE</Text>
//                         <Text style={styles.balanceAmount}>Rs. {(item?.totalAmount - item?.shippingPrice).toFixed(2)}</Text>
//                       </View>
//                     </View>
//                   )}
//                 </View>

//                 {/* Footer */}
//                 <View style={styles.footer}>
//                   {item.latitude && item.longitude && (
//                     <View style={styles.qrSection}>
//                       <Image style={styles.qrCode} src={generateQrCodeUrl(locationQrData)} />
//                       <Text style={styles.qrLabel}>DELIVERY LOCATION</Text>
//                     </View>
//                   )}
//                 </View>
//               </Page>
//             )
//           })}
//       </Document>
//     </PDFViewer>
//   )
// }

// const styles = StyleSheet.create({
//   viewer: {
//     height: '100vh',
//     width: '75vw',
//     position: 'absolute',
//     top: 0,
//     left: '0'
//   },
//   page: {
//     padding: 20,
//     backgroundColor: '#ffffff',
//     fontFamily: 'Helvetica'
//   },
  
//   // Elegant Header with Barcode
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     paddingBottom: 12,
//     marginBottom: 12,
//     borderBottom: '2px solid #000000'
//   },
//   brandSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10
//   },
//   logo: {
//     width: 35,
//     height: 50
//   },
//   tagline: {
//     fontSize: 7,
//     color: '#666666',
//     letterSpacing: 0.5,
//     marginTop: 1
//   },
//   orderSection: {
//     alignItems: 'flex-end',
//     flex: 1,
//     marginLeft: 10
//   },
//   orderNumber: {
//     fontSize: 11,
//     fontWeight: 'bold',
//     color: '#000000',
//     letterSpacing: 0.5,
//     marginBottom: 4
//   },
//   // Barcode Styles - Full Width
//   barcodeContainer: {
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 4,
//     backgroundColor: '#ffffff',
//     paddingVertical: 4,
//     border: '0.5px solid #e0e0e0'
//   },
//   barcode: {
//     width: '100%',
//     height: 30
//   },

//   // Shipping Grid
//   shippingGrid: {
//     flexDirection: 'row',
//     gap: 10,
//     marginBottom: 12
//   },
//   addressCard: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#fafafa',
//     borderLeft: '3px solid #cccccc'
//   },
//   destinationCard: {
//     backgroundColor: '#ffffff',
//     borderLeft: '3px solid #000000',
//     border: '1px solid #000000'
//   },
//   destinationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4
//   },
//   deliveryPartnerBadge: {
//     backgroundColor: '#e3f2fd',
//     padding: '2px 6px',
//     borderRadius: '3px',
//     marginBottom: 4,
//     alignSelf: 'flex-start'
//   },
//   deliveryPartnerText: {
//     fontSize: 7,
//     color: '#1976d2',
//     fontWeight: 'bold'
//   },
//   addressTitle: {
//     fontSize: 8,
//     fontWeight: 'bold',
//     color: '#000000',
//     letterSpacing: 1.2
//   },
//   deliveryType: {
//     fontSize: 6,
//     fontWeight: 'bold',
//     color: '#666666',
//     letterSpacing: 0.8,
//     paddingHorizontal: 4,
//     paddingVertical: 2,
//     backgroundColor: '#f0f0f0'
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#e0e0e0',
//     marginVertical: 6
//   },
//   noteSection: {
//     padding: 10,
//     border: '1px solid #e0e0e0',
//     backgroundColor: '#ffffff',
//     marginBottom: 12
//   },
//   noteTitle: {
//     fontSize: 8,
//     fontWeight: 'bold',
//     color: '#000000',
//     letterSpacing: 1.2,
//     marginBottom: 4
//   },
//   noteText: {
//     fontSize: 8,
//     color: '#333333',
//     lineHeight: 1.4
//   },
//   name: {
//     fontSize: 7,
//     fontWeight: 'bold',
//     color: '#000000',
//     marginBottom: 3
//   },
//   address: {
//     fontSize: 8,
//     color: '#666666',
//     marginBottom: 1,
//     lineHeight: 1.4
//   },
//   contact: {
//     fontSize: 8,
//     fontWeight: 'bold',
//     color: '#000000',
//     marginTop: 4
//   },

//   // Financial Section - Removed black background
//   financialSection: {
//     marginBottom: 12,
//     border: '2px solid #000000',
//     backgroundColor: '#fafafa'
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     borderBottom: '1px solid #e0e0e0'
//   },
//   summaryItem: {
//     flex: 1,
//     padding: 8,
//     borderRight: '1px solid #e0e0e0',
//     alignItems: 'center'
//   },
//   summaryLabel: {
//     fontSize: 6,
//     color: '#666666',
//     letterSpacing: 1,
//     marginBottom: 3
//   },
//   summaryValue: {
//     fontSize: 9,
//     fontWeight: 'bold',
//     color: '#000000'
//   },
//   totalSection: {
//     backgroundColor: '#ffffff',
//     padding: 10
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   totalLabel: {
//     fontSize: 9,
//     fontWeight: 'bold',
//     color: '#000000',
//     letterSpacing: 1.5
//   },
//   totalAmount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000000',
//     letterSpacing: 0.5
//   },
//   paymentHighlight: {
//     backgroundColor: '#ffffff',
//     padding: 10,
//     borderTop: '2px solid #000000'
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 3
//   },
//   paymentLabel: {
//     fontSize: 8,
//     color: '#666666',
//     letterSpacing: 0.8
//   },
//   paymentValue: {
//     fontSize: 8,
//     fontWeight: 'bold',
//     color: '#000000'
//   },
//   balanceRow: {
//     borderTop: '1px solid #e0e0e0',
//     paddingTop: 6,
//     marginTop: 3
//   },
//   balanceLabel: {
//     fontSize: 9,
//     fontWeight: 'bold',
//     color: '#000000',
//     letterSpacing: 1
//   },
//   balanceAmount: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#000000'
//   },

//   // Footer - Removed PRINTED text and shipping label
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     paddingTop: 10,
//     borderTop: '1px solid #e0e0e0'
//   },
//   qrSection: {
//     alignItems: 'center'
//   },
//   qrCode: {
//     width: 45,
//     height: 45,
//     marginBottom: 3
//   },
//   qrLabel: {
//     fontSize: 6,
//     color: '#666666',
//     letterSpacing: 1
//   }
// })



import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react'
// import Image from 'next/image'
import {useDispatch} from 'src/store'
import ReactDOM from 'react-dom/client'
import {useSelector} from 'react-redux'
import {
  Box,
  Button,
  CheckBox,
  HStack,
  ImageViewer,
  Modal,
  SelectField,
  Table
} from 'src/app/common'

import { useNavigate } from 'react-router-dom'

// import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'

import {getOrderListAction, updateOrderByIdAction} from '../web/cart/cart.slice'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Image as PDFImage,
  Canvas
} from '@react-pdf/renderer'
import {AiOutlineClose} from 'react-icons/ai'
import {MdCheckBoxOutlineBlank} from 'react-icons/md'
import {IoCheckboxOutline} from 'react-icons/io5'
import { IoPrint } from "react-icons/io5";

import toast from 'react-hot-toast'
import {AxiosResponse} from 'axios'
import {EditIcon, Eye, Trash2} from 'lucide-react'
import {BASE_URL, FILE_URL} from 'src/config'

const getProductImageUrl = (product: any): string => {
  const images = product?.productId?.images || []
  const targetColor = (product?.colorName || '').toString().trim().toLowerCase()
  
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0]
    if (typeof first === 'string') {
      return first
    }
    const matched = images.find(
      (img: any) => (img?.colorName || '').toString().trim().toLowerCase() === targetColor
    )
    const chosen = matched || images[0]
    const colored = chosen?.coloredImage || (Array.isArray(chosen?.coloredImages) && chosen?.coloredImages[0]) || chosen?.image || null
    if (colored) {
      return `${FILE_URL}/products/${colored}`
    }
  }
  return '/assets/images/defaultProduct.jpeg'
}

export const OrderListPage = () => {
  // const router = useRouter()
    const navigate = useNavigate()
  const dispatch = useDispatch()

  const [orderList, setOrderLists] = useState<any>()
  const [selectedCategory, setSelectedCategory] = useState<any>()

  // Backend-driven orders state
  const [orders, setOrders] = useState<any[]>([])
  const [totalOrders, setTotalOrders] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(false)

  // Date filter states
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [dateFilterType, setDateFilterType] = useState<string>('all')
  const [showCustomDateInputs, setShowCustomDateInputs] =
    useState<boolean>(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Delivery partner states
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [deliveryPartner, setDeliveryPartner] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(
    null
  )
  const [editingNcmOrderId, setEditingNcmOrderId] = useState<string | null>(
    null
  )
  const [ncmDestinationBranch, setNcmDestinationBranch] = useState<string>('')
  const [ncmBranches, setNcmBranches] = useState<string[]>([])
  const [isLoadingNcmBranches, setIsLoadingNcmBranches] =
    useState<boolean>(false)
  const [updatingNcmBranchOrderId, setUpdatingNcmBranchOrderId] = useState<
    string | null
  >(null)

  // Modal state
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [modalOrder, setModalOrder] = useState<any>(null)
  const [modalTracking, setModalTracking] = useState<any>(null)
  const [modalTrackingLoading, setModalTrackingLoading] = useState<boolean>(false)
  const [modalFullscreenImage, setModalFullscreenImage] = useState<string | null>(null)

  // Fetch orders from backend on filter/search/page change
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (searchQuery) params.set('search', searchQuery)
      if (dateFilterType && dateFilterType !== 'all') {
        params.set('dateFilter', dateFilterType)
        if (dateFilterType === 'custom') {
          if (startDate) params.set('startDate', startDate)
          if (endDate) params.set('endDate', endDate)
        }
      }
      const query = params.toString() ? `?${params.toString()}` : ''
      const res = await fetch(`${BASE_URL}/order${query}`)
      const data = await res.json()
      setOrders(data.orders || data.orderData || [])
      setTotalOrders(data.totalCount || data.total || 0)
    } catch (err) {
      setOrders([])
      setTotalOrders(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchQuery, dateFilterType, startDate, endDate])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [activeOrderDetails, setActiveOrderDetails] = useState<any>(undefined)
  const [activeData, setActiveData] = useState<any>([{}])

  const orderPdf = useMemo(() => {
    if (!!activeOrderDetails) {
      return <OrderPDF data={activeData} />
    }
  }, [activeOrderDetails, showDetails])

  const [dataToPrint, setDataToPrint] = useState<any>([])

  const BulkActionHandler = (value, ordersData) => {
    if (value) {
      setDataToPrint((prev: any) => [
        ...prev,
        {data: ordersData, isPrinting: value}
      ])
    }
  }

  // Helper function to parse date from OrderedAt string
  const parseOrderDate = (dateString: string) => {
    return parseDate(dateString)
  }

  // Helper function to get date range based on filter type
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null

    let date = new Date(dateStr)
    if (!isNaN(date.getTime())) return date

    const [datePart, timePart] = dateStr.split(',')
    const [day, month, year] = datePart
      .trim()
      .split(/[\/\-]/)
      .map(Number)

    if (!day || !month || !year) return null

    let [hours, minutes, seconds] = [0, 0, 0]
    if (timePart) {
      ;[hours, minutes, seconds] = timePart.trim().split(':').map(Number)
      seconds = seconds || 0
    }

    return new Date(year, month - 1, day, hours, minutes, seconds)
  }

  const getDateRange = (
    filterType: string,
    startDate?: string,
    endDate?: string
  ) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (filterType) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }

      case 'last1hour': {
        const start = new Date(now.getTime() - 60 * 60 * 1000)
        return {start, end: now}
      }

      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return {
          start: weekStart,
          end: new Date(now.getTime() + 24 * 60 * 60 * 1000)
        }

      case 'last7days': {
        const start = new Date(now)
        start.setDate(now.getDate() - 7)
        return {start, end: now}
      }

      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
          start: monthStart,
          end: new Date(now.getTime() + 24 * 60 * 60 * 1000)
        }

      case 'custom':
        const parsedStart = parseDate(startDate || '')
        const parsedEnd = parseDate(endDate || '')
        return {
          start: parsedStart,
          end: parsedEnd
            ? new Date(parsedEnd.getTime() + 24 * 60 * 60 * 1000)
            : null
        }

      default:
        return {start: null, end: null}
    }
  }

  // Helper function to get total quantity for an order
  const getTotalQuantity = (products: any[]) => {
    return (
      products?.reduce((total, product) => total + product.quantity, 0) || 0
    )
  }

  // Helper function to get total price for an order
  const getTotalPrice = (products: any[]) => {
    return products?.reduce((total, product) => total + product.price, 0) || 0
  }

  // Helper function to open Google Maps location
  const openGoogleMaps = (latitude: number, longitude: number) => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`
      window.open(url, '_blank')
    }
  }

  const toSafeList = (value: any): any[] => {
    if (Array.isArray(value)) return value
    if (value && typeof value === 'object') return Object.values(value)
    return []
  }

  const takeFirst = (value: any, count: number): any[] => {
    const list = toSafeList(value)
    const max = Math.max(0, Number(count || 0))
    const result: any[] = []
    for (let i = 0; i < list.length && i < max; i += 1) {
      result.push(list[i])
    }
    return result
  }

  const formatDateTime = (value: any) => {
    if (!value) return '-'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return String(value)
    return parsed.toLocaleString()
  }

  // Helper function to get location display name
  const getLocationDisplayName = (order: any) => {
    if (order.locationAddress) {
      return order.locationAddress
    }
    if (order.latitude && order.longitude) {
      return `${order.latitude.toFixed(6)}, ${order.longitude.toFixed(6)}`
    }
    return 'No location data'
  }

  // Confirm order from admin panel, then optionally open WhatsApp helper.
  const sendWhatsAppMessage = async (order: any) => {
    console.log(order, 'order finally')

    if (!order?._id) {
      toast.error('Invalid order')
      return
    }

    if (confirmingOrderId) {
      return
    }

    if (order?.isConfirmed) {
      toast('This order is already confirmed.')
      return
    }

    setConfirmingOrderId(order._id)
    try {
      let confirmationUpdated = false
      let ncmMeta: any = null
      await dispatch(
        updateOrderByIdAction({
          id: String(order._id),
          data: {
            isConfirmed: true,
            confirmedAt: new Date().toISOString()
          },
          onSuccess: (response: AxiosResponse) => {
            confirmationUpdated = true
            ncmMeta = response?.data?.ncm || null
          }
        })
      )

      if (!confirmationUpdated) {
        toast.error('Failed to confirm order. Please try again.')
        return
      }

      if (ncmMeta?.success) {
        const pickupText = ncmMeta?.skipped
          ? `NCM pickup already existed (#${ncmMeta?.ncmOrderId || 'N/A'})`
          : `NCM pickup created (#${ncmMeta?.ncmOrderId || 'N/A'})`
        toast.success(
          `Order confirmed. ${pickupText}. Confirmation email has been sent to customer.`
        )
      } else {
        toast.success(
          'Order confirmed. Confirmation email has been sent to customer.'
        )
        if (ncmMeta?.error) {
          const shortError = String(ncmMeta.error).slice(0, 160)
          toast.error(`NCM pickup sync failed: ${shortError}`)
        }
      }
      await fetchOrders()

      const phoneNumber = order.phoneNumber || '9841934343'
      const customerName =
        order.userId?.name || order.userId?.email || 'Customer'
      const orderId = order.productOrderId || order._id

      const productsList =
        order.products
          ?.map(
            (product, index) =>
              `${index + 1}. ${product.productId?.name} (Qty: ${product.quantity}, Price: ${getNprPrice(product.price)})`
          )
          .join('\n') || 'No products listed'

      const totalAmount = getNprPrice(order.totalAmount)
      const shippingLocation = order.shippingLocation || order.locationAddress
      const deliveryType = order.isInsideValley
        ? 'Home Delivery (Inside Valley)'
        : 'Office Delivery (Outside Valley)'
      const paymentType =
        order.paymentMethod === 'phonepay'
          ? 'PhonePay'
          : 'Cash on Delivery (COD)'

      let locationInfo = ''
      if (order.latitude && order.longitude) {
        locationInfo = `\n📍 *Location:* https://www.google.com/maps?q=${order.latitude},${order.longitude}`
      }

      const message = `🎉 *ORDER CONFIRMED* 🎉

Dear ${customerName},

Your order has been confirmed and is being processed!

📋 *Order Details:*
Order ID: ${orderId}
${productsList}

💰 *Payment Summary:*
Total Amount: ${totalAmount}
Payment Method: ${paymentType}

🚚 *Delivery Information:*
Delivery Type: ${deliveryType}
Address: ${shippingLocation}${locationInfo}
Estimated Delivery: ${order.isInsideValley ? '1 day' : '2–5 working days'}

📧 *Confirmation Email Sent:*
We've sent your confirmation details and invoice image by email.

Thank you for shopping with us! 
We'll keep you updated on your order status.

Best regards,
Aabhushan Gallery Team`

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error('Error confirming order:', error)
      toast.error('Failed to confirm order. Please try again.')
    } finally {
      setConfirmingOrderId(null)
    }
  }

  // Function to handle delivery partner update
  const handleDeliveryPartnerUpdate = async (orderId: string) => {
    if (!deliveryPartner) {
      toast.error('Please select a delivery partner')
      return
    }

    setIsUpdating(true)
    try {
      await dispatch(
        updateOrderByIdAction({
          id: String(orderId),
          data: {deliveryPartner},
          onSuccess: (response: AxiosResponse) => {
            toast.success('Delivery partner updated successfully')
            setEditingOrderId(null)
            setDeliveryPartner('')
            fetchOrders()
          }
        })
      )
    } catch (error) {
      toast.error('Error updating delivery partner')
      console.error('Update error:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Function to start editing delivery partner
  const startEditingDeliveryPartner = (order: any) => {
    setEditingOrderId(order._id)
    setDeliveryPartner(order.deliveryPartner || '')
  }

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingOrderId(null)
    setDeliveryPartner('')
  }

  const handleDeleteOrder = async (order: any) => {
    const orderId = order?._id
    const displayId = order?.productOrderId || orderId

    if (!orderId) {
      toast.error('Invalid order ID')
      return
    }

    const shouldDelete = window.confirm(
      `Delete order ${displayId}? This cannot be undone.`
    )
    if (!shouldDelete) return

    setDeletingOrderId(orderId)

    try {
      const response = await fetch(`${BASE_URL}/order/${orderId}`, {
        method: 'DELETE'
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || 'Failed to delete order')
      }

      toast.success(`Order ${displayId} deleted successfully`)

      if (modalOrder?._id === orderId) {
        closeOrderModal()
      }

      await fetchOrders()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete order')
    } finally {
      setDeletingOrderId(null)
    }
  }

  const fetchNcmBranches = useCallback(async () => {
    if (ncmBranches.length > 0 || isLoadingNcmBranches) {
      return
    }

    setIsLoadingNcmBranches(true)
    try {
      const response = await fetch(`${BASE_URL}/order/ncm/assigned-branches`)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch NCM branches')
      }

      const branches = Array.isArray(data?.branches)
        ? data.branches.map((item: any) => String(item).trim()).filter(Boolean)
        : []

      setNcmBranches(branches)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch NCM branches')
    } finally {
      setIsLoadingNcmBranches(false)
    }
  }, [ncmBranches, isLoadingNcmBranches])

  const startEditingNcmBranch = async (order: any) => {
    setEditingNcmOrderId(order._id)
    setNcmDestinationBranch(order?.ncmDestinationBranch || '')
    await fetchNcmBranches()
  }

  const cancelEditingNcmBranch = () => {
    setEditingNcmOrderId(null)
    setNcmDestinationBranch('')
  }

  const handleNcmBranchUpdate = async (orderId: string) => {
    if (!orderId) return

    setUpdatingNcmBranchOrderId(orderId)
    try {
      await dispatch(
        updateOrderByIdAction({
          id: String(orderId),
          data: {
            ncmDestinationBranch: ncmDestinationBranch
              ? ncmDestinationBranch.trim().toUpperCase()
              : ''
          },
          onSuccess: () => {
            toast.success('NCM destination branch updated')
            setEditingNcmOrderId(null)
            setNcmDestinationBranch('')
          }
        })
      )

      await fetchOrders()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update NCM destination branch')
    } finally {
      setUpdatingNcmBranchOrderId(null)
    }
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'

    try {
      let date: Date

      const cleanDate = dateString.replace(',', '').trim()

      if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(cleanDate)) {
        date = new Date(cleanDate)
      }
      else if (/^\d{2}\/\d{2}\/\d{4}/.test(cleanDate)) {
        const [day, month, yearAndTime] = cleanDate.split('/')
        const [year, time] = yearAndTime.split(' ')
        const isoString = `${year}-${month}-${day}T${time || '00:00:00'}`
        date = new Date(isoString)
      } else {
        date = new Date(cleanDate)
      }

      if (isNaN(date.getTime())) return dateString

      return (
        date.toLocaleDateString('en-GB') +
        ' ' +
        date.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      )
    } catch {
      return dateString
    }
  }

  // Truncate text helper
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  // Clear date filter
  const clearDateFilter = () => {
    setDateFilterType('all')
    setStartDate('')
    setEndDate('')
    setShowCustomDateInputs(false)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
  }

  // Clear all filters
  const clearAllFilters = () => {
    clearDateFilter()
    clearSearch()
  }

  // Handle custom date filter toggle
  const handleCustomDateFilterToggle = () => {
    if (dateFilterType === 'custom') {
      setShowCustomDateInputs(!showCustomDateInputs)
    } else {
      setDateFilterType('custom')
      setShowCustomDateInputs(true)
    }
  }

  // Handle start date change
  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setStartDate(newValue)
    },
    []
  )

  // Handle end date change
  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setEndDate(newValue)
    },
    []
  )

  const fetchOrderTracking = useCallback(async (orderId: string) => {
    setModalTrackingLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/order/${orderId}/tracking`)
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.error || 'Failed to fetch tracking details')
      }
      setModalTracking(json)
    } catch (_error) {
      setModalTracking(null)
    } finally {
      setModalTrackingLoading(false)
    }
  }, [])

  const openOrderModal = useCallback(async (order: any) => {
    setModalOrder(order)
    setShowOrderModal(true)
    setModalTracking(null)
    await fetchOrderTracking(order._id)
  }, [fetchOrderTracking])

  const closeOrderModal = useCallback(() => {
    setShowOrderModal(false)
    setModalOrder(null)
    setModalTracking(null)
    setModalTrackingLoading(false)
  }, [])

  useEffect(() => {
    if (!showOrderModal || !modalOrder?._id) return
    const trackerPoll = setInterval(() => {
      fetchOrderTracking(modalOrder._id)
    }, 30 * 1000)
    return () => clearInterval(trackerPoll)
  }, [showOrderModal, modalOrder?._id, fetchOrderTracking])

  return (
    <div style={{
      backgroundColor: '#faf6f2',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
      height: '100%'
    }}>
      <Box>
        {/* Header Section */}
   

        {/* Filter Section */}
        {!showDetails && (
          <div style={{
            margin: '0 16px 24px 16px',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e8ddd0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            {/* Search Bar */}
            <div style={{
              marginBottom: '24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <div style={{flex: 1}}>
                <input
                  type="text"
                  placeholder="🔍 Search orders by ID, location, phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '2px solid #e8ddd0',
                    fontSize: '15px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#fefcf9'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c44569'
                    e.target.style.backgroundColor = '#ffffff'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8ddd0'
                    e.target.style.backgroundColor = '#fefcf9'
                  }}
                />
              </div>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#f0e4d5',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#5a3d2b',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0d0c0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0e4d5'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                fontWeight: '600',
                fontSize: '15px',
                paddingTop: '8px',
                color: '#5a3d2b'
              }}>
                Filter by Date:
              </div>

              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1}}>
                {['all', 'last1hour', 'last7days', 'custom'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      if (filter === 'custom') {
                        handleCustomDateFilterToggle()
                      } else {
                        setDateFilterType(filter)
                        setShowCustomDateInputs(false)
                      }
                      if (page !== 1) setPage(1)
                    }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '25px',
                      border: dateFilterType === filter ? 'none' : '1px solid #e8ddd0',
                      background: dateFilterType === filter 
                        ? '#c44569'
                        : '#ffffff',
                      color: dateFilterType === filter ? '#ffffff' : '#8b6b4d',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      boxShadow: dateFilterType === filter ? '0 2px 8px rgba(196,69,105,0.2)' : 'none'
                    }}
                  >
                    {filter === 'all' ? 'All Orders' : 
                     filter === 'last1hour' ? 'Last Hour' :
                     filter === 'last7days' ? 'Last 7 Days' : 'Custom Range'}
                  </button>
                ))}
              </div>

              {(dateFilterType !== 'all' || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '25px',
                    border: '1px solid #e8ddd0',
                    backgroundColor: '#ffffff',
                    color: '#c44569',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff0f3'
                    e.currentTarget.style.borderColor = '#c44569'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                    e.currentTarget.style.borderColor = '#e8ddd0'
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {dateFilterType === 'custom' && showCustomDateInputs && (
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#fefcf9',
                borderRadius: '12px',
                border: '1px solid #e8ddd0'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <label style={{fontSize: '13px', fontWeight: '600', color: '#5a3d2b'}}>
                    From:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e8ddd0',
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <label style={{fontSize: '13px', fontWeight: '600', color: '#5a3d2b'}}>
                    To:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e8ddd0',
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowCustomDateInputs(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e8ddd0',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#8b6b4d',
                    marginLeft: 'auto'
                  }}
                >
                  Hide
                </button>
              </div>
            )}

            <div style={{
              marginTop: '20px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#8b6b4d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #f0e4d5'
            }}>
              <span>
                Showing <strong style={{color: '#c44569', fontSize: '15px'}}>{orders.length}</strong> of{' '}
                <strong style={{color: '#c44569', fontSize: '15px'}}>{totalOrders}</strong> orders
              </span>
              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                {searchQuery && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#fce4ec',
                    color: '#c44569'
                  }}>
                    🔍 "{searchQuery.substring(0, 30)}{searchQuery.length > 30 ? '...' : ''}"
                  </span>
                )}
                {dateFilterType !== 'all' && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: '#fff3e0',
                    color: '#c44569'
                  }}>
                    📅 {dateFilterType === 'custom' && startDate && endDate
                      ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                      : dateFilterType === 'last1hour' ? 'Last Hour' : 'Last 7 Days'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        {!showDetails && (
          <div style={{margin: '0 16px', paddingBottom: '32px'}}>
            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '80px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e8ddd0'
              }}>
                <div style={{textAlign: 'center'}}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid #f0e4d5',
                    borderTop: '3px solid #c44569',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }}></div>
                  <p style={{color: '#8b6b4d', fontSize: '15px', fontWeight: '500'}}>Loading orders...</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '80px',
                textAlign: 'center',
                border: '1px solid #e8ddd0'
              }}>
                <p style={{color: '#b8956e', fontSize: '16px', fontWeight: '500'}}>No orders found</p>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    activeData={activeData}
                    setActiveData={setActiveData}
                    setShowDetails={setShowDetails}
                    setActiveOrderDetails={setActiveOrderDetails}
                    openOrderModal={openOrderModal}
                    handleDeleteOrder={handleDeleteOrder}
                    deletingOrderId={deletingOrderId}
                    editingOrderId={editingOrderId}
                    deliveryPartner={deliveryPartner}
                    setDeliveryPartner={setDeliveryPartner}
                    handleDeliveryPartnerUpdate={handleDeliveryPartnerUpdate}
                    cancelEditing={cancelEditing}
                    startEditingDeliveryPartner={startEditingDeliveryPartner}
                    editingNcmOrderId={editingNcmOrderId}
                    ncmDestinationBranch={ncmDestinationBranch}
                    setNcmDestinationBranch={setNcmDestinationBranch}
                    handleNcmBranchUpdate={handleNcmBranchUpdate}
                    cancelEditingNcmBranch={cancelEditingNcmBranch}
                    startEditingNcmBranch={startEditingNcmBranch}
                    ncmBranches={ncmBranches}
                    isLoadingNcmBranches={isLoadingNcmBranches}
                    updatingNcmBranchOrderId={updatingNcmBranchOrderId}
                    isUpdating={isUpdating}
                    confirmingOrderId={confirmingOrderId}
                    sendWhatsAppMessage={sendWhatsAppMessage}
                    getTotalQuantity={getTotalQuantity}
                    getNprPrice={getNprPrice}
                    formatDate={formatDate}
                    truncateText={truncateText}
                    openGoogleMaps={openGoogleMaps}
                    getTotalPrice={getTotalPrice}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && orders.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                marginTop: '32px',
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e8ddd0'
              }}>
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: '1px solid #e8ddd0',
                    backgroundColor: '#ffffff',
                    color: page === 1 ? '#d0c0b0' : '#c44569',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  Previous
                </button>
                <span style={{color: '#5a3d2b', fontSize: '15px', fontWeight: '600'}}>
                  Page {page} of {Math.ceil(totalOrders / limit)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * limit >= totalOrders}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: '1px solid #e8ddd0',
                    backgroundColor: '#ffffff',
                    color: page * limit >= totalOrders ? '#d0c0b0' : '#c44569',
                    cursor: page * limit >= totalOrders ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Print Button */}
        {!showDetails && activeData.filter(item => Object.keys(item).length !== 0).length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 100
          }}>
            <button
              onClick={() => {
                const filteredData = activeData.filter(item => Object.keys(item).length !== 0)
                if (filteredData.length > 0) {
                  setShowDetails(true)
                  setActiveOrderDetails(filteredData)
                }
              }}
              style={{
                padding: '14px 28px',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #c44569 0%, #a83254 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 6px 20px rgba(196,69,105,0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(196,69,105,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,69,105,0.3)'
              }}
            >
              <IoPrint size={22} />
              Print Selected ({activeData.filter(item => Object.keys(item).length !== 0).length})
            </button>
          </div>
        )}

        {/* Order Details Modal - FIXED VERSION */}
        {showOrderModal && modalOrder && (
          <>
            <Modal
              visible={showOrderModal}
              modalSize="lg"
              width="900px"
              overlayBlur={6}
              closeModal={closeOrderModal}
            >
            <div style={{
              padding: '28px',
              maxHeight: '85vh',
              overflowY: 'auto',
              backgroundColor: '#fefcf9',
              width: '100%',
              borderRadius: '20px'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #f0e4d5'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#2d1b4e'
                }}>
                  Order Details
                </div>
                <button
                  onClick={closeOrderModal}
                  style={{
                    border: 'none',
                    background: '#f0e4d5',
                    fontSize: '22px',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    color: '#5a3d2b'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e0d0c0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0e4d5'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Order Info Section */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '14px',
                marginBottom: '20px',
                border: '1px solid #e8ddd0'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#2d1b4e',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #f0e4d5'
                }}>
                  Order Information
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#b8956e',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      Order ID
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      color: '#2d1b4e'
                    }}>
                      {modalOrder.productOrderId || modalOrder._id}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#b8956e',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      Placed At
                    </div>
                    <div style={{fontSize: '15px', fontWeight: '600', color: '#5a3d2b'}}>
                      {formatDate(modalOrder.OrderedAt)}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#b8956e',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      Customer
                    </div>
                    <div style={{fontSize: '16px', fontWeight: '700', color: '#2d1b4e'}}>
                      {modalOrder.userId?.name || modalOrder.userId?.email || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#b8956e',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      Phone
                    </div>
                    <div style={{fontSize: '15px', fontWeight: '600', color: '#5a3d2b'}}>
                      {modalOrder.phoneNumber || modalOrder.userId?.phone || '-'}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#b8956e',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      Payment Method
                    </div>
                    <div style={{fontSize: '15px', fontWeight: '600', color: '#5a3d2b'}}>
                      {modalOrder.paymentMethod || '-'}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#b8956e',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      Valley Status
                    </div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: modalOrder.isInsideValley ? '#2e7d32' : '#f57c00'
                    }}>
                      {modalOrder.isInsideValley ? 'Inside Valley' : 'Outside Valley'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '14px',
                marginBottom: '20px',
                border: '1px solid #e8ddd0'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#2d1b4e',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #f0e4d5'
                }}>
                  Delivery Information
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#b8956e',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      Shipping Location
                    </div>
                    <div style={{fontSize: '15px', fontWeight: '500', color: '#5a3d2b', lineHeight: '1.5'}}>
                      {modalOrder.shippingLocation || modalOrder.locationAddress || '-'}
                    </div>
                  </div>
                  {modalOrder.deliveryPartner && (
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: '#b8956e',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}>
                        Delivery Partner
                      </div>
                      <div style={{fontSize: '15px', fontWeight: '600', color: '#c44569'}}>
                        {modalOrder.deliveryPartner}
                      </div>
                    </div>
                  )}
                  {modalOrder.isRedZone && (
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: '#b8956e',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}>
                        Red Zone
                      </div>
                      <div style={{fontSize: '15px', color: '#e74c3c', fontWeight: '700'}}>
                        Yes
                      </div>
                    </div>
                  )}
                  {modalOrder.latitude && modalOrder.longitude && (
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: '#b8956e',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}>
                        GPS Location
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${modalOrder.latitude},${modalOrder.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '15px',
                          color: '#c44569',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: '600'
                        }}
                      >
                        📍 View on Google Maps
                      </a>
                    </div>
                  )}
                  {modalOrder.orderNote && (
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: '#b8956e',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}>
                        Order Note
                      </div>
                      <div style={{
                        fontSize: '15px',
                        fontStyle: 'italic',
                        color: '#8b6b4d',
                        lineHeight: '1.5',
                        padding: '10px',
                        backgroundColor: '#fefcf9',
                        borderRadius: '8px',
                        border: '1px solid #f0e4d5'
                      }}>
                        {modalOrder.orderNote}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* NCM Tracking Section */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '14px',
                marginBottom: '20px',
                border: '1px solid #e8ddd0'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#2d1b4e',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #f0e4d5'
                }}>
                  NCM Tracking
                </div>

                {modalTrackingLoading ? (
                  <div style={{fontSize: '15px', fontWeight: '500', color: '#8b6b4d', textAlign: 'center', padding: '20px'}}>
                    Loading tracking details...
                  </div>
                ) : (
                  <>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '20px'
                    }}>
                      <div style={{padding: '12px', backgroundColor: '#fefcf9', borderRadius: '10px', border: '1px solid #f0e4d5'}}>
                        <div style={{fontSize: '11px', color: '#b8956e', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700'}}>
                          Pickup Created
                        </div>
                        <div style={{fontSize: '14px', fontWeight: '600', color: '#2d1b4e'}}>
                          {formatDateTime(modalTracking?.ncm?.summary?.pickupCreatedAt || modalOrder?.ncmPickupCreatedAt)}
                        </div>
                      </div>
                      <div style={{padding: '12px', backgroundColor: '#fefcf9', borderRadius: '10px', border: '1px solid #f0e4d5'}}>
                        <div style={{fontSize: '11px', color: '#b8956e', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700'}}>
                          Pickup Completed
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: modalTracking?.ncm?.summary?.pickupCompleted ? '#2e7d32' : '#f57c00'
                        }}>
                          {modalTracking?.ncm?.summary?.pickupCompleted ? 'Yes' : 'No'}
                        </div>
                      </div>
                      <div style={{padding: '12px', backgroundColor: '#fefcf9', borderRadius: '10px', border: '1px solid #f0e4d5'}}>
                        <div style={{fontSize: '11px', color: '#b8956e', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700'}}>
                          Delivered
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: modalTracking?.ncm?.summary?.delivered ? '#2e7d32' : '#f57c00'
                        }}>
                          {modalTracking?.ncm?.summary?.delivered ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      color: '#2d1b4e'
                    }}>
                      Latest Status Timeline
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto'}}>
                      {takeFirst(modalTracking?.ncm?.statuses, 10).map((statusItem: any, index: number) => (
                        <div key={index} style={{
                          border: '1px solid #f0e4d5',
                          borderRadius: '10px',
                          padding: '12px',
                          background: '#fefcf9'
                        }}>
                          <div style={{fontSize: '14px', fontWeight: '700', color: '#2d1b4e'}}>
                            {statusItem?.status || '-'}
                          </div>
                          <div style={{fontSize: '12px', color: '#b8956e', marginTop: '4px'}}>
                            {statusItem?.added_time || '-'}
                          </div>
                          {statusItem?.location && (
                            <div style={{fontSize: '12px', color: '#8b6b4d', marginTop: '4px'}}>
                              📍 {statusItem.location}
                            </div>
                          )}
                        </div>
                      ))}
                      {toSafeList(modalTracking?.ncm?.statuses).length === 0 && (
                        <div style={{fontSize: '13px', color: '#b8956e', textAlign: 'center', padding: '20px'}}>
                          No status updates available yet.
                        </div>
                      )}
                    </div>

                    <div style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      color: '#2d1b4e'
                    }}>
                      Latest Comments
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto'}}>
                      {takeFirst(modalTracking?.ncm?.comments, 8).map((commentItem: any, index: number) => (
                        <div key={index} style={{
                          border: '1px solid #f0e4d5',
                          borderRadius: '10px',
                          padding: '12px',
                          background: '#fefcf9'
                        }}>
                          <div style={{fontSize: '13px', fontWeight: '500', color: '#5a3d2b'}}>
                            {commentItem?.comments || '-'}
                          </div>
                          <div style={{fontSize: '11px', color: '#b8956e', marginTop: '4px'}}>
                            {commentItem?.addedBy || '-'} • {commentItem?.added_time || '-'}
                          </div>
                        </div>
                      ))}
                      {toSafeList(modalTracking?.ncm?.comments).length === 0 && (
                        <div style={{fontSize: '13px', color: '#b8956e', textAlign: 'center', padding: '20px'}}>
                          No comments available yet.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Products Section */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '14px',
                marginBottom: '20px',
                border: '1px solid #e8ddd0'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#2d1b4e',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #f0e4d5'
                }}>
                  Products ({modalOrder.products?.length || 0})
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto'}}>
                  {modalOrder.products?.map((product: any, index: number) => {
                    const imageUrl = getProductImageUrl(product)

                    return (
                      <div key={index} style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '16px',
                        backgroundColor: '#fefcf9',
                        borderRadius: '12px',
                        border: '1px solid #f0e4d5'
                      }}>
                        <img
                          src={imageUrl || '/assets/images/defaultProduct.jpeg'}
                          alt={product.productId?.name || 'Product image'}
                          width={80}
                          height={80}
                          loading="lazy"
                          onClick={() => setModalFullscreenImage(imageUrl || '/assets/images/defaultProduct.jpeg')}
                          style={{
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e8ddd0',
                            cursor: 'pointer'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/assets/images/defaultProduct.jpeg'
                          }}
                        />
                        <div style={{flex: 1}}>
                          <div style={{fontSize: '16px', fontWeight: '700', color: '#2d1b4e', marginBottom: '8px'}}>
                            {product.productId?.name || 'Unknown Product'}
                          </div>
                          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px'}}>
                            {product.colorName && (
                              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <span style={{fontSize: '12px', color: '#b8956e'}}>Color:</span>
                                <span style={{
                                  display: 'inline-block',
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '4px',
                                  backgroundColor: product.colorName,
                                  border: '1px solid #e8ddd0'
                                }} />
                                <span style={{fontSize: '13px', color: '#5a3d2b'}}>{product.colorName}</span>
                              </div>
                            )}
                            {product.size && (
                              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <span style={{fontSize: '12px', color: '#b8956e'}}>Size:</span>
                                <span style={{fontSize: '13px', fontWeight: '500', color: '#5a3d2b'}}>{product.size}</span>
                              </div>
                            )}
                            {product.sku && (
                              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                <span style={{fontSize: '12px', color: '#b8956e'}}>SKU:</span>
                                <span style={{fontSize: '13px', fontWeight: '500', color: '#5a3d2b', fontFamily: 'monospace'}}>{product.sku}</span>
                              </div>
                            )}
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f0e4d5'}}>
                            <span style={{fontSize: '15px', fontWeight: '600', color: '#5a3d2b'}}>Qty: {product.quantity || 0}</span>
                            <span style={{fontSize: '18px', fontWeight: '800', color: '#c44569'}}>{getNprPrice(product.price || 0)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid #e8ddd0'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#2d1b4e',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #f0e4d5'
                }}>
                  Order Summary
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '15px'}}>
                    <span style={{color: '#8b6b4d', fontWeight: '500'}}>Subtotal</span>
                    <span style={{fontWeight: '700', color: '#2d1b4e'}}>{getNprPrice(getTotalPrice(modalOrder.products || []))}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '15px'}}>
                    <span style={{color: '#8b6b4d', fontWeight: '500'}}>Shipping</span>
                    <span style={{fontWeight: '700', color: '#2d1b4e'}}>{getNprPrice(modalOrder.shippingPrice || 0)}</span>
                  </div>
                  {modalOrder.giftBoxCharge > 0 && (
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '15px'}}>
                      <span style={{color: '#8b6b4d', fontWeight: '500'}}>Gift Box</span>
                      <span style={{fontWeight: '700', color: '#2d1b4e'}}>{getNprPrice(modalOrder.giftBoxCharge)}</span>
                    </div>
                  )}
                  {modalOrder.deliveryPartnerPrice > 0 && (
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '15px'}}>
                      <span style={{color: '#8b6b4d', fontWeight: '500'}}>Delivery Charge</span>
                      <span style={{fontWeight: '700', color: '#2d1b4e'}}>{getNprPrice(modalOrder.deliveryPartnerPrice)}</span>
                    </div>
                  )}
                  <div style={{
                    borderTop: '2px solid #f0e4d5',
                    paddingTop: '12px',
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{fontSize: '18px', fontWeight: '800', color: '#2d1b4e'}}>Total</span>
                    <span style={{fontSize: '22px', fontWeight: '800', color: '#c44569'}}>{getNprPrice(modalOrder.totalAmount || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          {modalFullscreenImage && (
            <ImageViewer src={modalFullscreenImage} onClose={() => setModalFullscreenImage(null)} />
          )}
          </>
        )}

        {orderPdf}

        {showDetails && (
          <AiOutlineClose
            style={{
              position: 'fixed',
              right: '24px',
              top: '24px',
              zIndex: 1000,
              cursor: 'pointer',
              fontSize: '28px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              padding: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #e8ddd0',
              color: '#c44569'
            }}
            onClick={() => {
              setShowDetails(false)
              setActiveOrderDetails(undefined)
              setActiveData([{}])
            }}
          />
        )}
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            overflow-y: auto !important;
          }
        `}</style>
      </Box>
    </div>
  )
}

// Order Card Component with Product Images
const OrderCard = ({
  order,
  activeData,
  setActiveData,
  setShowDetails,
  setActiveOrderDetails,
  openOrderModal,
  handleDeleteOrder,
  deletingOrderId,
  editingOrderId,
  deliveryPartner,
  setDeliveryPartner,
  handleDeliveryPartnerUpdate,
  cancelEditing,
  startEditingDeliveryPartner,
  editingNcmOrderId,
  ncmDestinationBranch,
  setNcmDestinationBranch,
  handleNcmBranchUpdate,
  cancelEditingNcmBranch,
  startEditingNcmBranch,
  ncmBranches,
  isLoadingNcmBranches,
  updatingNcmBranchOrderId,
  isUpdating,
  confirmingOrderId,
  sendWhatsAppMessage,
  getTotalQuantity,
  getNprPrice,
  formatDate,
  truncateText,
  openGoogleMaps,
  getTotalPrice
}) => {
  const isSelected = activeData?.find((item) => item._id === order._id) !== undefined
  const [expandedProducts, setExpandedProducts] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.2s ease',
      border: '1px solid #f0e4d5'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '14px', flex: 1}}>
          <div onClick={() => {
            if (isSelected) {
              setActiveData(activeData.filter((item) => item._id !== order._id))
            } else {
              setActiveData((prev) => [...prev, order])
            }
          }} style={{cursor: 'pointer'}}>
            {isSelected ? <IoCheckboxOutline size={26} color="#c44569" /> : <MdCheckBoxOutlineBlank size={26} color="#d4bfa8" />}
          </div>
          <div>
            <div style={{fontSize: '12px', color: '#b8956e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', fontWeight: '600'}}>
              Order ID
            </div>
            <div style={{fontSize: '20px', fontWeight: '800', fontFamily: 'monospace', color: '#2d1b4e'}}>
              {order.productOrderId || order._id}
            </div>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={() => openOrderModal(order)} style={{
            padding: '10px 20px', borderRadius: '10px', border: '1px solid #e8ddd0', background: '#ffffff',
            color: '#c44569', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fce4ec'; e.currentTarget.style.borderColor = '#c44569' }}
             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e8ddd0' }}>
            <Eye size={18} /> View Details
          </button>
          
          <button onClick={() => { setShowDetails(true); setActiveOrderDetails(order); setActiveData([order]) }} style={{
            padding: '10px 20px', borderRadius: '10px', border: '1px solid #e8ddd0', background: '#ffffff',
            color: '#8b6b4d', cursor: 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0e4d5' }}
             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff' }}>
            <IoPrint size={18} /> Print
          </button>
          
          <button onClick={() => handleDeleteOrder(order)} disabled={deletingOrderId === order._id} style={{
            padding: '10px 20px', borderRadius: '10px', border: '1px solid #e8ddd0', background: '#ffffff',
            color: '#e74c3c', cursor: deletingOrderId === order._id ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', opacity: deletingOrderId === order._id ? 0.6 : 1
          }} onMouseEnter={(e) => { if (deletingOrderId !== order._id) { e.currentTarget.style.backgroundColor = '#fef2f0'; e.currentTarget.style.borderColor = '#e74c3c' } }}
             onMouseLeave={(e) => { if (deletingOrderId !== order._id) { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e8ddd0' } }}>
            <Trash2 size={18} /> {deletingOrderId === order._id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Info Grid - Larger Fonts */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px'}}>
        {/* Customer Info */}
        <div style={{padding: '16px', backgroundColor: '#fefcf9', borderRadius: '14px', border: '1px solid #f0e4d5'}}>
          <div style={{fontSize: '13px', color: '#b8956e', textTransform: 'uppercase', fontWeight: '800', marginBottom: '12px', letterSpacing: '0.5px'}}>
            Customer Information
          </div>
          <div style={{fontSize: '16px', fontWeight: '800', color: '#2d1b4e', marginBottom: '8px'}}>
            {order.userId?.email || 'N/A'}
          </div>
          <div style={{fontSize: '15px', fontWeight: '600', color: '#5a3d2b', marginBottom: '8px'}}>
            📞 {order.phoneNumber || order.userId?.phone || '-'}
          </div>
          <div style={{fontSize: '14px', fontWeight: '500', color: '#b8956e', marginTop: '8px'}}>
            🕒 {formatDate(order.OrderedAt)}
          </div>
        </div>

        {/* Products with Images */}
        <div style={{padding: '16px', backgroundColor: '#fefcf9', borderRadius: '14px', border: '1px solid #f0e4d5'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
            <div style={{fontSize: '13px', color: '#b8956e', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px'}}>
              Products ({order.products?.length || 0})
            </div>
            <div style={{fontSize: '15px', fontWeight: '800', color: '#2d1b4e'}}>
              Total Qty: {getTotalQuantity(order.products)}
            </div>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {order.products?.slice(0, expandedProducts ? undefined : 2).map((product, idx) => (
              <div key={idx} style={{display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #f0e4d5'}}>
                <img 
                  src={getProductImageUrl(product)} 
                  alt={product.productId?.name || 'Product'} 
                  width={70}
                  height={70}
                  loading="lazy"
                  onClick={() => setFullscreenImage(getProductImageUrl(product))}
                  style={{objectFit: 'cover', borderRadius: '8px', border: '1px solid #f0e4d5', cursor: 'pointer'}}
                />
                <div style={{flex: 1}}>
                  <div style={{fontSize: '15px', fontWeight: '800', color: '#2d1b4e', marginBottom: '6px'}}>
                    {truncateText(product.productId?.name, 35)}
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                    <span style={{fontSize: '14px', fontWeight: '600', color: '#5a3d2b'}}>Qty: {product.quantity}</span>
                    <span style={{fontSize: '16px', fontWeight: '800', color: '#c44569'}}>{getNprPrice(product.price)}</span>
                  </div>
                  {product.colorName && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <span style={{fontSize: '12px', fontWeight: '600', color: '#b8956e'}}>Color:</span>
                      <span style={{display: 'inline-block', width: '18px', height: '18px', borderRadius: '4px', backgroundColor: product.colorName, border: '1px solid #e8ddd0'}} />
                      <span style={{fontSize: '13px', color: '#8b6b4d'}}>{product.colorName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {order.products?.length > 2 && (
            <button onClick={() => setExpandedProducts(!expandedProducts)} style={{
              marginTop: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', border: 'none',
              background: '#f0e4d5', borderRadius: '20px', cursor: 'pointer', color: '#c44569', width: '100%'
            }}>
              {expandedProducts ? 'Show Less' : `Show ${order.products.length - 2} More Products`}
            </button>
          )}
        </div>

        {/* Shipping Info */}
        <div style={{padding: '16px', backgroundColor: '#fefcf9', borderRadius: '14px', border: '1px solid #f0e4d5'}}>
          <div style={{fontSize: '13px', color: '#b8956e', textTransform: 'uppercase', fontWeight: '800', marginBottom: '12px', letterSpacing: '0.5px'}}>
            Shipping Information
          </div>
          <div style={{fontSize: '15px', fontWeight: '600', color: '#5a3d2b', marginBottom: '10px', lineHeight: '1.5'}}>
            📍 {truncateText(order.shippingLocation || order.locationAddress, 60)}
          </div>
          {order.latitude && order.longitude && (
            <button onClick={() => openGoogleMaps(order.latitude, order.longitude)} style={{
              marginTop: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: '700', border: '1px solid #e8ddd0',
              borderRadius: '8px', background: '#ffffff', color: '#c44569', cursor: 'pointer'
            }}>
              View on Map
            </button>
          )}
          <div style={{marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            <span style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800',
              backgroundColor: order.isInsideValley ? '#e8f5e9' : '#fff3e0',
              color: order.isInsideValley ? '#2e7d32' : '#f57c00',
              border: order.isInsideValley ? '1px solid #c8e6c9' : '1px solid #ffe0b2'
            }}>
              {order.isInsideValley ? 'Inside Valley' : 'Outside Valley'}
            </span>
            <span style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800',
              backgroundColor: '#fce4ec', color: '#c44569', border: '1px solid #f8bbd0'
            }}>
              {order.paymentMethod === 'phonePay' ? 'Phone Pay' : 'Cash on Delivery'}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery & Status */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px',
        padding: '16px', backgroundColor: '#fefcf9', borderRadius: '14px', border: '1px solid #f0e4d5'
      }}>
        <div>
          <div style={{fontSize: '12px', color: '#b8956e', textTransform: 'uppercase', fontWeight: '800', marginBottom: '12px'}}>
            Delivery Partner
          </div>
          {editingOrderId === order._id ? (
            <div style={{display: 'flex', gap: '8px', flexDirection: 'column'}}>
              <select value={deliveryPartner} onChange={(e) => setDeliveryPartner(e.target.value)} style={{padding: '10px 12px', borderRadius: '10px', border: '2px solid #c44569', fontSize: '14px', fontWeight: '500', backgroundColor: '#ffffff'}}>
                <option value="">Select Partner</option>
                                <option value="NCM">NCM</option>
                <option value="NOT NCM">NOT NCM</option>
              </select>
              <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => handleDeliveryPartnerUpdate(order._id)} disabled={isUpdating} style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#c44569',
                  color: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: '700'
                }}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button onClick={cancelEditing} style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8ddd0', background: '#ffffff',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#8b6b4d'
                }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{
                padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '800',
                backgroundColor: order.deliveryPartner ? '#fce4ec' : '#f0e4d5',
                color: order.deliveryPartner ? '#c44569' : '#b8956e'
              }}>
                {order.deliveryPartner || 'Not Set'}
              </span>
              <button onClick={() => startEditingDeliveryPartner(order)} style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid #e8ddd0', background: '#ffffff',
                color: '#c44569', cursor: 'pointer', fontSize: '13px', fontWeight: '700'
              }}>
                Edit
              </button>
            </div>
          )}
        </div>

        <div>
          <div style={{fontSize: '12px', color: '#b8956e', textTransform: 'uppercase', fontWeight: '800', marginBottom: '12px'}}>
            NCM Branch
          </div>
          {editingNcmOrderId === order._id ? (
            <div style={{display: 'flex', gap: '8px', flexDirection: 'column'}}>
              <select value={ncmDestinationBranch} onChange={(e) => setNcmDestinationBranch(e.target.value)} style={{padding: '10px 12px', borderRadius: '10px', border: '2px solid #c44569', fontSize: '14px', fontWeight: '500', backgroundColor: '#ffffff'}} disabled={isLoadingNcmBranches}>
                <option value="">Global Default</option>
                {ncmBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
              </select>
              <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => handleNcmBranchUpdate(order._id)} disabled={updatingNcmBranchOrderId === order._id} style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#c44569',
                  color: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: '700'
                }}>
                  {updatingNcmBranchOrderId === order._id ? 'Saving...' : 'Save'}
                </button>
                <button onClick={cancelEditingNcmBranch} style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8ddd0', background: '#ffffff',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#8b6b4d'
                }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <span style={{
                padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '800',
                backgroundColor: order.ncmDestinationBranch ? '#e8f5e9' : '#f0e4d5',
                color: order.ncmDestinationBranch ? '#2e7d32' : '#b8956e'
              }}>
                {order.ncmDestinationBranch || 'Global Default'}
              </span>
              <button onClick={() => startEditingNcmBranch(order)} style={{
                padding: '6px 14px', borderRadius: '8px', border: '1px solid #e8ddd0', background: '#ffffff',
                color: '#c44569', cursor: 'pointer', fontSize: '13px', fontWeight: '700'
              }}>
                Edit
              </button>
            </div>
          )}
        </div>

        <div>
          <div style={{fontSize: '12px', color: '#b8956e', textTransform: 'uppercase', fontWeight: '800', marginBottom: '12px'}}>
            Order Status
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
            <span style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '800',
              backgroundColor: order.isConfirmed ? '#e8f5e9' : '#fff3e0',
              color: order.isConfirmed ? '#2e7d32' : '#f57c00'
            }}>
              {order.isConfirmed ? '✓ Confirmed' : '⏳ Pending'}
            </span>
            {!order.isConfirmed && (
              <button onClick={() => sendWhatsAppMessage(order)} disabled={confirmingOrderId === order._id} style={{
                padding: '8px 20px', borderRadius: '20px', border: 'none', background: '#c44569',
                color: '#ffffff', cursor: confirmingOrderId === order._id ? 'not-allowed' : 'pointer',
                fontSize: '13px', fontWeight: '800'
              }}>
                {confirmingOrderId === order._id ? 'Confirming...' : 'Confirm Order'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Financial Summary - Larger Fonts */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px',
        borderTop: '2px solid #f0e4d5', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <div style={{fontSize: '13px', color: '#b8956e', marginBottom: '6px', fontWeight: '700'}}>Subtotal</div>
          <div style={{fontSize: '18px', fontWeight: '800', color: '#2d1b4e'}}>{getNprPrice(getTotalPrice(order.products || []))}</div>
        </div>
        <div>
          <div style={{fontSize: '13px', color: '#b8956e', marginBottom: '6px', fontWeight: '700'}}>Shipping</div>
          <div style={{fontSize: '16px', fontWeight: '700', color: '#5a3d2b'}}>{getNprPrice(order.shippingPrice || 0)}</div>
        </div>
        <div>
          <div style={{fontSize: '13px', color: '#b8956e', marginBottom: '6px', fontWeight: '700'}}>Total Amount</div>
          <div style={{fontSize: '28px', fontWeight: '800', color: '#c44569'}}>{getNprPrice(order.totalAmount || 0)}</div>
        </div>
      </div>

      {/* Delivery Status */}
      {order.ncmLastStatus && (
        <div style={{
          marginTop: '16px', padding: '12px 16px', backgroundColor: '#fce4ec', borderRadius: '10px',
          fontSize: '14px', fontWeight: '800', color: '#c44569', border: '1px solid #f8bbd0'
        }}>
          📦 Delivery Status: {order.ncmLastStatus}
        </div>
      )}

      {fullscreenImage && (
        <ImageViewer src={fullscreenImage} onClose={() => setFullscreenImage(null)} />
      )}
    </div>
  )
}

// OrderPDF Component (keep as is)
const OrderPDF = ({data}) => {
  const currentDate = new Date()

  const truncateOrderNote = (note: string, limit = 50) => {
    if (!note) return 'No note provided'
    const trimmed = String(note).trim()
    if (trimmed.length <= limit) return trimmed
    return `${trimmed.slice(0, limit)}...`
  }

  const generateQrCodeUrl = async (text: string) => {
    try {
      const image = await QRCode.toDataURL(text, {
        width: 280,
        errorCorrectionLevel: 'M'
      })
      return image
    } catch (err) {
      console.error(err)
      return ''
    }
  }

  const generateBarcodeUrl = (text: string) => {
    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, text, {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: false,
        margin: 0
      })
      return canvas.toDataURL('image/png')
    } catch (err) {
      console.error('Barcode generation error:', err)
      return ''
    }
  }

  const calculateOrderTotals = (products) => {
    if (!products || products.length === 0) return {totalQuantity: 0, totalPrice: 0}
    const totalQuantity = products?.reduce((sum, product) => sum + (product.quantity || 0), 0)
    const totalPrice = products?.reduce((sum, product) => sum + (product.price || 0), 0)
    return {totalQuantity, totalPrice}
  }

  const generateLocationQrUrl = (latitude: number, longitude: number) => {
    if (latitude && longitude) {
      return `https://www.google.com/maps?q=${latitude},${longitude}`
    }
    return 'No location available'
  }

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size))
    return result
  }

  const filteredOrders = data?.filter((item) => Object.keys(item).length !== 0) || []
  const pageGroups = chunkArray(filteredOrders, 4)

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        {pageGroups.map((group, pageIndex) => (
          <Page size="A4" style={styles.page} key={pageIndex}>
            <View style={styles.grid}>
              {group.map((item:any, index) => {
                const {totalQuantity, totalPrice} = calculateOrderTotals(item?.products || [])
                const locationQrData = generateLocationQrUrl(item.latitude, item.longitude)
                const orderId = item.productOrderId || item._id

                return (
                  <View style={styles.item} key={index}>
                    <View style={styles.itemContent}>
                      <View style={styles.header}>
                        <View style={styles.brandSection}>
                          <PDFImage style={styles.logo} src="/assets/images/logosss.png" />
                        </View>
                        <View style={styles.orderSection}>
                          <Text style={styles.orderNumber}>{orderId}</Text>
                          <View style={styles.barcodeContainer}>
                            <PDFImage style={styles.barcode} src={generateBarcodeUrl(orderId)} />
                          </View>
                        </View>
                      </View>

                      <View style={styles.shippingGrid}>
                        <View style={styles.addressCard}>
                          <Text style={styles.addressTitle}>ORIGIN</Text>
                          <View style={styles.divider} />
                          <Text style={styles.name}>Aabhushan Gallery</Text>
                          <Text style={styles.address}>Kathmandu</Text>
                          <Text style={styles.address}>Nepal 44600</Text>
                          <Text style={styles.contact}>T: 9861698400</Text>
                        </View>

                        <View style={[styles.addressCard, styles.destinationCard]}>
                          <View style={styles.destinationHeader}>
                            <Text style={styles.deliveryType}>{item?.isHomeDelivery ? 'HOME DELIVERY' : 'OFFICE DELIVERY'}</Text>
                            <Text style={styles.deliveryType}>{item?.paymentMethod === 'phonePay' ? 'Phone Pay' : 'Cash on Delivery'}</Text>
                          </View>
                          {item.deliveryPartner && (
                            <View style={styles.deliveryPartnerBadge}>
                              <Text style={styles.deliveryPartnerText}>Partner: {item.deliveryPartner}</Text>
                            </View>
                          )}
                          <View style={styles.divider} />
                          <Text style={styles.name}>{item.customerName || 'Customer'}</Text>
                          <Text style={styles.address}>Address by user: {item.shippingLocation}</Text>
                          {item.locationAddress && <Text style={styles.address}>Address From Map: {item.locationAddress}</Text>}
                          <Text style={styles.contact}>T: {item.phoneNumber}</Text>
                        </View>
                      </View>

                      <View style={styles.noteSection}>
                        <Text style={styles.noteTitle}>ORDER NOTE</Text>
                        <View style={styles.divider} />
                        <Text style={styles.noteText}>{truncateOrderNote(item?.orderNote)}</Text>
                      </View>

                      <View style={styles.financialSection}>
                        <View style={styles.summaryGrid}>
                          <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>ITEMS</Text>
                            <Text style={styles.summaryValue}>{item?.products?.length || 0}</Text>
                          </View>
                          <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>QTY</Text>
                            <Text style={styles.summaryValue}>{totalQuantity}</Text>
                          </View>
                          <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>SUBTOTAL</Text>
                            <Text style={styles.summaryValue}>Rs. {totalPrice.toFixed(2)}</Text>
                          </View>
                          {!!item.includeGiftBox && (
                            <View style={styles.summaryItem}>
                              <Text style={styles.summaryLabel}>GiftBox Charge</Text>
                              <Text style={styles.summaryValue}>Rs.400</Text>
                            </View>
                          )}
                          <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>SHIPPING</Text>
                            <Text style={styles.summaryValue}>Rs. {item?.shippingPrice || 0}</Text>
                          </View>
                        </View>

                        {item.isInsideValley === false ? (
                          <View style={styles.paymentHighlight}>
                            <View style={styles.paymentRow}>
                              <Text style={styles.paymentLabel}>ADVANCE PAID</Text>
                              <Text style={styles.paymentValue}>Rs. {item?.shippingPrice}</Text>
                            </View>
                            <View style={[styles.paymentRow, styles.balanceRow]}>
                              <Text style={styles.balanceLabel}>BALANCE DUE</Text>
                              <Text style={styles.balanceAmount}>Rs. {(item?.totalAmount - item?.shippingPrice).toFixed(2)}</Text>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.totalSection}>
                            <View style={styles.totalRow}>
                              <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                              <Text style={styles.totalAmount}>Rs. {item?.totalAmount?.toFixed(2) || 0}</Text>
                            </View>
                          </View>
                        )}
                      </View>

                      <View style={styles.footer}>
                        {item.latitude && item.longitude && (
                          <View style={styles.qrSection}>
                            <PDFImage style={styles.qrCode} src={generateQrCodeUrl(locationQrData)} />
                            <Text style={styles.qrLabel}>DELIVERY LOCATION</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          </Page>
        ))}
      </Document>
    </PDFViewer>
  )
}

const styles = StyleSheet.create({
  viewer: { height: '100vh', width: '75vw', position: 'absolute', top: 0, left: 0 },
  page: { padding: 28, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', height: '100%' },
  item: { width: '50%', height: '50%', padding: 7 },
  itemContent: { flex: 1, border: '0.5px solid #000000', padding: 10, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 6, marginBottom: 6, borderBottom: '1px solid #000000' },
  brandSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 22, height: 30 },
  orderSection: { alignItems: 'flex-end', flex: 1, marginLeft: 12 },
  orderNumber: { fontSize: 9, fontWeight: 'bold', color: '#000000', letterSpacing: 0.3, marginBottom: 4 },
  barcodeContainer: { width: '100%', alignItems: 'center', marginTop: 4, backgroundColor: '#ffffff', paddingVertical: 4, border: '0.5px solid #e0e0e0' },
  barcode: { width: '100%', height: 24 },
  shippingGrid: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  addressCard: { flex: 1, padding: 8, backgroundColor: '#fafafa', borderLeft: '3px solid #cccccc' },
  destinationCard: { backgroundColor: '#ffffff', borderLeft: '3px solid #000000', border: '0.5px solid #000000' },
  destinationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  deliveryPartnerBadge: { backgroundColor: '#e3f2fd', padding: '2px 6px', borderRadius: '3px', marginBottom: 4, alignSelf: 'flex-start' },
  deliveryPartnerText: { fontSize: 6, color: '#1976d2', fontWeight: 'bold' },
  addressTitle: { fontSize: 7, fontWeight: 'bold', color: '#000000', letterSpacing: 1 },
  deliveryType: { fontSize: 6, fontWeight: 'bold', color: '#666666', letterSpacing: 0.8, paddingHorizontal: 4, paddingVertical: 2, backgroundColor: '#f0f0f0' },
  divider: { height: 0.5, backgroundColor: '#e0e0e0', marginVertical: 4 },
  noteSection: { padding: 8, border: '0.5px solid #e0e0e0', backgroundColor: '#ffffff', marginBottom: 8 },
  noteTitle: { fontSize: 7, fontWeight: 'bold', color: '#000000', letterSpacing: 1, marginBottom: 4 },
  noteText: { fontSize: 7, color: '#333333' },
  name: { fontSize: 7, fontWeight: 'bold', color: '#000000', marginBottom: 2 },
  address: { fontSize: 7, color: '#666666', marginBottom: 1 },
  contact: { fontSize: 7, fontWeight: 'bold', color: '#000000', marginTop: 4 },
  financialSection: { marginBottom: 6, border: '1px solid #000000', backgroundColor: '#fafafa' },
  summaryGrid: { flexDirection: 'row', borderBottom: '0.5px solid #e0e0e0' },
  summaryItem: { flex: 1, padding: 6, borderRight: '0.5px solid #e0e0e0', alignItems: 'center' },
  summaryLabel: { fontSize: 6, color: '#666666', letterSpacing: 0.8, marginBottom: 2 },
  summaryValue: { fontSize: 7, fontWeight: 'bold', color: '#000000' },
  totalSection: { backgroundColor: '#ffffff', padding: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 8, fontWeight: 'bold', color: '#000000', letterSpacing: 1.2 },
  totalAmount: { fontSize: 13, fontWeight: 'bold', color: '#000000', letterSpacing: 0.3 },
  paymentHighlight: { backgroundColor: '#ffffff', padding: 8, borderTop: '1px solid #000000' },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  paymentLabel: { fontSize: 7, color: '#666666', letterSpacing: 0.8 },
  paymentValue: { fontSize: 7, fontWeight: 'bold', color: '#000000' },
  balanceRow: { borderTop: '0.5px solid #e0e0e0', paddingTop: 4, marginTop: 2 },
  balanceLabel: { fontSize: 8, fontWeight: 'bold', color: '#000000', letterSpacing: 0.8 },
  balanceAmount: { fontSize: 10, fontWeight: 'bold', color: '#000000' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: 6, borderTop: '0.5px solid #e0e0e0', marginTop: 'auto' },
  qrSection: { alignItems: 'center' },
  qrCode: { width: 28, height: 28, marginBottom: 2 },
  qrLabel: { fontSize: 5, color: '#666666', letterSpacing: 0.8 }
})