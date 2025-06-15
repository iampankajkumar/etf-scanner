import { AssetItem } from '../types';

export function formatSymbol(symbol: string): string {
  let formattedSymbol = symbol.trim().toUpperCase();
  if (!formattedSymbol.includes('.') && !formattedSymbol.includes('-')) {
    const isCrypto = formattedSymbol.endsWith('USD') || formattedSymbol.includes('BTC') || formattedSymbol.includes('ETH');
    if (!isCrypto) {
      formattedSymbol += '.NS';
    }
  }
  return formattedSymbol;
}

export function formatReturn(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function sortData(dataToSort: AssetItem[], key: keyof AssetItem | null, direction: 'asc' | 'desc'): AssetItem[] {
  if (!key) return dataToSort;

  return [...dataToSort].sort((a, b) => {
    let aVal, bVal;
    
    // Helper function to parse percentage strings to numbers
    const parsePercentage = (value: string | undefined) => {
      if (!value || value === 'N/A') return null;
      return parseFloat(value.replace('%', ''));
    };

    // Helper function to parse numeric strings
    const parseNumeric = (value: string | undefined) => {
      if (!value || value === 'N/A') return null;
      return parseFloat(value);
    };
    
    switch (key) {
      case 'ticker':
        aVal = a.ticker;
        bVal = b.ticker;
        break;
      case 'discount':
        aVal = parsePercentage(a.discount);
        bVal = parsePercentage(b.discount);
        break;
      case 'currentPrice':
        aVal = a.rawCurrentPrice;
        bVal = b.rawCurrentPrice;
        break;
      case 'rsi':
        aVal = a.rawRsi;
        bVal = b.rawRsi;
        break;
      case 'weeklyRSI':
        aVal = parseNumeric(a.weeklyRSI);
        bVal = parseNumeric(b.weeklyRSI);
        break;
      case 'monthlyRSI':
        aVal = parseNumeric(a.monthlyRSI);
        bVal = parseNumeric(b.monthlyRSI);
        break;
      case 'lastDayVolume':
        aVal = parseNumeric(a.lastDayVolume);
        bVal = parseNumeric(b.lastDayVolume);
        break;
      case 'oneDayReturn':
        aVal = a.rawOneDayReturn;
        bVal = b.rawOneDayReturn;
        break;
      case 'oneWeekReturn':
        aVal = a.rawOneWeekReturn;
        bVal = b.rawOneWeekReturn;
        break;
      case 'oneMonthReturn':
        aVal = a.rawOneMonthReturn;
        bVal = b.rawOneMonthReturn;
        break;
      case 'oneYearReturns':
        aVal = parsePercentage(a.oneYearReturns);
        bVal = parsePercentage(b.oneYearReturns);
        break;
      case 'twoYearReturns':
        aVal = parsePercentage(a.twoYearReturns);
        bVal = parsePercentage(b.twoYearReturns);
        break;
      case 'twoYearNiftyReturns':
        aVal = parsePercentage(a.twoYearNiftyReturns);
        bVal = parsePercentage(b.twoYearNiftyReturns);
        break;
      case 'priceToEarning':
        aVal = parseNumeric(a.priceToEarning);
        bVal = parseNumeric(b.priceToEarning);
        break;
      case 'niftyPriceToEarning':
        aVal = parseNumeric(a.niftyPriceToEarning);
        bVal = parseNumeric(b.niftyPriceToEarning);
        break;
      case 'rawThreeMonthReturn':
        aVal = a.rawThreeMonthReturn;
        bVal = b.rawThreeMonthReturn;
        break;
      case 'rawSixMonthReturn':
        aVal = a.rawSixMonthReturn;
        bVal = b.rawSixMonthReturn;
        break;
      // Additional fields for completeness
      case 'recordDate':
        aVal = a.recordDate;
        bVal = b.recordDate;
        break;
      case 'lastClosePrice':
        aVal = parseNumeric(a.lastClosePrice);
        bVal = parseNumeric(b.lastClosePrice);
        break;
      case 'downFrom2YearHigh':
        aVal = parsePercentage(a.downFrom2YearHigh);
        bVal = parsePercentage(b.downFrom2YearHigh);
        break;
      case 'dailyRSI':
        aVal = parseNumeric(a.dailyRSI);
        bVal = parseNumeric(b.dailyRSI);
        break;
      case 'oneWeekReturns':
        aVal = parsePercentage(a.oneWeekReturns);
        bVal = parsePercentage(b.oneWeekReturns);
        break;
      case 'oneMonthReturns':
        aVal = parsePercentage(a.oneMonthReturns);
        bVal = parsePercentage(b.oneMonthReturns);
        break;
      default:
        return 0;
    }

    // Handle null values
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    // Handle string comparison
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    // Handle numeric comparison
    if (direction === 'asc') {
      return (aVal as number) < (bVal as number) ? -1 : (aVal as number) > (bVal as number) ? 1 : 0;
    } else {
      return (aVal as number) > (bVal as number) ? -1 : (aVal as number) < (bVal as number) ? 1 : 0;
    }
  });
}

export function createEmptyAssetItem(symbol: string): AssetItem {
  return {
    ticker: symbol,
    rsi: 'N/A',
    currentPrice: 'N/A',
    oneDayReturn: 'N/A',
    oneWeekReturn: 'N/A',
    oneMonthReturn: 'N/A',
    discount: 'N/A',
    fiftyTwoWeekHigh: null,
    rawRsi: null,
    rawCurrentPrice: null,
    rawOneDayReturn: null,
    rawOneWeekReturn: null,
    rawOneMonthReturn: null,
    rawThreeMonthReturn: null,
    rawSixMonthReturn: null,
    allPrices: [],
  };
}
