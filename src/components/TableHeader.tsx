import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from './atoms/Text';
import { styles } from '../styles/appStyles';
import { SortConfig, AssetItem } from '../types';
import { COLUMN_WIDTHS } from '../constants/ui';

interface TableHeaderProps {
  sortConfig: SortConfig;
  onSort: (key: keyof AssetItem) => void;
  scrollX: Animated.Value;
}

export function TableHeader({ sortConfig, onSort, scrollX }: TableHeaderProps): React.JSX.Element {
  const getSortIndicator = (key: keyof AssetItem) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <View style={styles.headerContainer}>
      {/* Fixed Symbol column */}
      <View style={[styles.fixedHeaderColumn, { width: COLUMN_WIDTHS.TICKER, borderRightWidth: 1, borderRightColor: '#333' }]}> 
        <TouchableOpacity onPress={() => onSort('ticker')}>
          <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.TICKER, textAlign: 'left' }]}>Symbol {getSortIndicator('ticker')}</Text>
        </TouchableOpacity>
      </View>
      {/* Scrollable columns */}
      <Animated.View style={[styles.scrollableHeaders, { transform: [{ translateX: Animated.multiply(scrollX, -1) }] }]}> 
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onSort('discount')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>Discount {getSortIndicator('discount')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('currentPrice')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>Price {getSortIndicator('currentPrice')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('rsi')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>RSI {getSortIndicator('rsi')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneDayReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>1D Return {getSortIndicator('oneDayReturn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneWeekReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>1W Return {getSortIndicator('oneWeekReturn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneMonthReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>1M Return {getSortIndicator('oneMonthReturn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('rawThreeMonthReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>3M Return {getSortIndicator('rawThreeMonthReturn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('rawSixMonthReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL }]}>6M Return {getSortIndicator('rawSixMonthReturn')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}