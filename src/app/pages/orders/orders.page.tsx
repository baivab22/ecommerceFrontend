// import React, {useEffect, useState, useCallback, useMemo} from 'react'
// import {useDispatch} from 'src/store'
// import ReactDOM from 'react-dom/client'
// import {useSelector} from 'react-redux'
// import {
//   Box,
//   Button,
//   CheckBox,
//   HStack,
//   Modal,
//   SelectField,
//   Table
// } from 'src/app/common'
// import {useNavigate} from 'react-router-dom'

// import {getOrderListAction} from '../web/cart/cart.slice'
// import {getNprPrice} from 'src/helpers/nprPrice.helper'
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
// import {AiOutlineClose} from 'react-icons/ai'
// import {MdCheckBoxOutlineBlank} from 'react-icons/md'
// import {IoCheckboxOutline} from 'react-icons/io5'
// import toast from 'react-hot-toast'

// export const OrderListPage = () => {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const [orderList, setOrderLists] = useState<any>()
//   const [selectedCategory, setSelectedCategory] = useState<any>()
//   const orderData = useSelector((state: any) => state.cart)

//   // Date filter states
//   const [startDate, setStartDate] = useState<string>('')
//   const [endDate, setEndDate] = useState<string>('')
//   const [dateFilterType, setDateFilterType] = useState<string>('all')
//   const [showCustomDateInputs, setShowCustomDateInputs] = useState<boolean>(false)
  
//   // Search state
//   const [searchQuery, setSearchQuery] = useState<string>('')

//   useEffect(() => {
//     dispatch(
//       getOrderListAction({
//         onSuccess: () => console.log('Order list fetched Successfully')
//       })
//     )
//   }, [])

//   const [showDetails, setShowDetails] = useState<boolean>(false)
//   const [activeOrderDetails, setActiveOrderDetails] = useState<any>(undefined)
//   const [activeData, setActiveData] = useState<any>([{}])

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
//         {data: ordersData, isPrinting: value}
//       ])
//     }
//   }

//   // Helper function to parse date from OrderedAt string
//   const parseOrderDate = (dateString: string) => {
//     if (!dateString) return null
//     try {
//       const cleanDate = dateString.replace(/,/g, '')
//       const date = new Date(cleanDate)
//       // Ensure valid date
//       if (isNaN(date.getTime())) return null
//       return date
//     } catch {
//       return null
//     }
//   }

//   // Helper function to get date range based on filter type
//   const parseDate = (dateStr: string): Date | null => {
//     if (!dateStr) return null;

//     // Try native parser first (works for MM/DD/YYYY)
//     let date = new Date(dateStr);
//     if (!isNaN(date.getTime())) return date;

//     // Handle DD/MM/YYYY or DD/MM/YYYY, HH:mm:ss formats
//     const [datePart, timePart] = dateStr.split(',');
//     const [day, month, year] = datePart.trim().split(/[\/\-]/).map(Number);

//     if (!day || !month || !year) return null;

//     let [hours, minutes, seconds] = [0, 0, 0];
//     if (timePart) {
//       [hours, minutes, seconds] = timePart.trim().split(':').map(Number);
//       seconds = seconds || 0;
//     }

//     return new Date(year, month - 1, day, hours, minutes, seconds);
//   };

//   const getDateRange = (
//     filterType: string,
//     startDate?: string,
//     endDate?: string
//   ) => {
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     switch (filterType) {
//       case 'today':
//         return {
//           start: today,
//           end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
//         };

//       case 'week':
//         const weekStart = new Date(today);
//         weekStart.setDate(today.getDate() - today.getDay());
//         return {
//           start: weekStart,
//           end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
//         };

//       case 'month':
//         const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//         return {
//           start: monthStart,
//           end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
//         };

//       case 'custom':
//         const parsedStart = parseDate(startDate || '');
//         const parsedEnd = parseDate(endDate || '');
//         return {
//           start: parsedStart,
//           end: parsedEnd
//             ? new Date(parsedEnd.getTime() + 24 * 60 * 60 * 1000)
//             : null,
//         };

//       default:
//         return { start: null, end: null };
//     }
//   };

//   const filteredOrders = useMemo(() => {
//     if (!orderData?.orderData) return []
    
//     let filtered = orderData.orderData

//     // Apply date filter
//     if (dateFilterType !== 'all') {
//       const { start, end } = getDateRange(dateFilterType)

//       if (start !== null || end !== null) {
//         filtered = filtered.filter((order: any) => {
//           const orderDate = parseOrderDate(order.OrderedAt)
//           if (!orderDate) return false

//           // Use >= for start and < for end (exclusive upper bound)
//           if (start !== null && orderDate < start) return false
//           if (end !== null && orderDate >= end) return false
          
//           return true
//         })
//       }
//     }

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim()
//       filtered = filtered.filter((order: any) => {
//         if (order.productOrderId?.toLowerCase().includes(query)) return true
//         if (order.userId?.email?.toLowerCase().includes(query)) return true
//         if (order.userId?.name?.toLowerCase().includes(query)) return true
//         if (order.userId?.phone?.toLowerCase().includes(query)) return true
//         if (order.shippingLocation?.toLowerCase().includes(query)) return true
//         if (order.locationAddress?.toLowerCase().includes(query)) return true
//         if (order.products?.some((product: any) => 
//           product.productId?.name?.toLowerCase().includes(query)
//         )) return true
//         if (order.paymentMethod?.toLowerCase().includes(query)) return true
        
//         return false
//       })
//     }

//     return filtered
//   }, [orderData, dateFilterType, startDate, endDate, searchQuery])

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

//   // Function to send invoice via email
//   const sendInvoiceEmail = async (order: any) => {
//     try {
      
//       const response = await fetch('http://localhost:8000/api/send-invoice', {

//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           orderId: order._id,
//           customerEmail: order.userId?.email,
//           customerName: order.userId?.name || 'Customer'
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast.success('Invoice sent successfully to customer email!');
//       } else {
//         toast.error('Failed to send invoice: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error sending invoice email:', error);
//       toast.error('Error sending invoice email. Please try again.');
//     }
//   };

//   // WhatsApp message sender with email invoice
//   const sendWhatsAppMessage = async (order: any) => {
//     console.log(order,"order finally")
    
//     // First send the invoice email
//     await sendInvoiceEmail(order);
    
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
// Estimated Delivery: order.isInsideValley
//   ? "1 day"
//   : "2–5 working days";

// 📧 *Invoice Sent:*
// We've sent a detailed invoice to your email address.

// Thank you for shopping with us! 
// We'll keep you updated on your order status.

// Best regards,
// Aabhushan Gallery Team`

//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
//     window.open(whatsappUrl, '_blank')
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
//               <span>Qty: ${product.quantity}</span>
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
//     if (!dateString) return '-';
    
//     try {
//       let date: Date;

//       // Normalize commas and trim spaces
//       const cleanDate = dateString.replace(',', '').trim();

//       // Case 1: "10/29/2025, 10:58:40 AM" (MM/DD/YYYY)
//       if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(cleanDate)) {
//         date = new Date(cleanDate);
//       } 
//       // Case 2: "29/10/2025 12:29:09" (DD/MM/YYYY)
//       else if (/^\d{2}\/\d{2}\/\d{4}/.test(cleanDate)) {
//         const [day, month, yearAndTime] = cleanDate.split('/');
//         const [year, time] = yearAndTime.split(' ');
//         const isoString = `${year}-${month}-${day}T${time || '00:00:00'}`;
//         date = new Date(isoString);
//       } 
//       else {
//         // fallback: try native parsing
//         date = new Date(cleanDate);
//       }

//       if (isNaN(date.getTime())) return dateString;

//       return (
//         date.toLocaleDateString('en-GB') +
//         ' ' +
//         date.toLocaleTimeString('en-US', {
//           hour12: false,
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//         })
//       );
//     } catch {
//       return dateString;
//     }
//   };

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

//   console.log(filteredOrders,"filteredOrders hai")

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
//                 placeholder="Search by Order ID, Customer, Product, Location, Phone..."
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
//                     setDateFilterType('all')
//                     setShowCustomDateInputs(false)
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
//                 Showing <strong>{filteredOrders.length}</strong> of <strong>{orderData?.orderData?.length || 0}</strong> orders
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
//             maxHeight: 'calc(100vh - 400px)',
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
//                   field: '_id',
//                   name: 'Actions',
//                   colStyle: { width: '140px', minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
//                   render: (_, item) => {
//                     return (
//                       <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
//                         <Button
//                           title="View Details"
//                           onClick={() => {
//                             setShowDetails(true)
//                             setActiveOrderDetails(item)
//                             setActiveData([item])
//                           }}
//                           style={{
//                             fontSize: '10px',
//                             padding: '2px 6px',
//                             minHeight: '24px'
//                           }}
//                         />
//                         <Button
//                           title="Confirm Order"
//                           onClick={() => sendWhatsAppMessage(item)}
//                           style={{
//                             fontSize: '10px',
//                             padding: '2px 6px',
//                             minHeight: '24px',
//                             backgroundColor: '#25D366',
//                             color: 'white'
//                           }}
//                         />
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
//                         {isScanned ?'scanned already':'not scanned' }
//                       </div>
//                     )
//                   }
//                 },
//               ]}
//               data={filteredOrders ?? []}
//               actions={{}}
//               pagination={{
//                 totalCount: Number(filteredOrders?.length ?? 0),
//                 perPage: 10
//               }}
//               pageFe={true}
//             />
//           </div>
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
    
//     const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0)
//     const totalPrice = products.reduce((sum, product) => sum + (product.price || 0), 0)
    
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
//                     <View>
//                       <Text style={styles.tagline}>AABHUSHAN GALLERY</Text>
//                     </View>
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
//                     <Text style={styles.address}>Kalimati, Kathmandu</Text>
//                     <Text style={styles.address}>Nepal 44600</Text>
//                     <Text style={styles.contact}>T: 9861698400</Text>
//                   </View>

//                   <View style={[styles.addressCard, styles.destinationCard]}>
//                     <View style={styles.destinationHeader}>
//                       <Text style={styles.deliveryType}>{item?.isHomeDelivery ? 'HOME DELIVERY' : 'OFFICE DELIVERY'}</Text>
//                       <Text style={styles.deliveryType}>{item?.paymentMethod==='phonePay' ? 'Phone Pay' : 'Cash on Delivery'}</Text>
//                     </View>
//                     <View style={styles.divider} />
//                     <Text style={styles.name}>{item.customerName || 'Customer'}</Text>
//                     <Text style={styles.address}>{item.shippingLocation}</Text>
//                     {item.locationAddress && <Text style={styles.address}>{item.locationAddress}</Text>}
//                     <Text style={styles.contact}>T: {item.phoneNumber}</Text>
//                   </View>
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
//                         <Text style={styles.paymentValue}>Rs. 300.00</Text>
//                       </View>
//                       <View style={[styles.paymentRow, styles.balanceRow]}>
//                         <Text style={styles.balanceLabel}>BALANCE DUE</Text>
//                         <Text style={styles.balanceAmount}>Rs. {(item?.totalAmount - 300).toFixed(2)}</Text>
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
//     alignItems: 'center'
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
//     backgroundColor: '#ffffff', // Changed from black to white
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
//     color: '#000000', // Changed from white to black
//     letterSpacing: 1.5
//   },
//   totalAmount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000000', // Changed from white to black
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

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch } from 'src/store'
import ReactDOM from 'react-dom/client'
import { useSelector } from 'react-redux'
import {
  Box,
  Button,
  CheckBox,
  HStack,
  Modal,
  SelectField,
  Table
} from 'src/app/common'
import { useNavigate } from 'react-router-dom'

import { getOrderListAction, updateOrderByIdAction } from '../web/cart/cart.slice'
import { getNprPrice } from 'src/helpers/nprPrice.helper'
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
  Image,
  Canvas
} from '@react-pdf/renderer'
import { AiOutlineClose } from 'react-icons/ai'
import { MdCheckBoxOutlineBlank } from 'react-icons/md'
import { IoCheckboxOutline } from 'react-icons/io5'
import toast from 'react-hot-toast'
import { AxiosResponse } from 'axios'
import { EditIcon } from 'lucide-react'
import { BASE_URL } from 'src/config'

export const OrderListPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [orderList, setOrderLists] = useState<any>()
  const [selectedCategory, setSelectedCategory] = useState<any>()
  const orderData = useSelector((state: any) => state.cart)

  // Date filter states
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [dateFilterType, setDateFilterType] = useState<string>('all')
  const [showCustomDateInputs, setShowCustomDateInputs] = useState<boolean>(false)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Delivery partner states
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [deliveryPartner, setDeliveryPartner] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  useEffect(() => {
    dispatch(
      getOrderListAction({
        onSuccess: () => console.log('Order list fetched Successfully')
      })
    )
  }, [])

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
        { data: ordersData, isPrinting: value }
      ])
    }
  }

  // Helper function to parse date from OrderedAt string
  const parseOrderDate = (dateString: string) => {
    if (!dateString) return null
    try {
      const cleanDate = dateString.replace(/,/g, '')
      const date = new Date(cleanDate)
      // Ensure valid date
      if (isNaN(date.getTime())) return null
      return date
    } catch {
      return null
    }
  }

  // Helper function to get date range based on filter type
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null

    // Try native parser first (works for MM/DD/YYYY)
    let date = new Date(dateStr)
    if (!isNaN(date.getTime())) return date

    // Handle DD/MM/YYYY or DD/MM/YYYY, HH:mm:ss formats
    const [datePart, timePart] = dateStr.split(',')
    const [day, month, year] = datePart.trim().split(/[\/\-]/).map(Number)

    if (!day || !month || !year) return null

    let [hours, minutes, seconds] = [0, 0, 0]
    if (timePart) {
      [hours, minutes, seconds] = timePart.trim().split(':').map(Number)
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
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        }

      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return {
          start: weekStart,
          end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        }

      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
          start: monthStart,
          end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        }

      case 'custom':
        const parsedStart = parseDate(startDate || '')
        const parsedEnd = parseDate(endDate || '')
        return {
          start: parsedStart,
          end: parsedEnd
            ? new Date(parsedEnd.getTime() + 24 * 60 * 60 * 1000)
            : null,
        }

      default:
        return { start: null, end: null }
    }
  }

  const filteredOrders = useMemo(() => {
    if (!orderData?.orderData) return []
    
    let filtered = orderData.orderData

    // Apply date filter
    if (dateFilterType !== 'all') {
      const { start, end } = getDateRange(dateFilterType)

      if (start !== null || end !== null) {
        filtered = filtered.filter((order: any) => {
          const orderDate = parseOrderDate(order.OrderedAt)
          if (!orderDate) return false

          // Use >= for start and < for end (exclusive upper bound)
          if (start !== null && orderDate < start) return false
          if (end !== null && orderDate >= end) return false
          
          return true
        })
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((order: any) => {
        if (order.productOrderId?.toLowerCase().includes(query)) return true
        if (order.userId?.email?.toLowerCase().includes(query)) return true
        if (order.userId?.name?.toLowerCase().includes(query)) return true
        if (order.userId?.phone?.toLowerCase().includes(query)) return true
        if (order.shippingLocation?.toLowerCase().includes(query)) return true
        if (order.locationAddress?.toLowerCase().includes(query)) return true
        if (order.products?.some((product: any) => 
          product.productId?.name?.toLowerCase().includes(query)
        )) return true
        if (order.paymentMethod?.toLowerCase().includes(query)) return true
        if (order.deliveryPartner?.toLowerCase().includes(query)) return true
        
        return false
      })
    }

    return filtered
  }, [orderData, dateFilterType, startDate, endDate, searchQuery])

  // Helper function to get total quantity for an order
  const getTotalQuantity = (products: any[]) => {
    return products?.reduce((total, product) => total + product.quantity, 0) || 0
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

  // Function to send invoice via email
  const sendInvoiceEmail = async (order: any) => {
    try {
      
      const response = await fetch(`${BASE_URL}/send-invoice`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order._id,
          customerEmail: order.userId?.email,
          customerName: order.userId?.name || 'Customer'
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Invoice sent successfully to customer email!')
      } else {
        toast.error('Failed to send invoice: ' + result.message)
      }
    } catch (error) {
      console.error('Error sending invoice email:', error)
      toast.error('Error sending invoice email. Please try again.')
    }
  }

  // WhatsApp message sender with email invoice
  const sendWhatsAppMessage = async (order: any) => {
    console.log(order,"order finally")
    
    // First send the invoice email
    await sendInvoiceEmail(order)
    
    const phoneNumber = order.phoneNumber || '9841934343'
    const customerName = order.userId?.name || order.userId?.email || 'Customer'
    const orderId = order.productOrderId || order._id
    
    const productsList = order.products?.map((product, index) => 
      `${index + 1}. ${product.productId?.name} (Qty: ${product.quantity}, Price: ${getNprPrice(product.price)})`
    ).join('\n') || 'No products listed'
    
    const totalAmount = getNprPrice(order.totalAmount)
    const shippingLocation = order.shippingLocation || order.locationAddress
    const deliveryType = order.isInsideValley ? 'Home Delivery (Inside Valley)' : 'Office Delivery (Outside Valley)'
    const paymentType = order.paymentMethod === 'phonepay' ? 'PhonePay' : 'Cash on Delivery (COD)'
    
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
Estimated Delivery: ${order.isInsideValley ? "1 day" : "2–5 working days"}

📧 *Invoice Sent:*
We've sent a detailed invoice to your email address.

Thank you for shopping with us! 
We'll keep you updated on your order status.

Best regards,
Aabhushan Gallery Team`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
          data: { deliveryPartner },
          onSuccess: (response: AxiosResponse) => {
            toast.success('Delivery partner updated successfully')
            setEditingOrderId(null)
            setDeliveryPartner('')
            
            // Refresh order list
            dispatch(
              getOrderListAction({
                onSuccess: () => console.log('Order list refreshed')
              })
            )
          },
          // onError: (error: any) => {
          //   toast.error('Failed to update delivery partner: ' + error.message)
          // }
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

  // Helper function to render products list in a compact way
  const renderProductsList = (products: any[]) => {
    if (!products || products.length === 0) return <div>No products</div>
    
    return (
      <div style={{minWidth: '200px', maxWidth: '300px'}}>
        {products.map((product, index) => (
          <div key={index} style={{
            marginBottom: '6px', 
            fontSize: '12px',
            lineHeight: '1.3'
          }}>
            <div style={{
              fontWeight: 'bold',
              marginBottom: '2px',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {product.productId?.name || 'Unknown Product'}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#666',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Qty: {product.quantity}</span>
              <div>
                Variant:
                <span
                  style={{
                    display: 'inline-block',
                    height: '20px',
                    width: '20px',
                    backgroundColor: product.colorName,
                    marginLeft: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                ></span>
              </div>
              <span>{getNprPrice(product.price)}</span>
            </div>
            {index < products.length - 1 && (
              <hr style={{margin: '4px 0', opacity: 0.3, border: 'none', borderTop: '1px solid #eee'}} />
            )}
          </div>
        ))}
      </div>
    )
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    
    try {
      let date: Date

      // Normalize commas and trim spaces
      const cleanDate = dateString.replace(',', '').trim()

      // Case 1: "10/29/2025, 10:58:40 AM" (MM/DD/YYYY)
      if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(cleanDate)) {
        date = new Date(cleanDate)
      } 
      // Case 2: "29/10/2025 12:29:09" (DD/MM/YYYY)
      else if (/^\d{2}\/\d{2}\/\d{4}/.test(cleanDate)) {
        const [day, month, yearAndTime] = cleanDate.split('/')
        const [year, time] = yearAndTime.split(' ')
        const isoString = `${year}-${month}-${day}T${time || '00:00:00'}`
        date = new Date(isoString)
      } 
      else {
        // fallback: try native parsing
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
          second: '2-digit',
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
  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setStartDate(newValue)
  }, [])

  // Handle end date change
  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setEndDate(newValue)
  }, [])

  console.log(filteredOrders,"filteredOrders hai")

  return (
    <div>
      <Box>
        <HStack justify="space-between" style={{margin: '20px 0'}}>
          <Button
            title="Add Order list"
            onClick={() => console.log('add order list')}
          />

          <Button
            title="Print Selected Orders"
            onClick={() => {
              const filteredData = activeData.filter(item => Object.keys(item).length !== 0)
              if (filteredData.length > 0) {
                setShowDetails(true)
                setActiveOrderDetails(filteredData)
              }
            }}
            disabled={activeData.filter(item => Object.keys(item).length !== 0).length === 0}
          />
        </HStack>

        {/* Date Filter Section */}
        {!showDetails && (
          <div style={{
            margin: '20px 0',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            {/* Search Bar */}
            <div style={{
              marginBottom: '16px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search by Order ID, Customer, Product, Location, Phone, Delivery Partner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#666'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', paddingTop: '6px' }}>
                Filter by Date:
              </div>
              
              {/* Quick Filter Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                <button
                  onClick={() => {
                    setDateFilterType('all')
                    setShowCustomDateInputs(false)
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: dateFilterType === 'all' ? '2px solid #1976d2' : '1px solid #ccc',
                    backgroundColor: dateFilterType === 'all' ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: dateFilterType === 'all' ? 'bold' : 'normal'
                  }}
                >
                  All Orders
                </button>
              </div>

              {/* Clear All Filters Button */}
              {(dateFilterType !== 'all' || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #d32f2f',
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Custom Date Range Inputs */}
            {dateFilterType === 'custom' && showCustomDateInputs && (
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'center', 
                marginTop: '12px',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="start-date-filter" style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', minWidth: '40px' }}>
                    From:
                  </label>
                  <input
                    id="start-date-filter"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={startDate}
                    onChange={handleStartDateChange}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '13px',
                      minWidth: '140px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="end-date-filter" style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', minWidth: '25px' }}>
                    To:
                  </label>
                  <input
                    id="end-date-filter"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={endDate}
                    onChange={handleEndDateChange}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '13px',
                      minWidth: '140px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
                <button
                  onClick={() => setShowCustomDateInputs(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#666',
                    marginLeft: 'auto'
                  }}
                >
                  Hide
                </button>
              </div>
            )}

            {/* Filter Summary */}
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              color: '#666',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span>
                Showing <strong>{filteredOrders.length}</strong> of <strong>{orderData?.orderData?.length || 0}</strong> orders
              </span>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {searchQuery && (
                  <span style={{ 
                    fontStyle: 'italic',
                    backgroundColor: '#e3f2fd',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}>
                    🔍 Searching: "${searchQuery.substring(0, 30)}{searchQuery.length > 30 ? '...' : ''}"
                  </span>
                )}
                {dateFilterType !== 'all' && (
                  <span style={{ 
                    fontStyle: 'italic',
                    backgroundColor: '#fff3e0',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}>
                    📅 {dateFilterType === 'custom' && startDate && endDate
                      ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                      : dateFilterType.charAt(0).toUpperCase() + dateFilterType.slice(1)
                    }
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {!showDetails && (
          <div style={{
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            overflowX: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }}>
            <Table
              columns={[
                {
                  field: 'select',
                  name: 'Select',
                  colStyle: { width: '60px', minWidth: '60px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (_, itemvalue) => {
                    const isSelected = activeData?.find((item) => item._id === itemvalue._id) !== undefined
                    
                    return (
                      <div
                        onClick={() => {
                          if (isSelected) {
                            setActiveData(
                              activeData.filter((item) => item._id !== itemvalue._id)
                            )
                          } else {
                            setActiveData((prev) => [...prev, itemvalue])
                            BulkActionHandler(true, itemvalue)
                          }
                        }}
                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                      >
                        {isSelected ? (
                          <IoCheckboxOutline size={20} color="#1976d2" />
                        ) : (
                          <MdCheckBoxOutlineBlank size={20} color="#666" />
                        )}
                      </div>
                    )
                  }
                },
                {
                  field: 'productOrderId',
                  name: 'Order ID',
                  colStyle: { width: '140px', minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (orderId) => {
                    return (
                      <div style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        {orderId}
                      </div>
                    )
                  }
                },
                {
                  field: 'products',
                  name: 'Products',
                  colStyle: { width: '300px', minWidth: '250px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (products) => {
                    return renderProductsList(products)
                  }
                },
                {
                  field: 'userId',
                  name: 'Customer',
                  colStyle: { width: '180px', minWidth: '150px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (userData) => {
                    return (
                      <div style={{ fontSize: '12px' }}>
                        <div style={{ fontWeight: '500' }}>
                          {truncateText(userData?.email || 'N/A', 25)}
                        </div>
                      </div>
                    )
                  }
                },
                {
                  field: 'products',
                  name: 'Qty',
                  colStyle: { width: '60px', minWidth: '60px', textAlign: 'center', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (products) => {
                    return (
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '14px',
                        textAlign: 'center'
                      }}>
                        {getTotalQuantity(products)}
                      </div>
                    )
                  }
                },
                {
                  field: 'totalAmount',
                  name: 'Total Amount',
                  colStyle: { width: '120px', minWidth: '120px', textAlign: 'right', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (totalAmount) => {
                    return (
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '13px',
                        color: '#2e7d32',
                        textAlign: 'right'
                      }}>
                        {getNprPrice(totalAmount)}
                      </div>
                    )
                  }
                },
                {
                  field: 'shippingLocation',
                  name: 'Destination',
                  colStyle: { width: '160px', minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (location) => {
                    return (
                      <div style={{ 
                        fontSize: '12px',
                        lineHeight: '1.3'
                      }}>
                        {truncateText(location, 25)}
                      </div>
                    )
                  }
                },
                {
                  field: '_id',
                  name: 'Exact Location',
                  colStyle: { width: '160px', minWidth: '150px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (_, item) => {
                    const hasLocation = item.latitude && item.longitude
                    
                    if (!hasLocation) {
                      return (
                        <div style={{ 
                          fontSize: '11px',
                          color: '#999',
                          fontStyle: 'italic'
                        }}>
                          No GPS data
                        </div>
                      )
                    }
                    
                    const displayText = item.locationAddress 
                      ? truncateText(item.locationAddress, 20)
                      : `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                    
                    return (
                      <a
                        href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '11px',
                          color: '#1976d2',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        <span>📍</span>
                        <span>{displayText}</span>
                      </a>
                    )
                  }
                },
                {
                  field: 'isInsideValley',
                  name: 'Valley',
                  colStyle: { width: '80px', minWidth: '80px', textAlign: 'center', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (isInsideValley) => {
                    return (
                      <div style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        backgroundColor: isInsideValley ? '#e8f5e8' : '#fff3e0',
                        color: isInsideValley ? '#2e7d32' : '#f57c00'
                      }}>
                        {isInsideValley ? 'Yes' : 'No'}
                      </div>
                    )
                  }
                },
                {
                  field: 'OrderedAt',
                  name: 'Order Date',
                  colStyle: { width: '130px', minWidth: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (orderedAt) => {
                    return (
                      <div style={{ 
                        fontSize: '11px',
                        color: '#666'
                      }}>
                        {orderedAt}
                      </div>
                    )
                  }
                },
                {
                  field: 'phoneNumber',
                  name: 'Mobile Number',
                  colStyle: { width: '130px', minWidth: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (phoneNumber) => {
                    return (
                      <div style={{ 
                        fontSize: '11px',
                        color: '#666'
                      }}>
                        {phoneNumber ?? '-'}
                      </div>
                    )
                  }
                },
                {
                  field: 'shippingPrice',
                  name: 'Shipping',
                  colStyle: { width: '100px', minWidth: '100px', textAlign: 'right', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (shippingPrice) => {
                    return (
                      <div style={{ 
                        fontSize: '12px',
                        color: '#666',
                        textAlign: 'right'
                      }}>
                        {getNprPrice(shippingPrice)}
                      </div>
                    )
                  }
                },
                {
                  field: 'deliveryPartner',
                  name: 'Delivery Partner',
                  colStyle: { width: '160px', minWidth: '160px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (deliveryPartner, item) => {
                    const isEditing = editingOrderId === item._id
                    
                    if (isEditing) {
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <select
                            value={deliveryPartner}
                            onChange={(e) => setDeliveryPartner(e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid #1976d2',
                              fontSize: '12px',
                              outline: 'none',
                              width: '100%'
                            }}
                          >
                            <option value="">Select Partner</option>
                            <option value="NCM">NCM</option>
                            <option value="NOT NCM">NOT NCM</option>
                            {/* <option value="Self Pickup">Self Pickup</option>
                            <option value="Third Party">Third Party</option> */}
                          </select>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => handleDeliveryPartnerUpdate(item._id)}
                              disabled={isUpdating}
                              style={{
                                padding: '2px 8px',
                                borderRadius: '3px',
                                border: 'none',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                fontSize: '10px',
                                cursor: 'pointer',
                                flex: 1
                              }}
                            >
                              {isUpdating ? 'Updating...' : 'Update'}
                            </button>
                            <button
                              onClick={cancelEditing}
                              style={{
                                padding: '2px 8px',
                                borderRadius: '3px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )
                    }
                    
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          backgroundColor: deliveryPartner ? '#e3f2fd' : '#f5f5f5',
                          color: deliveryPartner ? '#1976d2' : '#666',
                          fontWeight: deliveryPartner ? 'bold' : 'normal',
                          border: `1px solid ${deliveryPartner ? '#1976d2' : '#ddd'}`,
                          minWidth: '80px',
                          textAlign: 'center'
                        }}>
                          {deliveryPartner || 'Not Set'}
                        </div>
                        <button
                          onClick={() => startEditingDeliveryPartner(item)}
                          style={{
                            padding: '2px 6px',
                            borderRadius: '3px',
                            border: '1px solid #1976d2',
                            backgroundColor: 'white',
                            color: '#1976d2',
                            fontSize: '10px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <EditIcon fontSize="10px" />
                        </button>
                      </div>
                    )
                  }
                },
                {
                  field: '_id',
                  name: 'Actions',
                  colStyle: { width: '140px', minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (_, item) => {
                    return (
                      <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
                        <Button
                          title="View Details"
                          onClick={() => {
                            setShowDetails(true)
                            setActiveOrderDetails(item)
                            setActiveData([item])
                          }}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            minHeight: '24px'
                          }}
                        />
                        <Button
                          title="Confirm Order"
                          onClick={() => sendWhatsAppMessage(item)}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            minHeight: '24px',
                            backgroundColor: '#25D366',
                            color: 'white'
                          }}
                        />
                      </div>
                    )
                  }
                },
                {
                  field: 'isScanned',
                  name: 'Is Scanned already?',
                  colStyle: { width: '130px', minWidth: '130px', position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 10 },
                  render: (isScanned) => {
                    return (
                      <div style={{ 
                        fontSize: '11px',
                        color: '#666'
                      }}>
                        {isScanned ? 'scanned already' : 'not scanned'}
                      </div>
                    )
                  }
                },
              ]}
              data={filteredOrders ?? []}
              actions={{}}
              pagination={{
                totalCount: Number(filteredOrders?.length ?? 0),
                perPage: 10
              }}
              pageFe={true}
            />
          </div>
        )}

        {orderPdf}

        {showDetails && (
          <AiOutlineClose
            fill="red"
            style={{
              position: 'fixed', 
              right: '20px', 
              top: '20px', 
              zIndex: '20',
              cursor: 'pointer',
              fontSize: '24px',
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            onClick={() => {
              setShowDetails(false)
              setActiveOrderDetails(undefined)
              setActiveData([{}])
            }}
          />
        )}
      </Box>
    </div>
  )
}

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

  // Generate barcode data URL
  const generateBarcodeUrl = (text: string) => {
    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, text, {
        format: "CODE128",
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
    if (!products || products.length === 0) return { totalQuantity: 0, totalPrice: 0 }
    
    const totalQuantity = products?.reduce((sum, product) => sum + (product.quantity || 0), 0)
    const totalPrice = products?.reduce((sum, product) => sum + (product.price || 0), 0)
    
    return { totalQuantity, totalPrice }
  }

  const generateLocationQrUrl = (latitude: number, longitude: number) => {
    if (latitude && longitude) {
      return `https://www.google.com/maps?q=${latitude},${longitude}`
    }
    return 'No location available'
  }

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        {data
          ?.filter((item) => Object.keys(item).length !== 0)
          ?.map((item, index) => {
            const { totalQuantity, totalPrice } = calculateOrderTotals(item?.products || [])
            const locationQrData = generateLocationQrUrl(item.latitude, item.longitude)
            const orderId = item.productOrderId || item._id

            return (
              <Page size="A5" style={styles.page} key={index}>
                {/* Elegant Header with Barcode */}
                <View style={styles.header}>
                  <View style={styles.brandSection}>
                    <Image style={styles.logo} src="/assets/images/logosss.png" />
                    <View>
                      <Text style={styles.tagline}>AABHUSHAN GALLERY</Text>
                    </View>
                  </View>
                  <View style={styles.orderSection}>
                    {/* Removed ORDER text */}
                    <Text style={styles.orderNumber}>{orderId}</Text>
                    {/* Barcode Container - Full Width */}
                    <View style={styles.barcodeContainer}>
                      <Image 
                        style={styles.barcode} 
                        src={generateBarcodeUrl(orderId)} 
                      />
                    </View>
                  </View>
                </View>

                {/* Shipping Information Grid */}
                <View style={styles.shippingGrid}>
                  <View style={styles.addressCard}>
                    <Text style={styles.addressTitle}>ORIGIN</Text>
                    <View style={styles.divider} />
                    <Text style={styles.name}>Aabhushan Gallery</Text>
                    <Text style={styles.address}> Kathmandu</Text>
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
                        <Text style={styles.deliveryPartnerText}>
                          Partner: {item.deliveryPartner}
                        </Text>
                      </View>
                    )}
                    <View style={styles.divider} />
                    <Text style={styles.name}>{item.customerName || 'Customer'}</Text>
                    <Text style={styles.address}>Address by user:{item.shippingLocation}</Text>
                    {item.locationAddress && <Text style={styles.address}>Address From Map:{item.locationAddress}</Text>}
                    <Text style={styles.contact}>T: {item.phoneNumber}</Text>
                  </View>
                </View>

                {/* Order Note */}
                <View style={styles.noteSection}>
                  <Text style={styles.noteTitle}>ORDER NOTE</Text>
                  <View style={styles.divider} />
                  <Text style={styles.noteText}>{truncateOrderNote(item?.orderNote)}</Text>
                </View>

                {/* Financial Summary - Highlighted */}
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
{
  !!item.includeGiftBox &&     <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>GiftBox Charge</Text>
                      <Text style={styles.summaryValue}>Rs.400</Text>
                    </View>
}
                  
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>SHIPPING</Text>
                      <Text style={styles.summaryValue}>Rs. {item?.shippingPrice || 0}</Text>
                    </View>
                  </View>

                  <View style={styles.totalSection}>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                      <Text style={styles.totalAmount}>Rs. {item?.totalAmount?.toFixed(2) || 0}</Text>
                    </View>
                  </View>

                  {item.isInsideValley === false && (
                    <View style={styles.paymentHighlight}>
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>ADVANCE PAID</Text>
                        <Text style={styles.paymentValue}>Rs. ${item?.shippingPrice}</Text>
                      </View>
                      <View style={[styles.paymentRow, styles.balanceRow]}>
                        <Text style={styles.balanceLabel}>BALANCE DUE</Text>
                        <Text style={styles.balanceAmount}>Rs. {(item?.totalAmount - item?.shippingPrice).toFixed(2)}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  {item.latitude && item.longitude && (
                    <View style={styles.qrSection}>
                      <Image style={styles.qrCode} src={generateQrCodeUrl(locationQrData)} />
                      <Text style={styles.qrLabel}>DELIVERY LOCATION</Text>
                    </View>
                  )}
                </View>
              </Page>
            )
          })}
      </Document>
    </PDFViewer>
  )
}

const styles = StyleSheet.create({
  viewer: {
    height: '100vh',
    width: '75vw',
    position: 'absolute',
    top: 0,
    left: '0'
  },
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  
  // Elegant Header with Barcode
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottom: '2px solid #000000'
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logo: {
    width: 35,
    height: 50
  },
  tagline: {
    fontSize: 7,
    color: '#666666',
    letterSpacing: 0.5,
    marginTop: 1
  },
  orderSection: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 10
  },
  orderNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  // Barcode Styles - Full Width
  barcodeContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    border: '0.5px solid #e0e0e0'
  },
  barcode: {
    width: '100%',
    height: 30
  },

  // Shipping Grid
  shippingGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  addressCard: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fafafa',
    borderLeft: '3px solid #cccccc'
  },
  destinationCard: {
    backgroundColor: '#ffffff',
    borderLeft: '3px solid #000000',
    border: '1px solid #000000'
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  deliveryPartnerBadge: {
    backgroundColor: '#e3f2fd',
    padding: '2px 6px',
    borderRadius: '3px',
    marginBottom: 4,
    alignSelf: 'flex-start'
  },
  deliveryPartnerText: {
    fontSize: 7,
    color: '#1976d2',
    fontWeight: 'bold'
  },
  addressTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1.2
  },
  deliveryType: {
    fontSize: 6,
    fontWeight: 'bold',
    color: '#666666',
    letterSpacing: 0.8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#f0f0f0'
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 6
  },
  noteSection: {
    padding: 10,
    border: '1px solid #e0e0e0',
    backgroundColor: '#ffffff',
    marginBottom: 12
  },
  noteTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1.2,
    marginBottom: 4
  },
  noteText: {
    fontSize: 8,
    color: '#333333',
    lineHeight: 1.4
  },
  name: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3
  },
  address: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 1,
    lineHeight: 1.4
  },
  contact: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 4
  },

  // Financial Section - Removed black background
  financialSection: {
    marginBottom: 12,
    border: '2px solid #000000',
    backgroundColor: '#fafafa'
  },
  summaryGrid: {
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0'
  },
  summaryItem: {
    flex: 1,
    padding: 8,
    borderRight: '1px solid #e0e0e0',
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 6,
    color: '#666666',
    letterSpacing: 1,
    marginBottom: 3
  },
  summaryValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000'
  },
  totalSection: {
    backgroundColor: '#ffffff',
    padding: 10
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1.5
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5
  },
  paymentHighlight: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderTop: '2px solid #000000'
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3
  },
  paymentLabel: {
    fontSize: 8,
    color: '#666666',
    letterSpacing: 0.8
  },
  paymentValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000'
  },
  balanceRow: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: 6,
    marginTop: 3
  },
  balanceLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1
  },
  balanceAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000'
  },

  // Footer - Removed PRINTED text and shipping label
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTop: '1px solid #e0e0e0'
  },
  qrSection: {
    alignItems: 'center'
  },
  qrCode: {
    width: 45,
    height: 45,
    marginBottom: 3
  },
  qrLabel: {
    fontSize: 6,
    color: '#666666',
    letterSpacing: 1
  }
})