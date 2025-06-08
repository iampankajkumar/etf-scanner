import React from 'react';
import { View, Text } from 'react-native';
import { sizes } from '../theme/sizes';
import { styles } from '../styles/appStyles';

interface PriceRangeBarProps {
  title: string;
  min: number;
  max: number;
  current: number;
}

export function PriceRangeBar({ title, min, max, current }: PriceRangeBarProps): React.JSX.Element {
  const getPosition = (value: number) => {
    if (max === min) {
      return 50;
    }
    return ((value - min) / (max - min)) * 100;
  };

  const currentPosition = getPosition(current);

  const leftColor = 'red';
  const rightColor = 'green';

  return (
    <View style={styles.priceRangeContainer}>
      <Text style={styles.priceRangeTitle}>{title}</Text>
      <View style={styles.priceRangeLabels}>
        <Text style={styles.priceRangeLabel}>₹{min.toFixed(2)}</Text>
        <Text style={styles.priceRangeLabel}>₹{max.toFixed(2)}</Text>
      </View>
      <View style={styles.priceRangeBar}>
        <View
          style={[
            styles.priceRangeIndicator,
            { left: `${currentPosition}%` },
          ]}
        />
      </View>
      <View style={[styles.priceRangeLabels, { marginTop: sizes.base * 1.5 }]}>
        <Text style={[styles.priceRangeLabel, { position: 'absolute', left: `${currentPosition}%`, transform: [{ translateX: -20 }] }]}>
          ₹{current.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}