# Backend Fixes Summary

## Bugs Fixed

### 1. **CRITICAL: dotenv loaded AFTER Stripe initialization**
- **Problem**: Line 2 initialized Stripe before line 4 loaded `.env`
- **Result**: `process.env.STRIPE_SECRET_KEY` was undefined, causing "Neither apiKey nor config.authenticator provided" error
- **Fix**: Moved `require('dotenv').config()` to line 1, before any env var usage

### 2. **Missing webhook endpoint**
- **Problem**: No `/api/stripe/webhook` route to handle payment confirmations
- **Result**: Stripe webhooks were never processed, so payment status was never confirmed
- **Fix**: Added webhook handler with `express.raw({ type: 'application/json' })` middleware

### 3. **Middleware order violation**
- **Problem**: `express.json()` was registered before webhook endpoint
- **Result**: Webhook body was parsed as JSON instead of raw buffer, breaking signature verification
- **Fix**: Registered webhook route BEFORE `express.json()` middleware

### 4. **Missing download endpoint**
- **Problem**: SuccessPage calls `GET /api/download?session_id=...` but endpoint didn't exist
- **Result**: Download always returned 404, showing "error occurred"
- **Fix**: Added `/api/download` endpoint with payment validation

### 5. **No payment validation**
- **Problem**: Download endpoint had no way to verify payment was actually completed
- **Result**: Anyone could download by guessing a session ID
- **Fix**: Added `stripe.checkout.sessions.retrieve(sessionId)` to check `payment_status === 'paid'`

### 6. **Missing webhook secret validation**
- **Problem**: Webhook secret wasn't checked before attempting verification
- **Result**: Webhooks would fail silently if secret wasn't set
- **Fix**: Added explicit check for `STRIPE_WEBHOOK_SECRET` with clear error message

---

## Required Environment Variables

| Variable | Required | Purpose | Status |
|----------|----------|---------|--------|
| `STRIPE_SECRET_KEY` | ✅ YES | Authenticate with Stripe API | ✅ Set |
| `STRIPE_WEBHOOK_SECRET` | ✅ YES | Verify webhook signatures | ⚠️ Placeholder (see below) |
| `SITE_URL` | ✅ YES | Redirect URL after payment | ✅ Set to `http://localhost:3000` |
| `DOWNLOAD_FILE_URL` | ✅ YES | URL to Flux.dmg file | ⚠️ Placeholder (see below) |
| `PORT` | ❌ Optional | Server port | ✅ Defaults to 5000 |

---

## ⚠️ YOU ARE MISSING THESE

### 1. Real Webhook Secret
Your `.env` has: `STRIPE_WEBHOOK_SECRET=whsec_test_placeholder`

**Get the real one:**
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
This will output:
```
> Ready! Your webhook signing secret is: whsec_xxxxxxxxxxxx
```
Copy that secret and update `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### 2. Download File URL
Your `.env` has: `DOWNLOAD_FILE_URL=https://your-storage.com/flux.dmg`

**You need to:**
- Host `Flux.dmg` somewhere (S3, GitHub Releases, etc.)
- Get a public URL to the file
- Update `.env` with the real URL

For testing locally, you can:
```bash
# Create a dummy file
touch /tmp/flux.dmg

# Serve it with Python
python3 -m http.server 8000 --directory /tmp
```
Then set: `DOWNLOAD_FILE_URL=http://localhost:8000/flux.dmg`

---

## Test Plan

### Test 1: Buy Flow
```
1. Frontend: Click "Buy & Download" button
2. Frontend: POST to http://localhost:5000/api/stripe/create-checkout-session
3. Backend: Returns { "url": "https://checkout.stripe.com/..." }
4. Frontend: Redirects to Stripe Checkout
5. Stripe: Complete payment with test card 4242 4242 4242 4242
6. Stripe: Redirects to http://localhost:3000/success?session_id=cs_test_xxxxx
7. ✅ Success page loads
```

### Test 2: Webhook
```
1. Terminal 1: stripe listen --forward-to localhost:5000/api/stripe/webhook
2. Terminal 2: node server.js
3. Complete payment in Stripe Checkout
4. Check Terminal 2 logs for: "✓ Payment confirmed for session: cs_test_xxxxx"
5. ✅ Webhook received and processed
```

### Test 3: Download Flow
```
1. After successful payment, you're on /success?session_id=cs_test_xxxxx
2. Frontend: Calls GET http://localhost:5000/api/download?session_id=cs_test_xxxxx
3. Backend: Retrieves session from Stripe, checks payment_status === 'paid'
4. Backend: Returns { "downloadUrl": "https://your-storage.com/flux.dmg" }
5. Frontend: Redirects to download URL
6. ✅ File downloads
```

### Test 4: Download Validation (Security)
```
1. Try to download without paying:
   GET http://localhost:5000/api/download?session_id=fake_session
2. Backend: Returns 403 { "error": "Payment not completed" }
3. ✅ Unpaid users cannot download
```

---

## How to Run

```bash
# Terminal 1: Start Stripe CLI webhook listener
stripe listen --forward-to localhost:5000/api/stripe/webhook

# Terminal 2: Start backend server
node server.js

# Terminal 3: Start frontend (in another directory)
npm start
```

---

## Files Changed

- ✅ `server.js` - Complete rewrite with all fixes
- ✅ `.env` - Added missing variables

---

## Next Steps

1. **Get webhook secret** from `stripe listen` command
2. **Get download URL** for your Flux.dmg file
3. **Update `.env`** with real values
4. **Run tests** following the test plan above
5. **Check logs** for "✓" messages confirming each step
