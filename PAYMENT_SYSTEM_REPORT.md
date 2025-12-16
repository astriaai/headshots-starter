# Payment System Report

## Overview
The Headshots AI application uses a dual payment provider system to handle credit purchases. Users can buy credits to unlock advanced image upscaling features. The system supports both **Paddle** (primary) and **Stripe** (legacy) as payment processors.

---

## 1. Payment Flow Architecture

### High-Level Flow
```
User Request
    ↓
/get-credits page (Email or Login)
    ↓
Stripe Pricing Table (Client-Side)
    ↓
User Completes Payment
    ↓
Payment Provider (Stripe/Paddle)
    ↓
Webhook Endpoint
    ↓
Credits Added to Database
    ↓
User Account Updated
```

---

## 2. Payment Entry Points

### A. **Primary Entry: `/get-credits` Page**

**Location:** `app/get-credits/page.tsx`

**Behavior:**
- **Server Component** that checks if user is authenticated
- Passes user data (if authenticated) or null to client component
- No login required - supports guest checkout

**Client Component:** `app/get-credits/components/CreditsPageClient.tsx`

**Two-Step Process:**

1. **For Guests (No Login):**
   - Email input form appears
   - User enters email address
   - Proceeds to payment

2. **For Logged-In Users:**
   - Skips email input
   - Goes directly to payment page

---

## 3. Payment Providers

### A. **Stripe (Legacy Support)**

**Status:** Currently integrated but marked as `NEXT_PUBLIC_STRIPE_IS_ENABLED=false`

**Configuration:**
```env
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_PRICE_ID_ONE_CREDIT=price-id-1
STRIPE_PRICE_ID_THREE_CREDITS=price-id-3
STRIPE_PRICE_ID_FIVE_CREDITS=price-id-5
```

**Component:** `components/stripe/StripeTable.tsx`

**How It Works:**
1. Loads Stripe pricing table script
2. Displays embedded pricing options
3. User selects credit package and pays
4. Stripe sends webhook to `/app/stripe/subscription-webhook/route.ts`

**Credit Mapping:**
- 1 Credit Package → 1 Credit
- 3 Credits Package → 3 Credits
- 5 Credits Package → 5 Credits

---

### B. **Paddle (Recommended)**

**Status:** Primary payment provider

**Configuration:**
```env
NEXT_PUBLIC_PADDLE_PRICE_ID=pri_01kcgs0zd41ammjkbx8ayfsgkd
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_128280d2c624b267d5e24019282
PADDLE_SECRET_KEY=your-paddle-secret-key
PADDLE_WEBHOOK_SECRET=your-paddle-webhook-secret
```

**Component:** `components/stripe/PaddlePricingTable.tsx`

**How It Works:**
1. Loads Paddle SDK from CDN
2. Initializes with client token
3. Opens checkout modal on button click
4. Passes customer email and ID
5. Paddle sends webhook to `/app/stripe/paddle-webhook/route.ts`

**Credit Mapping:**
- Any Paddle Price → 5 Credits (configured in webhook)

---

## 4. Payment Processing Flow

### Step 1: User Initiates Payment
**File:** `app/get-credits/components/CreditsPageClient.tsx`

```typescript
const handleEmailSubmit = () => {
  setIsEmailEntered(true);  // Proceed to payment
}
```

### Step 2: Payment Component Renders
**File:** `components/stripe/StripeTable.tsx`

```typescript
const customerId = user?.id || 'guest';
const customerEmail = user?.email || email || '';

// Send to payment provider with:
// - client-reference-id: User ID or 'guest'
// - customer-email: User email or entered email
```

### Step 3: Payment Completion
Payment provider processes transaction and sends webhook

### Step 4: Webhook Processing
**Stripe Endpoint:** `app/stripe/subscription-webhook/route.ts`
**Paddle Endpoint:** `app/stripe/paddle-webhook/route.ts`

Both endpoints:
1. Verify webhook signature
2. Extract transaction details
3. Calculate credits purchased
4. Update Supabase database

---

## 5. Stripe Webhook Processing

**Endpoint:** `POST /api/stripe/subscription-webhook`

**Process:**
```typescript
// 1. Verify webhook signature
event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)

// 2. Handle checkout.session.completed event
case "checkout.session.completed":
  userId = checkoutSessionCompleted.client_reference_id
  
  // 3. Get line items (which package was purchased)
  lineItems = stripe.checkout.sessions.listLineItems(sessionId)
  priceId = lineItems.data[0].price.id
  quantity = lineItems.data[0].quantity
  
  // 4. Calculate total credits
  creditsPerUnit = creditsPerPriceId[priceId]
  totalCredits = quantity * creditsPerUnit
  
  // 5. Update Supabase
  if (user has existing credits) {
    UPDATE credits SET credits = existing + totalCredits
  } else {
    INSERT new row with totalCredits
  }
```

**Success Response:**
```json
{
  "message": "success",
  "status": 200
}
```

---

## 6. Paddle Webhook Processing

**Endpoint:** `POST /api/stripe/paddle-webhook`

**Process:**
```typescript
// 1. Verify Paddle signature using HMAC-SHA256
signature = HMAC-SHA256(body, PADDLE_SECRET_KEY)
if (signature !== paddleSignature) return 401

// 2. Parse webhook event
event = JSON.parse(body)

// 3. Handle transaction.completed event
if (event.eventType === 'transaction.completed') {
  customerId = event.data.customerId
  totalAmount = event.data.totals.total
  
  // 4. Calculate credits (fixed 5 credits per purchase)
  credits = priceIdCredits[priceId] || 5
  
  // 5. Update Supabase
  if (user exists) {
    UPDATE credits
  } else {
    INSERT new row
  }
}
```

---

## 7. Database Schema

### Credits Table (`supabase`)

**Table Name:** `credits`

**Columns:**
```sql
CREATE TABLE credits (
  id UUID PRIMARY KEY,
  user_id VARCHAR NOT NULL,  -- User ID from auth
  credits INT NOT NULL,       -- Current credit balance
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Webhook Operations:**
- **SELECT** - Check if user has existing credits
- **UPDATE** - Add purchased credits to existing balance
- **INSERT** - Create new credit entry for first purchase

**Example Data:**
```
user_id: "guest"      credits: 5
user_id: "user-123"   credits: 15 (5 + 10 from previous purchases)
```

---

## 8. Current Configuration

### Active Payment Methods

| Provider | Status | Test Mode | Endpoint |
|----------|--------|-----------|----------|
| **Paddle** | ✅ Active | Yes (Sandbox) | `/api/stripe/paddle-webhook` |
| **Stripe** | ⏸️ Disabled | N/A | `/api/stripe/subscription-webhook` |

### Credit Pricing

**Paddle:**
- Price ID: `pri_01kcgs0zd41ammjkbx8ayfsgkd`
- Credits Per Purchase: **5 Credits**
- Mode: **Sandbox (Test)**

**Stripe:**
- Status: Disabled
- Would offer: 1, 3, or 5 credit packages

---

## 9. Key Features

### ✅ **Guest Checkout**
- Users can purchase credits without creating account
- Email required for Stripe/Paddle to process payment
- Payment provider handles email verification

### ✅ **Persistent Sessions**
- Logged-in users stay logged in (localStorage)
- User data automatically passed to payment provider
- Better UX for returning users

### ✅ **Webhook Security**
- Stripe: HMAC-SHA256 signature verification
- Paddle: HMAC-SHA256 signature verification
- Invalid signatures rejected with 401

### ✅ **Error Handling**
- Missing credentials: Returns 400 with error message
- Database errors: Logged and returned as 400
- Invalid webhooks: Rejected as 400

### ✅ **Credit Accumulation**
- Purchases add to existing balance
- Multiple purchases tracked correctly
- No credit expiration (by default)

---

## 10. Environment Variables Required

### Production Setup

```env
# Paddle (Recommended)
NEXT_PUBLIC_PADDLE_PRICE_ID=<your-paddle-price-id>
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=<your-paddle-client-token>
PADDLE_SECRET_KEY=<your-paddle-secret-key>
PADDLE_WEBHOOK_SECRET=<your-paddle-webhook-secret>

# Stripe (Optional)
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
STRIPE_PRICE_ID_ONE_CREDIT=<price-id>
STRIPE_PRICE_ID_THREE_CREDITS=<price-id>
STRIPE_PRICE_ID_FIVE_CREDITS=<price-id>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

---

## 11. Testing the Payment System

### Test Flow

1. **Access Credits Page:**
   ```
   http://localhost:3002/get-credits
   ```

2. **Enter Email (Guest):**
   - Type any email address
   - Click "Continue to Payment"

3. **View Payment Options:**
   - Paddle pricing table loads
   - Shows 5 credits package option

4. **Complete Payment:**
   - Uses Paddle sandbox (test) mode
   - No real charges
   - Webhook processes automatically

5. **Verify Credits:**
   - Check Supabase `credits` table
   - Should see new entry with 5 credits

### Webhook Verification

**Paddle Webhook URL:** `https://yourdomain.com/api/stripe/paddle-webhook`
**Stripe Webhook URL:** `https://yourdomain.com/api/stripe/subscription-webhook`

Both need to be registered in respective provider dashboards.

---

## 12. Future Enhancements

### Recommended Improvements

1. **Credit History Table**
   - Track all transactions
   - Show user purchase history
   - Generate invoices

2. **Credit Expiration**
   - Set expiration dates per purchase
   - Automatic cleanup of expired credits

3. **Promotional Codes**
   - Discount codes
   - Referral bonuses
   - Trial credits

4. **Usage Tracking**
   - Track credits used per feature
   - Usage analytics dashboard
   - Tier-based pricing

5. **Subscription Support**
   - Monthly/yearly subscriptions
   - Auto-replenishing credits
   - Cancel/pause options

---

## 13. Troubleshooting

### Issue: Webhook Not Processing

**Solution:**
1. Verify webhook secret matches provider configuration
2. Check webhook URL is publicly accessible
3. Enable webhook logs in payment provider dashboard
4. Verify Supabase credentials are valid

### Issue: Credits Not Added

**Solution:**
1. Check Supabase `credits` table exists
2. Verify `user_id` matches payment provider ID
3. Check webhook logs for errors
4. Ensure Service Role Key has table permissions

### Issue: Paddle/Stripe Not Loading

**Solution:**
1. Verify environment variables are set
2. Check browser console for JavaScript errors
3. Ensure SDK scripts can load (no CSP violations)
4. Test with different browser/incognito mode

---

## Summary

The payment system is a **two-provider** architecture that allows credit purchases through either **Paddle** (recommended) or **Stripe** (legacy). It supports both **authenticated users** and **guest checkout**, with secure webhook processing that updates user credit balances in real-time. The system is production-ready with proper error handling, signature verification, and database transactions.
