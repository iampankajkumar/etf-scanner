import db from '../db/database';
import { AssetItem } from '../types';
import { fetchPriceData } from '../api/yahooFinance';
import { calculateRSI } from '../utils/calculations';

/**
 * Cache duration in milliseconds (24 hours)
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Get asset data for a given symbol, either from cache or from the API
 * @param symbol The stock symbol to get data for
 * @returns Promise that resolves to the asset data
 */
export const getAssetData = async (symbol: string): Promise<AssetItem> => {
  try {
    const now = Date.now();
    const cachedAsset = await db.getAsset(symbol);

    // Check if we have valid cached data
    if (cachedAsset && now - cachedAsset.timestamp < CACHE_DURATION) {
      try {
        const parsedData = JSON.parse(cachedAsset.data) as AssetItem;
        if (parsedData && typeof parsedData === 'object' && 'ticker' in parsedData) {
          console.log(`[CACHE] Fetched ${symbol} from SQLite`);
          return parsedData;
        }
      } catch (parseError) {
        console.error(`[CACHE ERROR] Failed to parse cached data for ${symbol}:`, parseError);
      }
    }

    // Fetch fresh data from API
    console.log(`[API] Fetching ${symbol} from API`);
    const priceData = await fetchPriceData(symbol);

    // Calculate RSI
    const rsiArray = calculateRSI(priceData.allPrices || []);
    const rsi = rsiArray.length ? parseFloat(rsiArray[rsiArray.length - 1].toFixed(2)) : 'N/A';

    // Calculate discount from 52-week high
    const discount = calculateDiscount(priceData.fiftyTwoWeekHigh, priceData.currentPrice);

    // Transform data into AssetItem format
    const transformedData: AssetItem = {
      ticker: symbol,
      rsi,
      currentPrice: formatPrice(priceData.currentPrice),
      oneDayReturn: formatPercentage(priceData.oneDayReturn),
      oneWeekReturn: formatPercentage(priceData.oneWeekReturn),
      oneMonthReturn: formatPercentage(priceData.oneMonthReturn),
      discount,
      fiftyTwoWeekHigh: priceData.fiftyTwoWeekHigh,
      rawRsi: rsi === 'N/A' ? null : rsi,
      rawCurrentPrice: priceData.currentPrice,
      rawOneDayReturn: priceData.oneDayReturn,
      rawOneWeekReturn: priceData.oneWeekReturn,
      rawOneMonthReturn: priceData.oneMonthReturn,
      rawThreeMonthReturn: priceData.threeMonthReturn,
      rawSixMonthReturn: priceData.sixMonthReturn,
      allPrices: formatPriceHistory(priceData.allPrices),
    };

    // Cache the transformed data
    await db.saveAsset({
      symbol,
      timestamp: now,
      data: JSON.stringify(transformedData)
    });

    return transformedData;
  } catch (error) {
    console.error(`[ERROR] Failed to get asset data for ${symbol}:`, error);
    // Return a default asset item with the symbol but no data
    return createEmptyAssetItem(symbol);
  }
};

/**
 * Format a price value to a string with 2 decimal places
 * @param price The price value to format
 * @returns Formatted price string or 'N/A' if null
 */
function formatPrice(price: number | null): string {
  return price !== null ? price.toFixed(2) : 'N/A';
}

/**
 * Format a percentage value to a string with 2 decimal places and % sign
 * @param value The percentage value to format
 * @returns Formatted percentage string or 'N/A' if null
 */
function formatPercentage(value: number | null): string {
  if (value === null) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Calculate discount percentage from 52-week high
 * @param fiftyTwoWeekHigh The 52-week high price
 * @param currentPrice The current price
 * @returns Formatted discount string or '0.00%' if data is missing or invalid
 */
function calculateDiscount(fiftyTwoWeekHigh: number | null, currentPrice: number | null): string {
  try {
    // Log the input values for debugging
    console.log(`[DISCOUNT] Calculating discount: 52wk high=${fiftyTwoWeekHigh}, current=${currentPrice}`);
    
    // Check if we have valid data
    if (fiftyTwoWeekHigh === null || currentPrice === null) {
      console.log(`[DISCOUNT] Missing data for discount calculation: 52wk high=${fiftyTwoWeekHigh}, current=${currentPrice}`);
      return '0.00%';
    }
    
    // Ensure both values are positive numbers
    if (fiftyTwoWeekHigh <= 0 || currentPrice <= 0) {
      console.log(`[DISCOUNT] Invalid values for discount calculation: 52wk high=${fiftyTwoWeekHigh}, current=${currentPrice}`);
      return '0.00%';
    }
    
    // If current price is higher than 52-week high (which can happen if the 52-week high is outdated),
    // use the current price as the 52-week high
    const highPrice = currentPrice > fiftyTwoWeekHigh ? currentPrice : fiftyTwoWeekHigh;
    
    // Calculate the discount
    const discount = ((highPrice - currentPrice) / highPrice) * 100;
    
    // Check if the result is a valid number
    if (isNaN(discount)) {
      console.log(`[DISCOUNT] NaN result in discount calculation: 52wk high=${fiftyTwoWeekHigh}, current=${currentPrice}`);
      return '0.00%';
    }
    
    // Return the formatted discount
    return `${Math.max(0, discount).toFixed(2)}%`;
  } catch (error) {
    console.error('[DISCOUNT] Error calculating discount:', error);
    return '0.00%';
  }
}

/**
 * Format price history data with dates
 * @param prices Array of price values
 * @returns Array of price objects with dates
 */
function formatPriceHistory(prices: number[] | undefined): { date: string; price: number }[] {
  if (!prices || !prices.length) return [];
  
  return prices.map((price, index) => ({
    date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
    price
  }));
}

/**
 * Create an empty asset item for error cases
 * @param symbol The symbol to use for the empty item
 * @returns An empty asset item
 */
function createEmptyAssetItem(symbol: string): AssetItem {
  return {
    ticker: symbol,
    rsi: 'N/A',
    currentPrice: 'N/A',
    oneDayReturn: 'N/A',
    oneWeekReturn: 'N/A',
    oneMonthReturn: 'N/A',
    discount: 'N/A',
    fiftyTwoWeekHigh: null,
    rawRsi: null,
    rawCurrentPrice: null,
    rawOneDayReturn: null,
    rawOneWeekReturn: null,
    rawOneMonthReturn: null,
    rawThreeMonthReturn: null,
    rawSixMonthReturn: null,
    allPrices: [],
  };
}