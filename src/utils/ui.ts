export function getColor(rsi: number | 'N/A'): string {
  if (rsi === 'N/A') return '#888';
  const value = typeof rsi === 'string' ? parseFloat(rsi) : rsi;
  if (value < 30) return '#FF5252';
  if (value > 70) return '#4CAF50';
  return '#FFFFFF';
}

export function getReturnColor(returnValue: string | number | null | undefined): string {
  if (returnValue === null || returnValue === undefined || returnValue === 'N/A') return '#888';
  const value = typeof returnValue === 'string' ? parseFloat(returnValue.replace('%', '')) : returnValue;
  if (value > 0) return '#4CAF50';
  if (value < 0) return '#FF5252';
  return '#888';
}

export function getDiscountColor(discount: string | undefined): string {
  // Handle undefined, null, or empty string
  if (!discount) return '#888';
  
  if (discount === 'N/A' || discount === '0.00%') return '#888';
  
  try {
    // Extract the numeric value from the discount string
    const value = parseFloat(discount.replace('%', ''));
    
    // If the value is very close to 0 or NaN, return gray
    if (isNaN(value) || Math.abs(value) < 0.01) return '#888';
    
    // Otherwise return green (indicating a discount)
    return '#4CAF50';
  } catch (error) {
    console.error('[UI] Error in getDiscountColor:', error);
    return '#888'; // Default to gray on error
  }
}