# Image Storage Architecture Diagram

## How It All Works Together

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ImageUpscaleZone Component                              │  │
│  │  ─────────────────────────────────────────────────────── │  │
│  │  1. Get userId from Supabase session (useEffect)         │  │
│  │  2. Accept image file from user                          │  │
│  │  3. Convert to base64                                    │  │
│  │  4. Send POST to /api/upscale with:                      │  │
│  │     - imageData (base64)                                 │  │
│  │     - filename                                           │  │
│  │     - userId ✨ (NEW)                                    │  │
│  │  5. Receive upscaled image + recordId                    │  │
│  │  6. Display result to user                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│              │                                    ▲              │
│              │                                    │              │
└──────────────┼────────────────────────────────────┼──────────────┘
               │                                    │
               │ POST /api/upscale                  │ Response
               │ {imageData, filename, userId}     │ {upscaledUrl, recordId}
               │                                    │
               ▼                                    │
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTE                            │
│                  app/api/upscale/route.ts                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Extract imageData, filename, userId from request     │  │
│  │  2. Validate data                                        │  │
│  │  3. Send to Upscale API                                  │  │
│  │  4. Get upscaled image back                              │  │
│  │  5. Create Supabase client with SERVICE_ROLE_KEY ✨     │  │
│  │  6. Insert into upscale_history:                         │  │
│  │     ├─ user_id                                           │  │
│  │     ├─ original_image (base64)                           │  │
│  │     ├─ upscaled_image (base64)                           │  │
│  │     ├─ filename                                          │  │
│  │     ├─ job_id                                            │  │
│  │     └─ status: 'completed'                               │  │
│  │  7. Return recordId + upscaledUrl to client              │  │
│  └──────────────────────────────────────────────────────────┘  │
│              │                    │                             │
│              │                    │                             │
└──────────────┼────────────────────┼─────────────────────────────┘
               │                    │
               │ 1. POST to         │ 2. INSERT
               │ Upscale API        │ to Database
               ▼                    ▼
        ┌─────────────────────────────────────┐
        │   UPSCALE API                       │
        │   (External Service)                │
        │                                     │
        │   POST /v1/upscale                  │
        │   Returns upscaled image            │
        │                                     │
        └─────────────────────────────────────┘
                                                ┌──────────────────────┐
                                                │   SUPABASE           │
                                                │                      │
                                                │ Table:               │
                                                │ upscale_history      │
                                                │                      │
                                                │ Records:             │
                                                │ ├─ id: 1             │
                                                │ ├─ user_id: abc-123  │
                                                │ ├─ original_image    │
                                                │ ├─ upscaled_image    │
                                                │ ├─ filename          │
                                                │ ├─ job_id            │
                                                │ ├─ status            │
                                                │ └─ created_at        │
                                                │                      │
                                                └──────────────────────┘
```

---

## Data Flow Sequence

```
1. User Uploads Image
   │
   ├─→ Component reads file
   │   └─→ Convert to base64
   │
   ├─→ Get current user ID
   │   └─→ From Supabase session
   │
   └─→ Send to API with: imageData, filename, userId
      │
      ├─→ API receives request
      │
      ├─→ Call Upscale API
      │   └─→ Get upscaled image
      │
      ├─→ Store in Supabase table:
      │   ├─ user_id ← From component
      │   ├─ original_image ← From component
      │   ├─ upscaled_image ← From Upscale API
      │   ├─ filename ← From component
      │   └─ job_id ← From Upscale API
      │
      └─→ Return to component: upscaledUrl, recordId
         │
         └─→ Component displays success + image
            │
            └─→ User sees upscaled image + record saved ✓
```

---

## Environment Variables Required

```
Frontend (Client-side):
├─ NEXT_PUBLIC_SUPABASE_URL
└─ NEXT_PUBLIC_SUPABASE_ANON_KEY

Backend (Server-side - Secret):
├─ SUPABASE_SERVICE_ROLE_KEY ✨ NEW
├─ UPSCALE_API_KEY
└─ UPSCALE_API_URL
```

---

## Key Improvements Made

### Before ❌
```
User Upload → Upscale API → Return URL → Display
                                            │
                                            └─→ No storage!
                                                Lost after refresh
```

### After ✅
```
User Upload → Upscale API → Save to Supabase → Return with ID → Display
                                                    │
                                                    ├─→ Images stored
                                                    ├─→ Tied to user
                                                    ├─→ Can be retrieved later
                                                    ├─→ Can be analyzed
                                                    └─→ Can be managed
```

---

## Database Schema Relationships

```
                    auth.users
                        │
                        │ (Foreign Key)
                        │
                        ▼
                   upscale_history
                  ┌───────────────────┐
                  │ id (PK)           │
                  │ user_id (FK) ────────→ auth.users.id
                  │ original_image    │
                  │ upscaled_image    │
                  │ filename          │
                  │ job_id            │
                  │ status            │
                  │ created_at        │
                  │ updated_at        │
                  └───────────────────┘
                  
Indexes:
├─ idx_upscale_history_user_id (for filtering by user)
└─ idx_upscale_history_created_at (for sorting)
```

---

## What Each Component Does

### Frontend: ImageUpscaleZone.tsx
- 📸 Accepts image files from user
- 🔑 Gets current user ID from Supabase
- 📤 Sends image + userId to API
- 🎉 Displays result to user

### Backend: app/api/upscale/route.ts
- ✅ Validates input data
- 🚀 Calls Upscale API for processing
- 💾 Stores original + upscaled images in Supabase
- 📊 Records metadata (filename, job_id, status)
- ↩️ Returns result with database recordId

### Database: upscale_history table
- 🗂️ Stores all upscale records
- 👤 Links images to specific user
- 📅 Tracks when images were upscaled
- 🔍 Indexed for fast queries

---

## Success Indicators

### ✓ Working Correctly When:

1. **Component Starts**
   - No console errors about Supabase
   - userId state gets populated

2. **Image Upload**
   - File converts to base64 without errors
   - API call includes userId in body

3. **API Processing**
   - Upscale completes successfully
   - Supabase insert succeeds
   - No 401/403 errors

4. **Database Storage**
   - Records appear in upscale_history table
   - user_id matches logged-in user
   - Both original_image and upscaled_image populated

5. **Response**
   - Component receives recordId
   - Upscaled image displays correctly

---

## Performance Considerations

```
Database Queries (Example):
├─ Get all user upscales:
│  └─ SELECT * FROM upscale_history 
│     WHERE user_id = ? 
│     ORDER BY created_at DESC
│     
├─ Get recent upscales:
│  └─ SELECT * FROM upscale_history 
│     ORDER BY created_at DESC 
│     LIMIT 20
│     
└─ Search by filename:
   └─ SELECT * FROM upscale_history 
      WHERE filename ILIKE ? 
      AND user_id = ?

Index Benefits:
├─ user_id index → Fast filtering by user ✓
└─ created_at index → Fast sorting/pagination ✓
```

---

## Troubleshooting Flow

```
Image not storing?
    │
    ├─→ Check: SUPABASE_SERVICE_ROLE_KEY in .env
    │
    ├─→ Check: upscale_history table exists
    │          SELECT * FROM upscale_history LIMIT 1;
    │
    ├─→ Check: User is logged in
    │          Look for userId in component
    │
    └─→ Check: Server logs for errors
               Look in terminal running npm run dev
```

---

This architecture ensures:
- ✅ User images are stored securely
- ✅ Images tied to specific user
- ✅ Full upscale history maintained
- ✅ Data available for future features
- ✅ Scalable for many users
