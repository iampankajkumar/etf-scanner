/**
 * Theme Index
 * 
 * This file exports all theme-related constants and styles
 * to provide a single import point for the theme.
 */

export * from './colors';
export * from './sizes';
export * from './typography';

/**
 * Theme object that combines all theme-related constants and styles
 */
import { colors } from './colors';
import { sizes } from './sizes';
import { 
  fontFamily, 
  fontWeight, 
  fontSize, 
  lineHeight, 
  letterSpacing, 
  textStyles 
} from './typography';

export const theme = {
  colors,
  sizes,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  textStyles,
};

export type Theme = typeof theme;