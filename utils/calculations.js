export function calculateRSI(closes, period = 14) {
  if (closes.length < period + 1) return [];

  const changes = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  if (changes.length < period) return [];

  let sumGain = 0;
  let sumLoss = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      sumGain += changes[i];
    } else {
      sumLoss += Math.abs(changes[i]);
    }
  }

  let avgGain = sumGain / period;
  let avgLoss = sumLoss / period;

  const rsis = [];
  let rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss);
  rsis.push(100 - (100 / (1 + rs)));

  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const currentGain = change > 0 ? change : 0;
    const currentLoss = change < 0 ? Math.abs(change) : 0;

    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;

    rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss);
    rsis.push(100 - (100 / (1 + rs)));
  }

  return rsis;
}

export function calculateVolatility(prices) {
  if (prices.length < 2) return 'N/A';
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100;

  return volatility.toFixed(2) + '%';
}