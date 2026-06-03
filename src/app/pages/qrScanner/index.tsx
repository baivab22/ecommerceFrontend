import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import { scanWithJsQR } from './jsqrFallback'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import {getOrderDetailByIdAction} from '../products/product.slice'
import {markOrderScanAction, getSalesAnalyticsAction} from './qrScanner.slice'
import {useDispatch, useSelector} from 'src/store'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import {BASE_URL, FILE_URL} from 'src/config'
import {getNprPrice} from 'src/helpers/nprPrice.helper'
import {FiCopy, FiPlay, FiTrash2} from 'react-icons/fi'
import {registerVideoElement} from 'src/helpers/videoPlayback.helper'
import { updateOrderByIdAction } from '../web/cart/cart.slice'
import Image from 'next/image'
import OptimizedImage from '../../common/OptimizedImage/OptimizedImage.component'

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  & > div {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }
`

const ScannerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;

  @media (max-width: 1280px) {
    gap: 24px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const TabContainer = styled.div`
  margin-bottom: 32px;
  background-color: white;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 8px;
  display: flex;
  gap: 8px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const ScannerCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`

const StatusBadge = styled.span<{
  status: 'pending' | 'success' | 'error' | 'loading'
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({status}) => {
    switch (status) {
      case 'success':
        return 'background-color: #d1fae5; color: #065f46;'
      case 'loading':
        return 'background-color: #fef3c7; color: #92400e;'
      case 'pending':
        return 'background-color: #dbeafe; color: #1e40af;'
      case 'error':
        return 'background-color: #fee2e2; color: #991b1b;'
      default:
        return 'background-color: #f3f4f6; color: #4b5563;'
    }
  }}
`

const Button = styled.button<{
  variant?: 'primary' | 'danger' | 'success' | 'outline'
}>`
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  ${({variant = 'primary'}) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            transform: translateY(-1px);
          }
        `
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-1px);
          }
        `
      case 'success':
        return `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: translateY(-1px);
          }
        `
      case 'outline':
        return `
          background: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          &:hover {
            background: #eff6ff;
          }
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 800px;
  overflow: hidden;
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead {
    position: sticky;
    top: 0;
    z-index: 10;

    th {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #e2e8f0;

      &:first-child {
        border-top-left-radius: 8px;
      }

      &:last-child {
        border-top-right-radius: 8px;
      }
    }
  }

  tbody {
    tr {
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f8fafc;
      }

      td {
        padding: 16px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: top;
      }
    }
  }
`

const ProductMediaWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  video {
    object-fit: cover;
  }

  .play-icon-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    pointer-events: none;
  }

  .no-media {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #9ca3af;
    font-size: 10px;
    text-align: center;
  }
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  video,
  img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
  }

  video {
    width: auto;
    height: auto;
    max-width: 90vw;
    max-height: 90vh;
  }
`

const CameraPreview = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  aspect-ratio: 4/3;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ScanOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border: 3px solid rgba(16, 185, 129, 0.5);
  border-radius: 12px;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    right: 10%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #10b981, transparent);
    animation: scan 2s ease-in-out infinite;
  }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

interface Product {
  _id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  originalPrice?: number
  discountedPrice?: number
  discountPercentage?: number
  colorName?: string
  quantity: number
  productId?: {
    _id: string
    name: string
    description: string
    images: Array<{
      _id: string
      colorName: string
      coloredImage: string
    }>
    video?: string
    originalPrice: number
    discountedPrice: number
    discountPercentage: number
  }
}

interface OrderDetail {
  _id: string
  orderId: string
  userId: {
    name: string
    email: string
  }
  products: Product[]
  isInsideValley: boolean
  OrderedAt: string
  latitude?: number
  longitude?: number
  locationAddress?: string
  productOrderId: string
  date: string
  shippingPrice: number
  giftBoxCharge?: number
  totalAmount: number
  phoneNumber: string
  isHomeDelivery: boolean
  shippingLocation: string
  paymentMethod: string
  isScanned: boolean
  scannedAt?: string
  orderStatus?: string
  isConfirmed?: boolean
  includeGiftBox?: boolean
}

const normalizeOrderDetailResponse = (payload: any): OrderDetail | null => {
  if (!payload) return null
  const candidate =
    payload?.data && typeof payload.data === 'object' ? payload.data : payload
  if (!candidate || typeof candidate !== 'object') return null
  if (!candidate._id && !candidate.productOrderId) return null
  return candidate as OrderDetail
}

interface ScannedOrder {
  id: string
  orderId: string
  productOrderId: string
  orderDetail: OrderDetail | null
  timestamp: string
  date: string
  status: 'pending' | 'success' | 'error' | 'loading'
  errorMessage?: string
  checked?: boolean
  isLoadingDetail?: boolean
  isProcessing?: boolean
}

interface AnalyticsData {
  salesData: Array<{
    _id: {year: number; month?: number; day?: number; week?: number}
    totalSales: number
    orderCount: number
    totalItems: number
  }>
  topProducts: Array<{
    _id: string
    totalQuantity: number
    totalRevenue: number
    productDetails: Array<{
      name: string
      images: Array<{coloredImage: string}>
    }>
  }>
  period: string
}

interface BarcodeDetector {
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>
}

interface DetectedBarcode {
  boundingBox: DOMRectReadOnly
  cornerPoints: {x: number; y: number}[]
  format: string
  rawValue: string
}

interface BarcodeFormat {
  format: string
}

declare var BarcodeDetector: {
  prototype: BarcodeDetector
  new (options?: {formats: string[]}): BarcodeDetector
  getSupportedFormats(): Promise<string[]>
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D'
]

const QRScanner = () => {
  const {orderDetailData, orderDetailLoading} = useSelector(
    (state: any) => state.product
  )
  const {
    salesData,
    topProducts,
    loading: scanLoading
  } = useSelector((state: any) => state.scan)

  const dispatch = useDispatch()

  const [scanning, setScanning] = useState(false)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState('')
  const [scannedOrders, setScannedOrders] = useState<ScannedOrder[]>([])
  const [error, setError] = useState('')
  const [supportedFormats, setSupportedFormats] = useState<BarcodeFormat[]>([])
  const [scanCount, setScanCount] = useState(0)
  const [currentScanningOrderId, setCurrentScanningOrderId] = useState<
    string | null
  >(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<'scanner' | 'analytics'>('scanner')
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('monthly')
  const [isConfirming, setIsConfirming] = useState(false)
  const [modalMedia, setModalMedia] = useState<{
    type: 'image' | 'video'
    url: string
  } | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)

  const scannedProductOrderIdsRef = useRef<Set<string>>(new Set())
  const lastScanTimeRef = useRef<number>(0)
  const scanCooldownRef = useRef<number>(3000)
  const scannedBarcodesCooldownRef = useRef<Map<string, number>>(new Map())
  const BARCODE_RESURFACE_COOLDOWN = 3000
  const processingOrderRef = useRef<Set<string>>(new Set())
  const orderDetailCacheRef = useRef<Map<string, OrderDetail>>(new Map())
  const processingTimerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map())

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const detectorRef = useRef<BarcodeDetector | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const resolveProductImageUrl = useCallback((rawValue?: string) => {
    if (!rawValue) return ''
    const value = String(rawValue).trim()
    if (/^data:/i.test(value)) return value
    if (/^https?:\/\//i.test(value)) return encodeURI(value)

    const cleaned = value.replace(/^\/+/, '')
    const safePath = encodeURI(cleaned)
    if (cleaned.startsWith('products/')) return `${FILE_URL}/${safePath}`
    if (cleaned.startsWith('uploads/')) {
      return `${FILE_URL}/${encodeURI(cleaned.replace(/^uploads\//, ''))}`
    }

    return `${FILE_URL}/products/${safePath}`
  }, [])

  const resolveProductVideoUrl = useCallback((rawValue?: string) => {
    if (!rawValue) return ''
    const value = String(rawValue).trim()
    if (/^data:/i.test(value)) return value
    if (/^https?:\/\//i.test(value)) return encodeURI(value)

    const cleaned = value.replace(/^\/+/, '')
    const safePath = encodeURI(cleaned)
    if (cleaned.startsWith('video/')) return `${FILE_URL}/${safePath}`
    if (cleaned.startsWith('uploads/')) {
      return `${FILE_URL}/${encodeURI(cleaned.replace(/^uploads\//, ''))}`
    }

    return `${FILE_URL}/video/${safePath}`
  }, [])

  const playSuccessSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )()
      }

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + 0.3
      )

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.3)
    } catch (err) {
      console.log('Audio playback failed:', err)
    }
  }, [])

  const playErrorSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )()
      }

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.value = 400
      oscillator.type = 'sawtooth'

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + 0.5
      )

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.5)
    } catch (err) {
      console.log('Error sound playback failed:', err)
    }
  }, [])

  const checkBrowserSupport = useCallback(() => {
    if (!('BarcodeDetector' in window)) {
      setError(
        'Barcode Detection API not supported in this browser. Using fallback QR scanner.'
      )
      setFallbackMode(true)
      return false
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera access not supported in this browser.')
      return false
    }

    setFallbackMode(false)
    return true
  }, [])

  const initializeBarcodeDetector = useCallback(async () => {
    try {
      const formats = await (BarcodeDetector as any).getSupportedFormats()
      setSupportedFormats(formats)
      detectorRef.current = new (BarcodeDetector as any)({formats})
    } catch (err) {
      console.error('BarcodeDetector initialization failed:', err)
      setError('Failed to initialize barcode detector.')
    }
  }, [])

  const getCameras = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true})
      stream.getTracks().forEach((track) => track.stop())

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )

      setCameras(videoDevices)

      if (videoDevices.length > 0) {
        const rearCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear')
        )
        setSelectedCamera(
          rearCamera ? rearCamera.deviceId : videoDevices[0].deviceId
        )
      }
    } catch (err) {
      console.error('Error getting cameras:', err)
      setError('Failed to access camera devices.')
    }
  }, [])

  const startCamera = useCallback(
    async (deviceId = '') => {
      if (!checkBrowserSupport()) return

      try {
        setError('')

        const constraints = {
          video: {
            deviceId: deviceId ? {exact: deviceId} : undefined,
            width: {ideal: 1280},
            height: {ideal: 720},
            facingMode: deviceId ? undefined : 'environment'
          }
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        setScanning(true)
      } catch (err: any) {
        console.error('Error starting camera:', err)
        setError(`Camera error: ${err.message}`)
        setScanning(false)
      }
    },
    [checkBrowserSupport]
  )

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setScanning(false)
    setCurrentScanningOrderId(null)
    processingOrderRef.current.clear()

    processingTimerRef.current.forEach((timer) => clearTimeout(timer))
    processingTimerRef.current.clear()
  }, [])

  const fetchOrderDetail = useCallback(
    async (orderId: string, productOrderId: string) => {
      if (orderDetailCacheRef.current.has(orderId)) {
        return orderDetailCacheRef.current.get(orderId)!
      }

      try {
        const result = await dispatch(
          getOrderDetailByIdAction({orderId})
        ).unwrap()
        const normalizedOrderDetail = normalizeOrderDetailResponse(result)
        if (normalizedOrderDetail) {
          orderDetailCacheRef.current.set(orderId, normalizedOrderDetail)
          return normalizedOrderDetail
        }
        throw new Error(
          (result as any)?.message || 'Failed to fetch order details'
        )
      } catch (error: any) {
        console.error('Error fetching order details:', error)
        throw error
      }
    },
    [dispatch]
  )

  const isProductOrderInTable = useCallback(
    (productOrderId: string): boolean => {
      return scannedOrders.some(
        (order) => order.productOrderId === productOrderId
      )
    },
    [scannedOrders]
  )

  const addScannedOrder = useCallback(
    (
      orderId: string,
      productOrderId: string,
      orderDetail: OrderDetail | null = null,
      status: 'pending' | 'success' | 'error' | 'loading' = 'pending',
      errorMessage?: string
    ) => {
      if (isProductOrderInTable(productOrderId)) {
        console.log('Product order already in table, skipping:', productOrderId)
        playErrorSound()
        toast.error(`Order ${productOrderId} already scanned`)
        return false
      }

      const newOrder: ScannedOrder = {
        id: Date.now().toString(),
        orderId,
        productOrderId,
        orderDetail,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        date: new Date().toLocaleDateString(),
        status: status,
        errorMessage,
        checked: false,
        isLoadingDetail: status === 'pending',
        isProcessing: false
      }

      setScannedOrders((prev) => [newOrder, ...prev])
      setScanCount((prev) => prev + 1)

      if (status === 'success') {
        playSuccessSound()
        toast.success(`Order ${productOrderId} confirmed!`)
      } else if (status === 'error') {
        playErrorSound()
      }

      return true
    },
    [playSuccessSound, playErrorSound, isProductOrderInTable]
  )

  const processSingleOrder = useCallback(
    async (order: ScannedOrder) => {
      if (
        order.isProcessing ||
        processingOrderRef.current.has(order.productOrderId)
      ) {
        console.log('Order already being processed:', order.productOrderId)
        return
      }

      processingOrderRef.current.add(order.productOrderId)

      setScannedOrders((prev) =>
        prev.map((o) => (o.id === order.id ? {...o, isProcessing: true} : o))
      )

      try {
        console.log('Processing order:', order.productOrderId)

        const orderDetail = await fetchOrderDetail(
          order.orderId,
          order.productOrderId
        )

        const normalizedOrderDetail = normalizeOrderDetailResponse(orderDetail)
        if (!normalizedOrderDetail) {
          throw new Error('Order details could not be parsed from response')
        }
        setScannedOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  orderDetail: normalizedOrderDetail,
                  status: 'pending',
                  isLoadingDetail: false,
                  isProcessing: false,
                  orderId: String(
                    normalizedOrderDetail.productOrderId ||
                      normalizedOrderDetail._id ||
                      o.orderId ||
                      ''
                  )
                }
              : o
          )
        )

        setScannedOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {...o, status: 'pending', isProcessing: false}
              : o
          )
        )

        console.log('Order processed successfully:', order.productOrderId)
      } catch (error: any) {
        console.error('Failed to process order:', error)
        setScannedOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? {
                  ...o,
                  status: 'error',
                  errorMessage: error.message || 'Failed to process order',
                  isLoadingDetail: false,
                  isProcessing: false
                }
              : o
          )
        )
        toast.error(`Failed to process order ${order.productOrderId}`)
      } finally {
        setTimeout(() => {
          processingOrderRef.current.delete(order.productOrderId)
        }, 2000)
      }
    },
    [fetchOrderDetail]
  )

  const processPendingOrders = useCallback(() => {
    const ordersToProcess = scannedOrders.filter(
      (order) =>
        order.status === 'pending' &&
        !order.isProcessing &&
        !processingOrderRef.current.has(order.productOrderId)
    )

    ordersToProcess.forEach((order) => {
      if (processingTimerRef.current.has(order.productOrderId)) {
        clearTimeout(processingTimerRef.current.get(order.productOrderId))
      }

      const timer = setTimeout(() => {
        processSingleOrder(order)
        processingTimerRef.current.delete(order.productOrderId)
      }, 100)

      processingTimerRef.current.set(order.productOrderId, timer)
    })
  }, [scannedOrders, processSingleOrder])

  const handleOrderScan = useCallback(
    async (scannedData: string) => {
      const now = Date.now()

      if (now - lastScanTimeRef.current < scanCooldownRef.current) {
        console.log('Scan cooldown active, ignoring')
        return
      }

      let productOrderId = scannedData.trim()
      let orderId = productOrderId

      if (scannedData.includes(':')) {
        const parts = scannedData.split(':')
        orderId = parts[0].trim()
        productOrderId = parts[1]?.trim() || orderId
      } else if (scannedData.includes('|')) {
        const parts = scannedData.split('|')
        orderId = parts[0].trim()
        productOrderId = parts[1]?.trim() || orderId
      }

      if (!productOrderId || productOrderId.length < 5) {
        toast.error('Invalid QR code. Please scan a valid order QR code.')
        return
      }

      if (isProductOrderInTable(productOrderId)) {
        console.log('Order already in table, ignoring scan:', productOrderId)
        playErrorSound()
        toast.error(`Order ${productOrderId} already scanned`)
        return
      }

      if (processingOrderRef.current.has(productOrderId)) {
        console.log('Order already being processed, ignoring:', productOrderId)
        return
      }

      lastScanTimeRef.current = now
      setCurrentScanningOrderId(orderId)

      const added = addScannedOrder(orderId, productOrderId, null, 'pending')
      if (!added) {
        setCurrentScanningOrderId(null)
        return
      }

      setTimeout(() => {
        processPendingOrders()
      }, 500)

      setTimeout(() => {
        setCurrentScanningOrderId(null)
      }, 2000)
    },
    [
      addScannedOrder,
      processPendingOrders,
      isProductOrderInTable,
      playErrorSound
    ]
  )

  const confirmSelectedScans = useCallback(async () => {
    const selectedOrders = scannedOrders.filter(
      (order) => order.checked && order.status === 'pending'
    )
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order to confirm.')
      return
    }
    setIsConfirming(true)
    const selectedOrderIdentifiers = selectedOrders
      .map((order) =>
        String(
          order.orderDetail?._id || order.productOrderId || order.orderId || ''
        ).trim()
      )
      .filter(Boolean)
    const selectedIdentifiersSet = new Set(selectedOrderIdentifiers)

    if (selectedOrderIdentifiers.length === 0) {
      setIsConfirming(false)
      toast.error('Unable to identify selected orders for confirmation.')
      return
    }

    setScannedOrders((prev) =>
      prev.map((o) => {
        const currentOrderId = String(
          o.orderDetail?._id || o.productOrderId || o.orderId || ''
        ).trim()
        return selectedIdentifiersSet.has(currentOrderId)
          ? {...o, status: 'loading'}
          : o
      })
    )

    try {
      const response = await fetch(`${BASE_URL}/order/confirm-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({orderIds: selectedOrderIdentifiers})
      })

      const payload = await response.json().catch(() => ({}))
      const resultList = Array.isArray(payload?.results) ? payload.results : []
      const successSet = new Set<string>(
        resultList
          .filter((item: any) => item?.success)
          .flatMap((item: any) => [
            String(item.orderId || '').trim(),
            String(item.productOrderId || '').trim(),
            String(item.inputIdentifier || '').trim()
          ])
          .filter(Boolean)
      )
      const resultMap = new Map<string, any>(
        resultList.flatMap((item: any) => {
          const keys = [
            String(item.orderId || '').trim(),
            String(item.productOrderId || '').trim(),
            String(item.inputIdentifier || '').trim()
          ].filter(Boolean)
          return keys.map((key) => [key, item] as [string, any])
        })
      )

      // try {
        await dispatch(
          markOrderScanAction({
            productorderIds: selectedOrders.map((order) => order.productOrderId)
          })
        ).unwrap()
      // } catch (err) {
      //   console.error('Failed to mark one or more orders as scanned:', err)
      // }

      setScannedOrders((prev) =>
        prev.map((o) => {
          const currentOrderId = String(
            o.orderDetail?._id || o.productOrderId || o.orderId || ''
          ).trim()
          if (!selectedIdentifiersSet.has(currentOrderId)) return o
          const isSuccess = successSet.has(currentOrderId)
          const currentResult = resultMap.get(currentOrderId)
          return {
            ...o,
            status: isSuccess ? 'success' : 'error',
            checked: false,
            errorMessage: isSuccess
              ? undefined
              : currentResult?.error ||
                payload?.message ||
                'Failed to confirm order',
            orderDetail: o.orderDetail
              ? ({
                  ...o.orderDetail,
                  isScanned: isSuccess ? true : o.orderDetail.isScanned,
                  scannedAt: isSuccess
                    ? new Date().toISOString()
                    : o.orderDetail.scannedAt,
                  isConfirmed: isSuccess ? true : o.orderDetail.isConfirmed,
                  confirmedAt: isSuccess
                    ? new Date().toISOString()
                    : (o.orderDetail as any).confirmedAt
                } as any)
              : null
          }
        })
      )

      const successfulResults = resultList.filter((item: any) => item?.success)
      const failedResults = resultList.filter((item: any) => !item?.success)

      if (!response.ok && successfulResults.length === 0) {
        throw new Error(payload?.message || 'Failed to confirm selected orders')
      }

      for (const result of successfulResults) {
        const ncmMeta = result?.ncm || null
        if (ncmMeta?.skipped && ncmMeta?.reason === 'inside_valley') {
          toast.success(
            'Order confirmed. Inside Valley — NCM pickup not required. Confirmation email has been sent to customer.'
          )
        } else if (ncmMeta?.success) {
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
      }

      if (failedResults.length > 0) {
        toast.error(
          `${failedResults.length} order(s) failed to confirm. Please retry.`
        )
      }

      for (const order of selectedOrders) {
        const realOrderId = String(
          order.orderDetail?._id || order.productOrderId || order.orderId || ''
        ).trim()
        if (!successSet.has(realOrderId)) continue
        scannedProductOrderIdsRef.current.add(order.productOrderId)
        const od = order.orderDetail
        if (od) {
          // --- WhatsApp message logic (existing) ---
          const phoneNumber = od.phoneNumber || '9841934343'
          const customerName = od.userId?.name || od.userId?.email || 'Customer'
          const orderId = od.productOrderId || od._id
          const productsList =
            od.products
              ?.map(
                (product, index) =>
                  `${index + 1}. ${product.productId?.name} (Qty: ${product.quantity}, Price: ${getNprPrice(product.price)})`
              )
              .join('\n') || 'No products listed'
          const totalAmount = getNprPrice(od.totalAmount)
          const shippingLocation = od.shippingLocation || od.locationAddress
          const deliveryType = od.isInsideValley
            ? 'Home Delivery (Inside Valley)'
            : 'Office Delivery (Outside Valley)'
          const paymentType =
            od.paymentMethod === 'phonepay'
              ? 'PhonePay'
              : 'Cash on Delivery (COD)'
          let locationInfo = ''
          if (od.latitude && od.longitude) {
            locationInfo = `\n📍 *Location:* https://www.google.com/maps?q=${od.latitude},${od.longitude}`
          }
          const message = `🎉 *ORDER CONFIRMED* 🎉\n\nDear ${customerName},\n\nYour order has been confirmed and is being processed!\n\n📋 *Order Details:*\nOrder ID: ${orderId}\n${productsList}\n\n💰 *Payment Summary:*\nTotal Amount: ${totalAmount}\nPayment Method: ${paymentType}\n\n🚚 *Delivery Information:*\nDelivery Type: ${deliveryType}\nAddress: ${shippingLocation}${locationInfo}\nEstimated Delivery: ${od.isInsideValley ? '1 day' : '2–5 working days'}\n\n📧 *Confirmation Email Sent:*\nWe've sent your confirmation details and invoice image by email.\n\nThank you for shopping with us! \nWe'll keep you updated on your order status.\n\nBest regards,\nAabhushan Gallery Team`
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
          window.open(whatsappUrl, '_blank')

          // --- Order update logic (new, like sendWhatsAppMessage) ---
          try {
            await dispatch(
              updateOrderByIdAction({
                id: String(od._id),
                data: {
                  isConfirmed: true,
                  confirmedAt: new Date().toISOString()
                }
              })
            )
          } catch (err) {
            // Optionally show error toast, but don't block WhatsApp
            toast.error('Failed to update order as confirmed.')
          }
        }
      }
      playSuccessSound()
    } catch (error: any) {
      setScannedOrders((prev) =>
        prev.map((o) => {
          const currentOrderId = String(
            o.orderDetail?._id || o.productOrderId || o.orderId || ''
          ).trim()
          return selectedIdentifiersSet.has(currentOrderId)
            ? {
                ...o,
                status: 'error',
                errorMessage: error.message || 'Failed to confirm scan'
              }
            : o
        })
      )
      playErrorSound()
      toast.error(error.message || 'Failed to confirm scan')
    }
    setIsConfirming(false)
  }, [scannedOrders, dispatch, playSuccessSound, playErrorSound])

  const scanBarcode = useCallback(async () => {
    if (
      !videoRef.current ||
      !detectorRef.current ||
      videoRef.current.readyState !== 4
    ) {
      if (scanning) {
        animationFrameRef.current = requestAnimationFrame(scanBarcode)
      }
      return
    }

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current)
      const now = Date.now()

      scannedBarcodesCooldownRef.current.forEach((lastSeen, code) => {
        if (now - lastSeen > BARCODE_RESURFACE_COOLDOWN) {
          scannedBarcodesCooldownRef.current.delete(code)
        }
      })

      if (barcodes.length > 0) {
        const detectedBarcode = barcodes[0]
        const scannedData = detectedBarcode.rawValue

        let productOrderId = scannedData.trim()
        if (scannedData.includes(':')) {
          const parts = scannedData.split(':')
          productOrderId = parts[1]?.trim() || parts[0].trim()
        } else if (scannedData.includes('|')) {
          const parts = scannedData.split('|')
          productOrderId = parts[1]?.trim() || parts[0].trim()
        }

        const isInCooldown = scannedBarcodesCooldownRef.current.has(scannedData)
        const isAlreadyInTable = isProductOrderInTable(productOrderId)
        const isBeingProcessed = processingOrderRef.current.has(productOrderId)

        if (!isInCooldown && !isAlreadyInTable && !isBeingProcessed) {
          scannedBarcodesCooldownRef.current.set(scannedData, now)
          console.log('Barcode detected:', {
            scannedData,
            format: detectedBarcode.format,
            timestamp: new Date().toLocaleTimeString()
          })
          handleOrderScan(scannedData)
        } else {
          if (isInCooldown) {
            scannedBarcodesCooldownRef.current.set(scannedData, now)
          }
        }
      }
    } catch (err) {
      console.error('Barcode detection error:', err)
    }

    if (scanning) {
      animationFrameRef.current = requestAnimationFrame(scanBarcode)
    }
  }, [scanning, handleOrderScan, isProductOrderInTable])

  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.target.value
    setSelectedCamera(deviceId)

    if (scanning) {
      stopCamera()
      setTimeout(() => startCamera(deviceId), 100)
    }
  }

  const clearScannedData = () => {
    if (
      scannedOrders.length > 0 &&
      !window.confirm('Are you sure you want to clear all scanned orders?')
    ) {
      return
    }
    setScannedOrders([])
    setScanCount(0)
    setCurrentPage(1)
    scannedProductOrderIdsRef.current.clear()
    orderDetailCacheRef.current.clear()
    lastScanTimeRef.current = 0
    setCurrentScanningOrderId(null)
    processingOrderRef.current.clear()
    scannedBarcodesCooldownRef.current.clear()

    processingTimerRef.current.forEach((timer) => clearTimeout(timer))
    processingTimerRef.current.clear()

    toast.success('All scanned orders cleared')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!')
    })
  }

  const removeItem = (id: string) => {
    const orderToRemove = scannedOrders.find((order) => order.id === id)
    if (orderToRemove) {
      scannedProductOrderIdsRef.current.delete(orderToRemove.productOrderId)
      orderDetailCacheRef.current.delete(orderToRemove.orderId)
      processingOrderRef.current.delete(orderToRemove.productOrderId)

      if (processingTimerRef.current.has(orderToRemove.productOrderId)) {
        clearTimeout(
          processingTimerRef.current.get(orderToRemove.productOrderId)
        )
        processingTimerRef.current.delete(orderToRemove.productOrderId)
      }
    }

    if (orderToRemove && orderToRemove.orderId === currentScanningOrderId) {
      setCurrentScanningOrderId(null)
    }

    setScannedOrders((prev) => prev.filter((item) => item.id !== id))
    toast.success('Order removed')
  }

  const toggleCheck = (id: string) => {
    setScannedOrders((prev) =>
      prev.map((order) => {
        // Prevent checking if status is 'confirmed' or 'success' (already confirmed)
        if (order.id === id && order.status === 'pending') {
          if (order.orderDetail?.isConfirmed) return order
          return {...order, checked: !order.checked}
        }
        return order
      })
    )
  }

  const toggleSelectAll = () => {
    const allChecked = scannedOrders.every(
      (order) => order.checked || order.status !== 'pending' || order.orderDetail?.isConfirmed
    )
    setScannedOrders((prev) =>
      prev.map((order) => {
        if (order.status === 'pending' && !order.orderDetail?.isConfirmed) {
          return {...order, checked: !allChecked}
        }
        return order
      })
    )
          {pagination.currentOrders.map((order, idx) => (
            <tr key={order.id}>
              {/* ...existing table cells... */}
              <td>
                <input
                  type="checkbox"
                  checked={!!order.checked}
                  disabled={order.status !== 'pending' || order.orderDetail?.isConfirmed}
                  onChange={() => toggleCheck(order.id)}
                />
              </td>
              {/* ...other table cells... */}
            </tr>
          ))}
  }

  const getProductNames = useCallback((order: ScannedOrder): string => {
    if (!order.orderDetail?.products?.length) {
      return order.isLoadingDetail ? 'Loading...' : 'No product details'
    }

    const productNames = order.orderDetail.products.map(
      (product) => product.productId?.name || product.name || 'Unknown Product'
    )

    if (productNames.length === 0) return 'No products'
    if (productNames.length === 1) return productNames[0]

    return `${productNames[0]} +${productNames.length - 1} more`
  }, [])

  const getProductMedia = useCallback(
    (
      order: ScannedOrder
    ): {
      type: 'image' | 'video' | null
      url: string | null
      videoUrl?: string
    } => {
      if (!order.orderDetail?.products?.[0]?.productId)
        return {type: null, url: null}

      const product = order.orderDetail.products[0].productId

      // Check for images first (images array might be empty)
      const hasImages = product.images && product.images.length > 0

      if (hasImages && product.images[0]?.coloredImage) {
        return {
          type: 'image',
          url: resolveProductImageUrl(product.images[0].coloredImage)
        }
      }

      // If no images, check for video
      if (product.video) {
        const videoUrl = resolveProductVideoUrl(product.video)
        return {
          type: 'video',
          url: videoUrl,
          videoUrl: videoUrl
        }
      }

      return {type: null, url: null}
    },
    [resolveProductImageUrl, resolveProductVideoUrl]
  )

  const getProductCount = useCallback((order: ScannedOrder): number => {
    if (!order.orderDetail?.products?.length) return 0

    return order.orderDetail.products.reduce(
      (total, product) => total + (product.quantity || 1),
      0
    )
  }, [])

  const getTotalAmount = useCallback((order: ScannedOrder): number => {
    if (!order.orderDetail?.totalAmount) return 0
    return order.orderDetail.totalAmount
  }, [])

  const getShippingCharge = useCallback((order: ScannedOrder): number => {
    if (!order.orderDetail?.shippingPrice) return 0
    return order.orderDetail.shippingPrice
  }, [])

  const getGiftBoxCharge = useCallback((order: ScannedOrder): number => {
    if (!order.orderDetail?.giftBoxCharge) return 0
    return order.orderDetail.giftBoxCharge
  }, [])

  const loadAnalyticsData = useCallback(() => {
    dispatch(getSalesAnalyticsAction(analyticsPeriod))
  }, [dispatch, analyticsPeriod])

  const formatSalesData = useCallback(() => {
    if (!salesData) return []

    return salesData.map((item) => {
      let name = ''
      if (analyticsPeriod === 'daily') {
        name = `${item._id.day}/${item._id.month}/${item._id.year}`
      } else if (analyticsPeriod === 'weekly') {
        name = `Week ${item._id.week}, ${item._id.year}`
      } else if (analyticsPeriod === 'yearly') {
        name = `${item._id.year}`
      } else {
        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
        name = `${monthNames[(item._id.month || 1) - 1]} ${item._id.year}`
      }

      return {
        name,
        sales: item.totalSales,
        orders: item.orderCount,
        items: item.totalItems,
        revenue: item.totalSales
      }
    })
  }, [salesData, analyticsPeriod])

  const formatTopProductsData = useCallback(() => {
    if (!topProducts) return []

    return topProducts.map((item) => ({
      name: item?.name || 'Unknown Product',
      value: item.totalQuantity,
      revenue: item.totalRevenue
    }))
  }, [topProducts])

  const orderStats = useMemo(() => {
    return scannedOrders.reduce(
      (stats, order) => {
        if (order.status === 'success' && order.orderDetail) {
          stats.totalAmount += getTotalAmount(order)
          stats.totalProducts += getProductCount(order)
          stats.totalShipping += getShippingCharge(order)
          stats.totalGiftBox += getGiftBoxCharge(order)
          stats.scannedOrders++
          if (order.orderDetail.isScanned) {
            stats.fulfilledOrders++
          }
        }
        return stats
      },
      {
        totalAmount: 0,
        totalProducts: 0,
        totalShipping: 0,
        totalGiftBox: 0,
        scannedOrders: 0,
        fulfilledOrders: 0
      }
    )
  }, [
    scannedOrders,
    getTotalAmount,
    getProductCount,
    getShippingCharge,
    getGiftBoxCharge
  ])

  const pagination = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentOrders = scannedOrders.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(scannedOrders.length / itemsPerPage)

    return {indexOfLastItem, indexOfFirstItem, currentOrders, totalPages}
  }, [scannedOrders, currentPage, itemsPerPage])

  const nextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const selectedOrdersCount = useMemo(
    () => scannedOrders.filter((order) => order.checked).length,
    [scannedOrders]
  )

  const pendingOrdersCount = useMemo(
    () => scannedOrders.filter((order) => order.status === 'pending').length,
    [scannedOrders]
  )

  useEffect(() => {
    const initialize = async () => {
      if (checkBrowserSupport()) {
        await initializeBarcodeDetector()
        await getCameras()
      }
    }

    initialize()

    return () => {
      stopCamera()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      processingTimerRef.current.forEach((timer) => clearTimeout(timer))
      processingTimerRef.current.clear()
    }
  }, [checkBrowserSupport, initializeBarcodeDetector, getCameras, stopCamera])

  useEffect(() => {
    if (scanning) {
      if (fallbackMode) {
        scanWithJsQR(videoRef.current, handleOrderScan, scanning)
      } else {
        animationFrameRef.current = requestAnimationFrame(scanBarcode)
      }
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scanning, scanBarcode, fallbackMode, handleOrderScan])

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalyticsData()
    }
  }, [activeTab, loadAnalyticsData])

  useEffect(() => {
    const hasPendingOrders = scannedOrders.some(
      (order) =>
        order.status === 'pending' &&
        !order.isProcessing &&
        !processingOrderRef.current.has(order.productOrderId)
    )

    if (hasPendingOrders) {
      processPendingOrders()
    }
  }, [scannedOrders.length, processPendingOrders])

  // Setup video playback for product videos
  useEffect(() => {
    videoElementsRef.current.forEach((video, id) => {
      if (video) {
        const playPromise = video.play()
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // Auto-play was prevented, that's fine
          })
        }
      }
    })
  }, [scannedOrders])

  const handleVideoPlayClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    videoElement: HTMLVideoElement | null
  ) => {
    event.stopPropagation()
    if (!videoElement) return

    if (videoElement.paused) {
      videoElement.muted = false
      videoElement.volume = 1
      const playPromise = videoElement.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          videoElement.muted = true
        })
      }
    } else {
      videoElement.pause()
    }
  }

  const renderProductMedia = (order: ScannedOrder, videoId: string) => {
    const {type, url, videoUrl} = getProductMedia(order)

    if (!url) {
      return (
        <ProductMediaWrapper>
          <div className="no-media">No Media</div>
        </ProductMediaWrapper>
      )
    }

    if (type === 'video' && videoUrl) {
      return (
        <ProductMediaWrapper
          onClick={() => setModalMedia({type: 'video', url: videoUrl})}
        >
          <video
            ref={(el) => {
              if (el) {
                videoElementsRef.current.set(videoId, el)
                el.muted = true
                el.loop = true
                el.playsInline = true
                const playPromise = el.play()
                if (playPromise && typeof playPromise.catch === 'function') {
                  playPromise.catch(() => {
                    // Auto-play prevented
                  })
                }
              } else {
                videoElementsRef.current.delete(videoId)
              }
            }}
            src={videoUrl}
            muted
            loop
            playsInline
          />
          <div className="play-icon-overlay">
            <FiPlay size={12} />
          </div>
        </ProductMediaWrapper>
      )
    }

    return (
      <ProductMediaWrapper onClick={() => setModalMedia({type: 'image', url})}>
        <OptimizedImage src={url} alt="Product" width={400} height={300} style={{ width: '100%', height: 'auto' }} />
      </ProductMediaWrapper>
    )
  }

  const renderScannerTab = () => (
    <ScannerGrid>
      <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        <ScannerCard>
          <div style={{marginBottom: '20px'}}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}
            >
              Camera Selection:
            </label>
            <select
              value={selectedCamera}
              onChange={handleCameraChange}
              disabled={scanning}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '2px solid #e5e7eb',
                fontSize: '14px',
                backgroundColor: scanning ? '#f9fafb' : 'white',
                transition: 'border-color 0.2s ease',
                cursor: scanning ? 'not-allowed' : 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '20px'
              }}
            >
              <option value="">Default Camera</option>
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.slice(0, 8)}...`}
                </option>
              ))}
            </select>
          </div>

          <div style={{display: 'flex', gap: '12px'}}>
            <Button
              variant={scanning ? 'danger' : 'success'}
              onClick={() =>
                scanning ? stopCamera() : startCamera(selectedCamera)
              }
              style={{flex: 1}}
            >
              {scanning ? '⏹️ Stop Scanning' : '▶️ Start Scanning'}
            </Button>

            <Button
              variant="outline"
              onClick={clearScannedData}
              disabled={scannedOrders.length === 0}
              style={{flex: 1}}
            >
              🗑️ Clear All
            </Button>
          </div>
        </ScannerCard>

        <ScannerCard>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b'
            }}
          >
            Camera Preview
          </h3>

          <CameraPreview>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                display: scanning ? 'block' : 'none',
                position: 'relative'
              }}
              muted
              playsInline
            />

            {!scanning && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                  color: '#9ca3af',
                  fontSize: '16px',
                  gap: '12px'
                }}
              >
                <div style={{fontSize: '64px'}}>📷</div>
                <div style={{textAlign: 'center'}}>
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '18px',
                      marginBottom: '4px'
                    }}
                  >
                    Camera Offline
                  </div>
                  <div style={{fontSize: '14px'}}>
                    Click "Start Scanning" to begin
                  </div>
                </div>
              </div>
            )}

            {scanning && <ScanOverlay />}
          </CameraPreview>

          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              background: scanning
                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                : '#f8fafc',
              borderRadius: '10px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: scanning ? '#065f46' : '#6b7280',
              border: `2px solid ${scanning ? '#10b981' : '#e5e7eb'}`
            }}
          >
            {scanning
              ? '🔍 Scanning for order barcodes...'
              : '⏸️ Scanner paused'}
            {currentScanningOrderId && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#1e40af'
                }}
              >
                Last scanned: {currentScanningOrderId}
              </div>
            )}
          </div>
        </ScannerCard>

        {error && (
          <div
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: '#991b1b',
              border: '2px solid #fca5a5',
              borderRadius: '12px',
              fontSize: '14px'
            }}
          >
            <div
              style={{
                fontWeight: '700',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⚠️</span>
              <span>Error</span>
            </div>
            {error}
          </div>
        )}
      </div>

      <TableContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f1f5f9'
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b'
              }}
            >
              Scanned Orders ({scannedOrders.length})
            </h3>
            {pendingOrdersCount > 0 && (
              <div
                style={{
                  fontSize: '14px',
                  color: '#3b82f6',
                  marginTop: '4px',
                  fontWeight: '500'
                }}
              >
                {pendingOrdersCount} pending • {selectedOrdersCount} selected
              </div>
            )}
          </div>

          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              style={{
                padding: '8px 12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>

        {pendingOrdersCount > 0 && (
          <div
            style={{
              marginBottom: '20px',
              padding: '20px',
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '2px solid #bae6fd',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div
                style={{fontSize: '15px', color: '#0369a1', fontWeight: '600'}}
              >
                {selectedOrdersCount} of {pendingOrdersCount} pending order(s)
                selected
              </div>
              {selectedOrdersCount > 0 &&
                selectedOrdersCount < pendingOrdersCount && (
                  <button
                    onClick={toggleSelectAll}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: '#3b82f6',
                      border: '2px solid #3b82f6',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Select All Pending
                  </button>
                )}
            </div>

            <Button
              variant="success"
              onClick={confirmSelectedScans}
              disabled={selectedOrdersCount === 0 || isConfirming || scannedOrders.some(order => order.checked && order.orderDetail?.isConfirmed)}
              style={{minWidth: '180px'}}
            >
              {isConfirming ? (
                <>
                  <LoadingSpinner />
                  Confirming...
                </>
              ) : (
                <>
                  <span style={{fontSize: '16px'}}>✅</span>
                  Confirm ({selectedOrdersCount})
                </>
              )}
            </Button>
          </div>
        )}

        {scannedOrders.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#9ca3af',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                fontSize: '72px',
                marginBottom: '24px',
                opacity: 0.5
              }}
            >
              📋
            </div>
            <div
              style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}
            >
              No orders scanned yet
            </div>
            <div style={{fontSize: '14px'}}>
              Start scanning to see orders here
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                overflow: 'auto',
                flex: 1,
                marginBottom: '20px',
                borderRadius: '8px'
              }}
            >
              <Table>
                <thead>
                  <tr>
                    <th style={{width: '50px'}}>
                      <input
                        type="checkbox"
                        checked={
                          scannedOrders.length > 0 &&
                          scannedOrders
                            .filter((o) => o.status === 'pending')
                            .every((order) => order.checked)
                        }
                        onChange={toggleSelectAll}
                        disabled={pendingOrdersCount === 0}
                        style={{
                          cursor:
                            pendingOrdersCount > 0 ? 'pointer' : 'not-allowed',
                          transform: 'scale(1.2)'
                        }}
                      />
                    </th>
                    <th style={{width: '220px'}}>Product Details</th>
                    <th>Order Information</th>
                    <th style={{width: '120px'}}>Status</th>
                    <th style={{width: '130px'}}>Charges</th>
                    <th style={{width: '100px'}}>Amount</th>
                    <th style={{width: '100px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.currentOrders.map((order, idx) => {
                    const videoId = `product-video-${order.id}`
                    return (
                      <tr key={order.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={order.checked || false}
                            onChange={() => toggleCheck(order.id)}
                            disabled={order.status !== 'pending'}
                            style={{
                              cursor:
                                order.status === 'pending'
                                  ? 'pointer'
                                  : 'not-allowed',
                              transform: 'scale(1.2)'
                            }}
                          />
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            }}
                          >
                            {renderProductMedia(order, videoId)}
                            <div>
                              <div
                                style={{
                                  fontWeight: '600',
                                  color: '#1e293b',
                                  fontSize: '13px',
                                  lineHeight: '1.3',
                                  marginBottom: '4px'
                                }}
                              >
                                {getProductNames(order)}
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#64748b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <span>🛒 {getProductCount(order)} item(s)</span>
                                {order.orderDetail?.products?.[0]?.productId
                                  ?.discountedPrice && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      💰 NPR{' '}
                                      {
                                        order.orderDetail.products[0].productId
                                          .discountedPrice
                                      }
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{fontSize: '12px', lineHeight: '1.5'}}>
                            <div style={{marginBottom: '4px'}}>
                              <strong style={{color: '#475569'}}>
                                Order ID:
                              </strong>{' '}
                              <span
                                style={{
                                  color: '#3b82f6',
                                  fontWeight: '500',
                                  fontFamily: 'monospace',
                                  fontSize: '11px'
                                }}
                              >
                                {order.orderDetail?.productOrderId ||
                                  order.orderId}
                              </span>
                            </div>
                            <div style={{marginBottom: '4px'}}>
                              <strong style={{color: '#475569'}}>
                                Customer:
                              </strong>{' '}
                              <span style={{color: '#1e293b'}}>
                                {order.orderDetail?.userId?.name || 'Unknown'}
                              </span>
                            </div>
                            <div style={{marginBottom: '4px'}}>
                              <strong style={{color: '#475569'}}>Phone:</strong>{' '}
                              <span
                                style={{color: '#1e293b', fontWeight: '500'}}
                              >
                                {order.orderDetail?.phoneNumber || '-'}
                              </span>
                            </div>
                            <div style={{marginBottom: '4px'}}>
                              <strong style={{color: '#475569'}}>
                                Delivery:
                              </strong>{' '}
                              <span
                                style={{
                                  color: order.orderDetail?.isHomeDelivery
                                    ? '#059669'
                                    : '#d97706',
                                  fontWeight: '500'
                                }}
                              >
                                {order.orderDetail?.isHomeDelivery
                                  ? 'Home Delivery'
                                  : 'Pickup'}
                              </span>
                            </div>
                            {order.orderDetail?.includeGiftBox && (
                              <div style={{marginBottom: '4px'}}>
                                <strong style={{color: '#475569'}}>
                                  Gift Box:
                                </strong>{' '}
                                <span
                                  style={{color: '#8b5cf6', fontWeight: '500'}}
                                >
                                  Included
                                </span>
                              </div>
                            )}
                            <div
                              style={{
                                fontSize: '11px',
                                color: '#94a3b8',
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              <span>🕒 {order.timestamp}</span>
                              {order.orderDetail?.paymentMethod && (
                                <span>• {order.orderDetail.paymentMethod}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <StatusBadge status={order.status}>
                              {order.status === 'loading' && '🔄 '}
                              {order.status === 'success' && '✅ '}
                              {order.status === 'pending' && '⏳ '}
                              {order.status === 'error' && '❌ '}
                              {order.status.toUpperCase()}
                            </StatusBadge>

                            {order.isLoadingDetail && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#f59e0b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <LoadingSpinner
                                  style={{width: '12px', height: '12px'}}
                                />
                                Loading details...
                              </div>
                            )}

                            {order.status === 'error' && order.errorMessage && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#ef4444',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {order.errorMessage}
                              </div>
                            )}

                            {order.orderDetail?.isScanned && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#059669',
                                  fontWeight: '500'
                                }}
                              >
                                ✅ Confirmed
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{fontSize: '12px', lineHeight: '1.5'}}>
                            {getShippingCharge(order) > 0 && (
                              <div style={{marginBottom: '4px'}}>
                                <strong style={{color: '#475569'}}>
                                  Delivery:
                                </strong>{' '}
                                <span style={{color: '#1e293b'}}>
                                  NPR {getShippingCharge(order).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {getGiftBoxCharge(order) > 0 && (
                              <div style={{marginBottom: '4px'}}>
                                <strong style={{color: '#475569'}}>
                                  Gift Box:
                                </strong>{' '}
                                <span style={{color: '#1e293b'}}>
                                  NPR {getGiftBoxCharge(order).toFixed(2)}
                                </span>
                              </div>
                            )}
                            {order.orderDetail?.includeGiftBox &&
                              getGiftBoxCharge(order) === 0 && (
                                <div style={{marginBottom: '4px'}}>
                                  <strong style={{color: '#475569'}}>
                                    Gift Box:
                                  </strong>{' '}
                                  <span
                                    style={{
                                      color: '#8b5cf6',
                                      fontWeight: '500'
                                    }}
                                  >
                                    Free Included
                                  </span>
                                </div>
                              )}
                            {getShippingCharge(order) === 0 &&
                              !order.orderDetail?.includeGiftBox &&
                              getGiftBoxCharge(order) === 0 && (
                                <span
                                  style={{color: '#9ca3af', fontSize: '11px'}}
                                >
                                  No extra charges
                                </span>
                              )}
                          </div>
                        </td>
                        <td>
                          <div style={{textAlign: 'right'}}>
                            <div
                              style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#059669'
                              }}
                            >
                              NPR {getTotalAmount(order).toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            <Button
                              variant="outline"
                              onClick={() => copyToClipboard(order.orderId)}
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <FiCopy size={14} />
                              Copy
                            </Button>

                            <Button
                              variant="danger"
                              onClick={() => removeItem(order.id)}
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <FiTrash2 size={14} />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderTop: '2px solid #e2e8f0'
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}
                >
                  Showing {pagination.indexOfFirstItem + 1}-
                  {Math.min(pagination.indexOfLastItem, scannedOrders.length)}{' '}
                  of {scannedOrders.length} orders
                </div>
                <div
                  style={{display: 'flex', gap: '12px', alignItems: 'center'}}
                >
                  <Button
                    variant="outline"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    style={{padding: '8px 16px'}}
                  >
                    ← Previous
                  </Button>

                  <div style={{display: 'flex', gap: '4px'}}>
                    {Array.from(
                      {length: Math.min(5, pagination.totalPages)},
                      (_, i) => {
                        let pageNum
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor:
                                currentPage === pageNum
                                  ? '#3b82f6'
                                  : 'transparent',
                              color:
                                currentPage === pageNum ? 'white' : '#64748b',
                              border: `2px solid ${currentPage === pageNum ? '#3b82f6' : '#e5e7eb'}`,
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight:
                                currentPage === pageNum ? '600' : '500',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {pageNum}
                          </button>
                        )
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={nextPage}
                    disabled={currentPage === pagination.totalPages}
                    style={{padding: '8px 16px'}}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </TableContainer>

      {/* Modal for fullscreen image/video */}
      {modalMedia && (
        <Modal onClick={() => setModalMedia(null)}>
          {modalMedia.type === 'video' ? (
            <video
              src={modalMedia.url}
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
              <Image
                src={modalMedia.url}
                alt="Fullscreen product"
                fill
                style={{ objectFit: 'contain' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </Modal>
      )}
    </ScannerGrid>
  )

  const renderAnalyticsTab = () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
      <ScannerCard>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b'
            }}
          >
            📈 Sales Analytics Dashboard
          </h3>

          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <select
              value={analyticsPeriod}
              onChange={(e) => setAnalyticsPeriod(e.target.value as any)}
              style={{
                padding: '10px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '14px',
                backgroundColor: 'white',
                fontWeight: '500',
                minWidth: '140px',
                cursor: 'pointer'
              }}
            >
              <option value="daily">📅 Daily</option>
              <option value="weekly">🗓️ Weekly</option>
              <option value="monthly">📊 Monthly</option>
              <option value="yearly">📈 Yearly</option>
            </select>

            <Button
              variant="primary"
              onClick={loadAnalyticsData}
              disabled={scanLoading}
              style={{minWidth: '140px'}}
            >
              {scanLoading ? (
                <>
                  <LoadingSpinner />
                  Loading...
                </>
              ) : (
                '🔄 Refresh'
              )}
            </Button>
          </div>
        </div>
      </ScannerCard>

      <StatsGrid>
        {[
          {
            title: 'Total Scanned',
            value: scannedOrders.length,
            color: '#3b82f6',
            icon: '📱'
          },
          {
            title: 'Total Revenue',
            value: `NPR ${orderStats.totalAmount.toFixed(2)}`,
            color: '#059669',
            icon: '💰'
          },
          {
            title: 'Products Sold',
            value: orderStats.totalProducts,
            color: '#8b5cf6',
            icon: '🛒'
          },
          {
            title: 'Fulfillment Rate',
            value: `${orderStats.scannedOrders > 0 ? ((orderStats.fulfilledOrders / orderStats.scannedOrders) * 100).toFixed(1) : 0}%`,
            color: '#f59e0b',
            icon: '✅'
          }
        ].map((stat, index) => (
          <ScannerCard key={index}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  marginBottom: '12px',
                  background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}40 100%)`,
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#64748b',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}
              >
                {stat.title}
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: stat.color,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {stat.value}
              </div>
            </div>
          </ScannerCard>
        ))}
      </StatsGrid>

      <ChartsGrid>
        <ScannerCard>
          <h4
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b'
            }}
          >
            📈 Sales Trend
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formatSalesData()}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                formatter={(value) => [
                  `NPR ${Number(value).toLocaleString()}`,
                  'Revenue'
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ScannerCard>

        <ScannerCard>
          <h4
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b'
            }}
          >
            📊 Orders & Items
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatSalesData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Bar
                dataKey="orders"
                fill="#82ca9d"
                name="Orders"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="items"
                fill="#8884d8"
                name="Items"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ScannerCard>

        <ScannerCard>
          <h4
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b'
            }}
          >
            🏆 Top Selling Products
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatTopProductsData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {formatTopProductsData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [value, 'Quantity']}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ScannerCard>

        <ScannerCard>
          <h4
            style={{
              margin: '0 0 20px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b'
            }}
          >
            💰 Revenue by Product
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatTopProductsData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                formatter={(value) => [
                  `NPR ${Number(value).toLocaleString()}`,
                  'Revenue'
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="revenue" fill="#ff8042" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ScannerCard>
      </ChartsGrid>
    </div>
  )

  return (
    <PageContainer>
      <div>
        <TabContainer>
          <button
            onClick={() => setActiveTab('scanner')}
            style={{
              padding: '16px 32px',
              background:
                activeTab === 'scanner'
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'white',
              color: activeTab === 'scanner' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              flex: 1,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow:
                activeTab === 'scanner'
                  ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                  : '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <span style={{fontSize: '20px'}}>📱</span>
            Scanner Mode
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '16px 32px',
              background:
                activeTab === 'analytics'
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'white',
              color: activeTab === 'analytics' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '700',
              flex: 1,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow:
                activeTab === 'analytics'
                  ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                  : '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <span style={{fontSize: '20px'}}>📈</span>
            Analytics Dashboard
          </button>
        </TabContainer>

        {activeTab === 'scanner' ? renderScannerTab() : renderAnalyticsTab()}
      </div>

      <style>
        {`
          @keyframes scan {
            0% { transform: translateY(-100px); }
            50% { transform: translateY(200px); }
            100% { transform: translateY(500px); }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          select:focus, button:focus {
            outline: none;
            ring: 2px solid rgba(59, 130, 246, 0.5);
          }
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 2px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
            
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }


          video{
          position:relative !important;
          }
        `}
      </style>
    </PageContainer>
  )
}

export default QRScanner
