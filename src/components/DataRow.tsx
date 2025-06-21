import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './atoms/Text';
import { styles } from '../styles/appStyles';
import { getColor, getReturnColor, getDiscountColor } from '../utils/ui';
import { formatReturn } from '../utils/data';
import { AssetItem } from '../types';
import { COLUMN_WIDTHS } from '../constants/ui';
import { sizes } from '../theme/sizes';

interface DataRowProps {
  item: AssetItem;
  onDelete: (symbol: string) => void;
  onSymbolPress: (item: AssetItem) => void;
  fixed: boolean;
  scrollable: boolean;
}

// Memoized component for better performance
const DataRow = React.memo<DataRowProps>(({ item, onDelete, onSymbolPress, fixed, scrollable }) => {
  // Memoize callbacks to prevent unnecessary re-renders
  const handleSymbolPress = useCallback(() => {
    onSymbolPress(item);
  }, [onSymbolPress, item]);

  const handleDelete = useCallback(() => {
    onDelete(item.ticker);
  }, [onDelete, item.ticker]);

  // Memoize computed values
  const displaySymbol = useMemo(() => {
    return item.ticker ? item.ticker.replace('.NS', '') : '';
  }, [item.ticker]);

  // Memoize style objects to prevent recreation
  const fixedColumnStyle = useMemo(() => [
    styles.fixedColumn,
    { width: COLUMN_WIDTHS.TICKER, borderRightWidth: 1, borderRightColor: '#333' }
  ], []);

  const tickerStyle = useMemo(() => [
    styles.ticker,
    styles.clickableTicker,
    { width: COLUMN_WIDTHS.TICKER, textAlign: 'left' as const, paddingLeft: 2, paddingRight: 4 }
  ], []);

  // Memoize colors separately to reduce recalculation
  const colors = useMemo(() => ({
    discount: getDiscountColor(item.discount),
    rsi: getColor(item.rsi),
    weeklyRSI: getColor(item.weeklyRSI),
    monthlyRSI: getColor(item.monthlyRSI),
    oneDayReturn: getReturnColor(item.oneDayReturn),
    oneWeekReturn: getReturnColor(item.oneWeekReturn),
    oneMonthReturn: getReturnColor(item.oneMonthReturn),
    changePercent: getReturnColor(item.changePercent),
  }), [item.discount, item.rsi, item.weeklyRSI, item.monthlyRSI, item.oneDayReturn, item.oneWeekReturn, item.oneMonthReturn, item.changePercent]);

  // Static style objects (created once)
  const staticStyles = useMemo(() => ({
    dataCell: [styles.dataCell, { 
      width: COLUMN_WIDTHS.DATA_CELL, 
      borderRightWidth: 1, 
      borderRightColor: '#333', 
      textAlign: 'center' as const 
    }],
    priceCell: [styles.dataCell, styles.priceCell, { 
      width: COLUMN_WIDTHS.PRICE_CELL, 
      borderRightWidth: 1, 
      borderRightColor: '#333', 
      textAlign: 'center' as const 
    }],
    livePriceCell: [styles.dataCell, styles.priceCell, { 
      width: COLUMN_WIDTHS.LIVE_PRICE_CELL, 
      borderRightWidth: 1, 
      borderRightColor: '#333', 
      textAlign: 'center' as const 
    }],
    changePercentCell: [styles.dataCell, { 
      width: COLUMN_WIDTHS.CHANGE_PERCENT_CELL, 
      borderRightWidth: 1, 
      borderRightColor: '#333', 
      textAlign: 'center' as const 
    }],
    volumeCell: [styles.dataCell, { 
      width: COLUMN_WIDTHS.VOLUME_CELL, 
      borderRightWidth: 1, 
      borderRightColor: '#333', 
      textAlign: 'center' as const 
    }],
    lastCell: [styles.dataCell, { 
      width: COLUMN_WIDTHS.DATA_CELL, 
      textAlign: 'center' as const 
    }]
  }), []);
  if (fixed) {
    return (
      <View style={styles.row1}>
        <View style={fixedColumnStyle}>
          <TouchableOpacity
            onPress={handleSymbolPress}
            onLongPress={handleDelete}
            style={styles.tickerContainer}
          >
            <Text 
              style={tickerStyle}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
              ellipsizeMode="tail"
            >
              {displaySymbol}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (scrollable) {
    return (
      <View style={styles.row}>
        <View style={styles.scrollableColumns}>
          <Text style={[staticStyles.dataCell, { color: colors.discount }]}>{String(item.discount || '0.00%')}</Text>
          <Text style={staticStyles.priceCell}>{String(item.currentPrice || 'N/A')}</Text>
          <Text style={staticStyles.livePriceCell}>{String(item.livePrice || 'N/A')}</Text>
          <Text style={[staticStyles.changePercentCell, { color: colors.changePercent }]}>{String(item.changePercent || 'N/A')}</Text>
          <Text style={[staticStyles.dataCell, { color: colors.rsi }]}>{String(item.rsi || 'N/A')}</Text>
          <Text style={[staticStyles.dataCell, { color: colors.weeklyRSI }]}>{String(item.weeklyRSI || 'N/A')}</Text>
          <Text style={[staticStyles.dataCell, { color: colors.monthlyRSI }]}>{String(item.monthlyRSI || 'N/A')}</Text>
          <Text style={staticStyles.volumeCell}>{String(item.lastDayVolume || 'N/A')}</Text>
          <Text style={[staticStyles.dataCell, { color: colors.oneDayReturn }]}>{String(item.oneDayReturn || 'N/A')}</Text>
          <Text style={[staticStyles.dataCell, { color: colors.oneWeekReturn }]}>{String(item.oneWeekReturn || 'N/A')}</Text>
          <Text style={[staticStyles.dataCell, { color: colors.oneMonthReturn }]}>{String(item.oneMonthReturn || 'N/A')}</Text>
          <Text style={staticStyles.dataCell}>{String(item.oneYearReturns || 'N/A')}</Text>
          <Text style={staticStyles.dataCell}>{String(item.twoYearReturns || 'N/A')}</Text>
          <Text style={staticStyles.dataCell}>{String(item.twoYearNiftyReturns || 'N/A')}</Text>
          <Text style={staticStyles.dataCell}>{String(item.priceToEarning || 'N/A')}</Text>
          <Text style={staticStyles.lastCell}>{String(item.niftyPriceToEarning || 'N/A')}</Text>
        </View>
      </View>
    );
  }

  return null;
});

// Add display name for debugging
DataRow.displayName = 'DataRow';

export { DataRow };