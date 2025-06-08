/**
 * Text Component
 * 
 * A reusable text component that applies consistent styling based on the theme.
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { textStyles } from '../../theme/typography';
import { colors } from '../../theme/colors';

export type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'title' 
  | 'subheading' 
  | 'body' 
  | 'caption' 
  | 'tiny'
  | 'monospace';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

/**
 * Text component that applies consistent styling based on the theme
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        textStyles[variant],
        align && { textAlign: align },
        color && { color },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

/**
 * Heading component for h1 text
 */
export const H1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

/**
 * Heading component for h2 text
 */
export const H2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

/**
 * Heading component for h3 text
 */
export const H3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

/**
 * Title component
 */
export const Title: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="title" {...props} />
);

/**
 * Subheading component
 */
export const Subheading: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="subheading" {...props} />
);

/**
 * Body text component
 */
export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

/**
 * Caption text component
 */
export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

/**
 * Tiny text component
 */
export const Tiny: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="tiny" {...props} />
);

/**
 * Monospace text component
 */
export const Monospace: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="monospace" {...props} />
);