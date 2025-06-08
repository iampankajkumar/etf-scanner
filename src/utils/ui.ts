export function getColor(rsi: number | 'N/A'): string {
  if (rsi === 'N/A') return '#888';
  const value = typeof rsi === 'string' ? parseFloat(rsi) : rsi;
  if (value < 30) return '#FF5252';
  if (value > 70) return '#4CAF50';
  return '#FFFFFF';
}

export function getReturnColor(returnValue: string): string {
  if (returnValue === 'N/A') return '#888';
  return returnValue.startsWith('+') ? '#4CAF50' : returnValue === '0.00%' ? '#888' : '#FF5252';
}