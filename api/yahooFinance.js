export async function fetchPriceData(symbol) {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1y&interval=1d`
    );
    const json = await response.json();
    
    if (!json.chart?.result?.[0]?.indicators?.quote?.[0]?.close) {
      console.error(`Invalid data structure for ${symbol}`);
      return {
        closingPrices: [],
        currentPrice: null,
        oneDayReturn: null,
        oneWeekReturn: null
      };
    }

    const timestamps = json.chart.result[0].timestamp || [];
    const closes = json.chart.result[0].indicators.quote[0].close || [];
    
    const validPrices = [];
    for (let i = 0; i < closes.length; i++) {
      if (closes[i] !== null && closes[i] !== undefined) {
        validPrices.push(closes[i]);
      }
    }

    if (validPrices.length === 0) {
      return {
        closingPrices: [],
        currentPrice: null,
        oneDayReturn: null,
        oneWeekReturn: null
      };
    }

    const currentPrice = validPrices[validPrices.length - 1];
    const yesterdayPrice = validPrices.length > 1 ? validPrices[validPrices.length - 2] : null;
    const oneDayReturn = yesterdayPrice ? ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100 : null;

    const weekAgoIndex = validPrices.length > 5 ? validPrices.length - 6 : null;
    const weekAgoPrice = weekAgoIndex !== null ? validPrices[weekAgoIndex] : null;
    const oneWeekReturn = weekAgoPrice ? ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100 : null;

    const monthAgoIndex = validPrices.length > 21 ? validPrices.length - 22 : null;
    const monthAgoPrice = monthAgoIndex !== null ? validPrices[monthAgoIndex] : null;
    const oneMonthReturn = monthAgoPrice ? ((currentPrice - monthAgoPrice) / monthAgoPrice) * 100 : null;

    const threeMonthAgoIndex = validPrices.length > 63 ? validPrices.length - 64 : null;
    const threeMonthAgoPrice = threeMonthAgoIndex !== null ? validPrices[threeMonthAgoIndex] : null;
    const threeMonthReturn = threeMonthAgoPrice ? ((currentPrice - threeMonthAgoPrice) / threeMonthAgoPrice) * 100 : null;

    const sixMonthAgoIndex = validPrices.length > 126 ? validPrices.length - 127 : null;
    const sixMonthAgoPrice = sixMonthAgoIndex !== null ? validPrices[sixMonthAgoIndex] : null;
    const sixMonthReturn = sixMonthAgoPrice ? ((currentPrice - sixMonthAgoPrice) / sixMonthAgoPrice) * 100 : null;

    return {
      closingPrices: validPrices.slice(-30),
      currentPrice,
      oneDayReturn,
      oneWeekReturn,
      oneMonthReturn,
      threeMonthReturn,
      sixMonthReturn,
      allPrices: validPrices
    };
  } catch (e) {
    console.error('Error fetching', symbol, e);
    return {
      closingPrices: [],
      currentPrice: null,
      oneDayReturn: null,
      oneWeekReturn: null
    };
  }
}