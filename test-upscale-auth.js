/**
 * Test script to verify Upscale API authentication
 * Run with: node test-upscale-auth.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const UPSCALE_API_KEY = process.env.UPSCALE_API_KEY;
const UPSCALE_API_URL = process.env.UPSCALE_API_URL;

console.log('=== Upscale API Authentication Test ===\n');

// Check if API key is configured
if (!UPSCALE_API_KEY) {
  console.error('❌ ERROR: UPSCALE_API_KEY is not set in .env.local');
  process.exit(1);
}

if (!UPSCALE_API_URL) {
  console.error('❌ ERROR: UPSCALE_API_URL is not set in .env.local');
  process.exit(1);
}

console.log('✓ API Key found:', UPSCALE_API_KEY.substring(0, 20) + '...');
console.log('✓ API URL:', UPSCALE_API_URL);
console.log('\n--- Testing Authentication ---\n');

// Test 1: Simple authentication ping
testAuthentication();

async function testAuthentication() {
  try {
    // Try a simple status/info endpoint
    const authHeaders = {
      'Authorization': `Bearer ${UPSCALE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    console.log('Testing with Bearer token format...');
    console.log('Headers:', JSON.stringify(authHeaders, null, 2));

    const response = await fetch(`${UPSCALE_API_URL}`, {
      method: 'GET',
      headers: authHeaders,
    });

    console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
    const responseText = await response.text();
    console.log('Response Body:', responseText);

    if (response.status === 401) {
      console.log('\n❌ Authentication FAILED - 401 Unauthorized');
      console.log('\nPossible issues:');
      console.log('1. Invalid API key format');
      console.log('2. API key has expired');
      console.log('3. Wrong authentication header format');
      console.log('4. API endpoint expects different auth method');
      
      console.log('\n--- Testing Alternative Auth Format (Token in header) ---\n');
      testAlternativeAuth();
    } else if (response.status === 200 || response.status === 400) {
      console.log('\n✓ Authentication SUCCESSFUL');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function testAlternativeAuth() {
  try {
    // Try with X-API-Key header instead
    const altHeaders = {
      'X-API-Key': UPSCALE_API_KEY,
      'Content-Type': 'application/json',
    };

    console.log('Headers:', JSON.stringify(altHeaders, null, 2));

    const response = await fetch(`${UPSCALE_API_URL}`, {
      method: 'GET',
      headers: altHeaders,
    });

    console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
    const responseText = await response.text();
    console.log('Response Body:', responseText);

    if (response.status === 401) {
      console.log('\n❌ Alternative auth also failed');
    } else {
      console.log('\n✓ Alternative auth format (X-API-Key) works!');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}
