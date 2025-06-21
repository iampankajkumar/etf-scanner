# API Refresh Optimization - Preventing Excessive /api/summary Calls

## Problem Analysis

The `/api/summary` API was being called on every refresh because:

1. **Force Refresh Logic**: When users pull-to-refresh or click "Refresh Data", the app calls `refreshAssets()` with `forceRefresh: true`, which bypassed all caching mechanisms.

2. **No Minimum Refresh Interval**: There was no protection against rapid successive refresh requests.

3. **Legacy Service Confusion**: Two services (`offlineDataService.ts` and `assetService.ts`) both called the same API, though only one was actively used.

## Root Cause

**File**: `src/services/offlineDataService.ts`

The `getAssets(forceRefresh: boolean)` method had this logic:
```typescript
// Check if we should use cached data
if (!forceRefresh) {
  // Only check cache if NOT force refreshing
  const isCacheValid = await this.isCacheValid();
  if (isCacheValid) {
    return cachedData; // Use cache
  }
}

// If forceRefresh=true, ALWAYS call API regardless of cache age
const freshAssets = await this.fetchFromApi(); // API CALL EVERY TIME
```

**Result**: Every pull-to-refresh or "Refresh Data" button press triggered an immediate API call, even if the last call was seconds ago.

## Solution Implemented

### 1. **Minimum Refresh Interval**

Added a 5-minute minimum interval between API calls:

```typescript
/**
 * Minimum refresh interval - prevent API calls more frequent than this
 */
const MIN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Check if enough time has passed since last refresh to allow a new API call
 */
private async canRefresh(): Promise<boolean> {
  const lastFetchData = await db.getAsset(LAST_FETCH_KEY);
  if (!lastFetchData) return true;
  
  const timeSinceLastFetch = Date.now() - lastFetchData.timestamp;
  
  if (timeSinceLastFetch < MIN_REFRESH_INTERVAL) {
    console.log(`[REFRESH] Last refresh was ${minutesAgo} minutes ago, minimum interval is 5 minutes`);
    return false;
  }
  
  return true;
}
```

### 2. **Smart Force Refresh Logic**

Modified the `getAssets()` method to respect minimum refresh intervals even for force refresh:

```typescript
// Even for force refresh, check minimum refresh interval
if (forceRefresh) {
  const canRefreshNow = await this.canRefresh();
  if (!canRefreshNow) {
    console.log('[REFRESH] Refresh requested too soon, using cached data');
    return {
      data: cachedAssets,
      fromCache: true,
      error: `Refresh too frequent. Last update was ${minutesAgo} minutes ago. Please wait ${waitMinutes} more minutes.`
    };
  }
}
```

### 3. **User Feedback**

When refresh is blocked due to minimum interval, users get clear feedback:
- Error message: "Refresh too frequent. Last update was X minutes ago. Please wait Y more minutes."
- Data is still returned from cache
- No API call is made

### 4. **Legacy Service Cleanup**

Removed unused `assetService.ts` from exports to prevent confusion:
```typescript
// Before
export * from './assetService';    // REMOVED - was calling same API
export * from './livePriceService';

// After  
export * from './livePriceService';
```

## Behavior Changes

### **Before Fix**:
- ❌ Every pull-to-refresh → API call
- ❌ Every "Refresh Data" click → API call  
- ❌ Multiple rapid refreshes → Multiple API calls
- ❌ No protection against API abuse

### **After Fix**:
- ✅ Pull-to-refresh respects 5-minute minimum interval
- ✅ "Refresh Data" respects 5-minute minimum interval
- ✅ Rapid refreshes use cached data with user feedback
- ✅ API calls limited to maximum once per 5 minutes

## User Experience

### **Scenario 1: Normal Usage**
1. User opens app → Uses cache if valid (same day)
2. User pulls to refresh after 10 minutes → API call allowed
3. Data refreshed successfully

### **Scenario 2: Rapid Refresh Attempts**
1. User pulls to refresh → API call (if >5 min since last)
2. User immediately pulls to refresh again → Blocked
3. User sees: "Refresh too frequent. Last update was 1 minute ago. Please wait 4 more minutes."
4. Cached data is still displayed

### **Scenario 3: Daily Usage**
1. First app open of the day → API call (new day)
2. Subsequent opens same day → Use cache
3. Force refresh after 6+ minutes → API call allowed

## Configuration

### **Adjustable Settings**:

```typescript
// Minimum time between API calls
const MIN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Cache validity (same calendar day)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

### **Customization Options**:
- Increase `MIN_REFRESH_INTERVAL` for less frequent API calls
- Decrease for more responsive refreshing (not recommended <2 minutes)
- Modify cache duration for different data freshness requirements

## Monitoring & Logging

### **Log Patterns to Watch**:

```bash
# Cache hits (good)
[CACHE] Data from today (2 hours ago) - using cache

# Refresh allowed (normal)
[REFRESH] Last refresh was 6 minutes ago, allowing refresh

# Refresh blocked (protection working)
[REFRESH] Last refresh was 2 minutes ago, minimum interval is 5 minutes

# API calls (should be infrequent)
[API] Fetching fresh data from API...
```

### **Success Metrics**:
- Reduced API call frequency
- Maintained user experience
- Clear user feedback for blocked refreshes
- Preserved data freshness

## Benefits

1. **🚀 Reduced API Load**: Maximum 1 call per 5 minutes per user
2. **💰 Cost Savings**: Fewer API calls = lower server costs
3. **⚡ Better Performance**: Faster response from cache
4. **🛡️ API Protection**: Prevents abuse and rate limiting
5. **👥 Better UX**: Clear feedback when refresh is blocked
6. **📱 Offline Resilience**: Always returns data when available

## Edge Cases Handled

1. **No Previous Data**: First-time users can always refresh
2. **Network Issues**: Falls back to cached data with appropriate messaging
3. **API Failures**: Returns cached data instead of failing completely
4. **Clock Changes**: Uses timestamp differences, not absolute times
5. **App Restart**: Refresh intervals persist across app sessions

## Future Enhancements

1. **Configurable Intervals**: Allow users to set refresh preferences
2. **Smart Refresh**: Shorter intervals during market hours
3. **Background Refresh**: Automatic updates when app is backgrounded
4. **Progressive Refresh**: Different intervals for different data types

The optimization successfully prevents excessive API calls while maintaining a responsive user experience and providing clear feedback when refresh requests are throttled.