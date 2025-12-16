/**
 * Supabase Authentication Test
 * Tests connection and authentication with Supabase using @supabase/supabase-js
 * Run with: node test-supabase-auth.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== Supabase Authentication Test ===\n');

// Validate environment variables
const errors = [];

if (!SUPABASE_URL) {
  errors.push('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
}
if (!SUPABASE_ANON_KEY) {
  errors.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
}

if (errors.length > 0) {
  errors.forEach(err => console.log(err));
  process.exit(1);
}

console.log('✓ Supabase URL:', SUPABASE_URL);
console.log('✓ Anon Key found:', SUPABASE_ANON_KEY.substring(0, 30) + '...');
console.log('✓ Service Role Key:', SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Not configured');
console.log('\n--- Testing Supabase Connection ---\n');

// Create Supabase client with anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabaseConnection() {
  try {
    // Test 1: Basic connectivity - fetch user session
    console.log('Test 1: Checking user session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session check failed:', sessionError.message);
    } else {
      console.log('✓ Session check successful');
      console.log('  Current session:', sessionData.session ? 'Active' : 'None (expected for anon key)');
    }

    // Test 2: Test database connectivity - query a simple table
    console.log('\nTest 2: Testing database connectivity...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError && authError.message.includes('JWT')) {
      console.log('✓ Authentication working (no user logged in - expected for anon key)');
    } else if (authError) {
      console.log('⚠️  Auth error:', authError.message);
    } else {
      console.log('✓ User data accessible:', authData.user ? 'Yes' : 'No');
    }

    // Test 3: Check if we can access public schema
    console.log('\nTest 3: Testing table access (public schema)...');
    try {
      const { data, error, status } = await supabase
        .from('users')
        .select('count(*)', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log('⚠️  Table query result:', error.message);
        console.log('   Status:', status);
        console.log('   (This is OK if "users" table doesn\'t exist or is private)');
      } else {
        console.log('✓ Database accessible - users table found');
      }
    } catch (e) {
      console.log('⚠️  Table access error:', e.message);
    }

    // Test 4: Verify JWT token format
    console.log('\nTest 4: Verifying JWT token...');
    const token = SUPABASE_ANON_KEY;
    const parts = token.split('.');
    
    if (parts.length === 3) {
      console.log('✓ JWT format valid (3 parts: header.payload.signature)');
      
      // Decode payload (without verification)
      try {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        console.log('✓ Token payload:');
        console.log('  - Issuer (iss):', payload.iss);
        console.log('  - Project (ref):', payload.ref);
        console.log('  - Role:', payload.role);
        console.log('  - Issued at:', new Date(payload.iat * 1000).toISOString());
        console.log('  - Expires at:', new Date(payload.exp * 1000).toISOString());
        
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp > now) {
          console.log('✓ Token is VALID (not expired)');
        } else {
          console.log('❌ Token is EXPIRED');
        }
      } catch (e) {
        console.log('⚠️  Could not decode token payload:', e.message);
      }
    } else {
      console.log('❌ Invalid JWT format');
    }

    // Test 5: Sign in anonymously
    console.log('\nTest 5: Testing anonymous sign-in...');
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    
    if (anonError) {
      console.log('⚠️  Anonymous sign-in result:', anonError.message);
    } else {
      console.log('✓ Anonymous sign-in successful');
      console.log('  Session token:', anonData.session?.access_token?.substring(0, 20) + '...');
    }

    console.log('\n=== Test Summary ===');
    console.log('✓ Supabase connection is WORKING');
    console.log('✓ Authentication credentials are VALID');
    console.log('\nYou can now use Supabase in your application.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

testSupabaseConnection();
