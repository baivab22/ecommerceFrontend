import React, { useState, useEffect } from 'react';
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
  Cell
} from 'recharts';

// ------------------- Types -------------------

interface SalesItem {
  _id: {
    day?: number;
    week?: number;
    month: number;
    year: number;
  };
  totalSales: number;
  orderCount: number;
  totalItems: number;
}

interface TopProductItem {
  productDetails: { name?: string }[];
  totalQuantity: number;
  totalRevenue: number;
}

interface SalesChartData {
  name: string;
  sales: number;
  orders: number;
  items: number;
}

interface TopProductsChartData {
  name: string;
  value: number;
  revenue: number;
}

// ------------------- Component -------------------

const SalesAnalytics: React.FC = () => {
  const dispatch = useDispatch();
  const { salesData, topProducts, loading } = useSelector((state: any) => state.scan);

  const [period, setPeriod] = useState<string>('monthly');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    dispatch(getSalesAnalyticsAction(period));
  }, [dispatch, period]);

  // Format Sales Data for Charts
  const formatSalesData = (): SalesChartData[] =>
    salesData.map((item: SalesItem) => {
      let label = '';
      if (period === 'daily') label = `${item._id.day}/${item._id.month}/${item._id.year}`;
      else if (period === 'weekly') label = `Week ${item._id.week}, ${item._id.year}`;
      else if (period === 'yearly') label = `Year ${item._id.year}`;
      else label = `${item._id.month}/${item._id.year}`;

      return {
        name: label,
        sales: item.totalSales,
        orders: item.orderCount,
        items: item.totalItems
      };
    });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatTopProductsData = (): TopProductsChartData[] =>
    topProducts.map((item: TopProductItem) => ({
      name: item.productDetails[0]?.name || 'Unknown Product',
      value: item.totalQuantity,
      revenue: item.totalRevenue
    }));

  const totalSales = salesData.reduce((sum: number, item: SalesItem) => sum + item.totalSales, 0);
  const totalOrders = salesData.reduce((sum: number, item: SalesItem) => sum + item.orderCount, 0);

  return (
    <div style={{ padding: '12px', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        @media (min-width: 768px) {
          .analytics-container {
            padding: 20px !important;
          }
        }
        
        @media (max-width: 767px) {
          .header-controls {
            flex-direction: column !important;
            gap: 8px !important;
            width: 100%;
          }
          
          .header-controls > div {
            flex-direction: column !important;
            width: 100%;
          }
          
          .header-controls select,
          .header-controls button {
            width: 100% !important;
            min-width: unset !important;
          }
          
          .summary-cards {
            flex-direction: column !important;
          }
          
          .charts-container {
            flex-direction: column !important;
          }
          
          .table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .table-container table {
            min-width: 500px;
          }
        }
        
        @media (max-width: 480px) {
          .header-title {
            font-size: 20px !important;
          }
          
          .card-value {
            font-size: 24px !important;
          }
          
          .chart-title {
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="analytics-container"
        style={{
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '16px'
        }}
      >
        <h2 className="header-title" style={{ fontSize: '24px', color: '#333', marginBottom: '16px' }}>
          Sales Analytics
        </h2>

        <div className="header-controls" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{ 
                flex: 1,
                minWidth: '120px', 
                padding: '8px 10px', 
                borderRadius: '6px', 
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
              style={{ 
                flex: 1,
                minWidth: '120px', 
                padding: '8px 10px', 
                borderRadius: '6px', 
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </select>
          </div>

          <button
            onClick={() => dispatch(getSalesAnalyticsAction(period))}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            minWidth: '0'
          }}
        >
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Sales</div>
          <div className="card-value" style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0', wordBreak: 'break-word' }}>
            Rs. {totalSales.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px' }}>All Time</div>
        </div>

        <div
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            minWidth: '0'
          }}
        >
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Orders</div>
          <div className="card-value" style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0', wordBreak: 'break-word' }}>
            {totalOrders}
          </div>
          <div style={{ fontSize: '12px' }}>Completed Scans</div>
        </div>

        <div
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            minWidth: '0'
          }}
        >
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Average Order</div>
          <div className="card-value" style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0', wordBreak: 'break-word' }}>
            Rs. {totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : '0.00'}
          </div>
          <div style={{ fontSize: '12px' }}>Per Order</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
        {/* Sales Trend Chart */}
        <div
          style={{
            flex: 2,
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minWidth: '0',
            width: '100%'
          }}
        >
          <h3 className="chart-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Sales Trend ({period.charAt(0).toUpperCase() + period.slice(1)})
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart data={formatSalesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`Rs. ${value}`, 'Sales']} 
                  labelFormatter={(label) => `Period: ${label}`}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales Amount" />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Order Count" />
              </LineChart>
            ) : (
              <BarChart data={formatSalesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`Rs. ${value}`, 'Sales']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="sales" fill="#8884d8" name="Sales Amount" />
                <Bar dataKey="orders" fill="#82ca9d" name="Order Count" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div
          style={{
            flex: 1,
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minWidth: '0',
            width: '100%'
          }}
        >
          <h3 className="chart-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            Top Selling Products
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatTopProductsData() as any}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const name = entry.name.length > 15 ? entry.name.substring(0, 12) + '...' : entry.name;
                  return `${name}: ${entry.value}`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {formatTopProductsData().map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [value, 'Quantity Sold']}
                contentStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div
        style={{
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <h3 className="chart-title" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          Top Products Details
        </h3>

        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                  Product Name
                </th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                  Quantity Sold
                </th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product: TopProductItem, index: number) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontSize: '14px' }}>
                    {product.productDetails[0]?.name || 'Unknown Product'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
                    {product.totalQuantity}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#059669', fontWeight: 'bold', fontSize: '14px' }}>
                    Rs. {product.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;