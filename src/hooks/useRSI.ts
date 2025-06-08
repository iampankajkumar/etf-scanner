import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAssets, sortAssets, addTicker, removeTicker } from '../store/slices/assetsSlice';
import { AssetItem, SortConfig } from '../types';

/**
 * Custom hook for managing RSI data and related operations
 * @returns Object containing RSI data and functions for managing it
 */
export const useRSI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: data, status, error, sortConfig, tickers } = useSelector((state: RootState) => state.assets);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  /**
   * Load RSI data for all tickers
   */
  const handleLoadRSI = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await dispatch(fetchAssets()).unwrap();
    } catch (error) {
      console.error('Failed to load RSI data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  /**
   * Initialize data on component mount
   */
  useEffect(() => {
    handleLoadRSI();
  }, [handleLoadRSI]);

  /**
   * Handle sorting of assets
   * @param key The key to sort by
   */
  const handleSort = useCallback((key: keyof AssetItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    dispatch(sortAssets({ key, direction }));
  }, [dispatch, sortConfig]);

  /**
   * Add a ticker to track
   * @param ticker The ticker symbol to add
   */
  const handleAddTicker = useCallback((ticker: string) => {
    if (!ticker.trim()) return;
    
    dispatch(addTicker(ticker.trim()));
    // Refresh data to include the new ticker
    handleLoadRSI();
  }, [dispatch, handleLoadRSI]);

  /**
   * Remove a ticker from tracking
   * @param ticker The ticker symbol to remove
   */
  const handleRemoveTicker = useCallback((ticker: string) => {
    dispatch(removeTicker(ticker));
  }, [dispatch]);

  return {
    data,
    status,
    error,
    isRefreshing,
    sortConfig,
    tickers,
    loadRSI: handleLoadRSI,
    handleSort,
    addTicker: handleAddTicker,
    removeTicker: handleRemoveTicker,
  };
};