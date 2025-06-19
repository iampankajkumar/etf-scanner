export const config = {
  api: {
    timeout: 8000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // maximum number of items to cache
  },
  ui: {
    updateInterval: 30000, // 30 seconds
    maxVisibleAssets: 50,
    defaultSortField: 'rsi',
    defaultSortDirection: 'desc' as const,
  },
  features: {
    enableOfflineMode: true,
    enablePushNotifications: false,
    enableAnalytics: false,
  }
} as const;

export type Config = typeof config;

// Environment-specific overrides
if (__DEV__) {
  config.api.timeout = 20000; // Longer timeout for development
  config.cache.ttl = 1 * 60 * 1000; // 1 minute cache in development
}
