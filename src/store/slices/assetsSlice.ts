import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AssetItem, SortConfig } from '../../types';
import { fetchPriceData } from '../../api/yahooFinance';
import { calculateRSI } from '../../utils/calculations';
import { sortData } from '../../utils/data';

interface AssetsState {
  items: AssetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortConfig: SortConfig;
}

const initialState: AssetsState = {
  items: [],
  status: 'idle',
  error: null,
  sortConfig: { key: 'rsi', direction: 'asc' },
};

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async (tickers: string[]) => {
  const result = await Promise.all(
    tickers.map(async (ticker) => {
      const {
        closingPrices,
        currentPrice,
        oneDayReturn,
        oneWeekReturn,
        oneMonthReturn,
        threeMonthReturn,
        sixMonthReturn,
        allPrices,
      } = await fetchPriceData(ticker);

      const rsiArray = calculateRSI(closingPrices);
      const rsi = rsiArray.length ? parseFloat(rsiArray[rsiArray.length - 1].toFixed(2)) : 'N/A';

      const formattedOneDayReturn =
        oneDayReturn !== null ? (oneDayReturn > 0 ? '+' : '') + oneDayReturn.toFixed(2) + '%' : 'N/A';
      const formattedOneWeekReturn =
        oneWeekReturn !== null ? (oneWeekReturn > 0 ? '+' : '') + oneWeekReturn.toFixed(2) + '%' : 'N/A';
      const formattedOneMonthReturn =
        oneMonthReturn !== null && oneMonthReturn !== undefined ? (oneMonthReturn > 0 ? '+' : '') + oneMonthReturn.toFixed(2) + '%' : 'N/A';

      const assetItem: AssetItem = {
        ticker,
        rsi,
        currentPrice: currentPrice !== null ? currentPrice.toFixed(2) : 'N/A',
        oneDayReturn: formattedOneDayReturn,
        oneWeekReturn: formattedOneWeekReturn,
        oneMonthReturn: formattedOneMonthReturn,
        rawRsi: rsi === 'N/A' ? null : rsi,
        rawCurrentPrice: currentPrice,
        rawOneDayReturn: oneDayReturn,
        rawOneWeekReturn: oneWeekReturn,
        rawOneMonthReturn: oneMonthReturn ?? null,
        rawThreeMonthReturn: threeMonthReturn ?? null,
        rawSixMonthReturn: sixMonthReturn ?? null,
        allPrices: allPrices ?? [],
      };
      return assetItem;
    })
  );
  return result;
});

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    sortAssets: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
      const { key, direction } = state.sortConfig;
      if (key) {
        state.items = sortData([...state.items], key, direction);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssets.fulfilled, (state, action: PayloadAction<AssetItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        const { key, direction } = state.sortConfig;
        if (key) {
          state.items = sortData([...state.items], key, direction);
        }
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { sortAssets } = assetsSlice.actions;
export default assetsSlice.reducer;