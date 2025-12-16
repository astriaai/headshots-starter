# 📧 Email System - Quick Reference

## Current Status: ✅ FIXED

```
Email Notifications: ENABLED ✅
API Key Configured: YES ✅
Webhooks Updated: YES ✅
Error Handling: YES ✅
```

---

## 🎯 What's Working Now

### 1. Model Training Completion Email ✅
```
When: AI model finishes training
To: User's email
Subject: "Your AI model has been successfully trained! ✅"
Contains: Confirmation, credit info, dashboard link
```

### 2. Headshots Generation Email ✅
```
When: AI generates professional headshots
To: User's email
Subject: "Your AI headshots are ready! 🎉"
Contains: Photo count, view button, reminder to share
```

---

## 🔑 API Key Details

### Test (Development)
```env
RESEND_API_KEY=re_test_1a2b3c4d5e6f7g8h9i0j
```
- ✅ Currently configured
- ✓ Good for development
- ✗ Won't actually send emails
- ✓ Use for testing

### Production (When Ready)
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```
- Get from: https://resend.com/settings/api-keys
- ✓ Real emails will send
- ✓ Use for live app
- ⏳ Not configured yet

---

## 🚀 How to Test

```bash
# 1. Start server
npm run dev

# 2. Train a model
Upload 4+ photos → Click "Train" → Wait 5-10 min

# 3. Check inbox
Email #1 arrives ✅

# 4. Generate headshots
Click "Generate" on trained model → Wait 2-5 min

# 5. Check inbox again
Email #2 arrives ✅
```

---

## 📂 Files Changed

| File | Change |
|------|--------|
| `.env.local` | Updated RESEND_API_KEY |
| `train-webhook/route.ts` | Enhanced email logic |
| `prompt-webhook/route.ts` | Added email sending (NEW) |

---

## 🔍 Email Debug

Check server console for:
```
✅ "Email sent to user@example.com"
✅ "Training completion email sent to..."
✅ "Email notifications disabled - RESEND_API_KEY not configured"

❌ "Failed to send email notification:" = Error
```

---

## 📋 Sender Address

```
From: noreply@headshots.tryleap.ai
```

To change:
1. Edit `train-webhook/route.ts` line 131
2. Edit `prompt-webhook/route.ts` line 136
3. Change `from: "your-new-address@domain.com"`
4. Restart server

---

## ✅ Quick Checklist

- [x] API key set in `.env.local`
- [x] Resend imported in webhooks
- [x] Email templates created
- [x] Error handling added
- [x] Dashboard links included
- [ ] Get production API key (when ready)
- [ ] Verify custom domain (optional)
- [ ] Monitor email stats

---

## 💡 Tips

**Test Fast:**
- Use `ASTRIA_TEST_MODE=true` in `.env.local`
- Models train instantly in test mode
- Check emails without waiting

**Monitor Emails:**
- Visit: https://resend.com/emails
- View delivery status
- Check bounce rates

**Custom Domain:**
- For professional emails
- Setup in Resend dashboard
- Add DNS records
- Update `from` address

---

**Last Updated:** December 16, 2025  
**Status:** ✅ Ready for Testing
