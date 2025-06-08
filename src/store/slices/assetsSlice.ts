import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AssetItem, SortConfig } from '../../types';
import { getAssetData } from '../../services/assetService';
import { sortData } from '../../utils/data';
import { DEFAULT_TICKERS } from '../../constants/tickers';

interface AssetsState {
  items: AssetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  sortConfig: SortConfig;
  tickers: string[];
}

const initialState: AssetsState = {
  items: [],
  status: 'idle',
  error: null,
  sortConfig: { key: 'rsi', direction: 'asc' },
  tickers: DEFAULT_TICKERS,
};

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async (_, { getState }) => {
  const { assets } = getState() as { assets: AssetsState };
  const { tickers } = assets;
  const result = await Promise.all(
    tickers.map(ticker => getAssetData(ticker))
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
    addTicker: (state, action: PayloadAction<string>) => {
      if (!state.tickers.includes(action.payload)) {
        state.tickers.push(action.payload);
      }
    },
    removeTicker: (state, action: PayloadAction<string>) => {
      state.tickers = state.tickers.filter((ticker) => ticker !== action.payload);
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

export const { sortAssets, addTicker, removeTicker } = assetsSlice.actions;
export default assetsSlice.reducer;