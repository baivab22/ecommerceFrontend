

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { getOrderDetailByIdAction } from '../products/product.slice';
import { 
  markOrderScanAction, 
//   bulkMarkAction,
  getSalesAnalyticsAction 
} from './qrScanner.slice';
import { useDispatch, useSelector } from 'src/store';
import toast from 'react-hot-toast'
import styled from 'styled-components';
import { BASE_URL, FILE_URL } from 'src/config';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  & > div {
    max-width: 1400px;
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
  gap: 24px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

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
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TabContainer = styled.div`
  margin-bottom: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 8px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  
  /* Hide scrollbar for cleaner look but allow scrolling */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
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
  const dispatch = useDispatch();
  const { orderDetailData, orderDetailLoading } = useSelector(
    (state: any) => state.product
  );
  const { salesData, topProducts, loading: scanLoading } = useSelector(
    (state: any) => state.scan
  );

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
          width: { ideal: 640 },
          height: { ideal: 480 },
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
      return false;
    }

    const newOrder: ScannedOrder = {
      id: Date.now().toString(),
      orderId,
      productOrderId,
      orderDetail,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      status: status,
      errorMessage,
      checked: false
    };
    
    setScannedOrders(prev => [newOrder, ...prev]);
    setScanCount(prev => prev + 1);
    
    if (status === 'success') {
      playSuccessSound();
    } else if (status === 'error') {
      playErrorSound();
    }

    return true;
  }, [playSuccessSound, playErrorSound, isProductOrderInTable]);

  // Handle order scanning with duplicate prevention and cooldown
  const handleOrderScan = useCallback(async (scannedData: string) => {
    const now = Date.now();
    
    // Check cooldown
    if (now - lastScanTimeRef.current < scanCooldownRef.current) {
      console.log('Scan cooldown active, skipping scan');
      return;
    }

    // Parse the scanned data - assuming format contains productOrderId
    // Try to extract productOrderId from different possible formats
    let productOrderId = scannedData;
    let orderId = scannedData;

    // If the scanned data contains a colon, assume format: "orderId:productOrderId"
    if (scannedData.includes(':')) {
      const parts = scannedData.split(':');
      orderId = parts[0];
      productOrderId = parts[1] || parts[0];
    }
    // If it's a long string, it might be just the productOrderId
    else if (scannedData.length > 10) {
      productOrderId = scannedData;
      orderId = scannedData; // Use same value for both if not specified
    }

    // Check if currently processing this order
    if (processingOrderRef.current === orderId) {
      console.log('Order is currently being processed, skipping:', orderId);
      return;
    }

    lastScanTimeRef.current = now;
    setCurrentScanningOrderId(orderId);
    processingOrderRef.current = orderId;
    
    try {
      // Add to pending list without making API call
      const added = addScannedOrder(orderId, productOrderId, null, 'pending');
      
      if (!added) {
        setCurrentScanningOrderId(null);
        processingOrderRef.current = null;
        return;
      }
      
      console.log('Order added to pending list:', { orderId, productOrderId });
      
    } catch (err) {
      console.error('Error processing scan:', err);
      addScannedOrder(orderId, productOrderId, null, 'error', 'Failed to process scan');
      setCurrentScanningOrderId(null);
      processingOrderRef.current = null;
    }
  }, [addScannedOrder]);

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

      // Call bulk mark API
      const result = await dispatch(markOrderScanAction({ productorderIds:productOrderIds as any })).unwrap();
      
      console.log('Bulk mark result:', result);

      if (result.success) {
        // Update all selected orders to success status
        setScannedOrders(prev => 
          prev.map(order => 
            order.checked && order.status === 'loading'
              ? { 
                  ...order, 
                  status: 'success' as const,
                  checked: false // Uncheck after successful confirmation
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
        throw new Error(result.message || 'Failed to confirm scans');
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
      animationFrameRef.current = requestAnimationFrame(scanBarcode);
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
    setScannedOrders([]);
    setScanCount(0);
    setCurrentPage(1);
    scannedProductOrderIdsRef.current.clear();
    lastScanTimeRef.current = 0;
    setCurrentScanningOrderId(null);
    processingOrderRef.current = null;
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
    }
    
    // Also clear processing state if this was the current order
    if (orderToRemove && orderToRemove.orderId === currentScanningOrderId) {
      setCurrentScanningOrderId(null);
      processingOrderRef.current = null;
    }
    
    setScannedOrders(prev => prev.filter(item => item.id !== id));
  };

  // Toggle checkbox for individual order
  const toggleCheck = (id: string) => {
    setScannedOrders(prev =>
      prev.map(order =>
        order.id === id
          ? { ...order, checked: !order.checked }
          : order
      )
    );
  };

  // Toggle select all checkboxes
  const toggleSelectAll = () => {
    const allChecked = scannedOrders.every(order => order.checked);
    setScannedOrders(prev =>
      prev.map(order => ({
        ...order,
        checked: !allChecked && order.status === 'pending' // Only allow selecting pending orders
      }))
    );
  };

  // Get product names for display (handles multiple products)
  const getProductNames = (order: ScannedOrder): string => {
    if (!order.orderDetail?.products?.length) return 'Pending...';
    
    const productNames = order.orderDetail.products.map(product => 
      product.productId?.name || 'Unknown Product'
    );
    
    if (productNames.length === 1) {
      return productNames[0];
    } else {
      return `${productNames[0]} +${productNames.length - 1} more`;
    }
  };

  // Get first product image
  const getFirstProductImage = (order: ScannedOrder): string | null => {
    if (!order.orderDetail?.products?.[0]?.productId?.images?.[0]?.coloredImage) {
      return null;
    }
    return `${FILE_URL}/products/${order.orderDetail.products[0].productId.images[0].coloredImage}`;
  };

  // Load analytics data
  const loadAnalyticsData = useCallback(() => {
    dispatch(getSalesAnalyticsAction(analyticsPeriod));
  }, [dispatch, analyticsPeriod]);

  // Format sales data for charts
  const formatSalesData = () => {
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
        name = `${item._id.month}/${item._id.year}`;
      }

      return {
        name,
        sales: item.totalSales,
        orders: item.orderCount,
        items: item.totalItems,
        revenue: item.totalSales
      };
    });
  };

  // Format top products data
  const formatTopProductsData = () => {
    if (!topProducts) return [];

    return topProducts.map(item => ({
      name: item.productDetails[0]?.name || 'Unknown Product',
      value: item.totalQuantity,
      revenue: item.totalRevenue
    }));
  };

  // Calculate order statistics
  const orderStats = scannedOrders.reduce((stats, order) => {
    if (order.status === 'success' && order.orderDetail) {
      stats.totalAmount += order.orderDetail.totalAmount || 0;
      stats.totalProducts += order.orderDetail.products?.length || 0;
      stats.scannedOrders++;
      if (order.orderDetail.isScanned) {
        stats.fulfilledOrders++;
      }
    }
    return stats;
  }, { totalAmount: 0, totalProducts: 0, scannedOrders: 0, fulfilledOrders: 0 });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = scannedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(scannedOrders.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get selected orders count
  const selectedOrdersCount = scannedOrders.filter(order => order.checked).length;
  const pendingOrdersCount = scannedOrders.filter(order => order.status === 'pending').length;

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

  // Render Scanner Tab
  const renderScannerTab = () => (
    <ScannerGrid>
      {/* Left Column - Camera Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Camera Controls */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
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
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                backgroundColor: scanning ? '#f9fafb' : 'white'
              }}
            >
              <option value="">Default Camera</option>
              {cameras.map(camera => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.slice(0, 10)}`}
                </option>
              ))}
            </select>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => scanning ? stopCamera() : startCamera(selectedCamera)}
              style={{
                padding: '12px 24px',
                backgroundColor: scanning ? '#dc2626' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                flex: 1,
                minWidth: '140px',
                transition: 'all 0.2s'
              }}
            >
              {scanning ? '⏹️ Stop Scanning' : '▶️ Start Scanning'}
            </button>

            <button
              onClick={clearScannedData}
              disabled={scannedOrders.length === 0}
              style={{
                padding: '12px 24px',
                backgroundColor: scannedOrders.length === 0 ? '#9ca3af' : '#d97706',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: scannedOrders.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                flex: 1,
                minWidth: '140px'
              }}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Camera Preview */}
        <div style={{ 
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Camera Preview
          </h3>
          
          <div style={{ 
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#000',
            aspectRatio: '4/3'
          }}>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: scanning ? 'block' : 'none',
                position: 'relative',
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
                backgroundColor: '#1f2937',
                color: '#9ca3af',
                fontSize: '16px',
                gap: '12px'
              }}>
                <div style={{ fontSize: '48px' }}>📷</div>
                <div style={{ textAlign: 'center' }}>
                  <div>Camera is off</div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>Click "Start Scanning" to begin</div>
                </div>
              </div>
            )}

            {scanning && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                border: '3px solid #10b981',
                borderRadius: '8px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '10%',
                  right: '10%',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                  animation: 'scan 2s ease-in-out infinite'
                }} />
              </div>
            )}
          </div>

          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: scanning ? '#d1fae5' : '#f3f4f6',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            color: scanning ? '#065f46' : '#6b7280'
          }}>
            {scanning ? '🔍 Scanning for order barcodes...' : '⏸️ Scanner paused'}
            {currentScanningOrderId && (
              <div style={{ marginTop: '4px', fontSize: '12px' }}>
                Last scanned: {currentScanningOrderId}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Error:</div>
            {error}
          </div>
        )}
      </div>

      {/* Right Column - Orders Table */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '800px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #f1f5f9'
        }}>
          <h3 style={{ 
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Scanned Orders ({scannedOrders.length})
            {pendingOrdersCount > 0 && (
              <span style={{ 
                fontSize: '14px', 
                color: '#3b82f6',
                marginLeft: '8px',
                fontWeight: 'normal'
              }}>
                ({pendingOrdersCount} pending)
              </span>
            )}
          </h3>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            
            {scannedOrders.length > 0 && (
              <button
                onClick={clearScannedData}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Confirm Button Section */}
        {pendingOrdersCount > 0 && (
          <div style={{
            marginBottom: '16px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: '500' }}>
                {selectedOrdersCount} of {pendingOrdersCount} pending order(s) selected
              </div>
              {selectedOrdersCount > 0 && (
                <button
                  onClick={toggleSelectAll}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'transparent',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {scannedOrders.every(order => order.checked) ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            
            <button
              onClick={confirmSelectedScans}
              disabled={selectedOrdersCount === 0 || isConfirming}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedOrdersCount === 0 || isConfirming ? '#9ca3af' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedOrdersCount === 0 || isConfirming ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                minWidth: '160px'
              }}
            >
              {isConfirming ? (
                <>
                  <span style={{ marginRight: '8px' }}>🔄</span>
                  Confirming...
                </>
              ) : (
                <>
                  <span style={{ marginRight: '8px' }}>✅</span>
                  Confirm ({selectedOrdersCount})
                </>
              )}
            </button>
          </div>
        )}

        {scannedOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#9ca3af',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>No orders scanned yet</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>Scanned orders will appear here</div>
          </div>
        ) : (
          <>
            <div style={{ 
              overflow: 'auto',
              flex: 1,
              marginBottom: '16px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f8fafc',
                    position: 'sticky',
                    top: 0
                  }}>
                    <th style={{
                      padding: '12px 6px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#475569',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      width: '40px'
                    }}>
                      <input
                        type="checkbox"
                        checked={scannedOrders.length > 0 && scannedOrders.every(order => order.checked && order.status === 'pending')}
                        onChange={toggleSelectAll}
                        disabled={pendingOrdersCount === 0}
                        style={{
                          cursor: pendingOrdersCount > 0 ? 'pointer' : 'not-allowed'
                        }}
                      />
                    </th>
                    <th style={{
                      padding: '12px 6px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#475569',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>Product</th>
                    <th style={{
                      padding: '12px 6px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#475569',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>Order Info</th>
                    <th style={{
                      padding: '12px 6px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#475569',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>Status</th>
                    <th style={{
                      padding: '12px 6px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#475569',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>Total</th>
                    <th style={{
                      padding: '12px 6px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#475569',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '11px',
                      textTransform: 'uppercase'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order, index) => (
                    <tr 
                      key={order.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                    >
                      <td style={{ 
                        padding: '12px 6px',
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}>
                        <input
                          type="checkbox"
                          checked={order.checked || false}
                          onChange={() => toggleCheck(order.id)}
                          disabled={order.status !== 'pending'}
                          style={{
                            cursor: order.status === 'pending' ? 'pointer' : 'not-allowed'
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px 6px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getFirstProductImage(order) ? (
                            <img 
                              src={getFirstProductImage(order)} 
                              alt="Product"
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: '#e5e7eb',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#9ca3af',
                              fontSize: '10px'
                            }}>
                              No Image
                            </div>
                          )}
                          <div>
                            <div style={{ 
                              fontWeight: '600', 
                              color: '#1e293b',
                              fontSize: '12px',
                              lineHeight: '1.2'
                            }}>
                              {getProductNames(order)}
                            </div>
                            <div style={{ 
                              fontSize: '10px', 
                              color: '#64748b',
                              marginTop: '2px'
                            }}>
                              {order.orderDetail?.products?.length || '?'} item(s)
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 6px', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                          <div><strong>Order ID:</strong> {order.orderId}</div>
                          <div><strong>Product Order ID:</strong> {order.productOrderId}</div>
                          <div><strong>Phone:</strong> {order.orderDetail?.phoneNumber || '-'}</div>
                          <div><strong>Location:</strong> {order.orderDetail?.shippingLocation || '-'}</div>
                          <div><strong>Payment:</strong> {order.orderDetail?.paymentMethod || '-'}</div>
                          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                            {order.timestamp}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 6px', verticalAlign: 'top', textAlign: 'center' }}>
                        <div>
                          <span style={{
                            padding: '4px 6px',
                            backgroundColor: order.status === 'success' ? '#10b981' : 
                                           order.status === 'loading' ? '#f59e0b' : 
                                           order.status === 'pending' ? '#3b82f6' : '#ef4444',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '500',
                            display: 'inline-block',
                            marginBottom: '4px'
                          }}>
                            {order.status === 'success' ? 'SUCCESS' : 
                             order.status === 'loading' ? 'LOADING' : 
                             order.status === 'pending' ? 'PENDING' : 'ERROR'}
                          </span>
                          {(order.status === 'error' || order.status === 'loading') && (
                            <div style={{ 
                              fontSize: '9px', 
                              color: order.status === 'loading' ? '#f59e0b' : '#ef4444', 
                              marginTop: '2px',
                              maxWidth: '120px',
                              wordBreak: 'break-word'
                            }}>
                              {order.errorMessage}
                            </div>
                          )}
                          {order.status === 'success' && (
                            <div style={{ marginTop: '4px' }}>
                              <span style={{
                                padding: '2px 6px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '9px',
                                fontWeight: '500'
                              }}>
                                ✅ CONFIRMED
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ 
                        padding: '12px 6px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: '#059669',
                        verticalAlign: 'top',
                        fontSize: '12px'
                      }}>
                        {order.orderDetail ? `NPR ${order.orderDetail.totalAmount?.toFixed(2)}` : '-'}
                      </td>
                      <td style={{ 
                        padding: '12px 6px',
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                          <button
                            onClick={() => copyToClipboard(order.orderId)}
                            style={{
                              padding: '4px 6px',
                              backgroundColor: '#8b5cf6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              width: '100%'
                            }}
                            title="Copy Order ID"
                          >
                            📋 Copy ID
                          </button>
                          <button
                            onClick={() => removeItem(order.id)}
                            style={{
                              padding: '4px 6px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              width: '100%'
                            }}
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderTop: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, scannedOrders.length)} of {scannedOrders.length} orders
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: currentPage === 1 ? '#f3f4f6' : '#3b82f6',
                      color: currentPage === 1 ? '#9ca3af' : 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#3b82f6',
                      color: currentPage === totalPages ? '#9ca3af' : 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ScannerGrid>
  );

  // Render Analytics Tab (unchanged from original)
  const renderAnalyticsTab = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Analytics Controls */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ 
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          Sales Analytics Dashboard
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={analyticsPeriod}
            onChange={(e) => setAnalyticsPeriod(e.target.value as any)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          <button
            onClick={loadAnalyticsData}
            disabled={scanLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: scanLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {scanLoading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Sales Overview Cards */}
      <StatsGrid>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Total Scanned</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            {scannedOrders.length}
          </div>
        </div>
        
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Total Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
            NPR {orderStats.totalAmount.toFixed(2)}
          </div>
        </div>
        
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Products Sold</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            {orderStats.totalProducts}
          </div>
        </div>
        
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Fulfillment Rate</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
            {orderStats.scannedOrders > 0 ? ((orderStats.fulfilledOrders / orderStats.scannedOrders) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </StatsGrid>

      {/* Charts Grid */}
      <ChartsGrid>
        {/* Sales Trend Chart */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: '400px'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            Sales Trend
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={formatSalesData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`NPR ${value}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: '400px'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            Orders & Items
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={formatSalesData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
              <Bar dataKey="items" fill="#8884d8" name="Items" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: '400px'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            Top Selling Products
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={formatTopProductsData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {formatTopProductsData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Quantity']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Product */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: '400px'
        }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            Revenue by Product
          </h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={formatTopProductsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [`NPR ${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartsGrid>
    </div>
  );

  return (
    <PageContainer>
      <div>
        
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#1e293b', 
            marginBottom: '8px',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Order Scanner & Analytics
          </h1>
          <p style={{ 
            color: '#64748b',
            fontSize: '16px',
            margin: 0
          }}>
            Scan order barcodes and analyze sales performance
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginTop: '16px',
            fontSize: '14px',
            color: '#475569'
          }}>
            <span>📷 {cameras.length} cameras</span>
            <span>•</span>
            <span>📊 {scanCount} total scans</span>
            <span>•</span>
            <span>✅ {orderStats.fulfilledOrders} fulfilled</span>
            <span>•</span>
            <span>💰 NPR {orderStats.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabContainer>
          <button
            onClick={() => setActiveTab('scanner')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'scanner' ? '#3b82f6' : 'transparent',
              color: activeTab === 'scanner' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              flex: 1,
              transition: 'all 0.2s'
            }}
          >
            📱 Scanner
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'analytics' ? '#3b82f6' : 'transparent',
              color: activeTab === 'analytics' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              flex: 1,
              transition: 'all 0.2s'
            }}
          >
            📈 Analytics
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
        `}
      </style>
    </PageContainer>
  );
};

export default QRScanner;