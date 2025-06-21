import { useState, useEffect, useCallback } from 'react';
import { livePriceService, ProcessedLivePriceData } from '../services/livePriceService';

/**
 * Custom hook for managing live price data
 * @returns Object containing live price data and functions for managing it
 */
export const useLivePrice = () => {
  const [livePrices, setLivePrices] = useState<Map<string, ProcessedLivePriceData>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  /**
   * Fetch live price data
   */
  const fetchLivePrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[LIVE_PRICE_HOOK] Starting to fetch live prices...');
      const pricesMap = await livePriceService.getLivePricesMap();
      setLivePrices(pricesMap);
      setLastUpdated(Date.now());
      
      console.log(`[LIVE_PRICE_HOOK] Successfully fetched live prices for ${pricesMap.size} symbols`);
    } catch (error) {
      console.error('[LIVE_PRICE_HOOK] Error fetching live prices:', error);
      
      // Set a user-friendly error message
      let errorMessage = 'Failed to fetch live prices';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Don't completely fail - keep existing data if available
      console.log(`[LIVE_PRICE_HOOK] Keeping existing live prices data (${livePrices.size} symbols)`);
    } finally {
      setIsLoading(false);
    }
  }, [livePrices.size]);

  /**
   * Get live price data for a specific symbol
   * @param symbol The symbol to get live price for
   * @returns Live price data for the symbol or null if not found
   */
  const getLivePriceForSymbol = useCallback((symbol: string): ProcessedLivePriceData | null => {
    return livePrices.get(symbol) || null;
  }, [livePrices]);

  /**
   * Refresh live price data (force refresh)
   */
  const refreshLivePrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[LIVE_PRICE_HOOK] Force refreshing live prices...');
      const pricesMap = await livePriceService.getLivePricesMap();
      setLivePrices(pricesMap);
      setLastUpdated(Date.now());
      
      console.log(`[LIVE_PRICE_HOOK] Force refresh completed for ${pricesMap.size} symbols`);
    } catch (error) {
      console.error('[LIVE_PRICE_HOOK] Error force refreshing live prices:', error);
      
      let errorMessage = 'Failed to refresh live prices';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch live prices on mount
  useEffect(() => {
    fetchLivePrices();
  }, [fetchLivePrices]);

  return {
    livePrices,
    isLoading,
    error,
    lastUpdated,
    fetchLivePrices,
    refreshLivePrices,
    getLivePriceForSymbol,
    clearError,
  };
};