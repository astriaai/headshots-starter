/**
 * Test fal.ai Upscale API
 * Run with: node test-fal-upscale.js
 */

require('dotenv').config({ path: '.env.local' });

const FAL_KEY = process.env.FAL_KEY;

console.log('=== fal.ai Upscale API Test ===\n');

if (!FAL_KEY || FAL_KEY === 'your-fal-ai-api-key') {
  console.error('❌ FAL_KEY not configured');
  console.error('   Set FAL_KEY in .env.local');
  console.error('   Get it from: https://fal.ai\n');
  process.exit(1);
}

console.log('✓ FAL_KEY found:', FAL_KEY.substring(0, 20) + '...\n');

// Import fal.ai client
const { fal } = require('@fal-ai/client');

// Configure client
fal.config({
  credentials: FAL_KEY,
});

console.log('Testing fal.ai Upscale API...\n');

async function testUpscaleAPI() {
  try {
    // Test image (small 1x1 PNG)
    const testImageUrl = 'https://storage.googleapis.com/falserverless/model_tests/recraft/recraft-upscaler-1.jpeg';
    
    console.log('Submitting upscale request...');
    console.log('Image URL:', testImageUrl);
    console.log('Model: fal-ai/recraft/upscale/crisp\n');

    const result = await fal.subscribe('fal-ai/recraft/upscale/crisp', {
      input: {
        image_url: testImageUrl,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Status: IN_PROGRESS');
          if (update.logs && update.logs.length > 0) {
            update.logs.forEach(log => {
              console.log('  -', log.message);
            });
          }
        }
      },
    });

    console.log('\n✅ Upscale successful!\n');
    console.log('Result:');
    console.log('  Request ID:', result.requestId);
    console.log('  Image URL:', result.data?.image?.url);
    console.log('  File Name:', result.data?.image?.file_name);
    console.log('  File Size:', result.data?.image?.file_size, 'bytes');
    console.log('  Content Type:', result.data?.image?.content_type);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('   API key is invalid or expired');
    } else if (error.message.includes('404')) {
      console.error('   Model endpoint not found');
    } else if (error.message.includes('timeout')) {
      console.error('   Request timed out');
    }
    
    process.exit(1);
  }
}

testUpscaleAPI();
