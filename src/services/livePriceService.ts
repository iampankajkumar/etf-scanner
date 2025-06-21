/**
 * Live Price Service for fetching real-time price data
 * This service fetches live price and change% data from /api/prices
 * /api/prices is called on EVERY refresh - no caching
 */

/**
 * Interface for live price data from the API
 */
export interface LivePriceData {
  volume: number;
  previousClose: number;
  lastUpdated: string;
  change: number;
  changePercent: number;
  currentPrice: number;
  key: string;
}

/**
 * Interface for processed live price data
 */
export interface ProcessedLivePriceData {
  symbol: string;
  livePrice: string;
  changePercent: string;
  rawLivePrice: number | null;
  rawChangePercent: number | null;
}

/**
 * Live Price Service class
 */
export class LivePriceService {
  private readonly API_URL = 'https://etf-screener-backend-production.up.railway.app/api/prices';

  /**
   * Fetch live price data for all symbols (called on every refresh)
   * @returns Promise that resolves to processed live price data
   */
  async fetchLivePrices(): Promise<ProcessedLivePriceData[]> {
    try {
      console.log('[LIVE_PRICE] Fetching live price data...');
      console.log('[LIVE_PRICE] API URL:', this.API_URL);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('[LIVE_PRICE] Response status:', response.status);
      console.log('[LIVE_PRICE] Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error response');
        console.error('[LIVE_PRICE] API Error Response:', errorText);
        throw new Error(`Live price API request failed with status ${response.status}: ${errorText}`);
      }
      
      const responseText = await response.text();
      console.log('[LIVE_PRICE] Raw response length:', responseText.length);
      
      let data: LivePriceData[];
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[LIVE_PRICE] JSON Parse Error:', parseError);
        console.error('[LIVE_PRICE] Response text preview:', responseText.substring(0, 500));
        throw new Error('Invalid JSON response from live price API');
      }
      
      if (!Array.isArray(data)) {
        console.error('[LIVE_PRICE] Response is not an array:', typeof data);
        throw new Error('Invalid response format from live price API - expected array');
      }

      console.log('[LIVE_PRICE] Received data for', data.length, 'symbols');

      // Process the data in smaller chunks to avoid memory issues in React Native
      const processedData: ProcessedLivePriceData[] = [];
      const chunkSize = 50; // Process 50 items at a time
      
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        
        const processedChunk = chunk.map((item, index) => {
          try {
            if (!item || typeof item !== 'object') {
              console.warn(`[LIVE_PRICE] Invalid item at index ${i + index}:`, item);
              return null;
            }

            const formatPrice = (price: number | null) => {
              if (price === null || price === undefined || isNaN(price)) return 'N/A';
              return price.toFixed(2);
            };

            const formatPercentage = (percent: number | null) => {
              if (percent === null || percent === undefined || isNaN(percent)) return 'N/A';
              return `${percent.toFixed(2)}%`;
            };

            return {
              symbol: item.key || 'UNKNOWN',
              livePrice: formatPrice(item.currentPrice),
              changePercent: formatPercentage(item.changePercent),
              rawLivePrice: item.currentPrice || null,
              rawChangePercent: item.changePercent || null,
            } as ProcessedLivePriceData;
          } catch (itemError) {
            console.error(`[LIVE_PRICE] Error processing item at index ${i + index}:`, itemError, item);
            return null;
          }
        }).filter(item => item !== null) as ProcessedLivePriceData[];
        
        processedData.push(...processedChunk);
        
        // Allow other operations to run between chunks in React Native
        if (i + chunkSize < data.length) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      console.log(`[LIVE_PRICE] Successfully processed live prices for ${processedData.length} symbols`);
      
      return processedData;
    } catch (error) {
      console.error('[LIVE_PRICE] Error fetching live prices:', error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to live price service. Please check your internet connection.');
      } else if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: Live price service took too long to respond.');
      } else if (error instanceof Error) {
        throw new Error(`Live price service error: ${error.message}`);
      } else {
        throw new Error('Unknown error occurred while fetching live prices');
      }
    }
  }

  /**
   * Get live price data for a specific symbol
   * @param symbol The symbol to get live price for
   * @returns Promise that resolves to live price data for the symbol or null if not found
   */
  async getLivePriceForSymbol(symbol: string): Promise<ProcessedLivePriceData | null> {
    try {
      const allPrices = await this.fetchLivePrices();
      return allPrices.find(price => price.symbol === symbol) || null;
    } catch (error) {
      console.error(`[LIVE_PRICE] Error fetching live price for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Create a map of symbol to live price data for easy lookup
   * @returns Promise that resolves to a Map of symbol to live price data
   */
  async getLivePricesMap(): Promise<Map<string, ProcessedLivePriceData>> {
    try {
      const allPrices = await this.fetchLivePrices();
      const pricesMap = new Map<string, ProcessedLivePriceData>();
      
      allPrices.forEach(price => {
        pricesMap.set(price.symbol, price);
      });
      
      console.log(`[LIVE_PRICE] Created prices map with ${pricesMap.size} entries`);
      return pricesMap;
    } catch (error) {
      console.error('[LIVE_PRICE] Error creating live prices map:', error);
      console.log('[LIVE_PRICE] Returning empty map due to error');
      return new Map();
    }
  }

  /**
   * Check if the live price service is available
   * @returns Promise that resolves to boolean indicating service availability
   */
  async isServiceAvailable(): Promise<boolean> {
    try {
      console.log('[LIVE_PRICE] Checking service availability...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for health check
      
      const response = await fetch(this.API_URL, {
        method: 'HEAD', // Use HEAD request for health check
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const isAvailable = response.ok;
      console.log(`[LIVE_PRICE] Service availability: ${isAvailable}`);
      return isAvailable;
    } catch (error) {
      console.log('[LIVE_PRICE] Service is not available:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}

// Export singleton instance
export const livePriceService = new LivePriceService();