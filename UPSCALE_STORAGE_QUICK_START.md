
# Image Storage in Supabase - Quick Start

## What Changed?

✓ Images are now **automatically stored in Supabase** when you upscale them

---

## 3 Quick Steps to Enable

### 1️⃣ Create Database Table

Run this in your Supabase SQL Editor:

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

### 2️⃣ Add Service Role Key to `.env.local`

Get your service role key:
- Go to https://app.supabase.com → Your Project → Settings → API
- Copy "Service Role Key" (the secret one)
- Add to your `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

### 3️⃣ Restart Your Server

```bash
npm run dev
```

---

## Done! 🎉

Now when you upscale an image:
1. It's processed by the Upscale API
2. Both original and upscaled versions are stored in Supabase
3. The record is linked to your user ID

---

## View Your Stored Images

Go to Supabase SQL Editor and run:

```sql
SELECT id, filename, status, created_at 
FROM upscale_history 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## What Was Updated?

### Files Modified:
- `app/api/upscale/route.ts` - Now stores images in Supabase
- `components/ImageUpscaleZone.tsx` - Now passes user ID to API

### Files Created:
- `setup-upscale-table.js` - Helps create the database table
- `UPSCALE_STORAGE_SETUP.md` - Detailed setup guide
- `UPSCALE_STORAGE_QUICK_START.md` - This file

---

## Still Have Questions?

See `UPSCALE_STORAGE_SETUP.md` for detailed setup, troubleshooting, and advanced options.
