# API Caching Strategy - Corrected Implementation

## Requirements Clarification

You were absolutely right! The correct API caching strategy should be:

- **`/api/summary`** - Called **ONCE per calendar day** and cached in SQLite
- **`/api/prices`** - Called on **EVERY refresh** (no caching)

## Previous Implementation Issues

### ❌ What Was Wrong:

1. **`/api/summary`** had a 5-minute minimum refresh interval (incorrect)
2. **`/api/prices`** had a 5-minute cache (incorrect)
3. Force refresh was being blocked for `/api/summary` (incorrect)

### ✅ Corrected Implementation:

## 1. `/api/summary` Service (offlineDataService.ts)

**Purpose**: Fetch ETF summary data (RSI, returns, P/E ratios, etc.)
**Caching**: Once per calendar day in SQLite
**Behavior**: Always use cache if from same calendar day

```typescript
/**
 * Get assets data with offline-first approach
 * /api/summary is called only once per calendar day and cached in SQLite
 * - First check if cached data is valid (same calendar day)
 * - If valid, ALWAYS return cached data (even for force refresh)
 * - If not valid or no cache, fetch from /api/summary and cache the result
 */
async getAssets(forceRefresh: boolean = false): Promise<{...}> {
  // Check if we have valid cached data (same calendar day)
  const isCacheValid = await this.isCacheValid();
  
  if (isCacheValid) {
    console.log('[SUMMARY_API] Using cached data from today - /api/summary not called');
    return cachedData;
  }

  // Cache is not valid (different day) - call /api/summary
  console.log('[SUMMARY_API] Cache invalid or missing - calling /api/summary');
  const freshAssets = await this.fetchFromApi(); // Calls /api/summary
  await this.saveAssetsToCache(freshAssets);
  
  return freshAssets;
}
```

**Key Points**:
- ✅ Called only once per calendar day
- ✅ Cached in SQLite database
- ✅ Force refresh ignored (still uses cache if same day)
- ✅ Only calls API when date changes

## 2. `/api/prices` Service (livePriceService.ts)

**Purpose**: Fetch real-time live prices and change percentages
**Caching**: No caching - fresh data every time
**Behavior**: Always calls API on every refresh

```typescript
/**
 * Live Price Service for fetching real-time price data
 * /api/prices is called on EVERY refresh - no caching
 */
export class LivePriceService {
  private readonly API_URL = 'https://etf-screener-backend-production.up.railway.app/api/prices';

  /**
   * Fetch live price data for all symbols (called on every refresh)
   */
  async fetchLivePrices(): Promise<ProcessedLivePriceData[]> {
    // Always fetch fresh data - no cache checking
    console.log('[LIVE_PRICE] Fetching live price data...');
    const response = await fetch(this.API_URL);
    // Process and return fresh data
  }
}
```

**Key Points**:
- ✅ No caching mechanism
- ✅ Called on every refresh
- ✅ Always returns fresh real-time data
- ✅ Removed all cache-related methods

## Behavior Comparison

### **App Startup (First Time Today)**:
```
[SUMMARY_API] Cache invalid or missing - calling /api/summary
[SUMMARY_API] Successfully fetched and cached data from /api/summary
[LIVE_PRICE] Fetching live price data...
```

### **Subsequent App Opens (Same Day)**:
```
[SUMMARY_API] Using cached data from today - /api/summary not called
[LIVE_PRICE] Fetching live price data...
```

### **Pull to Refresh (Same Day)**:
```
[SUMMARY_API] Using cached data from today - /api/summary not called
[LIVE_PRICE] Fetching live price data...
```

### **Next Day (First Open)**:
```
[SUMMARY_API] Cache invalid or missing - calling /api/summary
[SUMMARY_API] Successfully fetched and cached data from /api/summary
[LIVE_PRICE] Fetching live price data...
```

## Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Action   │    │   Data Sources   │    │   Storage       │
├─────────────────┤    ├──────────────────┤    ├─────────────────┤
│ App Startup     │───▶│ /api/summary     │───▶│ SQLite Cache    │
│ Pull Refresh    │    │ (once per day)   │    │ (calendar day)  │
│ Force Refresh   │    │                  │    │                 │
└─────────────────┘    ├──────────────────┤    └─────────────────┘
                       │ /api/prices      │
                       │ (every refresh)  │───▶ No Storage
                       └──────────────────┘     (always fresh)
```

## API Call Frequency

### **`/api/summary`**:
- **Monday**: 1 call (first app open)
- **Tuesday**: 1 call (first app open)
- **Wednesday**: 1 call (first app open)
- **Total per week**: 7 calls maximum

### **`/api/prices`**:
- **Per refresh**: 1 call
- **Per day**: Depends on user activity
- **Typical usage**: 10-50 calls per day per user

## Benefits of This Strategy

### **For `/api/summary`**:
1. **Reduced Server Load**: Maximum 1 call per user per day
2. **Faster App Performance**: Instant data loading from SQLite
3. **Offline Capability**: Works without internet after first daily fetch
4. **Cost Effective**: Minimal API usage for relatively static data

### **For `/api/prices`**:
1. **Real-time Data**: Always fresh price information
2. **Market Accuracy**: No stale price data shown to users
3. **User Expectations**: Live prices update on every refresh
4. **Trading Relevance**: Critical for financial decision making

## Implementation Changes Made

### **Removed from `/api/summary`**:
- ❌ 5-minute minimum refresh interval
- ❌ Force refresh blocking
- ❌ Frequent API calls

### **Removed from `/api/prices`**:
- ❌ 5-minute caching
- ❌ Cache validation logic
- ❌ Cache-related methods (`clearCache`, `getCacheStatus`)

### **Added Clarity**:
- ✅ Clear logging showing which API is called when
- ✅ Proper separation of concerns
- ✅ Correct caching behavior per API endpoint

## User Experience

### **Fast App Startup**:
- Summary data loads instantly from SQLite cache
- Only live prices fetch from network

### **Accurate Live Data**:
- Price changes reflect immediately on refresh
- No confusion from stale cached prices

### **Offline Resilience**:
- App works with yesterday's summary data if offline
- Clear messaging when live prices unavailable

## Monitoring & Verification

### **Log Patterns to Confirm Correct Behavior**:

```bash
# Good - Summary API called once per day
[SUMMARY_API] Cache invalid or missing - calling /api/summary
[SUMMARY_API] Successfully fetched and cached data from /api/summary

# Good - Summary API using cache same day
[SUMMARY_API] Using cached data from today - /api/summary not called

# Good - Live prices called every refresh
[LIVE_PRICE] Fetching live price data...
[LIVE_PRICE] Successfully processed live prices for 222 symbols
```

### **What You Should NOT See**:
```bash
# Bad - Would indicate incorrect implementation
[SUMMARY_API] Refresh requested too soon, using cached data
[LIVE_PRICE] Using cached data
```

This corrected implementation now properly follows your requirements:
- **`/api/summary`**: Once per calendar day, cached in SQLite
- **`/api/prices`**: Every refresh, no caching