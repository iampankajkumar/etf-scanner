/**
 * API Constants
 * 
 * This file contains all API-related constants used throughout the application.
 */

/**
 * Base URL for Yahoo Finance API
 */
export const YAHOO_FINANCE_API_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

/**
 * Cache duration in milliseconds (24 hours)
 */
export const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * API request timeout in milliseconds
 */
export const API_TIMEOUT = 30000; // 30 seconds

/**
 * Chart range for API requests
 */
export const DEFAULT_CHART_RANGE = '1y';

/**
 * Chart interval for API requests
 */
export const DEFAULT_CHART_INTERVAL = '1d';