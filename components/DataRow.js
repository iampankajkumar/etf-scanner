import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/appStyles';
import { getColor, getReturnColor } from '../utils/ui';

export function DataRow({ item, onDelete, onSymbolPress, fixed, scrollable }) {
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
              {item.ticker.replace('.NS', '')}
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
          <Text style={[styles.dataCell, styles.priceCell]}>
            {item.currentPrice}
          </Text>
          <Text style={[styles.dataCell, { color: getColor(item.rsi) }]}>
            {item.rsi}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(item.oneDayReturn) }]}>
            {item.oneDayReturn}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(item.oneWeekReturn) }]}>
            {item.oneWeekReturn}
          </Text>
          <Text style={[styles.dataCell, { color: getReturnColor(item.oneMonthReturn) }]}>
            {item.oneMonthReturn}
          </Text>
        </View>
      </View>
    );
  }

  return null;
}