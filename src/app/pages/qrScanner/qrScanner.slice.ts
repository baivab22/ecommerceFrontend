import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SalesAnalyticsResponse, ScannedOrder, ScanResponse, scanService } from './qrScanner.service';
// import { scanService, ScannedOrder, ScanResponse, SalesAnalyticsResponse } from './scan.service';

// ----------------------
// Slice State
// ----------------------
export interface ScanState {
  scannedOrders: ScannedOrder[];
  salesData: SalesAnalyticsResponse['salesData'];
  topProducts: SalesAnalyticsResponse['topProducts'];
  loading: boolean;
  error: string | null;
  lastScan: ScannedOrder | null;
}

const initialState: ScanState = {
  scannedOrders: [],
  salesData: [],
  topProducts: [],
  loading: false,
  error: null,
  lastScan: null,
};

// ----------------------
// Thunks
// ----------------------

// Mark a QR scan
export const markOrderScanAction = createAsyncThunk<
  ScanResponse,
  { productorderIds: string[] },
  { rejectValue: string }
>('scan/markOrderScan', async ({ productorderIds }, { rejectWithValue }) => {
  try {
    const response = await scanService.markOrderScan(productorderIds);
    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Scan failed');
  }
});

// Get scanned orders
export const getScannedOrdersAction = createAsyncThunk<
  ScannedOrder[],
  void,
  { rejectValue: string }
>('scan/getScannedOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await scanService.getScannedOrders();
    return orders;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch scanned orders');
  }
});

// Get sales analytics
export const getSalesAnalyticsAction = createAsyncThunk<
  SalesAnalyticsResponse,
  string | undefined,
  { rejectValue: string }
>('scan/getSalesAnalytics', async (period = 'monthly', { rejectWithValue }) => {
  try {
    const analytics = await scanService.getSalesAnalytics(period);
    return analytics;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch sales analytics');
  }
});

// ----------------------
// Slice
// ----------------------

const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastScan: (state) => {
      state.lastScan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Mark Order Scan
      .addCase(markOrderScanAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markOrderScanAction.fulfilled, (state, action: PayloadAction<ScanResponse>) => {
        state.loading = false;
        state.lastScan = action.payload.order;
      })
      .addCase(markOrderScanAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Scan failed';
      })

      // Get Scanned Orders
      .addCase(getScannedOrdersAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getScannedOrdersAction.fulfilled, (state, action: PayloadAction<ScannedOrder[]>) => {
        state.loading = false;
        state.scannedOrders = action.payload;
      })
      .addCase(getScannedOrdersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch scanned orders';
      })

      // Get Sales Analytics
      .addCase(getSalesAnalyticsAction.fulfilled, (state, action: PayloadAction<SalesAnalyticsResponse>) => {
        state.salesData = action.payload.salesData;
        state.topProducts = action.payload.topProducts;
      });
  },
});

export const { clearError, clearLastScan } = scanSlice.actions;
export default scanSlice.reducer;
