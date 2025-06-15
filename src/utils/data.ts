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
    
    switch (key) {
      case 'ticker':
        aVal = a.ticker;
        bVal = b.ticker;
        break;
      case 'discount':
        // Parse discount percentage strings to numbers for proper sorting
        // but don't modify the original values
        if (a.discount && a.discount !== 'N/A' && b.discount && b.discount !== 'N/A') {
          aVal = parseFloat(a.discount.replace('%', ''));
          bVal = parseFloat(b.discount.replace('%', ''));
        } else {
          aVal = a.discount;
          bVal = b.discount;
        }
        break;
      case 'currentPrice':
        aVal = a.rawCurrentPrice;
        bVal = b.rawCurrentPrice;
        break;
      case 'rsi':
        aVal = a.rawRsi;
        bVal = b.rawRsi;
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
      case 'rawThreeMonthReturn':
        aVal = a.rawThreeMonthReturn;
        bVal = b.rawThreeMonthReturn;
        break;
      case 'rawSixMonthReturn':
        aVal = a.rawSixMonthReturn;
        bVal = b.rawSixMonthReturn;
        break;
      default:
        return 0;
    }

    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

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
