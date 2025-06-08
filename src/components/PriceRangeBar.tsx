import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/appStyles';

interface PriceRangeBarProps {
  title: string;
  min: number;
  max: number;
  current: number;
}

export function PriceRangeBar({ title, min, max, current }: PriceRangeBarProps): React.JSX.Element {
  const getPosition = (value: number) => ((value - min) / (max - min)) * 100;

  const currentPosition = getPosition(current);

  return (
    <View style={styles.priceRangeContainer}>
      <Text style={styles.priceRangeTitle}>{title}</Text>
      <View style={{ height: 60, justifyContent: 'center' }}>
        <View style={[styles.line, { top: 10, backgroundColor: 'red' }]} />
        <Text style={[styles.lineText, { top: 0, left: 0 }]}>Min: ₹{min.toFixed(2)}</Text>
        
        <View style={[styles.line, { top: 30, backgroundColor: 'blue' }]} />
        <Text style={[styles.lineText, { top: 20, left: `${currentPosition}%` }]}>Current: ₹{current.toFixed(2)}</Text>

        <View style={[styles.line, { top: 50, backgroundColor: 'green' }]} />
        <Text style={[styles.lineText, { top: 40, right: 0 }]}>Max: ₹{max.toFixed(2)}</Text>
      </View>
    </View>
  );
}