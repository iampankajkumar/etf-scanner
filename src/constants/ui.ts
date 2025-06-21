/**
 * UI Constants
 * 
 * This file contains all UI-related constants used throughout the application.
 */

/**
 * Table column widths
 */
export const COLUMN_WIDTHS = {
  TICKER: 95,
  DATA_CELL: 75,
  VOLUME_CELL: 90,
  PRICE_CELL: 80,
  LIVE_PRICE_CELL: 85,
  CHANGE_PERCENT_CELL: 80,
};

/**
 * Animation durations in milliseconds
 */
export const ANIMATION = {
  SHORT: 150,
  MEDIUM: 300,
  LONG: 500,
};

/**
 * Z-index values for layering UI elements
 */
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 1,
  HEADER: 10,
  MODAL: 100,
  TOOLTIP: 200,
};

/**
 * Default padding and margin values
 */
export const SPACING = {
  TINY: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
};

/**
 * RSI interpretation thresholds
 */
export const RSI_THRESHOLDS = {
  OVERSOLD: 30,
  NEUTRAL_LOW: 40,
  NEUTRAL_HIGH: 60,
  OVERBOUGHT: 70,
};

/**
 * Default modal dimensions
 */
export const MODAL = {
  WIDTH: '80%',
  BORDER_RADIUS: 8,
};

/**
 * Banner ad dimensions
 */
export const BANNER_AD = {
  HEIGHT: 60, // Standard banner ad height (50px + padding)
  PADDING: 10, // Extra padding around the ad
};