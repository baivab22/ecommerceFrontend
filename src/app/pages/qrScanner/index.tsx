import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { getOrderDetailByIdAction } from '../products/product.slice';
import { 
  markOrderScanAction, 
  // bulkMarkAction,
  getSalesAnalyticsAction 
} from './qrScanner.slice';
import { useDispatch, useSelector } from 'src/store';
import toast from 'react-hot-toast'
import styled from 'styled-components';
import { BASE_URL, FILE_URL } from 'src/config';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  & > div {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }
`;

const ScannerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

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
`;

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
`;

const TabContainer = styled.div`
  margin-bottom: 32px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 8px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ScannerCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const StatusBadge = styled.span<{ status: 'pending' | 'success' | 'error' | 'loading' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ status }) => {
    switch (status) {
      case 'success':
        return 'background-color: #d1fae5; color: #065f46;';
      case 'loading':
        return 'background-color: #fef3c7; color: #92400e;';
      case 'pending':
        return 'background-color: #dbeafe; color: #1e40af;';
      case 'error':
        return 'background-color: #fee2e2; color: #991b1b;';
      default:
        return 'background-color: #f3f4f6; color: #4b5563;';
    }
  }}
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'success' | 'outline' }>`
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
  
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-1px);
          }
        `;
      case 'success':
        return `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          &:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          &:hover {
            background: #eff6ff;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 800px;
  overflow: hidden;
`;

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
`;

const ProductImage = styled.div<{ imageUrl?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${({ imageUrl }) => imageUrl ? `url(${imageUrl})` : '#f3f4f6'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 10px;
`;

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
`;

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
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  colorName?: string;
  quantity: number;
  productId?: {
    _id: string;
    name: string;
    description: string;
    images: Array<{
      _id: string;
      colorName: string;
      coloredImage: string;
    }>;
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: number;
  };
}

interface OrderDetail {
  _id: string;
  orderId: string;
  userId: {
    name: string;
    email: string;
  };
  products: Product[];
  isInsideValley: boolean;
  OrderedAt: string;
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
  productOrderId: string;
  date: string;
  shippingPrice: number;
  totalAmount: number;
  phoneNumber: string;
  isHomeDelivery: boolean;
  shippingLocation: string;
  paymentMethod: string;
  isScanned: boolean;
  scannedAt?: string;
  orderStatus?: string;
}

interface ScannedOrder {
  id: string;
  orderId: string;
  productOrderId: string;
  orderDetail: OrderDetail | null;
  timestamp: string;
  date: string;
  status: 'pending' | 'success' | 'error' | 'loading';
  errorMessage?: string;
  checked?: boolean;
  isLoadingDetail?: boolean;
}

interface AnalyticsData {
  salesData: Array<{
    _id: { year: number; month?: number; day?: number; week?: number };
    totalSales: number;
    orderCount: number;
    totalItems: number;
  }>;
  topProducts: Array<{
    _id: string;
    totalQuantity: number;
    totalRevenue: number;
    productDetails: Array<{
      name: string;
      images: Array<{ coloredImage: string }>;
    }>;
  }>;
  period: string;
}

interface BarcodeDetector {
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}

interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number }[];
  format: string;
  rawValue: string;
}

interface BarcodeFormat {
  format: string;
}

declare var BarcodeDetector: {
  prototype: BarcodeDetector;
  new (options?: { formats: string[] }): BarcodeDetector;
  getSupportedFormats(): Promise<string[]>;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const QRScanner = () => {
  // const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const { orderDetailData, orderDetailLoading } = useSelector(
    (state: any) => state.product
  );
  const { salesData, topProducts, loading: scanLoading } = useSelector(
    (state: any) => state.scan
  );

  const dispatch=useDispatch()

  // State management
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [scannedOrders, setScannedOrders] = useState<ScannedOrder[]>([]);
  const [error, setError] = useState('');
  const [supportedFormats, setSupportedFormats] = useState<BarcodeFormat[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const [currentScanningOrderId, setCurrentScanningOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<'scanner' | 'analytics'>('scanner');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Refs for preventing duplicate scans and API calls
  const scannedProductOrderIdsRef = useRef<Set<string>>(new Set());
  const lastScanTimeRef = useRef<number>(0);
  const scanCooldownRef = useRef<number>(3000);
  const processingOrderRef = useRef<string | null>(null);
  const orderDetailCacheRef = useRef<Map<string, OrderDetail>>(new Map());

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sound functions
  const playSuccessSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (err) {
      console.log('Audio playback failed:', err);
    }
  }, []);

  const playErrorSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = 400;
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    } catch (err) {
      console.log('Error sound playback failed:', err);
    }
  }, []);

  // Check browser support
  const checkBrowserSupport = useCallback(() => {
    if (!('BarcodeDetector' in window)) {
      setError('Barcode Detection API not supported in this browser. Please use Chrome, Edge, or Opera.');
      return false;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera access not supported in this browser.');
      return false;
    }

    return true;
  }, []);

  // Initialize barcode detector
  const initializeBarcodeDetector = useCallback(async () => {
    try {
      const formats = await (BarcodeDetector as any).getSupportedFormats();
      setSupportedFormats(formats);
      detectorRef.current = new (BarcodeDetector as any)({ formats });
    } catch (err) {
      console.error('BarcodeDetector initialization failed:', err);
      setError('Failed to initialize barcode detector.');
    }
  }, []);

  // Get available cameras
  const getCameras = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setCameras(videoDevices);
      
      if (videoDevices.length > 0) {
        const rearCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(rearCamera ? rearCamera.deviceId : videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setError('Failed to access camera devices.');
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (deviceId = '') => {
    if (!checkBrowserSupport()) return;

    try {
      setError('');
      
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: deviceId ? undefined : 'environment'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setScanning(true);
    } catch (err: any) {
      console.error('Error starting camera:', err);
      setError(`Camera error: ${err.message}`);
      setScanning(false);
    }
  }, [checkBrowserSupport]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
    setCurrentScanningOrderId(null);
    processingOrderRef.current = null;
  }, []);

  // Fetch order details by ID
  const fetchOrderDetail = useCallback(async (orderId: string, productOrderId: string) => {
    // Check cache first
    if (orderDetailCacheRef.current.has(orderId)) {
      return orderDetailCacheRef.current.get(orderId)!;
    }

          if(!orderDetailLoading){    try {

      const result = await dispatch(getOrderDetailByIdAction({orderId})).unwrap();
      if (result.success && result.data) {
        //@ts-ignore
        orderDetailCacheRef.current.set(orderId, result.data);
        return result.data;
      }

      //@ts-ignore
      throw new Error(result.message || 'Failed to fetch order details');
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      throw error;
    }}


  }, [dispatch]);

  // Check if productOrderId is already in the table
  const isProductOrderInTable = useCallback((productOrderId: string): boolean => {
    return scannedOrders.some(order => order.productOrderId === productOrderId);
  }, [scannedOrders]);

  // Add scanned order to table with duplicate prevention
  const addScannedOrder = useCallback((orderId: string, productOrderId: string, orderDetail: OrderDetail | null = null, status: 'pending' | 'success' | 'error' | 'loading' = 'pending', errorMessage?: string) => {
    // Check if this productOrderId is already in the table
    if (isProductOrderInTable(productOrderId)) {
      console.log('Product order already in table, skipping:', productOrderId);
      playErrorSound();
      toast.error(`Order ${productOrderId} already scanned`);
      return false;
    }

    const newOrder: ScannedOrder = {
      id: Date.now().toString(),
      orderId,
      productOrderId,
      orderDetail,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString(),
      status: status,
      errorMessage,
      checked: false,
      isLoadingDetail: status === 'pending'
    };
    
    setScannedOrders(prev => [newOrder, ...prev]);
    setScanCount(prev => prev + 1);
    
    if (status === 'success') {
      playSuccessSound();
      toast.success(`Order ${productOrderId} confirmed!`);
    } else if (status === 'error') {
      playErrorSound();
    }

    return true;
  }, [playSuccessSound, playErrorSound, isProductOrderInTable]);

  // Process pending order details
  const processPendingOrderDetails = useCallback(async () => {
    const pendingOrders = scannedOrders.filter(order => order.isLoadingDetail && order.status === 'pending');
    
    for (const order of pendingOrders) {
      try {
        // Update status to loading
        setScannedOrders(prev => prev.map(o => 
          o.id === order.id ? { ...o, isLoadingDetail: true } : o
        ));

        // Fetch order details
        const orderDetail = await fetchOrderDetail(order.orderId, order.productOrderId);
        
        // Update order with details
        //@ts-ignore
        setScannedOrders(prev => prev.map(o => 
          o.id === order.id ? { 
            ...o, 
            orderDetail, 
            status: 'pending', 
            isLoadingDetail: false,
            // Update orderId with actual orderId from details if available
            //@ts-ignore
            orderId: orderDetail.orderId || o.orderId
          } : o
        ));

        console.log('Order details fetched successfully:', order.productOrderId);
        
      } catch (error: any) {
        console.error('Failed to fetch order details:', error);
        
        setScannedOrders(prev => prev.map(o => 
          o.id === order.id ? { 
            ...o, 
            status: 'error', 
            errorMessage: error.message || 'Failed to fetch order details',
            isLoadingDetail: false 
          } : o
        ));
        
        toast.error(`Failed to load order ${order.productOrderId}`);
      }
    }
  }, [scannedOrders, fetchOrderDetail]);

  // Handle order scanning with duplicate prevention and cooldown
  const handleOrderScan = useCallback(async (scannedData: string) => {
    const now = Date.now();
    
    // Check cooldown
    if (now - lastScanTimeRef.current < scanCooldownRef.current) {
      console.log('Scan cooldown active, skipping scan');
      return;
    }

    // Check if we're already processing an order
    if (processingOrderRef.current) {
      console.log('Already processing an order, skipping scan');
      return;
    }

    // Parse the scanned data
    let productOrderId = scannedData.trim();
    let orderId = productOrderId;

    // Try to extract orderId and productOrderId from different formats
    if (scannedData.includes(':')) {
      const parts = scannedData.split(':');
      orderId = parts[0].trim();
      productOrderId = parts[1]?.trim() || orderId;
    } else if (scannedData.includes('|')) {
      const parts = scannedData.split('|');
      orderId = parts[0].trim();
      productOrderId = parts[1]?.trim() || orderId;
    }

    // Validate scanned data
    if (!productOrderId || productOrderId.length < 5) {
      console.log('Invalid scanned data:', scannedData);
      toast.error('Invalid QR code. Please scan a valid order QR code.');
      return;
    }

    lastScanTimeRef.current = now;
    setCurrentScanningOrderId(orderId);
    processingOrderRef.current = orderId;
    
    try {
      // Add to pending list
      const added = addScannedOrder(orderId, productOrderId, null, 'pending');
      
      if (!added) {
        setCurrentScanningOrderId(null);
        processingOrderRef.current = null;
        return;
      }
      
      console.log('Order added to pending list:', { orderId, productOrderId });
      
      // Process pending orders in the next tick
      setTimeout(() => {
        processPendingOrderDetails();
      }, 0);
      
    } catch (err) {
      console.error('Error processing scan:', err);
      toast.error('Failed to process scanned order');
    } finally {
      // Reset processing state after a short delay
      setTimeout(() => {
        processingOrderRef.current = null;
        setCurrentScanningOrderId(null);
      }, 1000);
    }
  }, [addScannedOrder, processPendingOrderDetails]);

  // Confirm and process selected scans using bulkMarkAction
  const confirmSelectedScans = useCallback(async () => {
    const selectedOrders = scannedOrders.filter(order => order.checked && order.status === 'pending');
    
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order to confirm.');
      return;
    }

    setIsConfirming(true);

    try {
      // Extract productOrderIds from selected orders
      const productOrderIds = selectedOrders.map(order => order.productOrderId);
      
      console.log('Confirming scans with productOrderIds:', productOrderIds);

      // Update status to loading for selected orders
      setScannedOrders(prev => 
        prev.map(order => 
          order.checked && order.status === 'pending'
            ? { ...order, status: 'loading' as const }
            : order
        )
      );

      // Call bulk mark API - note: bulkMarkAction might need to be defined or imported

      const result = await dispatch(markOrderScanAction({ 
        //@ts-ignore
        productorderIds: productOrderIds 
      })).unwrap();
      
      console.log('Bulk mark result:', result);

      if ((result as any).success) {
        // Update all selected orders to success status
        setScannedOrders(prev => 
          prev.map(order => 
            order.checked && order.status === 'loading'
              ? { 
                  ...order, 
                  status: 'success' as const,
                  checked: false, // Uncheck after successful confirmation
                  orderDetail: order.orderDetail ? {
                    ...order.orderDetail,
                    isScanned: true,
                    scannedAt: new Date().toISOString()
                  } : null
                }
              : order
          )
        );
        
        // Add successful productOrderIds to the ref to prevent future duplicates
        selectedOrders.forEach(order => {
          scannedProductOrderIdsRef.current.add(order.productOrderId);
        });
        
        playSuccessSound();
        toast.success(`Successfully confirmed ${selectedOrders.length} order(s)!`);
      } else {
        throw new Error((result as any).message || 'Failed to confirm scans');
      }
      
    } catch (error: any) {
      console.error('Error confirming scans:', error);
      
      // Update all selected orders to error status
      setScannedOrders(prev => 
        prev.map(order => 
          order.checked && order.status === 'loading'
            ? { 
                ...order, 
                status: 'error' as const,
                errorMessage: error.message || 'Failed to confirm scan'
              }
            : order
        )
      );
      
      playErrorSound();
      toast.error('Failed to confirm some orders. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  }, [scannedOrders, dispatch, playSuccessSound, playErrorSound]);

  // Scan for barcodes
  const scanBarcode = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current || videoRef.current.readyState !== 4) {
      if (scanning) {
        animationFrameRef.current = requestAnimationFrame(scanBarcode);
      }
      return;
    }

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);
      
      if (barcodes.length > 0) {
        const detectedBarcode = barcodes[0];
        const scannedData = detectedBarcode.rawValue;
        
        console.log('Barcode detected:', {
          scannedData,
          format: detectedBarcode.format,
          timestamp: new Date().toLocaleTimeString()
        });
        
        handleOrderScan(scannedData);
      }
    } catch (err) {
      console.error('Barcode detection error:', err);
    }

    if (scanning) {
      animationFrameRef.current = requestAnimationFrame(scanBarcode);
    }
  }, [scanning, handleOrderScan]);

  // Handle camera change
  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.target.value;
    setSelectedCamera(deviceId);
    
    if (scanning) {
      stopCamera();
      setTimeout(() => startCamera(deviceId), 100);
    }
  };

  // Clear all scanned data
  const clearScannedData = () => {
    if (scannedOrders.length > 0 && !window.confirm('Are you sure you want to clear all scanned orders?')) {
      return;
    }
    
    setScannedOrders([]);
    setScanCount(0);
    setCurrentPage(1);
    scannedProductOrderIdsRef.current.clear();
    orderDetailCacheRef.current.clear();
    lastScanTimeRef.current = 0;
    setCurrentScanningOrderId(null);
    processingOrderRef.current = null;
    toast.success('All scanned orders cleared');
  };

  // Copy result to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    });
  };

  // Remove single item
  const removeItem = (id: string) => {
    const orderToRemove = scannedOrders.find(order => order.id === id);
    if (orderToRemove) {
      scannedProductOrderIdsRef.current.delete(orderToRemove.productOrderId);
      orderDetailCacheRef.current.delete(orderToRemove.orderId);
    }
    
    // Also clear processing state if this was the current order
    if (orderToRemove && orderToRemove.orderId === currentScanningOrderId) {
      setCurrentScanningOrderId(null);
      processingOrderRef.current = null;
    }
    
    setScannedOrders(prev => prev.filter(item => item.id !== id));
    toast.success('Order removed');
  };

  // Toggle checkbox for individual order
  const toggleCheck = (id: string) => {
    setScannedOrders(prev =>
      prev.map(order =>
        order.id === id && order.status === 'pending'
          ? { ...order, checked: !order.checked }
          : order
      )
    );
  };

  // Toggle select all checkboxes
  const toggleSelectAll = () => {
    const allChecked = scannedOrders.every(order => order.checked || order.status !== 'pending');
    setScannedOrders(prev =>
      prev.map(order => ({
        ...order,
        checked: !allChecked && order.status === 'pending'
      }))
    );
  };

  // Get product names for display
  const getProductNames = useCallback((order: ScannedOrder): string => {
    if (!order.orderDetail?.products?.length) {
      return order.isLoadingDetail ? 'Loading...' : 'No product details';
    }
    
    const productNames = order.orderDetail.products.map(product => 
      product.productId?.name || product.name || 'Unknown Product'
    );
    
    if (productNames.length === 0) return 'No products';
    if (productNames.length === 1) return productNames[0];
    
    return `${productNames[0]} +${productNames.length - 1} more`;
  }, []);

  // Get first product image
  const getFirstProductImage = useCallback((order: ScannedOrder): string | null => {
    if (!order.orderDetail?.products?.[0]) return null;
    
    const product = order.orderDetail.products[0];
    
    // Try productId images first
    if (product.productId?.images?.[0]?.coloredImage) {
      return `${FILE_URL}/products/${product.productId.images[0].coloredImage}`;
    }
    
    // Fallback to any other image property
    if ((product as any).image) {
      return `${FILE_URL}/products/${(product as any).image}`;
    }
    
    return null;
  }, []);

  // Get product count
  const getProductCount = useCallback((order: ScannedOrder): number => {
    if (!order.orderDetail?.products?.length) return 0;
    
    return order.orderDetail.products.reduce((total, product) => 
      total + (product.quantity || 1), 0
    );
  }, []);

  // Get total amount
  const getTotalAmount = useCallback((order: ScannedOrder): number => {
    if (!order.orderDetail?.totalAmount) return 0;
    
    // Include shipping price if available
    const shipping = order.orderDetail.shippingPrice || 0;
    return order.orderDetail.totalAmount ;
  }, []);

  // Load analytics data
  const loadAnalyticsData = useCallback(() => {
    dispatch(getSalesAnalyticsAction(analyticsPeriod));
  }, [dispatch, analyticsPeriod]);

  // Format sales data for charts
  const formatSalesData = useCallback(() => {
    if (!salesData) return [];

    return salesData.map(item => {
      let name = '';
      if (analyticsPeriod === 'daily') {
        name = `${item._id.day}/${item._id.month}/${item._id.year}`;
      } else if (analyticsPeriod === 'weekly') {
        name = `Week ${item._id.week}, ${item._id.year}`;
      } else if (analyticsPeriod === 'yearly') {
        name = `${item._id.year}`;
      } else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        name = `${monthNames[(item._id.month || 1) - 1]} ${item._id.year}`;
      }

      return {
        name,
        sales: item.totalSales,
        orders: item.orderCount,
        items: item.totalItems,
        revenue: item.totalSales
      };
    });
  }, [salesData, analyticsPeriod]);

  // Format top products data
  const formatTopProductsData = useCallback(() => {
    if (!topProducts) return [];

    return topProducts.map(item => ({
      name: item.productDetails[0]?.name || 'Unknown Product',
      value: item.totalQuantity,
      revenue: item.totalRevenue
    }));
  }, [topProducts]);

  // Calculate order statistics
  const orderStats = useMemo(() => {
    return scannedOrders.reduce((stats, order) => {
      if (order.status === 'success' && order.orderDetail) {
        stats.totalAmount += getTotalAmount(order);
        stats.totalProducts += getProductCount(order);
        stats.scannedOrders++;
        if (order.orderDetail.isScanned) {
          stats.fulfilledOrders++;
        }
      }
      return stats;
    }, { totalAmount: 0, totalProducts: 0, scannedOrders: 0, fulfilledOrders: 0 });
  }, [scannedOrders, getTotalAmount, getProductCount]);

  // Pagination calculations
  const pagination = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = scannedOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(scannedOrders.length / itemsPerPage);

    return { indexOfLastItem, indexOfFirstItem, currentOrders, totalPages };
  }, [scannedOrders, currentPage, itemsPerPage]);

  const nextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get selected orders count
  const selectedOrdersCount = useMemo(() => 
    scannedOrders.filter(order => order.checked).length,
    [scannedOrders]
  );

  const pendingOrdersCount = useMemo(() => 
    scannedOrders.filter(order => order.status === 'pending').length,
    [scannedOrders]
  );

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      if (checkBrowserSupport()) {
        await initializeBarcodeDetector();
        await getCameras();
      }
    };

    initialize();

    return () => {
      stopCamera();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [checkBrowserSupport, initializeBarcodeDetector, getCameras, stopCamera]);

  // Start/stop scanning when scanning state changes
  useEffect(() => {
    if (scanning) {
      animationFrameRef.current = requestAnimationFrame(scanBarcode);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scanning, scanBarcode]);

  // Load analytics when tab changes
  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalyticsData();
    }
  }, [activeTab, loadAnalyticsData]);

  // Process pending orders when orders change
  useEffect(() => {
    const pendingCount = scannedOrders.filter(o => o.isLoadingDetail).length;
    if (pendingCount > 0) {
      processPendingOrderDetails();
    }
  }, [scannedOrders, processPendingOrderDetails]);

  // Render Scanner Tab
  const renderScannerTab = () => (
    <ScannerGrid>
      {/* Left Column - Camera Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Camera Controls */}
        <ScannerCard>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
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
              {cameras.map(camera => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.slice(0, 8)}...`}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant={scanning ? 'danger' : 'success'}
              onClick={() => scanning ? stopCamera() : startCamera(selectedCamera)}
              style={{ flex: 1 }}
            >
              {scanning ? '⏹️ Stop Scanning' : '▶️ Start Scanning'}
            </Button>

            <Button
              variant="outline"
              onClick={clearScannedData}
              disabled={scannedOrders.length === 0}
              style={{ flex: 1 }}
            >
              🗑️ Clear All
            </Button>
          </div>
        </ScannerCard>

        {/* Camera Preview */}
        <ScannerCard>
          <h3 style={{ 
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Camera Preview
          </h3>
          
          <CameraPreview>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                display: scanning ? 'block' : 'none',
                position:'relative'
              }}
              muted
              playsInline
            />
            
            {!scanning && (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                color: '#9ca3af',
                fontSize: '16px',
                gap: '12px'
              }}>
                <div style={{ fontSize: '64px' }}>📷</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>Camera Offline</div>
                  <div style={{ fontSize: '14px' }}>Click "Start Scanning" to begin</div>
                </div>
              </div>
            )}

            {scanning && <ScanOverlay />}
          </CameraPreview>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: scanning ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : '#f8fafc',
            borderRadius: '10px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            color: scanning ? '#065f46' : '#6b7280',
            border: `2px solid ${scanning ? '#10b981' : '#e5e7eb'}`
          }}>
            {scanning ? '🔍 Scanning for order barcodes...' : '⏸️ Scanner paused'}
            {currentScanningOrderId && (
              <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: '600', color: '#1e40af' }}>
                Last scanned: {currentScanningOrderId}
              </div>
            )}
          </div>
        </ScannerCard>

        {error && (
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            color: '#991b1b',
            border: '2px solid #fca5a5',
            borderRadius: '12px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span>
              <span>Error</span>
            </div>
            {error}
          </div>
        )}
      </div>

      {/* Right Column - Orders Table */}
      <TableContainer>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid #f1f5f9'
        }}>
          <div>
            <h3 style={{ 
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Scanned Orders ({scannedOrders.length})
            </h3>
            {pendingOrdersCount > 0 && (
              <div style={{ 
                fontSize: '14px', 
                color: '#3b82f6',
                marginTop: '4px',
                fontWeight: '500'
              }}>
                {pendingOrdersCount} pending • {selectedOrdersCount} selected
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
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

        {/* Confirm Button Section */}
        {pendingOrdersCount > 0 && (
          <div style={{
            marginBottom: '20px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '2px solid #bae6fd',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '15px', color: '#0369a1', fontWeight: '600' }}>
                {selectedOrdersCount} of {pendingOrdersCount} pending order(s) selected
              </div>
              {selectedOrdersCount > 0 && selectedOrdersCount < pendingOrdersCount && (
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
              disabled={selectedOrdersCount === 0 || isConfirming}
              style={{ minWidth: '180px' }}
            >
              {isConfirming ? (
                <>
                  <LoadingSpinner />
                  Confirming...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '16px' }}>✅</span>
                  Confirm ({selectedOrdersCount})
                </>
              )}
            </Button>
          </div>
        )}

        {scannedOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#9ca3af',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              fontSize: '72px', 
              marginBottom: '24px',
              opacity: 0.5 
            }}>📋</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No orders scanned yet</div>
            <div style={{ fontSize: '14px' }}>Start scanning to see orders here</div>
          </div>
        ) : (
          <>
            <div style={{ 
              overflow: 'auto',
              flex: 1,
              marginBottom: '20px',
              borderRadius: '8px'
            }}>
              <Table>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>
                      <input
                        type="checkbox"
                        checked={scannedOrders.length > 0 && 
                                 scannedOrders.filter(o => o.status === 'pending')
                                   .every(order => order.checked)}
                        onChange={toggleSelectAll}
                        disabled={pendingOrdersCount === 0}
                        style={{
                          cursor: pendingOrdersCount > 0 ? 'pointer' : 'not-allowed',
                          transform: 'scale(1.2)'
                        }}
                      />
                    </th>
                    <th style={{ width: '200px' }}>Product Details</th>
                    <th>Order Information</th>
                    <th style={{ width: '120px' }}>Status</th>
                    <th style={{ width: '100px' }}>Amount</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={order.checked || false}
                          onChange={() => toggleCheck(order.id)}
                          disabled={order.status !== 'pending'}
                          style={{
                            cursor: order.status === 'pending' ? 'pointer' : 'not-allowed',
                            transform: 'scale(1.2)'
                          }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ProductImage imageUrl={getFirstProductImage(order)}>
                            {!getFirstProductImage(order) && 'No Image'}
                          </ProductImage>
                          <div>
                            <div style={{ 
                              fontWeight: '600', 
                              color: '#1e293b',
                              fontSize: '13px',
                              lineHeight: '1.3',
                              marginBottom: '4px'
                            }}>
                              {getProductNames(order)}
                            </div>
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <span>🛒 {getProductCount(order)} item(s)</span>
                              {order.orderDetail?.products?.[0]?.productId?.discountedPrice && (
                                <>
                                  <span>•</span>
                                  <span>💰 NPR {order.orderDetail.products[0].productId.discountedPrice}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                          <div style={{ marginBottom: '4px' }}>
                            <strong style={{ color: '#475569' }}>Order ID:</strong>{' '}
                            <span style={{ 
                              color: '#3b82f6', 
                              fontWeight: '500',
                              fontFamily: 'monospace',
                              fontSize: '11px'
                            }}>
                              {order.orderId}
                            </span>
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <strong style={{ color: '#475569' }}>Customer:</strong>{' '}
                            <span style={{ color: '#1e293b' }}>
                              {order.orderDetail?.userId?.name || 'Unknown'}
                            </span>
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <strong style={{ color: '#475569' }}>Phone:</strong>{' '}
                            <span style={{ color: '#1e293b', fontWeight: '500' }}>
                              {order.orderDetail?.phoneNumber || '-'}
                            </span>
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <strong style={{ color: '#475569' }}>Delivery:</strong>{' '}
                            <span style={{ 
                              color: order.orderDetail?.isHomeDelivery ? '#059669' : '#d97706',
                              fontWeight: '500'
                            }}>
                              {order.orderDetail?.isHomeDelivery ? 'Home Delivery' : 'Pickup'}
                            </span>
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: '#94a3b8',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span>🕒 {order.timestamp}</span>
                            {order.orderDetail?.paymentMethod && (
                              <span>• {order.orderDetail.paymentMethod}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <StatusBadge status={order.status}>
                            {order.status === 'loading' && '🔄 '}
                            {order.status === 'success' && '✅ '}
                            {order.status === 'pending' && '⏳ '}
                            {order.status === 'error' && '❌ '}
                            {order.status.toUpperCase()}
                          </StatusBadge>
                          
                          {order.isLoadingDetail && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#f59e0b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <LoadingSpinner style={{ width: '12px', height: '12px' }} />
                              Loading details...
                            </div>
                          )}
                          
                          {(order.status === 'error' && order.errorMessage) && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#ef4444',
                              wordBreak: 'break-word'
                            }}>
                              {order.errorMessage}
                            </div>
                          )}
                          
                          {order.orderDetail?.isScanned && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#059669',
                              fontWeight: '500'
                            }}>
                              ✅ Confirmed
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '16px', 
                            fontWeight: '700', 
                            color: '#059669' 
                          }}>
                            NPR {getTotalAmount(order).toFixed(2)}
                          </div>
                          {order.orderDetail?.shippingPrice && order.orderDetail.shippingPrice > 0 && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#64748b',
                              marginTop: '2px'
                            }}>
                              + NPR {order.orderDetail.shippingPrice.toFixed(2)} shipping
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(order.orderId)}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            📋 Copy
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => removeItem(order.id)}
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 0',
                borderTop: '2px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                  Showing {pagination.indexOfFirstItem + 1}-{Math.min(pagination.indexOfLastItem, scannedOrders.length)} of {scannedOrders.length} orders
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Button
                    variant="outline"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    style={{ padding: '8px 16px' }}
                  >
                    ← Previous
                  </Button>
                  
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: currentPage === pageNum ? '#3b82f6' : 'transparent',
                            color: currentPage === pageNum ? 'white' : '#64748b',
                            border: `2px solid ${currentPage === pageNum ? '#3b82f6' : '#e5e7eb'}`,
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: currentPage === pageNum ? '600' : '500',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={nextPage}
                    disabled={currentPage === pagination.totalPages}
                    style={{ padding: '8px 16px' }}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </TableContainer>
    </ScannerGrid>
  );

  // Render Analytics Tab (unchanged from original but optimized)
  const renderAnalyticsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Analytics Controls */}
      <ScannerCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            📈 Sales Analytics Dashboard
          </h3>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
              style={{ minWidth: '140px' }}
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

      {/* Sales Overview Cards */}
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
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '12px',
                background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}40 100%)`,
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: '500' }}>
                {stat.title}
              </div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: '800', 
                color: stat.color,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {stat.value}
              </div>
            </div>
          </ScannerCard>
        ))}
      </StatsGrid>

      {/* Charts Grid */}
      <ChartsGrid>
        {/* Sales Trend Chart */}
        <ScannerCard>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            📈 Sales Trend
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formatSalesData()}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                formatter={(value) => [`NPR ${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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

        {/* Orders Chart */}
        <ScannerCard>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            📊 Orders & Items
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatSalesData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#82ca9d" name="Orders" radius={[4, 4, 0, 0]} />
              <Bar dataKey="items" fill="#8884d8" name="Items" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ScannerCard>

        {/* Top Products Chart */}
        <ScannerCard>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            🏆 Top Selling Products
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatTopProductsData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {formatTopProductsData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Quantity']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ScannerCard>

        {/* Revenue by Product */}
        <ScannerCard>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
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
                formatter={(value) => [`NPR ${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#ff8042" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ScannerCard>
      </ChartsGrid>
    </div>
  );

  return (
    <PageContainer>
      <div>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          padding: '32px 24px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '20px',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <h1 style={{ 
            fontSize: '36px',
            fontWeight: '800',
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>
            Order Scanner & Analytics Dashboard
          </h1>
          <p style={{ 
            fontSize: '18px',
            opacity: 0.9,
            margin: '0 auto 24px',
            maxWidth: '600px'
          }}>
            Scan order barcodes in real-time and analyze sales performance with advanced insights
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            <span>📷 {cameras.length} cameras available</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>📊 {scanCount} total scans</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>✅ {orderStats.fulfilledOrders} fulfilled orders</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>💰 NPR {orderStats.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabContainer>
          <button
            onClick={() => setActiveTab('scanner')}
            style={{
              padding: '16px 32px',
              background: activeTab === 'scanner' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'white',
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
              boxShadow: activeTab === 'scanner' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <span style={{ fontSize: '20px' }}>📱</span>
            Scanner Mode
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '16px 32px',
              background: activeTab === 'analytics' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'white',
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
              boxShadow: activeTab === 'analytics' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <span style={{ fontSize: '20px' }}>📈</span>
            Analytics Dashboard
          </button>
        </TabContainer>

        {/* Main Content */}
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
            height: 8px;
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
        `}
      </style>
    </PageContainer>
  );
};

export default QRScanner;