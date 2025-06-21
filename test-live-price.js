// Simple test to verify live price API works
const testLivePriceAPI = async () => {
  try {
    const response = await fetch('https://etf-screener-backend-production.up.railway.app/api/prices');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Live price API response:', data);
    console.log('Number of items:', data.length);
    
    if (data.length > 0) {
      console.log('Sample item:', data[0]);
    }
  } catch (error) {
    console.error('Error testing live price API:', error);
  }
};

testLivePriceAPI();