/**
 * Upscale API Endpoint Diagnostic
 * Tests various endpoint formats to find the correct one
 * Run with: node test-upscale-endpoints.js
 */

require('dotenv').config({ path: '.env.local' });

const UPSCALE_API_KEY = process.env.UPSCALE_API_KEY;
const BASE_URL = 'https://api.upscale.media';

console.log('=== Testing Upscale API Endpoints ===\n');
console.log('API Key:', UPSCALE_API_KEY.substring(0, 20) + '...\n');

const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const endpoints = [
  '/v1/upscale',
  '/v1/upscaling',
  '/api/v1/upscale',
  '/api/upscale',
  '/upscale',
  '/v2/upscale',
];

const requestBody = {
  image: testImage,
  scale: 2,
  format: 'png'
};

async function testEndpoint(path) {
  const url = BASE_URL + path;
  console.log(`Testing: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSCALE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const statusColor = response.status === 404 ? '❌' : 
                       response.status === 401 ? '🔐' :
                       response.status === 400 ? '⚠️' : 
                       response.status === 200 ? '✅' : '❓';
    
    console.log(`  Status: ${statusColor} ${response.status} ${response.statusText}`);
    
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      console.log(`  Error: ${json.message || json.error || 'Unknown error'}`);
    } catch {
      console.log(`  Response: ${text.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log(`  Error: ${error.message}`);
  }
  console.log();
}

async function runTests() {
  console.log('Testing different endpoint paths...\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }

  // Also test with different auth headers
  console.log('\n--- Testing Different Auth Headers ---\n');
  
  const authHeaders = [
    { name: 'Bearer Token', header: `Bearer ${UPSCALE_API_KEY}` },
    { name: 'X-API-Key', header: UPSCALE_API_KEY },
    { name: 'API-Key', header: UPSCALE_API_KEY },
  ];

  for (const { name, header } of authHeaders) {
    console.log(`Testing Auth: ${name}`);
    try {
      const response = await fetch(BASE_URL + '/v1/upscale', {
        method: 'POST',
        headers: {
          'Authorization': header,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log(`  Status: ${response.status}`);
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
    console.log();
  }

  console.log('\n=== Recommendations ===\n');
  console.log('If you got 404 on all endpoints:');
  console.log('1. Check API documentation at upscale.media');
  console.log('2. Verify API key is valid and not expired');
  console.log('3. Check if API key is for a different service');
  console.log('4. Contact upscale.media support\n');
  
  console.log('If 401 (Unauthorized):');
  console.log('1. API key format is wrong');
  console.log('2. API key has expired');
  console.log('3. Authentication header format is incorrect\n');

  console.log('If 400 (Bad Request):');
  console.log('1. Endpoint found but request body format is wrong');
  console.log('2. Missing required parameters');
  console.log('3. Check API request format\n');
}

runTests();
