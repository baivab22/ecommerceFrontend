import React, {useEffect, useState, useCallback, useMemo} from 'react'
import {useDispatch} from 'src/store'
import ReactDOM from 'react-dom/client'
import {useSelector} from 'react-redux'
import {
  Box,
  Button,
  CheckBox,
  HStack,
  Modal,
  SelectField,
  Table
} from 'src/app/common'
import {useNavigate} from 'react-router-dom'

import {getOrderListAction} from '../web/cart/cart.slice'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import QRCode from 'qrcode'

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Image
} from '@react-pdf/renderer'
import {AiOutlineClose} from 'react-icons/ai'
import {MdCheckBoxOutlineBlank} from 'react-icons/md'
import {IoCheckboxOutline} from 'react-icons/io5'

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
      return <OrderPDf data={activeData} />
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
    if (!dateString) return null
    try {
      const cleanDate = dateString.replace(/,/g, '')
      return new Date(cleanDate)
    } catch {
      return null
    }
  }

  // Helper function to get date range based on filter type
  const getDateRange = (filterType: string) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (filterType) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        }
      case 'week':
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return {
          start: weekStart,
          end: new Date(now.getTime() + 24 * 60 * 60 * 1000 - 1)
        }
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
          start: monthStart,
          end: new Date(now.getTime() + 24 * 60 * 60 * 1000 - 1)
        }
      case 'custom':
        return {
          start: startDate ? new Date(startDate) : null,
          end: endDate ? new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1) : null
        }
      default:
        return { start: null, end: null }
    }
  }

  // Filter orders by date and search query
  const filteredOrders = useMemo(() => {
    if (!orderData?.orderData) return []
    
    let filtered = orderData.orderData

    // Apply date filter
    if (dateFilterType !== 'all') {
      const { start, end } = getDateRange(dateFilterType)
      
      if (start || end) {
        filtered = filtered.filter((order: any) => {
          const orderDate = parseOrderDate(order.OrderedAt)
          if (!orderDate) return false

          if (start && orderDate < start) return false
          if (end && orderDate > end) return false
          
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

  // WhatsApp message sender
  const sendWhatsAppMessage = (order: any) => {
    console.log(order,"order finally")
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
Estimated Delivery: 2-5 working days

Thank you for shopping with us! 
We'll keep you updated on your order status.

Best regards,
Aabhushan Gallery Team`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
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
      const date = new Date(dateString.replace(/,/g, ''))
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
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
                placeholder="Search by Order ID, Customer, Product, Location, Phone..."
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
                <button
                  onClick={() => {
                    setDateFilterType('today')
                    setShowCustomDateInputs(false)
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: dateFilterType === 'today' ? '2px solid #1976d2' : '1px solid #ccc',
                    backgroundColor: dateFilterType === 'today' ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: dateFilterType === 'today' ? 'bold' : 'normal'
                  }}
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    setDateFilterType('week')
                    setShowCustomDateInputs(false)
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: dateFilterType === 'week' ? '2px solid #1976d2' : '1px solid #ccc',
                    backgroundColor: dateFilterType === 'week' ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: dateFilterType === 'week' ? 'bold' : 'normal'
                  }}
                >
                  This Week
                </button>
                <button
                  onClick={() => {
                    setDateFilterType('month')
                    setShowCustomDateInputs(false)
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: dateFilterType === 'month' ? '2px solid #1976d2' : '1px solid #ccc',
                    backgroundColor: dateFilterType === 'month' ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: dateFilterType === 'month' ? 'bold' : 'normal'
                  }}
                >
                  This Month
                </button>
                <button
                  onClick={handleCustomDateFilterToggle}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: dateFilterType === 'custom' ? '2px solid #1976d2' : '1px solid #ccc',
                    backgroundColor: dateFilterType === 'custom' ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: dateFilterType === 'custom' ? 'bold' : 'normal'
                  }}
                >
                  Custom Range {dateFilterType === 'custom' && (showCustomDateInputs ? '▼' : '▶')}
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
                    🔍 Searching: "{searchQuery.substring(0, 30)}{searchQuery.length > 30 ? '...' : ''}"
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
            maxHeight: 'calc(100vh - 400px)',
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
                        color: '#1976d2'
                      }}>
                        {truncateText(orderId, 20)}
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
                        {formatDate(orderedAt)}
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
                }
              ]}
              data={filteredOrders ?? []}
              actions={{}}
              pagination={{
                totalCount: Number(filteredOrders?.length ?? 0),
                perPage: 10
              }}
           
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

const OrderPDf = ({data}) => {
  const currentDate = new Date()

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

  console.log(data,"data value finally")
  const calculateOrderTotals = (products) => {
    if (!products || products.length === 0) return { totalQuantity: 0, totalPrice: 0 }
    
    const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0)
    const totalPrice = products.reduce((sum, product) => sum + (product.price || 0), 0)
    
    return { totalQuantity, totalPrice }
  }

  const getMaxProductsPerPage = (productsCount) => {
    const headerHeight = 30
    const originDestHeight = 40
    const summaryHeight = 50
    const qrHeight = 40
    const footerHeight = 20
    const margins = 24
    
    const availableHeight = 288 - headerHeight - originDestHeight - summaryHeight - qrHeight - footerHeight - margins
    const productItemHeight = 16
    
    return Math.floor(availableHeight / productItemHeight)
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
            const deliveryType = item?.isHomeDelivery 
            const maxProducts = getMaxProductsPerPage(item?.products?.length || 0)
            const locationQrData = generateLocationQrUrl(item.latitude, item.longitude)

            console.log('delivery type final',item,deliveryType)

            return (
              <Page
                size={{width: 216, height: 288}}
                style={styles.page}
                key={index}
              >
                <View style={styles.header}>
                  <Image
                    style={styles.logo}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSNyE_y63CdiQwrOyaUDsNWmntsXiuAm4Izg&s"
                  />
                  <Text style={styles.headerTitle}>{item.productOrderId}</Text>
                </View>

                <View style={styles.box}>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.label}>Origin</Text>
                      <Text style={styles.value}>Aabhushan Gallery</Text>
                      <Text style={styles.smallValue}>Kathmandu,Kalimati Nepal 44600</Text>
                      <Text style={styles.contactValue}>9861394245</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.label}>Destination</Text>
                      <Text style={styles.value}>{item.shippingLocation}</Text>
                      <Text style={styles.deliveryType}>{item?.isHomeDelivery?'Home Delivery':'Office Delivery' }</Text>
                      {item.latitude && item.longitude && (
                        <Text style={styles.locationCoords}>
                          {item.locationAddress || `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`}
                        </Text>
                      )}
                      <Text style={styles.contactValue}>{item.phoneNumber}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.box, {backgroundColor: '#f9f9f9', flex: 1}]}>
                  <Text style={styles.sectionTitle}>Products Details</Text>
                  <View style={styles.productsContainer}>
                    {item?.products?.slice(0, maxProducts).map((product, productIndex) => (
                      <View key={productIndex} style={styles.compactProductRow}>
                        <View style={styles.productNameContainer}>
                          <Text style={styles.compactProductName}>
                            {(product?.productId?.name || 'Unknown Product').substring(0, 35)}
                            {(product?.productId?.name || '').length > 35 ? '...' : ''}
                          </Text>
                        </View>
                        <View style={styles.productStatsContainer}>
                          <Text style={styles.productStat}>Qty: {product?.quantity || 0}</Text>
                          <Text style={styles.productStat}>Rs. {product?.price.toFixed(2) || 0}</Text>
                        </View>
                      </View>
                    ))}
                    
                    {item?.products?.length > maxProducts && (
                      <View style={styles.moreProductsIndicator}>
                        <Text style={styles.moreProductsText}>
                          +{item.products.length - maxProducts} more items
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={[styles.box, {backgroundColor: '#f0f7ff'}]}>
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summaryLabel}>Items: {item?.products?.length || 0}</Text>
                      <Text style={styles.summaryLabel}>Qty: {totalQuantity}</Text>
                    </View>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summaryLabel}>Products: Rs. {totalPrice.toFixed(2)}</Text>
                      <Text style={styles.summaryLabel}>Shipping: Rs. {item?.shippingPrice || 0}</Text>
                    </View>
                    <View style={styles?.summaryColumn}>
                      <Text style={styles?.totalLabel}>Total: Rs. {item?.totalAmount?.toFixed(2) || (totalPrice.toFixed(2) + parseFloat(item.shippingPrice || 0))}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.qrContainer}>
                  <Text style={styles.qrLabel}>
                    {item.latitude && item.longitude ? 'Scan for delivery location' : 'Scan for order details'}
                  </Text>
                  <Image
                    style={styles.qrCode}
                    src={generateQrCodeUrl(locationQrData)}
                  />
                </View>

                <View style={styles.footer}>
                  <Text style={styles.printDate}>
                    Print Date: {currentDate.toLocaleDateString()}
                  </Text>
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
    padding: 12,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: '0.5px solid #666'
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  column: {
    flex: 1,
    paddingRight: 4
  },
  summaryColumn: {
    flex: 1,
    alignItems: 'center'
  },
  label: {
    fontSize: 6,
    color: '#444',
    marginBottom: 1
  },
  value: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 1
  },
  smallValue: {
    fontSize: 6,
    color: '#666',
    marginBottom: 1
  },
  contactValue: {
    fontSize: 6,
    fontWeight: 'bold'
  },
  deliveryType: {
    fontSize: 6,
    color: '#2563eb',
    fontWeight: 'bold',
    marginTop: 2
  },
  locationCoords: {
    fontSize: 5,
    color: '#666',
    marginTop: 1,
    fontStyle: 'italic'
  },
  box: {
    padding: 4,
    backgroundColor: '#f8f8f8',
    borderRadius: 2,
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333',
    textAlign: 'center'
  },
  productsContainer: {
    flexDirection: 'column'
  },
  compactProductRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    paddingBottom: 2,
    borderBottom: '0.3px solid #eee'
  },
  productNameContainer: {
    flex: 2,
    paddingRight: 4
  },
  compactProductName: {
    fontSize: 6,
    fontWeight: 'bold',
    color: '#333'
  },
  productStatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  productStat: {
    fontSize: 5,
    color: '#666'
  },
  moreProductsIndicator: {
    alignItems: 'center',
    marginTop: 2,
    paddingTop: 2,
    borderTop: '0.5px solid #ccc'
  },
  moreProductsText: {
    fontSize: 6,
    fontStyle: 'italic',
    color: '#888'
  },
  summaryLabel: {
    fontSize: 6,
    color: '#666',
    marginBottom: 1
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2563eb'
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 4
  },
  qrLabel: {
    fontSize: 5,
    color: '#666',
    marginBottom: 2,
    fontStyle: 'italic'
  },
  qrCode: {
    width: 35,
    height: 35,
    objectFit: 'contain'
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    textAlign: 'right'
  },
  printDate: {
    fontSize: 5,
    color: '#666'
  }
})