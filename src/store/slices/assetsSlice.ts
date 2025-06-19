import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AssetItem, SortConfig } from '../../types';
import { sortData } from '../../utils/data';
import { offlineDataService } from '../../services/offlineDataService';

/**
 * State interface for the assets slice
 */
interface AssetsState {
  items: AssetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortConfig: SortConfig;
  fromCache: boolean;
  cacheAge?: number;
  lastUpdated?: number;
}

/**
 * Initial state for the assets slice
 */
const initialState: AssetsState = {
  items: [],
  status: 'idle',
  error: null,
  sortConfig: { key: 'rsi', direction: 'asc' },
  fromCache: false,
  cacheAge: undefined,
  lastUpdated: undefined,
};

/**
 * Async thunk for fetching all assets data using offline-first approach
 */
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (forceRefresh: boolean = false, { rejectWithValue }) => {
    try {
      const result = await offlineDataService.getAssets(forceRefresh);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch assets');
    }
  }
);

/**
 * Async thunk for forcing a refresh from the API
 */
export const refreshAssets = createAsyncThunk(
  'assets/refreshAssets',
  async (_, { rejectWithValue }) => {
    try {
      const result = await offlineDataService.getAssets(true);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to refresh assets');
    }
  }
);

/**
 * Assets slice definition
 */
const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    /**
     * Sort assets based on a key and direction
     */
    sortAssets: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
      const { key, direction } = state.sortConfig;
      if (key) {
        state.items = sortData([...state.items], key, direction);
      }
    },
    
    /**
     * Add a ticker to the list if it doesn't already exist
     */
        
    /**
     * Clear any error state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAssets
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.cacheAge = action.payload.cacheAge;
        state.lastUpdated = Date.now();
        state.error = action.payload.error || null;
        
        // Apply current sort configuration
        const { key, direction } = state.sortConfig;
        if (key) {
          state.items = sortData([...state.items], key, direction);
        }
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || action.error.message || 'Unknown error';
      })
      // Handle refreshAssets
      .addCase(refreshAssets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(refreshAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.cacheAge = action.payload.cacheAge;
        state.lastUpdated = Date.now();
        state.error = action.payload.error || null;
        
        // Apply current sort configuration
        const { key, direction } = state.sortConfig;
        if (key) {
          state.items = sortData([...state.items], key, direction);
        }
      })
      .addCase(refreshAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || action.error.message || 'Unknown error';
      });
  },
});

export const { sortAssets, clearError } = assetsSlice.actions;
export default assetsSlice.reducer;