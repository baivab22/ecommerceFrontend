import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import holidayModeService from './holidayMode.service';

// ============================================
// ASYNC THUNKS
// ============================================

// Fetch holiday mode settings
const fetchHolidayModeAction = createAsyncThunk(
  'holidayMode/fetch',
  async (
    {
      onSuccess
    }:{
      onSuccess: any
    },
    thunkAPI
  ) => {
    try {
      const response = await holidayModeService.getSettings();
      onSuccess && onSuccess(response);
      return response as any;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch holiday mode settings'
      );
    }
  }
);

// Toggle holiday mode on/off
const toggleHolidayModeAction = createAsyncThunk(
  'holidayMode/toggle',
  async (
    {
      onSuccess
    }:{ onSuccess: any },
    thunkAPI
  ) => {
    try {
      const response = await holidayModeService.toggle();
      onSuccess && onSuccess(response);
      return response as any;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to toggle holiday mode'
      );
    }
  }
);

// Update holiday mode settings
const updateHolidayModeAction = createAsyncThunk(
  'holidayMode/update',
  async (
    {
      settings,
      onSuccess
    }:{
      onSuccess: any,
      settings: any
    },
    thunkAPI
  ) => {
    try {
      const response = await holidayModeService.updateSettings(settings);
      onSuccess && onSuccess(response);
      return response as any;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to update holiday mode settings'
      );
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  settings: {
    isActive: false,
    message: 'We are currently on holiday. Orders will be processed after we return.',
    startDate: '',
    endDate: '',
    allowBrowsing: true,
    allowOrders: false
  },
  loading: false,
  error: null,
  success: null,
  
  // Additional loading states for specific actions
  fetchLoading: false,
  toggleLoading: false,
  updateLoading: false
};

// ============================================
// SLICE
// ============================================

const holidayModeSlice = createSlice({
  name: 'holidayMode',
  initialState,
  reducers: {
    // Clear error and success messages
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    
    // Update local settings (for form inputs before saving)
    updateLocalSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload
      };
    },
    
    // Reset to initial state
    resetHolidayMode: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // ============================================
    // FETCH HOLIDAY MODE
    // ============================================
    builder.addCase(fetchHolidayModeAction.pending, (state) => {
      state.loading = true;
      state.fetchLoading = true;
      state.error = null;
    });
    builder.addCase(fetchHolidayModeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.fetchLoading = false;
      state.settings = action.payload.data || action.payload;
      state.error = null;
    });
    builder.addCase(fetchHolidayModeAction.rejected, (state, action) => {
      state.loading = false;
      state.fetchLoading = false;
      state.error = action.payload;
    });
    
    // ============================================
    // TOGGLE HOLIDAY MODE
    // ============================================
    builder.addCase(toggleHolidayModeAction.pending, (state) => {
      state.loading = true;
      state.toggleLoading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(toggleHolidayModeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.toggleLoading = false;
      const data = action.payload.data || action.payload;
      state.settings = data;
      state.success = `Holiday mode ${data.isActive ? 'enabled' : 'disabled'} successfully`;
      state.error = null;
    });
    builder.addCase(toggleHolidayModeAction.rejected, (state, action) => {
      state.loading = false;
      state.toggleLoading = false;
      state.error = action.payload;
      state.success = null;
    });
    
    // ============================================
    // UPDATE HOLIDAY MODE
    // ============================================
    builder.addCase(updateHolidayModeAction.pending, (state) => {
      state.loading = true;
      state.updateLoading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(updateHolidayModeAction.fulfilled, (state, action) => {
      state.loading = false;
      state.updateLoading = false;
      state.settings = action.payload.data || action.payload;
      state.success = 'Holiday mode settings updated successfully';
      state.error = null;
    });
    builder.addCase(updateHolidayModeAction.rejected, (state, action) => {
      state.loading = false;
      state.updateLoading = false;
      state.error = action.payload;
      state.success = null;
    });
  }
});

// ============================================
// EXPORT ACTIONS
// ============================================
export const { 
  clearMessages, 
  updateLocalSettings, 
  resetHolidayMode 
} = holidayModeSlice.actions;

// ============================================
// EXPORT ASYNC ACTIONS
// ============================================
export {
  fetchHolidayModeAction,
  toggleHolidayModeAction,
  updateHolidayModeAction
};

// ============================================
// SELECTORS
// ============================================
export const selectHolidayMode = (state) => state.holidayMode.settings;
export const selectHolidayModeLoading = (state) => state.holidayMode.loading;
export const selectHolidayModeError = (state) => state.holidayMode.error;
export const selectHolidayModeSuccess = (state) => state.holidayMode.success;
export const selectHolidayModeFetchLoading = (state) => state.holidayMode.fetchLoading;
export const selectHolidayModeToggleLoading = (state) => state.holidayMode.toggleLoading;
export const selectHolidayModeUpdateLoading = (state) => state.holidayMode.updateLoading;

// ============================================
// EXPORT REDUCER
// ============================================
export default holidayModeSlice.reducer;