import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AssetItem, SortConfig } from '../../types';
import { sortData } from '../../utils/data';

/**
 * State interface for the assets slice
 */
interface AssetsState {
  items: AssetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortConfig: SortConfig;
}

/**
 * Initial state for the assets slice
 */
const initialState: AssetsState = {
  items: [],
  status: 'idle',
  error: null,
  sortConfig: { key: 'rsi', direction: 'asc' },
};

/**
 * Async thunk for fetching all assets data from the new API
 */
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch all data from the new API
      const response = await fetch('https://etf-screener-backend-production.up.railway.app/api/summary');
      const data = await response.json();
      // Map each entry to AssetItem
      return data.map((etfData: any) => {
        const d = etfData.details;
        // Helper function to format numbers to 2 decimal places
        const formatNumber = (value: any) => {
          if (!value || value === '' || isNaN(parseFloat(value))) return 'N/A';
          return parseFloat(value).toFixed(2);
        };

        // Helper function to format percentage values
        const formatPercentage = (value: any) => {
          if (!value || value === '' || isNaN(parseFloat(value))) return 'N/A';
          return `${parseFloat(value).toFixed(2)}%`;
        };

        // Map all relevant fields
        return {
          ticker: etfData.symbol,
          recordDate: d.recordDate,
          lastClosePrice: formatNumber(d.lastClosePrice),
          lastDayVolume: d.lastDayVolume,
          downFrom2YearHigh: formatPercentage(d.downFrom2YearHigh),
          dailyRSI: formatNumber(d.dailyRSI),
          weeklyRSI: formatNumber(d.weeklyRSI),
          monthlyRSI: formatNumber(d.monthlyRSI),
          oneWeekReturns: formatPercentage(d["1weekReturns"]),
          oneMonthReturns: formatPercentage(d["1monthReturns"]),
          oneYearReturns: formatPercentage(d["1yearReturns"]),
          twoYearReturns: formatPercentage(d["2yearReturns"]),
          twoYearNiftyReturns: formatPercentage(d["2yNiftyReturns"]),
          priceToEarning: formatNumber(d.priceToEarning),
          niftyPriceToEarning: formatNumber(d.niftyPriceToEarning),
          priceRange: d.priceRange,
          priceToEarningRange: d.priceToEarningRange,
          rsiObj: d.rsi,
          returnsObj: d.returns,
          // For compatibility with old columns
          rsi: d.dailyRSI ? parseFloat(d.dailyRSI).toFixed(2) : 'N/A',
          currentPrice: formatNumber(d.lastClosePrice),
          oneDayReturn: 'N/A', // Not provided by API
          oneWeekReturn: formatPercentage(d["1weekReturns"]),
          oneMonthReturn: formatPercentage(d["1monthReturns"]),
          discount: formatPercentage(d.downFrom2YearHigh),
          fiftyTwoWeekHigh: d.priceRange?.yearlyRange?.max ? parseFloat(d.priceRange.yearlyRange.max) : null,
          rawRsi: d.dailyRSI ? parseFloat(d.dailyRSI) : null,
          rawCurrentPrice: d.lastClosePrice ? parseFloat(d.lastClosePrice) : null,
          rawOneDayReturn: null,
          rawOneWeekReturn: d["1weekReturns"] ? parseFloat(d["1weekReturns"]) : null,
          rawOneMonthReturn: d["1monthReturns"] ? parseFloat(d["1monthReturns"]) : null,
          rawThreeMonthReturn: null,
          rawSixMonthReturn: null,
          allPrices: [
            { date: d.recordDate || new Date().toISOString(), price: d.lastClosePrice ? parseFloat(d.lastClosePrice) : 0 }
          ],
          // Store the complete range data for details page
          priceRangeData: d.priceRange,
          rsiData: d.rsi,
          returnsData: d.returns,
        };
      });
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