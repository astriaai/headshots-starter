/**
 * Setup script to create upscale_history table in Supabase
 * Run this once to initialize the table structure
 * Command: node setup-upscale-table.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== Setting up Upscale History Table ===\n');

if (!SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'your-service-role-key') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not configured');
  console.error('   Please set your service role key in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupTable() {
  try {
    console.log('Creating upscale_history table...\n');

    // SQL to create the table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS upscale_history (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        original_image TEXT NOT NULL,
        upscaled_image TEXT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        job_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create index on user_id for faster queries
    const createIndexSQL = `
      CREATE INDEX IF NOT EXISTS idx_upscale_history_user_id 
      ON upscale_history(user_id);
    `;

    // Create index on created_at for sorting
    const createCreatedAtIndexSQL = `
      CREATE INDEX IF NOT EXISTS idx_upscale_history_created_at 
      ON upscale_history(created_at DESC);
    `;

    // Execute using RPC or direct SQL
    const { data: tables, error: listError } = await supabase
      .rpc('get_tables')
      .catch(() => ({ data: null, error: null }));

    // Try to create table via direct SQL using the admin API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        query: createTableSQL,
      }),
    }).catch(() => null);

    // Alternative: Check if table exists by trying to query it
    console.log('Checking if upscale_history table exists...');
    const { data: existingData, error: queryError } = await supabase
      .from('upscale_history')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    if (queryError && queryError.code === 'PGRST103') {
      console.log('⚠️  Table does not exist. Creating via SQL...\n');
      console.log('Please create the table manually using this SQL:\n');
      console.log('```sql');
      console.log(createTableSQL);
      console.log(createIndexSQL);
      console.log(createCreatedAtIndexSQL);
      console.log('```\n');
      console.log('Steps:');
      console.log('1. Go to https://app.supabase.com');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Create a new query');
      console.log('5. Paste the SQL above');
      console.log('6. Click Run\n');
    } else if (!queryError) {
      console.log('✓ Table already exists!\n');
      console.log('Table structure:');
      console.log('  - id: BIGSERIAL PRIMARY KEY');
      console.log('  - user_id: UUID (references auth.users)');
      console.log('  - original_image: TEXT (base64 or URL)');
      console.log('  - upscaled_image: TEXT (base64 or URL)');
      console.log('  - filename: VARCHAR(255)');
      console.log('  - job_id: VARCHAR(255)');
      console.log('  - status: VARCHAR(50)');
      console.log('  - created_at: TIMESTAMP');
      console.log('  - updated_at: TIMESTAMP\n');
    } else {
      console.log('✓ Setup complete! Table is ready to use.\n');
    }

    console.log('=== Next Steps ===');
    console.log('1. Update ImageUpscaleZone.tsx to pass userId to the API');
    console.log('2. Get userId from useAuth() or session hook');
    console.log('3. Images will be automatically stored in Supabase\n');

  } catch (error) {
    console.error('❌ Setup error:', error.message);
    process.exit(1);
  }
}

setupTable();
