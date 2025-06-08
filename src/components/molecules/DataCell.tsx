/**
 * DataCell Component
 * 
 * A reusable component for displaying data in a table cell.
 */

import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from '../atoms/Text';
import { colors } from '../../theme/colors';
import { sizes } from '../../theme/sizes';

export interface DataCellProps {
  value: string | number | null | undefined;
  color?: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  style?: ViewStyle | TextStyle;
}

/**
 * DataCell component for displaying data in a table cell
 */
export const DataCell: React.FC<DataCellProps> = ({
  value,
  color,
  align = 'right',
  width = 80,
  style,
}) => {
  // Handle null, undefined, or empty values
  const displayValue = value === null || value === undefined || value === '' 
    ? 'N/A' 
    : value;

  return (
    <Text
      style={[
        styles.cell,
        { width, textAlign: align },
        color && { color },
        style,
      ]}
    >
      {displayValue}
    </Text>
  );
};

/**
 * Styles for the DataCell component
 */
const styles = StyleSheet.create({
  cell: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: sizes.base / 2,
  },
});