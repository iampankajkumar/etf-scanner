import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAssets, refreshAssets, sortAssets } from '../store/slices/assetsSlice';
import { AssetItem, SortConfig } from '../types';

/**
 * Custom hook for managing RSI data and related operations
 * @returns Object containing RSI data and functions for managing it
 */
export const useRSI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    items: data, 
    status, 
    error, 
    sortConfig, 
    fromCache, 
    cacheAge, 
    lastUpdated 
  } = useSelector((state: RootState) => state.assets);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  /**
   * Load RSI data for all tickers (uses cache if available and valid)
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
   * Force refresh data from API (bypasses cache)
   */
  const handleRefreshRSI = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await dispatch(refreshAssets()).unwrap();
    } catch (error) {
      console.error('Failed to refresh RSI data:', error);
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

  return {
    data,
    status,
    error,
    isRefreshing,
    sortConfig,
    fromCache,
    cacheAge,
    lastUpdated,
    loadRSI: handleLoadRSI,
    refreshRSI: handleRefreshRSI,
    handleSort,
  };
};