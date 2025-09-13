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

  // Helper function to get total quantity for an order
  const getTotalQuantity = (products: any[]) => {
    return products?.reduce((total, product) => total + product.quantity, 0) || 0
  }

  // Helper function to get total price for an order
  const getTotalPrice = (products: any[]) => {
    return products?.reduce((total, product) => total + product.price, 0) || 0
  }

  // WhatsApp message sender
  const sendWhatsAppMessage = (order: any) => {
    const phoneNumber = order.userId?.phone || '9841934343' // Default or customer phone
    const customerName = order.userId?.name || order.userId?.email || 'Customer'
    const orderId = order.productOrderId || order._id
    
    const productsList = order.products?.map((product, index) => 
      `${index + 1}. ${product.productId?.name} (Qty: ${product.quantity}, Price: ${getNprPrice(product.price)})`
    ).join('\n') || 'No products listed'
    
    const totalAmount = getNprPrice(order.totalAmount)
    const shippingLocation = order.shippingLocation
    const deliveryType = order.isInsideValley ? 'Home Delivery (Inside Valley)' : 'Office Delivery (Outside Valley)'
    const paymentType = order.paymentMethod === 'phonepay' ? 'PhonePay' : 'Cash on Delivery (COD)'
    
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
Address: ${shippingLocation}
Estimated Delivery: 2-5 working days

Thank you for shopping with us! 
We'll keep you updated on your order status.

Best regards,
Aabhushan Gallery Team`

    // Open WhatsApp with pre-filled message
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

        {!showDetails && (
          <Table
            columns={[
              {
                field: 'select',
                name: 'Select',
                colStyle: { width: '60px', minWidth: '60px' },
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
                colStyle: { width: '140px', minWidth: '140px' },
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
                colStyle: { width: '300px', minWidth: '250px' },
                render: (products) => {
                  return renderProductsList(products)
                }
              },
              {
                field: 'userId',
                name: 'Customer',
                colStyle: { width: '180px', minWidth: '150px' },
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
                colStyle: { width: '60px', minWidth: '60px', textAlign: 'center' },
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
                colStyle: { width: '120px', minWidth: '120px', textAlign: 'right' },
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
                colStyle: { width: '160px', minWidth: '140px' },
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
                field: 'isInsideValley',
                name: 'Valley',
                colStyle: { width: '80px', minWidth: '80px', textAlign: 'center' },
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
                colStyle: { width: '130px', minWidth: '130px' },
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
                field: 'shippingPrice',
                name: 'Shipping',
                colStyle: { width: '100px', minWidth: '100px', textAlign: 'right' },
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
                colStyle: { width: '140px', minWidth: '140px' },
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
            data={(orderData && orderData.orderData) ?? []}
            actions={{}}
            pagination={{
              totalCount: Number(orderData.orderData?.length ?? 0),
              perPage: 10
            }}
          />
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

  // Calculate totals for an order
  const calculateOrderTotals = (products) => {
    if (!products || products.length === 0) return { totalQuantity: 0, totalPrice: 0 }
    
    const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0)
    const totalPrice = products.reduce((sum, product) => sum + (product.price || 0), 0)
    
    return { totalQuantity, totalPrice }
  }

  // Calculate maximum products per page based on available space
  const getMaxProductsPerPage = (productsCount) => {
    // Base space calculations for A4 page (216x288 points)
    const headerHeight = 30
    const originDestHeight = 40
    const summaryHeight = 50
    const qrHeight = 40
    const footerHeight = 20
    const margins = 24 // top + bottom padding
    
    const availableHeight = 288 - headerHeight - originDestHeight - summaryHeight - qrHeight - footerHeight - margins
    const productItemHeight = 16 // Height per product item
    
    return Math.floor(availableHeight / productItemHeight)
  }

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        {data
          ?.filter((item) => Object.keys(item).length !== 0)
          ?.map((item, index) => {
            const { totalQuantity, totalPrice } = calculateOrderTotals(item?.products || [])
            const deliveryType = item.isInsideValley ? 'Home Delivery' : 'Office Pickup'
            const maxProducts = getMaxProductsPerPage(item?.products?.length || 0)

            return (
              <Page
                size={{width: 216, height: 288}}
                style={styles.page}
                key={index}
              >
                {/* Header */}
                <View style={styles.header}>
                  <Image
                    style={styles.logo}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSNyE_y63CdiQwrOyaUDsNWmntsXiuAm4Izg&s"
                  />
                  <Text style={styles.headerTitle}>{item.productOrderId}</Text>
                </View>

                {/* Origin & Destination */}
                <View style={styles.box}>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.label}>Origin</Text>
                      <Text style={styles.value}>Aabhushan Gallery</Text>
                      <Text style={styles.smallValue}>Kathmandu, Nepal 44600</Text>
                      <Text style={styles.contactValue}>9841934343</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.label}>Destination</Text>
                      <Text style={styles.value}>{item.shippingLocation}</Text>
                      <Text style={styles.deliveryType}>{deliveryType}</Text>
                    </View>
                  </View>
                </View>

                {/* Products Section - Compact Layout */}
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
                          <Text style={styles.productStat}>Rs. {product?.price || 0}</Text>
                        </View>
                      </View>
                    ))}
                    
                    {/* Show remaining products count if exceeds max */}
                    {item?.products?.length > maxProducts && (
                      <View style={styles.moreProductsIndicator}>
                        <Text style={styles.moreProductsText}>
                          +{item.products.length - maxProducts} more items
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Order Summary - Fixed at bottom */}
                <View style={[styles.box, {backgroundColor: '#f0f7ff'}]}>
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summaryLabel}>Items: {item?.products?.length || 0}</Text>
                      <Text style={styles.summaryLabel}>Qty: {totalQuantity}</Text>
                    </View>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.summaryLabel}>Products: Rs. {totalPrice}</Text>
                      <Text style={styles.summaryLabel}>Shipping: Rs. {item.shippingPrice || 0}</Text>
                    </View>
                    <View style={styles.summaryColumn}>
                      <Text style={styles.totalLabel}>Total: Rs. {item.totalAmount || (totalPrice + parseFloat(item.shippingPrice || 0))}</Text>
                    </View>
                  </View>
                </View>

                {/* QR Code - Compact */}
                <View style={styles.qrContainer}>
                  <Image
                    style={styles.qrCode}
                    src={generateQrCodeUrl(
                      `http://localhost:3000/orderDetails?orderId=${item?._id}&isForOrder=true`
                    )}
                  />
                </View>

                {/* Footer */}
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