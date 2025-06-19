/**
 * Card Component
 * 
 * A reusable card component that applies consistent styling based on the theme.
 */

import React from 'react';
import { View, ViewProps, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { sizes } from '../../theme/sizes';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: number;
  children: React.ReactNode;
}

/**
 * Card component that applies consistent styling based on the theme
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        getCardStyles(variant),
        padding !== undefined && { padding },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

/**
 * Get card styles based on variant
 */
const getCardStyles = (variant: CardVariant) => {
  switch (variant) {
    case 'elevated':
      return {
        ...styles.elevated,
      };
    case 'outlined':
      return {
        ...styles.outlined,
      };
    default:
      return {};
  }
};

/**
 * Styles for the card component
 */
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radius,
    padding: sizes.padding,
    marginVertical: sizes.base,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});