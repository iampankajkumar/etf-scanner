export function getColor(rsi) {
  if (rsi === 'N/A') return '#888';
  const value = parseFloat(rsi);
  if (value < 30) return '#FF5252';
  if (value > 70) return '#4CAF50';
  return '#FFFFFF';
}

export function getReturnColor(returnValue) {
  if (returnValue === 'N/A') return '#888';
  return returnValue.startsWith('+') ? '#4CAF50' : returnValue === '0.00%' ? '#888' : '#FF5252';
}