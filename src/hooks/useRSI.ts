import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAssets, sortAssets, addTicker, removeTicker } from '../store/slices/assetsSlice';
import { AssetItem, SortConfig } from '../types';

export const useRSI = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: data, status, sortConfig, tickers } = useSelector((state: RootState) => state.assets);

  const loadRSI = useCallback(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  useEffect(() => {
    loadRSI();
  }, [loadRSI]);

  const handleSort = (key: keyof AssetItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    dispatch(sortAssets({ key, direction }));
  };

  const handleAddTicker = (ticker: string) => {
    dispatch(addTicker(ticker));
  };

  const handleRemoveTicker = (ticker: string) => {
    dispatch(removeTicker(ticker));
  };

  return {
    data,
    status,
    sortConfig,
    tickers,
    loadRSI,
    handleSort,
    addTicker: handleAddTicker,
    removeTicker: handleRemoveTicker,
  };
};