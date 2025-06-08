import db from '../db/database';
import { AssetItem } from '../types';
import { fetchPriceData } from '../api/yahooFinance';
import { calculateRSI } from '../utils/calculations';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const getAssetData = async (symbol: string): Promise<AssetItem> => {
  const now = Date.now();
  const cachedAsset = await db.db.getFirstAsync<{ data: string, timestamp: number }>(
    'SELECT data, timestamp FROM assets WHERE symbol = ?',
    symbol
  );

  if (cachedAsset && now - cachedAsset.timestamp < CACHE_DURATION) {
    console.log(`[CACHE] Fetched ${symbol} from SQLite`);
    return JSON.parse(cachedAsset.data);
  }

  console.log(`[API] Fetched ${symbol} from API`);
  const priceData = await fetchPriceData(symbol);

  const rsiArray = calculateRSI(priceData.allPrices || []);
  const rsi = rsiArray.length ? parseFloat(rsiArray[rsiArray.length - 1].toFixed(2)) : 'N/A';

  const transformedData: AssetItem = {
    ticker: symbol,
    rsi,
    currentPrice: priceData.currentPrice?.toFixed(2) || 'N/A',
    oneDayReturn: priceData.oneDayReturn?.toFixed(2) + '%' || 'N/A',
    oneWeekReturn: priceData.oneWeekReturn?.toFixed(2) + '%' || 'N/A',
    oneMonthReturn: priceData.oneMonthReturn?.toFixed(2) + '%' || 'N/A',
    rawRsi: rsi === 'N/A' ? null : rsi,
    rawCurrentPrice: priceData.currentPrice,
    rawOneDayReturn: priceData.oneDayReturn,
    rawOneWeekReturn: priceData.oneWeekReturn,
    rawOneMonthReturn: priceData.oneMonthReturn ?? null,
    rawThreeMonthReturn: priceData.threeMonthReturn ?? null,
    rawSixMonthReturn: priceData.sixMonthReturn ?? null,
    allPrices: priceData.allPrices?.map((price: number, index: number) => ({ date: new Date(new Date().setDate(new Date().getDate() - index)).toISOString().split('T')[0], price })) || [],
  };

  await db.db.runAsync(
    'INSERT OR REPLACE INTO assets (symbol, timestamp, data) VALUES (?, ?, ?)',
    symbol,
    now,
    JSON.stringify(transformedData)
  );

  return transformedData;
};