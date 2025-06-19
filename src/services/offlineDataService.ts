import db from '../db/database';
import { AssetItem } from '../types';
import { isConnected } from '../utils/network';

/**
 * Cache duration - refresh once per calendar day
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000; // Keep for backward compatibility, but we'll use date-based logic

/**
 * Key for storing the last fetch timestamp
 */
const LAST_FETCH_KEY = 'last_fetch_timestamp';

/**
 * Key for storing all assets data
 */
const ALL_ASSETS_KEY = 'all_assets_data';

/**
 * Interface for the API response
 */
interface ApiResponse {
  symbol: string;
  details: {
    recordDate: string;
    lastClosePrice: string;
    lastDayVolume: string;
    downFrom2YearHigh: string;
    dailyRSI: string;
    weeklyRSI: string;
    monthlyRSI: string;
    "1weekReturns": string;
    "1monthReturns": string;
    "1yearReturns": string;
    "2yearReturns": string;
    "2yNiftyReturns": string;
    priceToEarning: string;
    niftyPriceToEarning: string;
    priceRange: any;
    rsi: any;
    returns: any;
  };
}

/**
 * Offline-first data service that handles caching and API calls
 */
export class OfflineDataService {
  /**
   * Check if cached data is still valid (same calendar day)
   */
  private async isCacheValid(): Promise<boolean> {
    try {
      const lastFetchData = await db.getAsset(LAST_FETCH_KEY);
      if (!lastFetchData) {
        return false;
      }
      
      const now = new Date();
      const lastFetchDate = new Date(lastFetchData.timestamp);
      
      // Check if it's the same calendar day
      const isSameDay = now.getFullYear() === lastFetchDate.getFullYear() &&
                        now.getMonth() === lastFetchDate.getMonth() &&
                        now.getDate() === lastFetchDate.getDate();
      
      const hoursAgo = Math.round((now.getTime() - lastFetchData.timestamp) / (1000 * 60 * 60));
      
      if (isSameDay) {
        console.log(`[CACHE] Data from today (${hoursAgo} hours ago) - using cache`);
      } else {
        console.log(`[CACHE] Data from previous day (${hoursAgo} hours ago) - needs refresh`);
      }
      
      return isSameDay;
    } catch (error) {
      console.error('[CACHE] Error checking cache validity:', error);
      return false;
    }
  }

  /**
   * Get cached assets data
   */
  private async getCachedAssets(): Promise<AssetItem[] | null> {
    try {
      const cachedData = await db.getAsset(ALL_ASSETS_KEY);
      if (!cachedData) {
        return null;
      }

      const parsedData = JSON.parse(cachedData.data) as AssetItem[];
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        console.log(`[CACHE] Retrieved ${parsedData.length} assets from cache`);
        return parsedData;
      }
      
      return null;
    } catch (error) {
      console.error('[CACHE] Error retrieving cached assets:', error);
      return null;
    }
  }

  /**
   * Save assets data to cache
   */
  private async saveAssetsToCache(assets: AssetItem[]): Promise<void> {
    try {
      const now = Date.now();
      
      // Save the assets data
      await db.saveAsset({
        symbol: ALL_ASSETS_KEY,
        timestamp: now,
        data: JSON.stringify(assets)
      });

      // Save the last fetch timestamp
      await db.saveAsset({
        symbol: LAST_FETCH_KEY,
        timestamp: now,
        data: JSON.stringify({ lastFetch: now })
      });

      console.log(`[CACHE] Saved ${assets.length} assets to cache`);
    } catch (error) {
      console.error('[CACHE] Error saving assets to cache:', error);
    }
  }

  /**
   * Fetch fresh data from the API
   */
  private async fetchFromApi(): Promise<AssetItem[]> {
    console.log('[API] Fetching fresh data from API...');
    
    const response = await fetch('https://etf-screener-backend-production.up.railway.app/api/summary');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: ApiResponse[] = await response.json();
    
    // Transform API data to AssetItem format
    const assets = data.map((etfData) => {
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
      } as AssetItem;
    });

    console.log(`[API] Successfully fetched ${assets.length} assets from API`);
    return assets;
  }

  /**
   * Get assets data with offline-first approach
   * - First check if cached data is valid (same calendar day)
   * - If valid, return cached data
   * - If not valid or no cache, fetch from API and cache the result
   * - If API fails and we have cached data, return cached data with a warning
   */
  async getAssets(forceRefresh: boolean = false): Promise<{
    data: AssetItem[];
    fromCache: boolean;
    cacheAge?: number;
    error?: string;
  }> {
    try {
      // Initialize database if not already done
      await db.init();

      // Check if we should use cached data
      if (!forceRefresh) {
        const isCacheValid = await this.isCacheValid();
        
        if (isCacheValid) {
          const cachedAssets = await this.getCachedAssets();
          if (cachedAssets) {
            const lastFetchData = await db.getAsset(LAST_FETCH_KEY);
            const cacheAge = lastFetchData ? Date.now() - lastFetchData.timestamp : 0;
            
            return {
              data: cachedAssets,
              fromCache: true,
              cacheAge: Math.round(cacheAge / (1000 * 60 * 60)) // hours
            };
          }
        }
      }

      // Check network connectivity before attempting API call
      const hasConnection = await isConnected();
      
      if (!hasConnection) {
        console.log('[NETWORK] No internet connection, using cached data');
        const cachedAssets = await this.getCachedAssets();
        if (cachedAssets) {
          const lastFetchData = await db.getAsset(LAST_FETCH_KEY);
          const cacheAge = lastFetchData ? Date.now() - lastFetchData.timestamp : 0;
          
          return {
            data: cachedAssets,
            fromCache: true,
            cacheAge: Math.round(cacheAge / (1000 * 60 * 60)),
            error: `No internet connection. Using cached data from ${Math.round(cacheAge / (1000 * 60 * 60))} hours ago.`
          };
        } else {
          throw new Error('No internet connection and no cached data available');
        }
      }

      // Try to fetch fresh data from API
      try {
        const freshAssets = await this.fetchFromApi();
        await this.saveAssetsToCache(freshAssets);
        
        return {
          data: freshAssets,
          fromCache: false
        };
      } catch (apiError) {
        console.error('[API] Failed to fetch from API:', apiError);
        
        // If API fails, try to return cached data even if it's old
        const cachedAssets = await this.getCachedAssets();
        if (cachedAssets) {
          const lastFetchData = await db.getAsset(LAST_FETCH_KEY);
          const cacheAge = lastFetchData ? Date.now() - lastFetchData.timestamp : 0;
          
          console.log('[FALLBACK] Using cached data due to API failure');
          return {
            data: cachedAssets,
            fromCache: true,
            cacheAge: Math.round(cacheAge / (1000 * 60 * 60)),
            error: `API unavailable. Using cached data from ${Math.round(cacheAge / (1000 * 60 * 60))} hours ago.`
          };
        }
        
        // If no cached data available, throw the API error
        throw apiError;
      }
    } catch (error) {
      console.error('[SERVICE] Error in getAssets:', error);
      throw new Error(`Failed to load assets: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    try {
      await db.deleteAsset(ALL_ASSETS_KEY);
      await db.deleteAsset(LAST_FETCH_KEY);
      console.log('[CACHE] Cache cleared successfully');
    } catch (error) {
      console.error('[CACHE] Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Get cache status information
   */
  async getCacheStatus(): Promise<{
    hasCache: boolean;
    isValid: boolean;
    lastFetch?: Date;
    cacheAge?: number;
    itemCount?: number;
  }> {
    try {
      const lastFetchData = await db.getAsset(LAST_FETCH_KEY);
      const cachedAssetsData = await db.getAsset(ALL_ASSETS_KEY);
      
      if (!lastFetchData) {
        return { hasCache: false, isValid: false };
      }

      const lastFetch = new Date(lastFetchData.timestamp);
      const cacheAge = Date.now() - lastFetchData.timestamp;
      
      // Check if cache is from today (same calendar day)
      const now = new Date();
      const isSameDay = now.getFullYear() === lastFetch.getFullYear() &&
                        now.getMonth() === lastFetch.getMonth() &&
                        now.getDate() === lastFetch.getDate();
      
      const itemCount = cachedAssetsData ? JSON.parse(cachedAssetsData.data).length : 0;

      return {
        hasCache: true,
        isValid: isSameDay,
        lastFetch,
        cacheAge: Math.round(cacheAge / (1000 * 60 * 60)),
        itemCount
      };
    } catch (error) {
      console.error('[CACHE] Error getting cache status:', error);
      return { hasCache: false, isValid: false };
    }
  }
}

// Export singleton instance
export const offlineDataService = new OfflineDataService();