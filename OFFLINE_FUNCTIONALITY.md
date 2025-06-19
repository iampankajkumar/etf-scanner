# Offline Functionality Implementation

## Overview

The RSI Tracker app now implements a comprehensive offline-first approach that ensures the app works seamlessly without internet connectivity. Data is cached locally using SQLite and refreshed once daily when the app is opened.

## Key Features

### 1. **Offline-First Architecture**
- Data is fetched from cache first if available and valid (less than 24 hours old)
- API is only called when cache is invalid or when explicitly refreshed
- App works completely offline after initial data load

### 2. **Smart Caching System**
- **Cache Duration**: Once per calendar day (not 24-hour intervals)
- **Storage**: SQLite database for reliable local storage
- **Cache Logic**: Data refreshes on first app open each day
- **Cache Keys**: 
  - `all_assets_data`: Stores the complete assets dataset
  - `last_fetch_timestamp`: Tracks when data was last fetched

### 3. **Network-Aware Behavior**
- Automatically detects network connectivity
- Falls back to cached data when offline
- Shows appropriate status messages to users

### 4. **User Experience Enhancements**
- **Cache Status Indicator**: Shows when using cached data and its age
- **Pull-to-Refresh**: Forces fresh data fetch from API
- **Menu Options**: 
  - "Refresh Data" - Force API refresh
  - "Cache Status" - View current cache information
- **Error Handling**: Graceful fallback to cached data when API fails

## Implementation Details

### Core Components

#### 1. **OfflineDataService** (`src/services/offlineDataService.ts`)
- Main service handling offline-first data management
- Methods:
  - `getAssets(forceRefresh)`: Get data with cache-first approach
  - `clearCache()`: Clear all cached data
  - `getCacheStatus()`: Get detailed cache information

#### 2. **Database Service** (`src/db/database.ts`)
- SQLite database management
- Handles asset storage and retrieval
- Automatic database initialization

#### 3. **Enhanced Redux Store** (`src/store/slices/assetsSlice.ts`)
- New state properties:
  - `fromCache`: Boolean indicating if data is from cache
  - `cacheAge`: Age of cached data in hours
  - `lastUpdated`: Timestamp of last update
- New actions:
  - `fetchAssets`: Cache-first data loading
  - `refreshAssets`: Force API refresh

#### 4. **Network Utilities** (`src/utils/network.ts`)
- Network connectivity detection
- Real-time network status monitoring

### Data Flow

```
App Start
    ↓
Check Cache Validity (Same Calendar Day?)
    ↓
[Valid Cache] → Use Cached Data → Display with Cache Indicator
    ↓
[Invalid/No Cache] → Check Network Connection
    ↓
[Online] → Fetch from API → Cache Data → Display Fresh Data
    ↓
[Offline] → Use Old Cache (if available) → Display with Warning
    ↓
[No Cache + Offline] → Show Error Message
```

### User Interactions

1. **App Launch**: Automatically loads data (cache-first)
2. **Pull-to-Refresh**: Forces fresh API call
3. **Menu → Refresh Data**: Forces fresh API call
4. **Menu → Cache Status**: Shows cache information

## Configuration

### Cache Duration
```typescript
// Cache refreshes once per calendar day (not 24-hour intervals)
// Data from today = valid, data from yesterday = needs refresh
const isSameDay = now.getFullYear() === lastFetch.getFullYear() &&
                  now.getMonth() === lastFetch.getMonth() &&
                  now.getDate() === lastFetch.getDate();
```

### Database Schema
```sql
CREATE TABLE assets (
  id INTEGER PRIMARY KEY NOT NULL,
  symbol TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  data TEXT NOT NULL
);
```

## Error Handling

### Scenarios Covered:
1. **No Internet + Valid Cache**: Use cached data with status indicator
2. **No Internet + Expired Cache**: Use old cache with warning message
3. **No Internet + No Cache**: Show error message
4. **API Error + Cache Available**: Fallback to cached data
5. **API Error + No Cache**: Show error message

### Error Messages:
- `"No internet connection. Using cached data from X hours ago."`
- `"API unavailable. Using cached data from X hours ago."`
- `"No internet connection and no cached data available"`

## Benefits

### For Users:
- **Instant App Loading**: No waiting for API calls on subsequent launches
- **Offline Access**: Full functionality without internet
- **Data Freshness**: Automatic daily updates when online
- **Transparency**: Clear indication of data source and age

### For Performance:
- **Reduced API Calls**: Only fetch when necessary
- **Faster Load Times**: Cached data loads instantly
- **Bandwidth Savings**: Minimize data usage
- **Better UX**: No loading spinners for cached data

## Testing Offline Functionality

### Manual Testing:
1. **First Launch**: Ensure data is fetched and cached
2. **Offline Mode**: Turn off internet, restart app - should load cached data
3. **Cache Expiry**: Wait 24+ hours, restart app - should attempt fresh fetch
4. **Pull-to-Refresh**: Should work online, show error offline
5. **Menu Options**: Test "Refresh Data" and "Cache Status"

### Verification Points:
- [ ] App works without internet after initial setup
- [ ] Cache status indicator appears when using cached data
- [ ] Pull-to-refresh forces API call when online
- [ ] Appropriate error messages when offline
- [ ] Data automatically refreshes after 24 hours when online

## Future Enhancements

### Potential Improvements:
1. **Selective Refresh**: Update only changed data
2. **Background Sync**: Automatic updates when app comes online
3. **Cache Size Management**: Automatic cleanup of old data
4. **Offline Indicators**: Network status in UI
5. **Manual Cache Control**: User-configurable cache duration

## Troubleshooting

### Common Issues:
1. **Database Initialization Errors**: Check SQLite permissions
2. **Network Detection Issues**: Verify NetInfo package installation
3. **Cache Not Working**: Check database write permissions
4. **API Errors**: Verify network connectivity and API endpoint

### Debug Logging:
The app includes comprehensive logging with prefixes:
- `[CACHE]`: Cache operations
- `[API]`: API calls
- `[NETWORK]`: Network operations
- `[FALLBACK]`: Fallback scenarios
- `[SERVICE]`: Service-level operations

## Dependencies

### Required Packages:
- `expo-sqlite`: Local database storage
- `@react-native-community/netinfo`: Network connectivity detection
- `@reduxjs/toolkit`: State management
- `react-redux`: Redux integration

### Installation:
```bash
npm install expo-sqlite @react-native-community/netinfo
```

This implementation ensures your RSI Tracker app provides a seamless offline experience while maintaining data freshness and user transparency.