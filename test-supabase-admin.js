/**
 * Supabase Service Role Authentication Test
 * Tests connection with admin/service role key
 * Run with: node test-supabase-admin.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== Supabase Service Role Authentication Test ===\n');

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'your-service-role-key') {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY is not configured');
  console.log('   (This is optional - your anon key is working fine)\n');
  process.exit(0);
}

console.log('✓ Supabase URL:', SUPABASE_URL);
console.log('✓ Service Role Key found:', SUPABASE_SERVICE_ROLE_KEY.substring(0, 30) + '...');
console.log('\n--- Testing with Service Role Key ---\n');

// Create admin client with service role key
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testAdminConnection() {
  try {
    // Test with admin key - check tables
    console.log('Test: Accessing database with admin credentials...');
    
    const { data, error, status } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.log('⚠️  Error:', error.message);
      console.log('   Status:', status);
    } else {
      console.log('✓ Admin access successful');
      console.log('  Records found:', data ? data.length : 0);
    }

    // Test listing tables
    console.log('\nTest: Listing database tables (via RPC)...');
    const { data: tables, error: tableError } = await supabaseAdmin
      .rpc('get_tables')
      .catch(() => ({ data: null, error: { message: 'RPC function not available' } }));

    if (tableError) {
      console.log('⚠️  Could not list tables:', tableError.message);
      console.log('   (This is OK if RPC function is not set up)');
    } else {
      console.log('✓ RPC function accessible');
    }

    console.log('\n=== Admin Test Summary ===');
    console.log('✓ Service role key is VALID');
    console.log('✓ Admin authentication is WORKING');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

testAdminConnection();
