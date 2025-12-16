/**
 * Test upscale endpoint with proper API call
 * Simulates what the API handler should do
 */

require('dotenv').config({ path: '.env.local' });

const UPSCALE_API_KEY = process.env.UPSCALE_API_KEY;
const UPSCALE_API_URL = process.env.UPSCALE_API_URL;

console.log('=== Testing Actual Upscale API Call ===\n');
console.log('Using endpoint:', UPSCALE_API_URL);
console.log('API Key:', UPSCALE_API_KEY.substring(0, 20) + '...\n');

// Test with a small base64 image
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function testUpscaleAPI() {
  try {
    const response = await fetch(UPSCALE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSCALE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: testImageBase64,
        scale: 2,
        format: 'png'
      }),
    });

    console.log('Response Status:', response.status, response.statusText);
    const responseData = await response.text();
    
    try {
      const jsonData = JSON.parse(responseData);
      console.log('Response (JSON):', JSON.stringify(jsonData, null, 2));
    } catch {
      console.log('Response (Text):', responseData);
    }

    if (response.status === 401) {
      console.log('\n❌ AUTHENTICATION FAILED');
      console.log('The API key or format is invalid');
    } else if (response.status === 400) {
      console.log('\n⚠️  Bad Request - API key is valid but request format may be wrong');
    } else if (response.status === 200) {
      console.log('\n✓ SUCCESS - API call worked!');
    }
  } catch (error) {
    console.error('❌ Request error:', error.message);
  }
}

testUpscaleAPI();
