import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from './atoms/Text';
import { styles } from '../styles/appStyles';
import { SortConfig, AssetItem } from '../types';
import { COLUMN_WIDTHS } from '../constants/ui';
import { sizes } from '../theme/sizes';

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
          <Text 
            style={[styles.headerCell, { width: COLUMN_WIDTHS.TICKER, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'left', paddingLeft: 2, paddingRight: 4 }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.7}
            ellipsizeMode="tail"
          >
            Symbol {getSortIndicator('ticker')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Scrollable columns */}
      <Animated.View style={[styles.scrollableHeaders, { transform: [{ translateX: Animated.multiply(scrollX, -1) }] }]}> 
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onSort('discount')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>Down {getSortIndicator('discount')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('currentPrice')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.PRICE_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>Price {getSortIndicator('currentPrice')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('rsi')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>RSI (D) {getSortIndicator('rsi')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('weeklyRSI')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>RSI (W) {getSortIndicator('weeklyRSI')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('monthlyRSI')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>RSI (M) {getSortIndicator('monthlyRSI')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('lastDayVolume')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.VOLUME_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>Volume {getSortIndicator('lastDayVolume')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneDayReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>1D % {getSortIndicator('oneDayReturn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneWeekReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>1W % {getSortIndicator('oneWeekReturn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneMonthReturn')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>1M % {getSortIndicator('oneMonthReturn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneYearReturns')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>1Y % {getSortIndicator('oneYearReturns')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('twoYearReturns')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>2Y % {getSortIndicator('twoYearReturns')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('twoYearNiftyReturns')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>2Y Nifty % {getSortIndicator('twoYearNiftyReturns')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('priceToEarning')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333', textAlign: 'center' }]}>P/E {getSortIndicator('priceToEarning')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('niftyPriceToEarning')}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.DATA_CELL, textAlign: 'center' }]}>Nifty P/E {getSortIndicator('niftyPriceToEarning')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}