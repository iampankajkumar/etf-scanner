import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from './atoms/Text';
import { styles } from '../styles/appStyles';
import { SortConfig, AssetItem } from '../types';

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
      <View style={styles.fixedHeaderColumn}>
        <TouchableOpacity onPress={() => onSort('ticker')}>
          <Text style={styles.headerCell}>
            Symbol {getSortIndicator('ticker')}
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.scrollableHeaders, { transform: [{ translateX: Animated.multiply(scrollX, -1) }] }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => onSort('discount')}>
            <Text style={styles.headerCell}>
              Discount {getSortIndicator('discount')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('currentPrice')}>
            <Text style={styles.headerCell}>
              Price {getSortIndicator('currentPrice')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('rsi')}>
            <Text style={styles.headerCell}>
              RSI {getSortIndicator('rsi')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneDayReturn')}>
            <Text style={styles.headerCell}>
              1D Return {getSortIndicator('oneDayReturn')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneWeekReturn')}>
            <Text style={styles.headerCell}>
              1W Return {getSortIndicator('oneWeekReturn')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('oneMonthReturn')}>
            <Text style={styles.headerCell}>
              1M Return {getSortIndicator('oneMonthReturn')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('rawThreeMonthReturn')}>
            <Text style={styles.headerCell}>
              3M Return {getSortIndicator('rawThreeMonthReturn')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSort('rawSixMonthReturn')}>
            <Text style={styles.headerCell}>
              6M Return {getSortIndicator('rawSixMonthReturn')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}