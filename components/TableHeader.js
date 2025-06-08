import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { styles } from '../styles/appStyles';

export function TableHeader({ sortConfig, onSort, scrollX }) {
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.fixedHeaderColumn}>
        <TouchableOpacity onPress={() => onSort('symbol')}>
          <Text style={styles.headerCell}>
            Symbol {getSortIndicator('symbol')}
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.View style={[styles.scrollableHeaders, { transform: [{ translateX: Animated.multiply(scrollX, -1) }] }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerButton} onPress={() => onSort('price')}>
            <Text style={styles.headerCell}>
              Price {getSortIndicator('price')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => onSort('rsi')}>
            <Text style={styles.headerCell}>
              RSI {getSortIndicator('rsi')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => onSort('1d')}>
            <Text style={styles.headerCell}>
              1D {getSortIndicator('1d')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => onSort('1w')}>
            <Text style={styles.headerCell}>
              1W {getSortIndicator('1w')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => onSort('1m')}>
            <Text style={styles.headerCell}>
              1M {getSortIndicator('1m')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}