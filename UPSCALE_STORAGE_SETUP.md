# Image Storage in Supabase - Setup Guide

## Overview

Your upscale images are now automatically stored in Supabase. This includes both the original and upscaled images, with metadata about the upscaling job.

---

## What Was Updated

### 1. **API Route** (`app/api/upscale/route.ts`)
- Now imports Supabase client
- Accepts `userId` parameter from the frontend
- Stores both original and upscaled images in Supabase `upscale_history` table
- Returns `recordId` from the database insert

### 2. **Frontend Component** (`components/ImageUpscaleZone.tsx`)
- Now uses `useEffect` to fetch current user ID from Supabase session
- Passes `userId` to the API when calling upscale
- Receives and stores `recordId` from the API response

### 3. **Database Setup Script** (`setup-upscale-table.js`)
- Script to create the `upscale_history` table
- Includes indexes for faster queries

---

## Setup Steps

### Step 1: Create the Database Table

The `upscale_history` table stores:
- `id` - Unique record ID
- `user_id` - User who upscaled the image
- `original_image` - Base64 or URL of original image
- `upscaled_image` - Base64 or URL of upscaled image
- `filename` - Original filename
- `job_id` - Upscale API job ID
- `status` - Job status (pending, completed, failed)
- `created_at` - Timestamp
- `updated_at` - Timestamp

**Option A: Automatic Setup**
```bash
node setup-upscale-table.js
```

**Option B: Manual Setup**

Go to your Supabase dashboard and run this SQL:

```sql
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

CREATE INDEX idx_upscale_history_user_id ON upscale_history(user_id);
CREATE INDEX idx_upscale_history_created_at ON upscale_history(created_at DESC);
```

### Step 2: Verify Configuration

Your `.env.local` should have:

```env
# ✓ These are required (you already have them)
NEXT_PUBLIC_SUPABASE_URL=https://gfrdtscippxmcvrtngdl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# ⚠️ This is needed for the API to save to Supabase
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

If you don't have the service role key:
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API → Copy "Service Role Key"
4. Add to `.env.local`

### Step 3: Test the Integration

Once the table is created and service role key is configured:

1. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Go to the upscale page: http://localhost:3000/upscale

3. Upload and upscale an image

4. Check Supabase:
   - Go to your Supabase dashboard
   - Select your project
   - Go to SQL Editor
   - Run: `SELECT * FROM upscale_history ORDER BY created_at DESC LIMIT 10;`
   - You should see your upscaled image records!

---

## Querying Upscale History

### Get all upscales by a user

```typescript
const { data, error } = await supabase
  .from('upscale_history')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Get recent upscales

```typescript
const { data, error } = await supabase
  .from('upscale_history')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(20);
```

### Check job status

```typescript
const { data, error } = await supabase
  .from('upscale_history')
  .select('*')
  .eq('job_id', jobId)
  .single();
```

---

## How It Works

### Flow Diagram

```
User uploads image
         ↓
Component converts to base64
         ↓
Component gets user ID from Supabase session
         ↓
Component calls /api/upscale with:
  - imageData (base64)
  - filename
  - userId
         ↓
API sends to Upscale API
         ↓
Upscale API returns upscaled image
         ↓
API saves to Supabase table:
  - user_id
  - original_image
  - upscaled_image
  - filename
  - job_id
  - status
         ↓
API returns recordId to component
         ↓
Component displays upscaled image
```

---

## Image Data Storage

The images are stored as **base64-encoded strings** in the database. 

### Considerations

**Pros:**
- ✓ Self-contained in database
- ✓ No external storage needed
- ✓ Easy to share/export
- ✓ Simple setup

**Cons:**
- ⚠️ Large database size (base64 is ~33% larger than binary)
- ⚠️ Slower queries for large image lists
- ⚠️ Not ideal for very large images (>5MB)

### Alternative: Use Vercel Blob Storage

If you want to store images in Vercel Blob instead:

1. Update the API route to upload to Blob:
```typescript
const { url } = await put(`upscale/${userId}/${filename}`, imageBlob, {
  access: 'public',
});

// Store URL instead of base64
await supabase.from('upscale_history').insert({
  user_id: userId,
  original_image: originalUrl, // URL instead of base64
  upscaled_image: upscaledUrl,
  filename: filename,
  job_id: result.id,
  status: 'completed',
});
```

This would reduce database size and improve performance.

---

## File Structure

```
app/
  └── api/
      └── upscale/
          └── route.ts          ← Updated with Supabase storage

components/
  └── ImageUpscaleZone.tsx      ← Updated with userId passing

setup-upscale-table.js          ← New: Database setup script
UPSCALE_STORAGE_SETUP.md        ← This file
```

---

## Troubleshooting

### Images not being saved?

1. Check that `SUPABASE_SERVICE_ROLE_KEY` is set
2. Check server logs for errors:
   ```bash
   # In your next.js terminal
   # Look for "Upscale record saved" or error messages
   ```
3. Verify table exists:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'upscale_history';
   ```

### Getting "Auth session missing" error?

This means the user is not logged in. The component will still work (for testing) but images won't be stored.

### Getting "SUPABASE_SERVICE_ROLE_KEY is missing"?

The API will skip saving to Supabase but the upscale will still work. Just add the key to `.env.local`.

---

## Next Steps

1. ✓ Set up `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
2. ✓ Create the `upscale_history` table
3. ✓ Restart your dev server
4. ✓ Test by upscaling an image
5. ✓ Query the database to verify it's working

That's it! Your images are now stored in Supabase.
