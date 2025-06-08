import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/appStyles';

export function PriceRangeBar({ title, min, max, current }) {
  const percentage = ((current - min) / (max - min)) * 100;

  return (
    <View style={styles.priceRangeContainer}>
      <Text style={styles.priceRangeTitle}>{title}</Text>
      <View style={styles.priceRangeBar}>
        <View style={[styles.priceRangeFill, { width: `${percentage}%` }]} />
        <View style={[styles.priceRangeIndicator, { left: `${percentage}%` }]} />
      </View>
      <View style={styles.priceRangeLabels}>
        <Text style={styles.priceRangeLabel}>₹{min.toFixed(2)}</Text>
        <Text style={styles.priceRangeLabel}>₹{max.toFixed(2)}</Text>
      </View>
      <Text style={styles.priceRangeCurrent}>Current: ₹{current.toFixed(2)}</Text>
    </View>
  );
}