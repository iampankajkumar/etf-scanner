import db from '../db/database';
import { AssetItem } from '../types';
// import { fetchPriceData } from '../api/yahooFinance';

/**
 * Fetch ETF summary data from the new API
 */
async function fetchEtfSummaryData(symbol: string) {
  const response = await fetch('https://etf-screener-backend-production.up.railway.app/api/summary');
  const data = await response.json();
  // Find the entry for the requested symbol
  return data.find((item: any) => item.symbol === symbol);
}
import { calculateRSI } from '../utils/calculations';
import { formatReturn, createEmptyAssetItem } from '../utils/data';

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

    // Fetch fresh data from new API
    console.log(`[API] Fetching ${symbol} from new ETF summary API`);
    const etfData = await fetchEtfSummaryData(symbol);
    if (!etfData || !etfData.details) {
      throw new Error('No data found for symbol: ' + symbol);
    }
    const d = etfData.details;
    // Map API fields to AssetItem
    const rsi = d.dailyRSI ? parseFloat(d.dailyRSI) : 'N/A';
    const currentPrice = d.lastClosePrice ? parseFloat(d.lastClosePrice) : null;
    const discount = d.downFrom2YearHigh ? `${parseFloat(d.downFrom2YearHigh).toFixed(2)}%` : 'N/A';
    const oneDayReturn = null; // Not provided by API
    const oneWeekReturn = d["1weekReturns"] ? parseFloat(d["1weekReturns"]) : null;
    const oneMonthReturn = d["1monthReturns"] ? parseFloat(d["1monthReturns"]) : null;
    const threeMonthReturn = null; // Not provided by API
    const sixMonthReturn = null; // Not provided by API
    const fiftyTwoWeekHigh = d.priceRange?.yearlyRange?.max ? parseFloat(d.priceRange.yearlyRange.max) : null;
    // For details page, provide price ranges as allPrices (simulate with current only)
    const allPrices = [
      { date: d.recordDate || new Date().toISOString(), price: currentPrice ?? 0 }
    ];
    const transformedData: AssetItem = {
      ticker: symbol,
      rsi,
      currentPrice: formatPrice(currentPrice),
      oneDayReturn: formatReturn(oneDayReturn),
      oneWeekReturn: formatReturn(oneWeekReturn),
      oneMonthReturn: formatReturn(oneMonthReturn),
      discount,
      fiftyTwoWeekHigh,
      rawRsi: rsi === 'N/A' ? null : rsi,
      rawCurrentPrice: currentPrice,
      rawOneDayReturn: oneDayReturn,
      rawOneWeekReturn: oneWeekReturn,
      rawOneMonthReturn: oneMonthReturn,
      rawThreeMonthReturn: threeMonthReturn,
      rawSixMonthReturn: sixMonthReturn,
      allPrices,
      // New fields from API
      recordDate: d.recordDate,
      lastDayVolume: d.lastDayVolume,
      weeklyRSI: d.weeklyRSI,
      monthlyRSI: d.monthlyRSI,
      oneYearReturn: d["1yearReturns"],
      twoYearReturn: d["2yearReturns"],
      twoYearNiftyReturn: d["2yNiftyReturns"],
      priceToEarning: d.priceToEarning,
      niftyPriceToEarning: d.niftyPriceToEarning,
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

// formatPercentage removed, use formatReturn from utils/data

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

// createEmptyAssetItem removed, use from utils/data