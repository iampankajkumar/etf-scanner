/**
 * Yahoo Finance API integration for fetching price data
 */

export interface PriceData {
  closingPrices: number[];
  currentPrice: number | null;
  oneDayReturn: number | null;
  oneWeekReturn: number | null;
  oneMonthReturn: number | null;
  threeMonthReturn: number | null;
  sixMonthReturn: number | null;
  allPrices: number[];
  fiftyTwoWeekHigh: number | null;
}

/**
 * Fetches price data for a given symbol from Yahoo Finance API
 * @param symbol The stock symbol to fetch data for
 * @returns Price data including current price, returns, and 52-week high
 */
export async function fetchPriceData(symbol: string): Promise<PriceData> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const json = await response.json();
    
    // Validate the response structure
    if (!json.chart?.result?.[0]?.indicators?.quote?.[0]?.close) {
      console.error(`Invalid data structure for ${symbol}`);
      return createEmptyPriceData();
    }

    const timestamps = json.chart.result[0].timestamp || [];
    const closes = json.chart.result[0].indicators.quote[0].close || [];
    
    // Filter out null/undefined values
    const validPrices = closes.filter((price: number | null | undefined) => 
      price !== null && price !== undefined
    ) as number[];

    if (validPrices.length === 0) {
      return createEmptyPriceData();
    }

    const currentPrice = validPrices[validPrices.length - 1];
    
    // Calculate returns
    const yesterdayPrice = validPrices.length > 1 ? validPrices[validPrices.length - 2] : null;
    const oneDayReturn = calculateReturn(currentPrice, yesterdayPrice);

    const weekAgoIndex = validPrices.length > 5 ? validPrices.length - 6 : null;
    const weekAgoPrice = weekAgoIndex !== null ? validPrices[weekAgoIndex] : null;
    const oneWeekReturn = calculateReturn(currentPrice, weekAgoPrice);

    const monthAgoIndex = validPrices.length > 21 ? validPrices.length - 22 : null;
    const monthAgoPrice = monthAgoIndex !== null ? validPrices[monthAgoIndex] : null;
    const oneMonthReturn = calculateReturn(currentPrice, monthAgoPrice);

    const threeMonthAgoIndex = validPrices.length > 63 ? validPrices.length - 64 : null;
    const threeMonthAgoPrice = threeMonthAgoIndex !== null ? validPrices[threeMonthAgoIndex] : null;
    const threeMonthReturn = calculateReturn(currentPrice, threeMonthAgoPrice);

    const sixMonthAgoIndex = validPrices.length > 126 ? validPrices.length - 127 : null;
    const sixMonthAgoPrice = sixMonthAgoIndex !== null ? validPrices[sixMonthAgoIndex] : null;
    const sixMonthReturn = calculateReturn(currentPrice, sixMonthAgoPrice);

    // Get 52-week high from meta or calculate it from historical data
    let fiftyTwoWeekHigh = null;
    
    try {
      // First try to get it from meta data
      fiftyTwoWeekHigh = json.chart.result[0].meta.fiftyTwoWeekHigh || null;
      
      // If not available in meta, calculate it from historical data
      if (!fiftyTwoWeekHigh && validPrices.length > 0) {
        console.log(`[API] Calculating 52-week high for ${symbol} from historical data`);
        fiftyTwoWeekHigh = Math.max(...validPrices);
      }
      
      // Ensure it's a valid number
      if (fiftyTwoWeekHigh !== null && (isNaN(fiftyTwoWeekHigh) || fiftyTwoWeekHigh <= 0)) {
        console.log(`[API] Invalid 52-week high for ${symbol}: ${fiftyTwoWeekHigh}, setting to null`);
        fiftyTwoWeekHigh = null;
      }
      
      // If we still don't have a valid 52-week high but have a current price,
      // use the current price as a fallback (this ensures discount calculation can proceed)
      if (fiftyTwoWeekHigh === null && currentPrice !== null && currentPrice > 0) {
        console.log(`[API] Using current price as fallback for 52-week high for ${symbol}`);
        fiftyTwoWeekHigh = currentPrice;
      }
    } catch (error) {
      console.error(`[API] Error calculating 52-week high for ${symbol}:`, error);
      fiftyTwoWeekHigh = null;
    }
    
    console.log(`[API] 52-week high for ${symbol}: ${fiftyTwoWeekHigh}, current price: ${currentPrice}`);

    return {
      closingPrices: validPrices.slice(-30),
      currentPrice,
      oneDayReturn,
      oneWeekReturn,
      oneMonthReturn,
      threeMonthReturn,
      sixMonthReturn,
      allPrices: validPrices,
      fiftyTwoWeekHigh,
    };
  } catch (error) {
    console.error('Error fetching data for', symbol, error);
    return createEmptyPriceData();
  }
}

/**
 * Calculates the percentage return between two prices
 * @param currentPrice The current price
 * @param previousPrice The previous price
 * @returns The percentage return or null if either price is null
 */
function calculateReturn(currentPrice: number | null, previousPrice: number | null): number | null {
  if (currentPrice === null || previousPrice === null || previousPrice === 0) {
    return null;
  }
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

/**
 * Creates an empty price data object for error cases
 * @returns An empty price data object
 */
function createEmptyPriceData(): PriceData {
  return {
    closingPrices: [],
    currentPrice: null,
    oneDayReturn: null,
    oneWeekReturn: null,
    oneMonthReturn: null,
    threeMonthReturn: null,
    sixMonthReturn: null,
    allPrices: [],
    fiftyTwoWeekHigh: null,
  };
}