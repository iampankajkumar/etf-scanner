# Live Price Columns Sorting Implementation

## Overview

Added sorting functionality for the two new live price columns:
- **Live Price** - Current real-time price from the API
- **Change%** - Percentage change from previous close

## Implementation Details

### 1. **Sorting Logic Added**

**File**: `src/utils/data.ts`

Added cases for the new columns in the `sortData` function:

```typescript
case 'livePrice':
  aVal = a.rawLivePrice;
  bVal = b.rawLivePrice;
  break;
case 'changePercent':
  aVal = a.rawChangePercent;
  bVal = b.rawChangePercent;
  break;
```

### 2. **Data Merging and Sorting Strategy**

**File**: `src/App.tsx`

**Challenge**: The live price data is fetched separately and merged with the main RSI data. The Redux store sorts the original data, but we need to sort the merged data for live price columns.

**Solution**: Enhanced the data merging logic to handle sorting of live price columns:

```typescript
const dataWithLivePrices = React.useMemo(() => {
  // First, merge live price data with main data
  const mergedData = data.map(item => {
    const livePrice = getLivePriceForSymbol(item.ticker);
    return {
      ...item,
      livePrice: livePrice?.livePrice || 'N/A',
      changePercent: livePrice?.changePercent || 'N/A',
      rawLivePrice: livePrice?.rawLivePrice || null,
      rawChangePercent: livePrice?.rawChangePercent || null,
    };
  });

  // Apply sorting to merged data if sorting by live price columns
  if (sortConfig.key === 'livePrice' || sortConfig.key === 'changePercent') {
    return sortData(mergedData, sortConfig.key, sortConfig.direction);
  }

  return mergedData;
}, [data, getLivePriceForSymbol, sortConfig]);
```

### 3. **Table Header Integration**

**File**: `src/components/TableHeader.tsx`

The table header already includes sorting buttons for both columns:

```typescript
<TouchableOpacity onPress={() => onSort('livePrice')}>
  <Text>Live Price {getSortIndicator('livePrice')}</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => onSort('changePercent')}>
  <Text>Change% {getSortIndicator('changePercent')}</Text>
</TouchableOpacity>
```

### 4. **Data Structure**

**File**: `src/types/index.ts`

The AssetItem interface already includes the necessary fields:

```typescript
interface AssetItem {
  // ... other fields
  
  // Live price data (not cached, fetched separately)
  livePrice?: string;           // Formatted display value
  changePercent?: string;       // Formatted display value
  rawLivePrice?: number | null; // Raw numeric value for sorting
  rawChangePercent?: number | null; // Raw numeric value for sorting
}
```

## Sorting Behavior

### **Live Price Column**
- **Ascending**: Lowest price first (null values last)
- **Descending**: Highest price first (null values last)
- **Data Source**: `rawLivePrice` field (numeric)
- **Display**: `livePrice` field (formatted string)

### **Change% Column**
- **Ascending**: Most negative change first (null values last)
- **Descending**: Most positive change first (null values last)
- **Data Source**: `rawChangePercent` field (numeric)
- **Display**: `changePercent` field (formatted string with %)

### **Null Value Handling**
- Items without live price data (null values) are sorted to the end
- This ensures items with actual data are prioritized in sorting

## Technical Implementation

### **Two-Phase Sorting Strategy**

1. **Phase 1 - Redux Store Sorting**: 
   - Handles all non-live-price columns
   - Sorts the original RSI data
   - Maintains existing sorting performance

2. **Phase 2 - Component-Level Sorting**:
   - Handles live price columns only
   - Sorts the merged data (RSI + Live Price)
   - Triggered when `sortConfig.key` is 'livePrice' or 'changePercent'

### **Performance Considerations**

- **Efficient Re-sorting**: Only re-sorts when sort config changes
- **Memoization**: Uses React.useMemo to prevent unnecessary recalculations
- **Selective Sorting**: Only applies component-level sorting for live price columns

## Usage

### **User Interaction**
1. Tap on "Live Price" or "Change%" column headers
2. First tap: Sort ascending (↑)
3. Second tap: Sort descending (↓)
4. Visual indicator shows current sort direction

### **Data Flow**
```
RSI Data (Redux) → Live Price Data (Hook) → Merged Data → Sorted Data → UI
```

## Testing

### **Test Scenarios**

1. **Sort by Live Price Ascending**
   - Verify lowest prices appear first
   - Verify null values appear last

2. **Sort by Live Price Descending**
   - Verify highest prices appear first
   - Verify null values appear last

3. **Sort by Change% Ascending**
   - Verify most negative changes appear first
   - Verify null values appear last

4. **Sort by Change% Descending**
   - Verify most positive changes appear first
   - Verify null values appear last

5. **Mixed Data Scenarios**
   - Test with some items having live data, others not
   - Verify proper handling of 'N/A' display values

### **Edge Cases Handled**

- **No Live Price Data**: Items show 'N/A' and sort to end
- **API Errors**: Graceful degradation with null values
- **Network Issues**: Existing data preserved, new data sorted when available
- **Cache Scenarios**: Sorting works with both cached and fresh live price data

## Column Widths

**File**: `src/constants/ui.ts`

```typescript
export const COLUMN_WIDTHS = {
  LIVE_PRICE_CELL: 85,     // Width for live price column
  CHANGE_PERCENT_CELL: 80, // Width for change% column
};
```

## Benefits

1. **✅ Complete Sorting**: All columns now sortable including live price data
2. **✅ Performance**: Efficient two-phase sorting strategy
3. **✅ User Experience**: Consistent sorting behavior across all columns
4. **✅ Data Integrity**: Proper handling of null/missing values
5. **✅ Visual Feedback**: Clear sort direction indicators

## Future Enhancements

1. **Multi-Column Sorting**: Sort by multiple criteria simultaneously
2. **Custom Sort Orders**: User-defined sorting preferences
3. **Sort Persistence**: Remember user's preferred sort settings
4. **Advanced Filtering**: Combine sorting with filtering capabilities

The live price columns now have full sorting functionality that integrates seamlessly with the existing table sorting system while handling the unique challenges of real-time data merging.