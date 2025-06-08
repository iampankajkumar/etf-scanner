/**
 * Typography Theme
 * 
 * This file defines typography-related constants and styles used throughout the application.
 */

import { TextStyle } from 'react-native';
import { colors } from './colors';

/**
 * Font families
 */
export const fontFamily = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  monospace: 'monospace',
};

/**
 * Font weights
 */
export const fontWeight = {
  regular: 'normal' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: 'bold' as const,
};

/**
 * Font sizes
 */
export const fontSize = {
  tiny: 10,
  caption: 12,
  body: 14,
  subheading: 16,
  title: 18,
  h3: 20,
  h2: 24,
  h1: 30,
};

/**
 * Line heights
 */
export const lineHeight = {
  tiny: 14,
  caption: 16,
  body: 20,
  subheading: 24,
  title: 28,
  h3: 30,
  h2: 36,
  h1: 46,
};

/**
 * Letter spacing
 */
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};

/**
 * Text styles
 */
export const textStyles: Record<string, TextStyle> = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.h2,
    lineHeight: lineHeight.h2,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  h3: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.h3,
    lineHeight: lineHeight.h3,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  title: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.title,
    lineHeight: lineHeight.title,
    fontWeight: fontWeight.semiBold,
    color: colors.text,
  },
  subheading: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.subheading,
    lineHeight: lineHeight.subheading,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontWeight: fontWeight.regular,
    color: colors.text,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    fontWeight: fontWeight.regular,
    color: colors.textSecondary,
  },
  tiny: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.tiny,
    lineHeight: lineHeight.tiny,
    fontWeight: fontWeight.regular,
    color: colors.textMuted,
  },
  monospace: {
    fontFamily: fontFamily.monospace,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontWeight: fontWeight.regular,
    color: colors.text,
  },
};