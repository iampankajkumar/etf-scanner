export function formatSymbol(symbol) {
  let formattedSymbol = symbol.trim().toUpperCase();
  if (!formattedSymbol.includes('.') && !formattedSymbol.includes('-')) {
    const isCrypto = formattedSymbol.endsWith('USD') || formattedSymbol.includes('BTC') || formattedSymbol.includes('ETH');
    if (!isCrypto) {
      formattedSymbol += '.NS';
    }
  }
  return formattedSymbol;
}

export function sortData(dataToSort, key, direction) {
  return [...dataToSort].sort((a, b) => {
    let aVal, bVal;
    
    switch (key) {
      case 'symbol':
        aVal = a.ticker;
        bVal = b.ticker;
        break;
      case 'price':
        aVal = a.rawCurrentPrice;
        bVal = b.rawCurrentPrice;
        break;
      case 'rsi':
        aVal = a.rawRsi;
        bVal = b.rawRsi;
        break;
      case '1d':
        aVal = a.rawOneDayReturn;
        bVal = b.rawOneDayReturn;
        break;
      case '1w':
        aVal = a.rawOneWeekReturn;
        bVal = b.rawOneWeekReturn;
        break;
      case '1m':
        aVal = a.rawOneMonthReturn;
        bVal = b.rawOneMonthReturn;
        break;
      default:
        return 0;
    }

    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;

    if (direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
}