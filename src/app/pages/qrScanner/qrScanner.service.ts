import { api } from 'src/api';

// ---------------------------
// Types
// ---------------------------
export interface ProductItem {
  productId: string;
  name: string;
  quantity: number;
}

export interface ScannedOrder {
  productOrderId: string;
  products: ProductItem[];
  totalAmount: number;
  scannedAt: string;
  paymentMethod: 'phonepay' | 'cod';
}

export interface ScanResponse {
  order: ScannedOrder;
}

export interface SalesAnalyticsData {
  name: string;
  sales: number;
  orders: number;
  items: number;
}

export interface TopProduct {
  name: string;
  value: number;
  revenue: number;
}

export interface SalesAnalyticsResponse {
  salesData: SalesAnalyticsData[];
  topProducts: TopProduct[];
}

// ---------------------------
// Service Functions
// ---------------------------

const markOrderScan = async (orderId: string[]): Promise<ScanResponse> => {
  const response = await api<ScanResponse>('post')('/scan/scanned-orders', undefined, { productOrderId: orderId });
  return response.data;
};

const getScannedOrders = async (): Promise<ScannedOrder[]> => {
  const response = await api<{ orders: ScannedOrder[] }>('get')('/scan/scanned-orders');
  return response.data.orders;
};

const getSalesAnalytics = async (period: string = 'monthly'): Promise<SalesAnalyticsResponse> => {
  const response = await api<SalesAnalyticsResponse>('get')(`/scan/sales-analytics?period=${period}`);
  return response.data;
};

// ---------------------------
// Exported Service
// ---------------------------

export const scanService = {
  markOrderScan,
  getScannedOrders,
  getSalesAnalytics,
};
