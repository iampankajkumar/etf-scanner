// Note: Install @react-native-community/netinfo for full network detection
// For now, we'll use a simple fetch-based approach

/**
 * Network utility functions for handling connectivity
 */

/**
 * Check if the device is currently connected to the internet
 * @returns Promise that resolves to true if connected, false otherwise
 */
export const isConnected = async (): Promise<boolean> => {
  try {
    // Simple connectivity check using a lightweight API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('[NETWORK] No internet connection detected');
    return false;
  }
};

/**
 * Get basic network information
 * @returns Promise that resolves to network state information
 */
export const getNetworkInfo = async () => {
  try {
    const connected = await isConnected();
    return {
      isConnected: connected,
      isInternetReachable: connected,
      type: 'unknown',
      details: null,
    };
  } catch (error) {
    console.error('[NETWORK] Error getting network info:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
      details: null,
    };
  }
};

/**
 * Subscribe to network state changes
 * Note: This is a placeholder. Install @react-native-community/netinfo for real-time updates
 * @param callback Function to call when network state changes
 * @returns Unsubscribe function
 */
export const subscribeToNetworkChanges = (
  callback: (isConnected: boolean) => void
) => {
  console.log('[NETWORK] Real-time network monitoring requires @react-native-community/netinfo package');
  // Return a no-op unsubscribe function
  return () => {};
};