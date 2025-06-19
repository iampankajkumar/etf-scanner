/**
 * Button Component
 * 
 * A reusable button component that applies consistent styling based on the theme.
 */

import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  StyleSheet, 
  ActivityIndicator,
  View
} from 'react-native';
import { colors } from '../../theme/colors';
import { sizes } from '../../theme/sizes';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Button component that applies consistent styling based on the theme
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  label,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  disabled,
  ...props
}) => {
  const buttonStyles = getButtonStyles(variant, size, disabled);
  const textStyles = getTextStyles(variant, size);
  
  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      disabled={disabled || loading}
      {...props}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'text' ? colors.primary : colors.text} 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>{icon}</View>
            )}
            <Text style={textStyles}>{label}</Text>
            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>{icon}</View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Get button styles based on variant, size, and disabled state
 */
const getButtonStyles = (
  variant: ButtonVariant,
  size: ButtonSize,
  disabled?: boolean
) => {
  const baseStyle = {
    ...styles.button,
    ...sizeStyles[size],
    opacity: disabled ? 0.6 : 1,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: colors.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: colors.border,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      };
    case 'text':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
      };
    default:
      return baseStyle;
  }
};

/**
 * Get text styles based on variant and size
 */
const getTextStyles = (variant: ButtonVariant, size: ButtonSize) => {
  const baseStyle = {
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  };

  const sizeStyle = {
    small: { fontSize: sizes.caption },
    medium: { fontSize: sizes.body },
    large: { fontSize: sizes.h3 },
  }[size];

  switch (variant) {
    case 'primary':
    case 'secondary':
      return {
        ...baseStyle,
        ...sizeStyle,
        color: colors.text,
      };
    case 'outline':
    case 'text':
      return {
        ...baseStyle,
        ...sizeStyle,
        color: colors.primary,
      };
    default:
      return baseStyle;
  }
};

/**
 * Size styles for different button sizes
 */
const sizeStyles = {
  small: {
    paddingVertical: sizes.base / 2,
    paddingHorizontal: sizes.base,
    borderRadius: sizes.radius / 2,
  },
  medium: {
    paddingVertical: sizes.base,
    paddingHorizontal: sizes.base * 2,
    borderRadius: sizes.radius,
  },
  large: {
    paddingVertical: sizes.base * 1.5,
    paddingHorizontal: sizes.base * 3,
    borderRadius: sizes.radius,
  },
};

/**
 * Styles for the button component
 */
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: sizes.base / 2,
  },
  iconRight: {
    marginLeft: sizes.base / 2,
  },
});