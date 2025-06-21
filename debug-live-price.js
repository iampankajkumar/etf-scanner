/**
 * Debug script for Live Price Service
 * This script helps diagnose issues with the live price API
 */

const API_URL = 'https://etf-screener-backend-production.up.railway.app/api/prices';

async function debugLivePriceService() {
  console.log('🔍 Starting Live Price Service Debug...');
  console.log('📡 API URL:', API_URL);
  console.log('');

  // Test 1: Basic connectivity
  console.log('🧪 Test 1: Basic Connectivity');
  try {
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: 'HEAD',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    const endTime = Date.now();
    
    console.log(`✅ Connection successful`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    console.log(`🔗 Headers:`, Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.log(`❌ Connection failed:`, error.message);
    return;
  }
  console.log('');

  // Test 2: Full API request
  console.log('🧪 Test 2: Full API Request');
  try {
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    const endTime = Date.now();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ API Error: ${response.status} - ${errorText}`);
      return;
    }
    
    const responseText = await response.text();
    console.log(`📦 Response size: ${responseText.length} characters`);
    
    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log(`✅ JSON parsing successful`);
      console.log(`📊 Data type: ${Array.isArray(data) ? 'Array' : typeof data}`);
      
      if (Array.isArray(data)) {
        console.log(`📈 Number of items: ${data.length}`);
        
        if (data.length > 0) {
          console.log(`🔍 Sample item:`, JSON.stringify(data[0], null, 2));
          
          // Validate structure
          const sampleItem = data[0];
          const requiredFields = ['key', 'currentPrice', 'changePercent'];
          const missingFields = requiredFields.filter(field => !(field in sampleItem));
          
          if (missingFields.length === 0) {
            console.log(`✅ All required fields present`);
          } else {
            console.log(`⚠️  Missing fields: ${missingFields.join(', ')}`);
          }
        }
      } else {
        console.log(`⚠️  Expected array but got: ${typeof data}`);
      }
    } catch (parseError) {
      console.log(`❌ JSON parsing failed:`, parseError.message);
      console.log(`📄 Response preview:`, responseText.substring(0, 200));
    }
  } catch (error) {
    console.log(`❌ Request failed:`, error.message);
  }
  console.log('');

  // Test 3: Timeout behavior
  console.log('🧪 Test 3: Timeout Behavior');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    const endTime = Date.now();
    
    clearTimeout(timeoutId);
    console.log(`✅ Request completed within timeout`);
    console.log(`⏱️  Response time: ${endTime - startTime}ms`);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`⏰ Request timed out after 5 seconds`);
    } else {
      console.log(`❌ Request failed:`, error.message);
    }
  }
  
  console.log('');
  console.log('🏁 Debug complete!');
}

// Run the debug
debugLivePriceService().catch(error => {
  console.error('💥 Debug script failed:', error);
});