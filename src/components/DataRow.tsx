import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './atoms/Text';
import { styles } from '../styles/appStyles';
import { getColor, getReturnColor, getDiscountColor } from '../utils/ui';
import { formatReturn } from '../utils/data';
import { AssetItem } from '../types';
import { COLUMN_WIDTHS } from '../constants/ui';

interface DataRowProps {
  item: AssetItem;
  onDelete: (symbol: string) => void;
  onSymbolPress: (item: AssetItem) => void;
  fixed: boolean;
  scrollable: boolean;
}

export function DataRow({ item, onDelete, onSymbolPress, fixed, scrollable }: DataRowProps): React.JSX.Element | null {
  if (fixed) {
    return (
      <View style={styles.row1}>
        <View style={[styles.fixedColumn, { width: COLUMN_WIDTHS.TICKER, borderRightWidth: 1, borderRightColor: '#333' }]}>
          <TouchableOpacity
            onPress={() => onSymbolPress(item)}
            onLongPress={() => onDelete(item.ticker)}
            style={styles.tickerContainer}
          >
            <Text style={[styles.ticker, styles.clickableTicker, { width: COLUMN_WIDTHS.TICKER, textAlign: 'left' }]}>
              {item.ticker ? item.ticker.replace('.NS', '') : ''}
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
          <Text style={[styles.dataCell, { color: getDiscountColor(item.discount), width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>
            {item.discount || '0.00%'}
          </Text>
          <Text style={[styles.dataCell, styles.priceCell, { width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>
            {item.currentPrice}
          </Text>
          <Text style={[styles.dataCell, { color: getColor(item.rsi), width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>
            {item.rsi}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(item.oneDayReturn), width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>
            {item.oneDayReturn}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(item.oneWeekReturn), width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>
            {item.oneWeekReturn}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(item.oneMonthReturn), width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>
            {item.oneMonthReturn}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(formatReturn(item.rawThreeMonthReturn)), width: COLUMN_WIDTHS.DATA_CELL, borderRightWidth: 1, borderRightColor: '#333' }]}>
            {formatReturn(item.rawThreeMonthReturn)}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(formatReturn(item.rawSixMonthReturn)), width: COLUMN_WIDTHS.DATA_CELL }]}>
            {formatReturn(item.rawSixMonthReturn)}
          </Text>
        </View>
      </View>
    );
  }

  return null;
}