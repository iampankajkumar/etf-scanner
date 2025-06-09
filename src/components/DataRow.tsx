import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './atoms/Text';
import { styles } from '../styles/appStyles';
import { getColor, getReturnColor, getDiscountColor } from '../utils/ui';
import { formatReturn } from '../utils/data';
import { AssetItem } from '../types';

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
        <View style={styles.fixedColumn}>
          <TouchableOpacity
            onPress={() => onSymbolPress(item)}
            onLongPress={() => onDelete(item.ticker)}
            style={styles.tickerContainer}
          >
            <Text style={[styles.ticker, styles.clickableTicker]}>
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
          <Text style={[styles.dataCell, { color: getDiscountColor(item.discount) }]}>
            {item.discount || '0.00%'}
          </Text>
          <Text style={[styles.dataCell, styles.priceCell]}>
            {item.currentPrice}
          </Text>
          <Text style={[styles.dataCell, { color: getColor(item.rsi) }]}>
            {item.rsi}
          </Text>
          <Text
            style={[
              styles.dataCell,
              { color: getReturnColor(item.oneDayReturn) },
            ]}
          >
            {item.oneDayReturn}
          </Text>
          <Text
            style={[
              styles.dataCell,
              { color: getReturnColor(item.oneWeekReturn) },
            ]}
          >
            {item.oneWeekReturn}
          </Text>
          <Text
            style={[
              styles.dataCell,
              { color: getReturnColor(item.oneMonthReturn) },
            ]}
          >
            {item.oneMonthReturn}
          </Text>
          <Text
            style={[
              styles.dataCell,
              {
                color: getReturnColor(formatReturn(item.rawThreeMonthReturn)),
              },
            ]}
          >
            {formatReturn(item.rawThreeMonthReturn)}
          </Text>
          <Text
            style={[
              styles.dataCell,
              { color: getReturnColor(formatReturn(item.rawSixMonthReturn)) },
            ]}
          >
            {formatReturn(item.rawSixMonthReturn)}
          </Text>
        </View>
      </View>
    );
  }

  return null;
}