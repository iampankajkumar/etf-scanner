import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AssetItem, SortConfig } from '../../types';
import { getAssetData } from '../../services/assetService';
import { sortData, createEmptyAssetItem } from '../../utils/data';
import { DEFAULT_TICKERS } from '../../constants/tickers';

/**
 * State interface for the assets slice
 */
interface AssetsState {
  items: AssetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortConfig: SortConfig;
  tickers: string[];
}

/**
 * Initial state for the assets slice
 */
const initialState: AssetsState = {
  items: [],
  status: 'idle',
  error: null,
  sortConfig: { key: 'rsi', direction: 'asc' },
  tickers: DEFAULT_TICKERS,
};

// createEmptyAssetItem removed, use from utils/data

/**
 * Async thunk for fetching assets data
 */
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { assets: AssetsState };
      const { tickers } = state.assets;
      
      if (!tickers.length) {
        return [] as AssetItem[];
      }
      
      const result = await Promise.all(
        tickers.map(async (ticker) => {
          try {
            return await getAssetData(ticker);
          } catch (error) {
            console.error(`Error fetching data for ${ticker}:`, error);
            // Return a placeholder for failed items rather than failing the whole request
            return createEmptyAssetItem(ticker);
          }
        })
      );
      
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch assets');
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
    addTicker: (state, action: PayloadAction<string>) => {
      const ticker = action.payload.trim();
      if (ticker && !state.tickers.includes(ticker)) {
        state.tickers.push(ticker);
      }
    },
    
    /**
     * Remove a ticker from the list
     */
    removeTicker: (state, action: PayloadAction<string>) => {
      state.tickers = state.tickers.filter((ticker) => ticker !== action.payload);
      // Also remove the item from the items array
      state.items = state.items.filter((item) => item.ticker !== action.payload);
    },
    
    /**
     * Clear any error state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action: PayloadAction<AssetItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
        
        // Apply current sort configuration
        const { key, direction } = state.sortConfig;
        if (key) {
          state.items = sortData([...state.items], key, direction);
        }
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || action.error.message || 'Unknown error';
      });
  },
});

export const { sortAssets, addTicker, removeTicker, clearError } = assetsSlice.actions;
export default assetsSlice.reducer;