// import React, { useEffect, useMemo, useState } from 'react';
// import { useDispatch, useSelector } from 'src/store';
// import { getSalesAnalyticsAction } from '../qrScanner/qrScanner.slice';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from 'recharts';

// type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
// type ChartType = 'line' | 'bar';
// type DateRange = 'today' | 'last7' | 'last30' | 'all';

// interface AggregatedId {
//   day?: number;
//   week?: number;
//   month?: number;
//   year?: number;
// }

// interface AggregatedSalesItem {
//   _id: AggregatedId;
//   totalSales: number;
//   orderCount: number;
//   totalItems: number;
// }

// interface ProductRef {
//   _id?: string;
//   id?: string;
//   name?: string;
// }

// interface OrderProductItem {
//   productId: ProductRef | string;
//   quantity: number;
//   price?: number;
// }

// interface OrderItem {
//   _id: string;
//   products: OrderProductItem[];
//   totalAmount: number;
//   date?: string;
//   scannedAt?: string;
//   productOrderId?: string;
//   shippingPrice?: number;
//   giftBoxCharge?: number;
//   includeGiftBox?: boolean;
// }

// interface AggregatedTopProductItem {
//   _id?: string;
//   totalQuantity: number;
//   totalRevenue: number;
//   productDetails?: Array<{ name?: string }>;
// }

// interface SalesChartData {
//   name: string;
//   sales: number;
//   orders: number;
//   items: number;
//   sortValue: number;
// }

// interface TopProductData {
//   productId: string;
//   name: string;
//   totalQuantity: number;
//   totalRevenue: number;
//   avgPrice: number;
// }

// interface PieTopProductData extends TopProductData {
//   [key: string]: string | number;
// }

// interface OrderBreakdownData {
//   orderId: string;
//   scannedAt: string;
//   productCount: number;
//   totalItems: number;
//   productSubtotal: number;
//   shippingCharge: number;
//   giftBoxCharge: number;
//   computedTotal: number;
//   totalAmount: number;
//   otherCharges: number;
//   productSummary: string;
// }

// const COLORS = ['#0EA5E9', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#6366F1'];

// const toNumber = (value: unknown): number => {
//   const parsed = Number(value);
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const formatCurrency = (value: number): string => `Rs. ${value.toFixed(2)}`;

// const getOrderDate = (order: OrderItem): Date | null => {
//   const rawDate = order.scannedAt || order.date;
//   if (!rawDate) return null;
//   const parsed = new Date(rawDate);
//   return Number.isNaN(parsed.getTime()) ? null : parsed;
// };

// const isSameDay = (a: Date, b: Date): boolean =>
//   a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// const filterOrdersByRange = (orders: OrderItem[], range: DateRange): OrderItem[] => {
//   if (range === 'all') return orders;

//   const now = new Date();
//   const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   const last7Start = new Date(todayStart);
//   last7Start.setDate(todayStart.getDate() - 6);
//   const last30Start = new Date(todayStart);
//   last30Start.setDate(todayStart.getDate() - 29);

//   return orders.filter((order) => {
//     const orderDate = getOrderDate(order);
//     if (!orderDate) return false;

//     if (range === 'today') {
//       return isSameDay(orderDate, now);
//     }

//     if (range === 'last7') {
//       return orderDate >= last7Start;
//     }

//     return orderDate >= last30Start;
//   });
// };

// const toCsvCell = (value: string | number): string => {
//   const safe = String(value).replace(/"/g, '""');
//   return `"${safe}"`;
// };

// const getPeriodLabel = (date: Date, period: Period): { label: string; sortValue: number } => {
//   if (period === 'daily') {
//     return {
//       label: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
//       sortValue: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
//     };
//   }

//   if (period === 'weekly') {
//     const day = date.getDay();
//     const mondayOffset = day === 0 ? -6 : 1 - day;
//     const weekStart = new Date(date);
//     weekStart.setDate(date.getDate() + mondayOffset);

//     return {
//       label: `Week ${Math.ceil(date.getDate() / 7)}, ${date.getFullYear()}`,
//       sortValue: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).getTime(),
//     };
//   }

//   if (period === 'yearly') {
//     return {
//       label: `Year ${date.getFullYear()}`,
//       sortValue: new Date(date.getFullYear(), 0, 1).getTime(),
//     };
//   }

//   return {
//     label: `${date.getMonth() + 1}/${date.getFullYear()}`,
//     sortValue: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
//   };
// };

// const isAggregatedSalesItem = (value: unknown): value is AggregatedSalesItem => {
//   if (!value || typeof value !== 'object') return false;
//   const item = value as Partial<AggregatedSalesItem>;
//   return Boolean(item._id && typeof item.totalSales === 'number' && typeof item.orderCount === 'number');
// };

// const isOrderItem = (value: unknown): value is OrderItem => {
//   if (!value || typeof value !== 'object') return false;
//   const item = value as Partial<OrderItem>;
//   return Array.isArray(item.products) && typeof item.totalAmount === 'number';
// };

// const normalizeSalesData = (rawSalesData: unknown[], period: Period): SalesChartData[] => {
//   if (!Array.isArray(rawSalesData) || rawSalesData.length === 0) {
//     return [];
//   }

//   if (isAggregatedSalesItem(rawSalesData[0])) {
//     const mapped = (rawSalesData as AggregatedSalesItem[]).map((item) => {
//       const year = item._id.year ?? 1970;
//       const month = (item._id.month ?? 1) - 1;
//       const day = item._id.day ?? 1;
//       const baseDate = new Date(year, month, day);

//       const labelData = getPeriodLabel(baseDate, period);

//       return {
//         name: labelData.label,
//         sales: toNumber(item.totalSales),
//         orders: toNumber(item.orderCount),
//         items: toNumber(item.totalItems),
//         sortValue: labelData.sortValue,
//       };
//     });

//     return mapped.sort((a, b) => a.sortValue - b.sortValue);
//   }

//   const grouped: Record<string, SalesChartData> = {};

//   (rawSalesData as OrderItem[]).forEach((order) => {
//     if (!isOrderItem(order)) return;

//     const date = new Date(order.scannedAt || order.date || Date.now());
//     if (Number.isNaN(date.getTime())) return;

//     const { label, sortValue } = getPeriodLabel(date, period);

//     if (!grouped[label]) {
//       grouped[label] = {
//         name: label,
//         sales: 0,
//         orders: 0,
//         items: 0,
//         sortValue,
//       };
//     }

//     grouped[label].sales += toNumber(order.totalAmount);
//     grouped[label].orders += 1;
//     grouped[label].items += order.products.reduce((sum, product) => sum + toNumber(product.quantity), 0);
//   });

//   return Object.values(grouped).sort((a, b) => a.sortValue - b.sortValue);
// };

// const normalizeTopProducts = (rawTopProducts: unknown[]): TopProductData[] => {
//   if (!Array.isArray(rawTopProducts) || rawTopProducts.length === 0) {
//     return [];
//   }

//   // Supports aggregated shape when backend later switches to aggregation pipeline.
//   const looksAggregated =
//     typeof rawTopProducts[0] === 'object' &&
//     rawTopProducts[0] !== null &&
//     'totalQuantity' in (rawTopProducts[0] as Record<string, unknown>);

//   if (looksAggregated && !isOrderItem(rawTopProducts[0])) {
//     return (rawTopProducts as AggregatedTopProductItem[])
//       .map((item, index) => {
//         const totalQuantity = toNumber(item.totalQuantity);
//         const totalRevenue = toNumber(item.totalRevenue);
//         return {
//           productId: item._id || `product-${index}`,
//           name: item.productDetails?.[0]?.name || 'Unknown Product',
//           totalQuantity,
//           totalRevenue,
//           avgPrice: totalQuantity > 0 ? totalRevenue / totalQuantity : 0,
//         };
//       })
//       .sort((a, b) => b.totalQuantity - a.totalQuantity);
//   }

//   const productMap: Record<string, TopProductData> = {};

//   (rawTopProducts as OrderItem[]).forEach((order) => {
//     if (!isOrderItem(order)) return;

//     order.products.forEach((item, itemIndex) => {
//       const productObject = typeof item.productId === 'string' ? {} : item.productId;
//       const productId =
//         (typeof item.productId === 'string' ? item.productId : productObject._id || productObject.id) ||
//         `unknown-${order._id}-${itemIndex}`;
//       const productName = typeof item.productId === 'string' ? 'Unknown Product' : productObject.name || 'Unknown Product';

//       if (!productMap[productId]) {
//         productMap[productId] = {
//           productId,
//           name: productName,
//           totalQuantity: 0,
//           totalRevenue: 0,
//           avgPrice: 0,
//         };
//       }

//       const quantity = toNumber(item.quantity);
//       const lineRevenue = quantity * toNumber(item.price);

//       productMap[productId].totalQuantity += quantity;
//       productMap[productId].totalRevenue += lineRevenue;
//     });
//   });

//   return Object.values(productMap)
//     .map((item) => ({
//       ...item,
//       avgPrice: item.totalQuantity > 0 ? item.totalRevenue / item.totalQuantity : 0,
//     }))
//     .sort((a, b) => b.totalQuantity - a.totalQuantity);
// };

// const SalesAnalytics: React.FC = () => {
//   const dispatch = useDispatch();
//   const { salesData, topProducts, loading } = useSelector((state: any) => state.scan);

//   const [period, setPeriod] = useState<Period>('monthly');
//   const [chartType, setChartType] = useState<ChartType>('line');
//   const [dateRange, setDateRange] = useState<DateRange>('all');

//   useEffect(() => {
//     dispatch(getSalesAnalyticsAction(period));
//   }, [dispatch, period]);

//   const normalizedOrderSalesData = useMemo<OrderItem[]>(() => {
//     const source = (salesData || []) as unknown[];
//     if (!Array.isArray(source)) return [];
//     return source.filter(isOrderItem);
//   }, [salesData]);

//   const filteredOrders = useMemo<OrderItem[]>(
//     () => filterOrdersByRange(normalizedOrderSalesData, dateRange),
//     [normalizedOrderSalesData, dateRange]
//   );

//   const chartSource = useMemo<unknown[]>(() => {
//     if (filteredOrders.length > 0) return filteredOrders;
//     return (salesData || []) as unknown[];
//   }, [filteredOrders, salesData]);

//   const productSource = useMemo<unknown[]>(() => {
//     if (filteredOrders.length > 0) return filteredOrders;
//     return (topProducts || []) as unknown[];
//   }, [filteredOrders, topProducts]);

//   const formattedSalesData = useMemo(() => normalizeSalesData(chartSource, period), [chartSource, period]);

//   const formattedTopProducts = useMemo(() => normalizeTopProducts(productSource), [productSource]);

//   const totalSales = useMemo(
//     () => formattedSalesData.reduce((sum, item) => sum + item.sales, 0),
//     [formattedSalesData]
//   );

//   const totalOrders = useMemo(
//     () => formattedSalesData.reduce((sum, item) => sum + item.orders, 0),
//     [formattedSalesData]
//   );

//   const totalItems = useMemo(
//     () => formattedSalesData.reduce((sum, item) => sum + item.items, 0),
//     [formattedSalesData]
//   );

//   const hasSalesData = formattedSalesData.length > 0;
//   const hasProducts = formattedTopProducts.length > 0;
//   const pieTopProducts = useMemo<PieTopProductData[]>(
//     () => formattedTopProducts.slice(0, 6).map((item) => ({ ...item })),
//     [formattedTopProducts]
//   );

//   const orderBreakdown = useMemo<OrderBreakdownData[]>(() => {
//     return filteredOrders
//       .map((order) => {
//         const orderDate = getOrderDate(order);
//         const shippingCharge = toNumber(order.shippingPrice);
//         const giftBoxCharge = toNumber(order.giftBoxCharge);

//         const productSubtotal = order.products.reduce(
//           (sum, item) => sum + toNumber(item.quantity) * toNumber(item.price),
//           0
//         );

//         const totalItemsForOrder = order.products.reduce((sum, item) => sum + toNumber(item.quantity), 0);
//         const computedTotal = productSubtotal + shippingCharge + giftBoxCharge;
//         const actualTotal = toNumber(order.totalAmount);
//         const otherCharges = actualTotal - computedTotal;

//         const productSummary = order.products
//           .slice(0, 3)
//           .map((item) => {
//             const productRef = typeof item.productId === 'string' ? item.productId : item.productId.name || 'Unknown Product';
//             return `${productRef} x${toNumber(item.quantity)}`;
//           })
//           .join(', ');

//         return {
//           orderId: order.productOrderId || order._id,
//           scannedAt: orderDate ? orderDate.toLocaleString() : 'N/A',
//           productCount: order.products.length,
//           totalItems: totalItemsForOrder,
//           productSubtotal,
//           shippingCharge,
//           giftBoxCharge,
//           computedTotal,
//           totalAmount: actualTotal,
//           otherCharges,
//           productSummary,
//         };
//       })
//       .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
//   }, [filteredOrders]);

//   const handleExportReport = (): void => {
//     if (orderBreakdown.length === 0) return;

//     const summaryLines = [
//       ['Report Range', dateRange],
//       ['Chart Period', period],
//       ['Total Sales', totalSales.toFixed(2)],
//       ['Total Orders', totalOrders],
//       ['Total Items', totalItems],
//       ['Generated At', new Date().toLocaleString()],
//       [],
//     ];

//     const headers = [
//       'Order ID',
//       'Scanned At',
//       'Products',
//       'Total Items',
//       'Product Subtotal',
//       'Shipping Charge',
//       'Gift Box Charge',
//       'Calculated Total',
//       'Actual Total',
//       'Other Charges',
//       'Products Summary',
//     ];

//     const rows = orderBreakdown.map((item) => [
//       item.orderId,
//       item.scannedAt,
//       item.productCount,
//       item.totalItems,
//       item.productSubtotal.toFixed(2),
//       item.shippingCharge.toFixed(2),
//       item.giftBoxCharge.toFixed(2),
//       item.computedTotal.toFixed(2),
//       item.totalAmount.toFixed(2),
//       item.otherCharges.toFixed(2),
//       item.productSummary,
//     ]);

//     const csvContent = [
//       ...summaryLines.map((line) => line.map((cell) => toCsvCell(cell ?? '')).join(',')),
//       headers.map((header) => toCsvCell(header)).join(','),
//       ...rows.map((row) => row.map((cell) => toCsvCell(cell)).join(',')),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `sales-report-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div style={{ padding: '12px', fontFamily: 'Arial, sans-serif' }}>
//       <style>{`
//         @media (min-width: 768px) {
//           .analytics-container {
//             padding: 20px !important;
//           }
//         }

//         @media (max-width: 767px) {
//           .header-controls {
//             flex-direction: column !important;
//             gap: 8px !important;
//             width: 100%;
//           }

//           .header-controls > div {
//             flex-direction: column !important;
//             width: 100%;
//           }

//           .header-controls select,
//           .header-controls button {
//             width: 100% !important;
//             min-width: unset !important;
//           }

//           .summary-cards {
//             flex-direction: column !important;
//           }

//           .charts-container {
//             flex-direction: column !important;
//           }

//           .table-container {
//             overflow-x: auto;
//             -webkit-overflow-scrolling: touch;
//           }

//           .table-container table {
//             min-width: 500px;
//           }
//         }

//         @media (max-width: 480px) {
//           .header-title {
//             font-size: 20px !important;
//           }

//           .card-value {
//             font-size: 24px !important;
//           }

//           .chart-title {
//             font-size: 16px !important;
//           }
//         }
//       `}</style>

//       <div
//         className="analytics-container"
//         style={{
//           background: 'white',
//           padding: '16px',
//           borderRadius: '12px',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//           marginBottom: '16px',
//         }}
//       >
//         <h2 className="header-title" style={{ fontSize: '24px', color: '#333', marginBottom: '16px' }}>
//           Sales Analytics
//         </h2>

//         <div className="header-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//           <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
//             <select
//               value={period}
//               onChange={(e) => setPeriod(e.target.value as Period)}
//               style={{
//                 flex: 1,
//                 minWidth: '120px',
//                 padding: '8px 10px',
//                 borderRadius: '6px',
//                 border: '1px solid #ccc',
//                 fontSize: '14px',
//               }}
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>

//             <select
//               value={chartType}
//               onChange={(e) => setChartType(e.target.value as ChartType)}
//               style={{
//                 flex: 1,
//                 minWidth: '120px',
//                 padding: '8px 10px',
//                 borderRadius: '6px',
//                 border: '1px solid #ccc',
//                 fontSize: '14px',
//               }}
//             >
//               <option value="line">Line Chart</option>
//               <option value="bar">Bar Chart</option>
//             </select>
//           </div>

//           <button
//             onClick={() => dispatch(getSalesAnalyticsAction(period))}
//             style={{
//               backgroundColor: '#3B82F6',
//               color: 'white',
//               padding: '8px 16px',
//               borderRadius: '6px',
//               border: 'none',
//               cursor: 'pointer',
//               fontSize: '14px',
//               whiteSpace: 'nowrap',
//               opacity: loading ? 0.7 : 1,
//             }}
//             disabled={loading}
//           >
//             {loading ? 'Refreshing...' : 'Refresh'}
//           </button>

//           <button
//             onClick={handleExportReport}
//             style={{
//               backgroundColor: '#0F766E',
//               color: 'white',
//               padding: '8px 16px',
//               borderRadius: '6px',
//               border: 'none',
//               cursor: orderBreakdown.length > 0 ? 'pointer' : 'not-allowed',
//               fontSize: '14px',
//               whiteSpace: 'nowrap',
//               opacity: orderBreakdown.length > 0 ? 1 : 0.6,
//             }}
//             disabled={orderBreakdown.length === 0}
//           >
//             Generate Report
//           </button>
//         </div>

//         <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//           {([
//             { key: 'today', label: "Today's Sales" },
//             { key: 'last7', label: 'Last 7 Days' },
//             { key: 'last30', label: 'Last 30 Days' },
//             { key: 'all', label: 'All Time' },
//           ] as Array<{ key: DateRange; label: string }>).map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setDateRange(tab.key)}
//               style={{
//                 padding: '8px 12px',
//                 borderRadius: '8px',
//                 border: dateRange === tab.key ? '1px solid #1D4ED8' : '1px solid #CBD5E1',
//                 backgroundColor: dateRange === tab.key ? '#DBEAFE' : 'white',
//                 color: dateRange === tab.key ? '#1E3A8A' : '#334155',
//                 fontWeight: 600,
//                 cursor: 'pointer',
//                 fontSize: '13px',
//               }}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="summary-cards" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
//         <div
//           style={{
//             flex: 1,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             padding: '20px',
//             borderRadius: '12px',
//             textAlign: 'center',
//             minWidth: '0',
//           }}
//         >
//           <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Sales</div>
//           <div
//             className="card-value"
//             style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0', wordBreak: 'break-word' }}
//           >
//             {formatCurrency(totalSales)}
//           </div>
//           <div style={{ fontSize: '12px' }}>From scanned orders</div>
//         </div>

//         <div
//           style={{
//             flex: 1,
//             background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//             color: 'white',
//             padding: '20px',
//             borderRadius: '12px',
//             textAlign: 'center',
//             minWidth: '0',
//           }}
//         >
//           <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Orders</div>
//           <div
//             className="card-value"
//             style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0', wordBreak: 'break-word' }}
//           >
//             {totalOrders}
//           </div>
//           <div style={{ fontSize: '12px' }}>Completed scans</div>
//         </div>

//         <div
//           style={{
//             flex: 1,
//             background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//             color: 'white',
//             padding: '20px',
//             borderRadius: '12px',
//             textAlign: 'center',
//             minWidth: '0',
//           }}
//         >
//           <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Items Sold</div>
//           <div
//             className="card-value"
//             style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0', wordBreak: 'break-word' }}
//           >
//             {totalItems}
//           </div>
//           <div style={{ fontSize: '12px' }}>Across all products</div>
//         </div>
//       </div>

//       <div className="charts-container" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
//         <div
//           style={{
//             flex: 2,
//             background: 'white',
//             padding: '16px',
//             borderRadius: '12px',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//             minWidth: '0',
//             width: '100%',
//           }}
//         >
//           <h3 className="chart-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
//             Sales Trend ({period.charAt(0).toUpperCase() + period.slice(1)})
//           </h3>

//           {hasSalesData ? (
//             <ResponsiveContainer width="100%" height={300}>
//               {chartType === 'line' ? (
//                 <LineChart data={formattedSalesData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip
//                     formatter={(value: number, name: string) => {
//                       if (name === 'sales') return [formatCurrency(toNumber(value)), 'Sales'];
//                       if (name === 'orders') return [toNumber(value), 'Orders'];
//                       if (name === 'items') return [toNumber(value), 'Items'];
//                       return [value, name];
//                     }}
//                     labelFormatter={(label) => `Period: ${label}`}
//                     contentStyle={{ fontSize: '12px' }}
//                   />
//                   <Legend wrapperStyle={{ fontSize: '12px' }} />
//                   <Line type="monotone" dataKey="sales" stroke="#6366F1" strokeWidth={2} name="Sales Amount" />
//                   <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} name="Order Count" />
//                 </LineChart>
//               ) : (
//                 <BarChart data={formattedSalesData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip
//                     formatter={(value: number, name: string) => {
//                       if (name === 'sales') return [formatCurrency(toNumber(value)), 'Sales'];
//                       if (name === 'orders') return [toNumber(value), 'Orders'];
//                       if (name === 'items') return [toNumber(value), 'Items'];
//                       return [value, name];
//                     }}
//                     contentStyle={{ fontSize: '12px' }}
//                   />
//                   <Legend wrapperStyle={{ fontSize: '12px' }} />
//                   <Bar dataKey="sales" fill="#6366F1" name="Sales Amount" />
//                   <Bar dataKey="orders" fill="#10B981" name="Order Count" />
//                 </BarChart>
//               )}
//             </ResponsiveContainer>
//           ) : (
//             <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
//               {loading ? 'Loading sales trend...' : 'No sales data available for this period'}
//             </div>
//           )}
//         </div>

//         <div
//           style={{
//             flex: 1,
//             background: 'white',
//             padding: '16px',
//             borderRadius: '12px',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//             minWidth: '0',
//             width: '100%',
//           }}
//         >
//           <h3 className="chart-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
//             Top Selling Products
//           </h3>

//           {hasProducts ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieTopProducts}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={(entry) => {
//                     const item = entry as unknown as PieTopProductData;
//                     const shortName =
//                       String(item.name).length > 14 ? `${String(item.name).substring(0, 12)}...` : String(item.name);
//                     return `${shortName}: ${toNumber(item.totalQuantity)}`;
//                   }}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="totalQuantity"
//                 >
//                   {pieTopProducts.map((entry, index) => (
//                     <Cell key={`${entry.productId}-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value: number, name: string, payload) => {
//                     if (name === 'totalQuantity') {
//                       return [toNumber(value), 'Quantity Sold'];
//                     }

//                     const revenue = toNumber(payload?.payload?.totalRevenue);
//                     return [formatCurrency(revenue), 'Revenue'];
//                   }}
//                   contentStyle={{ fontSize: '12px' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
//               {loading ? 'Loading top products...' : 'No product sales data available'}
//             </div>
//           )}
//         </div>
//       </div>

//       <div
//         style={{
//           background: 'white',
//           padding: '16px',
//           borderRadius: '12px',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//         }}
//       >
//         <h3 className="chart-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
//           Top Products Details
//         </h3>

//         <div className="table-container">
//           {hasProducts ? (
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ backgroundColor: '#f8fafc' }}>
//                   <th
//                     style={{
//                       padding: '12px',
//                       textAlign: 'left',
//                       borderBottom: '1px solid #e2e8f0',
//                       fontSize: '14px',
//                     }}
//                   >
//                     Product Name
//                   </th>
//                   <th
//                     style={{
//                       padding: '12px',
//                       textAlign: 'right',
//                       borderBottom: '1px solid #e2e8f0',
//                       fontSize: '14px',
//                     }}
//                   >
//                     Quantity Sold
//                   </th>
//                   <th
//                     style={{
//                       padding: '12px',
//                       textAlign: 'right',
//                       borderBottom: '1px solid #e2e8f0',
//                       fontSize: '14px',
//                     }}
//                   >
//                     Total Revenue
//                   </th>
//                   <th
//                     style={{
//                       padding: '12px',
//                       textAlign: 'right',
//                       borderBottom: '1px solid #e2e8f0',
//                       fontSize: '14px',
//                     }}
//                   >
//                     Avg. Price
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {formattedTopProducts.slice(0, 10).map((product) => (
//                   <tr key={product.productId} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                     <td style={{ padding: '12px', fontSize: '14px' }}>
//                       {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
//                       {product.totalQuantity}
//                     </td>
//                     <td
//                       style={{
//                         padding: '12px',
//                         textAlign: 'right',
//                         color: '#059669',
//                         fontWeight: 'bold',
//                         fontSize: '14px',
//                       }}
//                     >
//                       {formatCurrency(product.totalRevenue)}
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px' }}>
//                       {formatCurrency(product.avgPrice)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p style={{ color: '#64748B' }}>{loading ? 'Loading product table...' : 'No product data available'}</p>
//           )}
//         </div>
//       </div>

//       <div
//         style={{
//           background: 'white',
//           padding: '16px',
//           borderRadius: '12px',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//           marginTop: '16px',
//         }}
//       >
//         <h3 className="chart-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}>
//           Scanned Order Price Breakdown
//         </h3>
//         <p style={{ color: '#64748B', marginBottom: '16px', fontSize: '13px' }}>
//           Clear price split for each scanned order: products subtotal, shipping charge, gift box charge, and final total.
//         </p>

//         <div className="table-container">
//           {orderBreakdown.length > 0 ? (
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ backgroundColor: '#f8fafc' }}>
//                   <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Order ID
//                   </th>
//                   <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Scanned At
//                   </th>
//                   <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Products
//                   </th>
//                   <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Product Subtotal
//                   </th>
//                   <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Shipping
//                   </th>
//                   <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Gift Box
//                   </th>
//                   <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Other
//                   </th>
//                   <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
//                     Final Total
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderBreakdown.slice(0, 50).map((order) => (
//                   <tr key={order.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                     <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600 }}>{order.orderId}</td>
//                     <td style={{ padding: '12px', fontSize: '13px' }}>{order.scannedAt}</td>
//                     <td style={{ padding: '12px', fontSize: '13px' }}>
//                       <div style={{ maxWidth: '280px' }}>
//                         {order.productSummary || 'No products'}
//                         <div style={{ color: '#64748B', marginTop: '3px' }}>
//                           {order.productCount} products, {order.totalItems} items
//                         </div>
//                       </div>
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>
//                       {formatCurrency(order.productSubtotal)}
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>
//                       {formatCurrency(order.shippingCharge)}
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>
//                       {formatCurrency(order.giftBoxCharge)}
//                     </td>
//                     <td
//                       style={{
//                         padding: '12px',
//                         textAlign: 'right',
//                         fontSize: '13px',
//                         color: Math.abs(order.otherCharges) > 0.01 ? '#B45309' : '#475569',
//                         fontWeight: Math.abs(order.otherCharges) > 0.01 ? 600 : 400,
//                       }}
//                     >
//                       {formatCurrency(order.otherCharges)}
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#059669' }}>
//                       {formatCurrency(order.totalAmount)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p style={{ color: '#64748B' }}>
//               {loading ? 'Loading scanned order price breakdown...' : 'No scanned orders found for selected range.'}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesAnalytics;




import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { getSalesAnalyticsAction } from '../qrScanner/qrScanner.slice';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ChevronDown,
  Filter,
  Zap,
  DollarSign,
  Award,
  Clock,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BASE_URL } from 'src/config';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';
type ChartType = 'line' | 'bar' | 'area';
type DateRange = 'today' | 'last7' | 'last30' | 'all';

interface AggregatedId {
  day?: number;
  week?: number;
  month?: number;
  year?: number;
}

interface AggregatedSalesItem {
  _id: AggregatedId;
  totalSales: number;
  orderCount: number;
  totalItems: number;
}

interface ProductRef {
  _id?: string;
  id?: string;
  name?: string;
}

interface OrderProductItem {
  productId: ProductRef | string;
  quantity: number;
  price?: number;
}

interface OrderItem {
  _id: string;
  products: OrderProductItem[];
  totalAmount: number;
  date?: string;
  scannedAt?: string;
  productOrderId?: string;
  shippingPrice?: number;
  giftBoxCharge?: number;
  includeGiftBox?: boolean;
}

interface AggregatedTopProductItem {
  _id?: string;
  totalQuantity: number;
  totalRevenue: number;
  productDetails?: Array<{ name?: string }>;
}

interface SalesChartData {
  name: string;
  sales: number;
  orders: number;
  items: number;
  sortValue: number;
  avgOrderValue: number;
}

interface TopProductData {
  productId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  avgPrice: number;
  contribution: number;
}

interface PieTopProductData extends TopProductData {
  [key: string]: string | number;
}

interface OrderBreakdownData {
  mongoId: string;
  orderId: string;
  scannedAt: string;
  productCount: number;
  totalItems: number;
  productSubtotal: number;
  shippingCharge: number;
  giftBoxCharge: number;
  computedTotal: number;
  totalAmount: number;
  productSummary: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number): string => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatCompactCurrency = (value: number): string => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
};

const getOrderDate = (order: OrderItem): Date | null => {
  const rawDate = order.scannedAt || order.date;
  if (!rawDate) return null;
  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const filterOrdersByRange = (orders: OrderItem[], range: DateRange): OrderItem[] => {
  if (range === 'all') return orders;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last7Start = new Date(todayStart);
  last7Start.setDate(todayStart.getDate() - 6);
  const last30Start = new Date(todayStart);
  last30Start.setDate(todayStart.getDate() - 29);

  return orders.filter((order) => {
    const orderDate = getOrderDate(order);
    if (!orderDate) return false;

    if (range === 'today') {
      return isSameDay(orderDate, now);
    }

    if (range === 'last7') {
      return orderDate >= last7Start;
    }

    return orderDate >= last30Start;
  });
};

const toCsvCell = (value: string | number): string => {
  const safe = String(value).replace(/"/g, '""');
  return `"${safe}"`;
};

const getPeriodLabel = (date: Date, period: Period): { label: string; sortValue: number } => {
  if (period === 'daily') {
    return {
      label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      sortValue: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
    };
  }

  if (period === 'weekly') {
    const day = date.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + mondayOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
      label: `${weekStart.getDate()}/${weekStart.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
      sortValue: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).getTime(),
    };
  }

  if (period === 'yearly') {
    return {
      label: date.getFullYear().toString(),
      sortValue: new Date(date.getFullYear(), 0, 1).getTime(),
    };
  }

  return {
    label: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    sortValue: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
  };
};

const isAggregatedSalesItem = (value: unknown): value is AggregatedSalesItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<AggregatedSalesItem>;
  return Boolean(item._id && typeof item.totalSales === 'number' && typeof item.orderCount === 'number');
};

const isOrderItem = (value: unknown): value is OrderItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<OrderItem>;
  return Array.isArray(item.products) && typeof item.totalAmount === 'number';
};

const normalizeSalesData = (rawSalesData: unknown[], period: Period): SalesChartData[] => {
  if (!Array.isArray(rawSalesData) || rawSalesData.length === 0) {
    return [];
  }

  if (isAggregatedSalesItem(rawSalesData[0])) {
    const mapped = (rawSalesData as AggregatedSalesItem[]).map((item) => {
      const year = item._id.year ?? 1970;
      const month = (item._id.month ?? 1) - 1;
      const day = item._id.day ?? 1;
      const baseDate = new Date(year, month, day);

      const labelData = getPeriodLabel(baseDate, period);
      const sales = toNumber(item.totalSales);
      const orders = toNumber(item.orderCount);

      return {
        name: labelData.label,
        sales,
        orders,
        items: toNumber(item.totalItems),
        sortValue: labelData.sortValue,
        avgOrderValue: orders > 0 ? sales / orders : 0,
      };
    });

    return mapped.sort((a, b) => a.sortValue - b.sortValue);
  }

  const grouped: Record<string, SalesChartData> = {};

  (rawSalesData as OrderItem[]).forEach((order) => {
    if (!isOrderItem(order)) return;

    const date = new Date(order.scannedAt || order.date || Date.now());
    if (Number.isNaN(date.getTime())) return;

    const { label, sortValue } = getPeriodLabel(date, period);

    if (!grouped[label]) {
      grouped[label] = {
        name: label,
        sales: 0,
        orders: 0,
        items: 0,
        sortValue,
        avgOrderValue: 0,
      };
    }

    grouped[label].sales += toNumber(order.totalAmount);
    grouped[label].orders += 1;
    grouped[label].items += order.products.reduce((sum, product) => sum + toNumber(product.quantity), 0);
  });

  const result = Object.values(grouped).sort((a, b) => a.sortValue - b.sortValue);
  
  return result.map(item => ({
    ...item,
    avgOrderValue: item.orders > 0 ? item.sales / item.orders : 0,
  }));
};

const normalizeTopProducts = (rawTopProducts: unknown[]): TopProductData[] => {
  if (!Array.isArray(rawTopProducts) || rawTopProducts.length === 0) {
    return [];
  }

  const looksAggregated =
    typeof rawTopProducts[0] === 'object' &&
    rawTopProducts[0] !== null &&
    'totalQuantity' in (rawTopProducts[0] as Record<string, unknown>);

  let products: TopProductData[] = [];

  if (looksAggregated && !isOrderItem(rawTopProducts[0])) {
    products = (rawTopProducts as AggregatedTopProductItem[])
      .map((item, index) => {
        const totalQuantity = toNumber(item.totalQuantity);
        const totalRevenue = toNumber(item.totalRevenue);
        return {
          productId: item._id || `product-${index}`,
          name: item.productDetails?.[0]?.name || 'Unknown Product',
          totalQuantity,
          totalRevenue,
          avgPrice: totalQuantity > 0 ? totalRevenue / totalQuantity : 0,
          contribution: 0,
        };
      });
  } else {
    const productMap: Record<string, TopProductData> = {};

    (rawTopProducts as OrderItem[]).forEach((order) => {
      if (!isOrderItem(order)) return;

      order.products.forEach((item, itemIndex) => {
        const productObject = typeof item.productId === 'string' ? {} : item.productId;
        const productId =
          (typeof item.productId === 'string' ? item.productId : productObject._id || productObject.id) ||
          `unknown-${order._id}-${itemIndex}`;
        const productName = typeof item.productId === 'string' ? 'Unknown Product' : productObject.name || 'Unknown Product';

        if (!productMap[productId]) {
          productMap[productId] = {
            productId,
            name: productName,
            totalQuantity: 0,
            totalRevenue: 0,
            avgPrice: 0,
            contribution: 0,
          };
        }

        const quantity = toNumber(item.quantity);
        const lineRevenue = quantity * toNumber(item.price);

        productMap[productId].totalQuantity += quantity;
        productMap[productId].totalRevenue += lineRevenue;
      });
    });

    products = Object.values(productMap).map((item) => ({
      ...item,
      avgPrice: item.totalQuantity > 0 ? item.totalRevenue / item.totalQuantity : 0,
      contribution: 0,
    }));
  }

  const totalProductRevenue = products.reduce((sum, item) => sum + item.totalRevenue, 0);

  return products
    .map((p) => ({
      ...p,
      contribution: totalProductRevenue > 0 ? (p.totalRevenue / totalProductRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);
};

const SalesAnalytics: React.FC = () => {
  const dispatch = useDispatch();
  const { salesData, topProducts, loading } = useSelector((state: any) => state.scan);

  const [period, setPeriod] = useState<Period>('monthly');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [deletingSalesId, setDeletingSalesId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getSalesAnalyticsAction(period));
  }, [dispatch, period]);

  const normalizedOrderSalesData = useMemo<OrderItem[]>(() => {
    const source = (salesData || []) as unknown[];
    if (!Array.isArray(source)) return [];
    return source.filter(isOrderItem);
  }, [salesData]);

  const filteredOrders = useMemo<OrderItem[]>(
    () => filterOrdersByRange(normalizedOrderSalesData, dateRange),
    [normalizedOrderSalesData, dateRange]
  );

  const chartSource = useMemo<unknown[]>(() => {
    if (filteredOrders.length > 0) return filteredOrders;
    return (salesData || []) as unknown[];
  }, [filteredOrders, salesData]);

  const productSource = useMemo<unknown[]>(() => {
    if (filteredOrders.length > 0) return filteredOrders;
    return (topProducts || []) as unknown[];
  }, [filteredOrders, topProducts]);

  const formattedSalesData = useMemo(() => normalizeSalesData(chartSource, period), [chartSource, period]);

  const totalSales = useMemo(
    () => formattedSalesData.reduce((sum, item) => sum + item.sales, 0),
    [formattedSalesData]
  );

  const totalOrders = useMemo(
    () => formattedSalesData.reduce((sum, item) => sum + item.orders, 0),
    [formattedSalesData]
  );

  const totalItems = useMemo(
    () => formattedSalesData.reduce((sum, item) => sum + item.items, 0),
    [formattedSalesData]
  );

  const averageOrderValue = useMemo(
    () => (totalOrders > 0 ? totalSales / totalOrders : 0),
    [totalSales, totalOrders]
  );

  const growthRate = useMemo(() => {
    if (formattedSalesData.length < 2) return 0;
    const lastTwo = formattedSalesData.slice(-2);
    const previous = lastTwo[0].sales;
    const current = lastTwo[1].sales;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }, [formattedSalesData]);

  const formattedTopProducts = useMemo(() => normalizeTopProducts(productSource), [productSource]);

  const hasSalesData = formattedSalesData.length > 0;
  const hasProducts = formattedTopProducts.length > 0;
  const pieTopProducts = useMemo<PieTopProductData[]>(
    () => formattedTopProducts.slice(0, 6).map((item) => ({ ...item })),
    [formattedTopProducts]
  );

  const orderBreakdown = useMemo<OrderBreakdownData[]>(() => {
    return filteredOrders
      .map((order) => {
        const orderDate = getOrderDate(order);
        const shippingCharge = toNumber(order.shippingPrice);
        const giftBoxCharge = toNumber(order.giftBoxCharge);

        const productSubtotal = order.products.reduce(
          (sum, item) => sum + toNumber(item.price),
          0
        );

        const totalItemsForOrder = order.products.reduce((sum, item) => sum + toNumber(item.quantity), 0);
        const computedTotal = productSubtotal + shippingCharge + giftBoxCharge;
        const actualTotal = toNumber(order.totalAmount);

        const productSummary = order.products
          .slice(0, 3)
          .map((item) => {
            const productRef = typeof item.productId === 'string' ? item.productId : item.productId.name || 'Unknown Product';
            const lineTotal = toNumber(item.price);
            const quantity = toNumber(item.quantity);
            const unitPrice = quantity > 0 ? lineTotal / quantity : lineTotal;
            return `${productRef} x${quantity} @ ${formatCurrency(unitPrice)} = ${formatCurrency(lineTotal)}`;
          })
          .join(', ');

        return {
          mongoId: order._id,
          orderId: order.productOrderId || order._id,
          scannedAt: orderDate ? orderDate.toLocaleString() : 'N/A',
          productCount: order.products.length,
          totalItems: totalItemsForOrder,
          productSubtotal,
          shippingCharge,
          giftBoxCharge,
          computedTotal,
          totalAmount: actualTotal,
          productSummary,
        };
      })
      .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  }, [filteredOrders]);

  const handleDeleteSalesData = async (row: OrderBreakdownData): Promise<void> => {
    const displayId = row.orderId;
    const shouldDelete = window.confirm(
      `Remove sales data for order ${displayId}? This will unscan the order from analytics.`
    );

    if (!shouldDelete) return;

    setDeletingSalesId(row.mongoId);

    try {
      const response = await fetch(`${BASE_URL}/scan/sales-analytics/${row.mongoId}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || 'Failed to remove sales data');
      }

      toast.success(`Removed sales data for order ${displayId}`);
      dispatch(getSalesAnalyticsAction(period));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to remove sales data');
    } finally {
      setDeletingSalesId(null);
    }
  };

  const handleExportReport = (): void => {
    if (orderBreakdown.length === 0) return;

    const summaryLines = [
      ['Report Range', dateRange],
      ['Chart Period', period],
      ['Total Sales', totalSales.toFixed(2)],
      ['Total Orders', totalOrders],
      ['Total Items', totalItems],
      ['Average Order Value', averageOrderValue.toFixed(2)],
      ['Growth Rate', `${growthRate.toFixed(1)}%`],
      ['Generated At', new Date().toLocaleString()],
      [],
    ];

    const headers = [
      'Order ID',
      'Scanned At',
      'Products',
      'Total Items',
      'Product Subtotal',
      'Shipping Charge',
      'Gift Box Charge',
      'Calculated Total',
      'Actual Total',
      'Products Summary',
    ];

    const rows = orderBreakdown.map((item) => [
      item.orderId,
      item.scannedAt,
      item.productCount,
      item.totalItems,
      item.productSubtotal.toFixed(2),
      item.shippingCharge.toFixed(2),
      item.giftBoxCharge.toFixed(2),
      item.computedTotal.toFixed(2),
      item.totalAmount.toFixed(2),
      item.productSummary,
    ]);

    const csvContent = [
      ...summaryLines.map((line) => line.map((cell) => toCsvCell(cell ?? '')).join(',')),
      headers.map((header) => toCsvCell(header)).join(','),
      ...rows.map((row) => row.map((cell) => toCsvCell(cell)).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales-report-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ChartComponent = {
    line: LineChart,
    bar: BarChart,
    area: AreaChart,
  }[chartType];

  const ChartDataComponent = {
    line: Line,
    bar: Bar,
    area: Area,
  }[chartType];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUp size={32} />
                Sales Analytics Dashboard
              </h1>
              <p style={{ opacity: 0.9, fontSize: '14px' }}>Real-time insights into your business performance</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => dispatch(getSalesAnalyticsAction(period))}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s',
                }}
                disabled={loading}
              >
                <RefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={handleExportReport}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: orderBreakdown.length > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                disabled={orderBreakdown.length === 0}
              >
                <Download size={18} />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '-24px auto 0', padding: '0 24px 24px' }}>
        {/* Date Range Tabs */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {([
              { key: 'today', label: "Today", icon: Clock },
              { key: 'last7', label: 'Last 7 Days', icon: Calendar },
              { key: 'last30', label: 'Last 30 Days', icon: Calendar },
              { key: 'all', label: 'All Time', icon: Filter },
            ] as Array<{ key: DateRange; label: string; icon: any }>).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDateRange(tab.key)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: dateRange === tab.key ? '#3B82F6' : 'transparent',
                  color: dateRange === tab.key ? 'white' : '#64748B',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '16px' }}>
                <DollarSign size={24} color="#3B82F6" />
              </div>
              {growthRate !== 0 && (
                <div style={{ 
                  background: growthRate >= 0 ? '#D1FAE5' : '#FEE2E2', 
                  color: growthRate >= 0 ? '#065F46' : '#991B1B',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <TrendingUp size={14} style={{ transform: growthRate >= 0 ? 'none' : 'rotate(180deg)' }} />
                  {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
                </div>
              )}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
              {formatCurrency(totalSales)}
            </div>
            <div style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>Total Sales Revenue</div>
            <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '8px' }}>vs previous period</div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#F0FDF4', padding: '12px', borderRadius: '16px' }}>
                <ShoppingBag size={24} color="#10B981" />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
              {totalOrders.toLocaleString()}
            </div>
            <div style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>Total Orders</div>
            <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '8px' }}>Completed transactions</div>
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '16px' }}>
                <Package size={24} color="#F59E0B" />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E293B', marginBottom: '8px' }}>
              {totalItems.toLocaleString()}
            </div>
            <div style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>Items Sold</div>
            <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '8px' }}>Total quantity</div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
                <Award size={24} />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              {formatCurrency(averageOrderValue)}
            </div>
            <div style={{ opacity: 0.9, fontSize: '14px', fontWeight: 500 }}>Average Order Value</div>
            <div style={{ opacity: 0.7, fontSize: '12px', marginTop: '8px' }}>Revenue per order</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <label style={{ color: '#475569', fontWeight: 500, fontSize: '14px' }}>Time Period:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                style={{
                  padding: '8px 32px 8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setChartType('line')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: chartType === 'line' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                  background: chartType === 'line' ? '#EFF6FF' : 'white',
                  color: chartType === 'line' ? '#3B82F6' : '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <LineChartIcon size={16} />
                Line
              </button>
              <button
                onClick={() => setChartType('bar')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: chartType === 'bar' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                  background: chartType === 'bar' ? '#EFF6FF' : 'white',
                  color: chartType === 'bar' ? '#3B82F6' : '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <BarChart3 size={16} />
                Bar
              </button>
              <button
                onClick={() => setChartType('area')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: chartType === 'area' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                  background: chartType === 'area' ? '#EFF6FF' : 'white',
                  color: chartType === 'area' ? '#3B82F6' : '#64748B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                <PieChartIcon size={16} />
                Area
              </button>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '24px', marginBottom: '24px' }}>
          {/* Sales Trend Chart */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B' }}>Sales Trend</h3>
              <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>Revenue and order volume over time</p>
            </div>
            {hasSalesData ? (
              <ResponsiveContainer width="100%" height={350}>
                <ChartComponent data={formattedSalesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} angle={-45} textAnchor="end" height={80} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={formatCompactCurrency} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'sales') return [formatCurrency(value), 'Revenue'];
                      if (name === 'orders') return [value.toLocaleString(), 'Orders'];
                      if (name === 'avgOrderValue') return [formatCurrency(value), 'Avg Order Value'];
                      return [value, name];
                    }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  {chartType === 'area' ? (
                    <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} fill="url(#salesGradient)" name="Revenue" />
                  ) : (
                    <ChartDataComponent yAxisId="left" type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" name="Revenue" />
                  )}
                  <ChartDataComponent yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} fill="#10B981" name="Orders" />
                </ChartComponent>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                {loading ? 'Loading sales data...' : 'No data available for selected period'}
              </div>
            )}
          </div>

          {/* Top Products Pie */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B' }}>Top Products</h3>
              <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>Revenue distribution by product</p>
            </div>
            {hasProducts ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieTopProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => {
                      const item = entry as unknown as PieTopProductData;
                      const shortName = String(item.name).length > 12 ? `${String(item.name).substring(0, 10)}...` : String(item.name);
                      return `${shortName}: ${item.totalQuantity}`;
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalRevenue"
                  >
                    {pieTopProducts.map((entry, index) => (
                      <Cell key={`${entry.productId}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, payload: any) => {
                      const item = payload?.payload;
                      return [
                        <>
                          <div><strong>{item?.name}</strong></div>
                          <div>Revenue: {formatCurrency(item?.totalRevenue)}</div>
                          <div>Quantity: {item?.totalQuantity}</div>
                          <div>Contribution: {item?.contribution?.toFixed(1)}%</div>
                        </>
                      ];
                    }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                {loading ? 'Loading products...' : 'No product data available'}
              </div>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B' }}>Product Performance</h3>
              <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>Detailed breakdown of top selling products</p>
            </div>
            <button
              onClick={() => setShowProductDetails(!showProductDetails)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                background: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: '#3B82F6',
              }}
            >
              {showProductDetails ? 'Show Less' : 'View All Products'}
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Product</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Quantity</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Revenue</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Avg Price</th>
                  <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {(showProductDetails ? formattedTopProducts : formattedTopProducts.slice(0, 5)).map((product, index) => (
                  <tr key={product.productId} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}80)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: '#1E293B' }}>
                      {product.totalQuantity.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', color: '#059669', fontWeight: 'bold', fontSize: '14px' }}>
                      {formatCurrency(product.totalRevenue)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: '#64748B' }}>
                      {formatCurrency(product.avgPrice)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', background: '#E2E8F0', borderRadius: '20px', overflow: 'hidden' }}>
                          <div style={{ width: `${product.contribution}%`, height: '6px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#3B82F6' }}>{product.contribution.toFixed(1)}%</span>
                      </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Breakdown */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B' }}>Order Details</h3>
            <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>Complete breakdown of each scanned order</p>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {orderBreakdown.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Order ID</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Products</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Subtotal</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Shipping</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Gift Box</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Total</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#475569' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBreakdown.slice(0, 20).map((order) => (
                    <tr key={`${order.mongoId}-${order.orderId}`} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#3B82F6' }}>#{order.orderId}</td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#64748B' }}>{order.scannedAt}</td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#1E293B' }}>
                        <div style={{ maxWidth: '360px' }}>
                          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{order.productCount} product line(s)</div>
                          <div style={{ color: '#64748B', lineHeight: 1.5 }}>
                            {order.productSummary || 'No products'}
                          </div>
                          <div style={{ color: '#94A3B8', marginTop: '4px' }}>
                            {order.totalItems} total item(s)
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: '#64748B' }}>
                        {formatCurrency(order.productSubtotal)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: '#64748B' }}>
                        {formatCurrency(order.shippingCharge)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: '#64748B' }}>
                        {formatCurrency(order.giftBoxCharge)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteSalesData(order)}
                          disabled={deletingSalesId === order.mongoId}
                          style={{
                            border: '1px solid #DC2626',
                            background: deletingSalesId === order.mongoId ? '#FEE2E2' : '#FEF2F2',
                            color: '#B91C1C',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: deletingSalesId === order.mongoId ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Trash2 size={14} />
                          {deletingSalesId === order.mongoId ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
                {loading ? 'Loading orders...' : 'No orders found for selected range'}
              </div>
            )}
          </div>
          {orderBreakdown.length > 20 && (
            <div style={{ textAlign: 'center', marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '12px', color: '#64748B', fontSize: '13px' }}>
              Showing 20 of {orderBreakdown.length} orders. Export full report for complete data.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 1024px) {
          .recharts-responsive-container {
            height: 300px !important;
          }
        }
        
        @media (max-width: 768px) {
          .recharts-responsive-container {
            height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesAnalytics;