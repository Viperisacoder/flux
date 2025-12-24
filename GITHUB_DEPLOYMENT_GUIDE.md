# GitHub & Deployment Guide

## ✅ Project is Now GitHub-Ready

Your project has been updated to be production-safe and ready for GitHub. Here's what changed:

### Changes Made

1. **Frontend API URLs** - Now use environment variables
   - `SuccessPage.tsx` - Uses `process.env.REACT_APP_API_URL`
   - `DownloadSection.tsx` - Uses `process.env.REACT_APP_API_URL`
   - Fallback to `http://localhost:5001` for local development

2. **`.env.example`** - Updated with placeholder values (no real secrets)
   - Safe to commit to GitHub
   - Developers copy it to `.env` and fill in their own values

3. **`.gitignore`** - Now includes `.env`
   - Your real secrets will never be committed
   - Only `.env.example` is tracked

### Environment Variables

**For Local Development** (`.env` file - never commit this):
```
STRIPE_SECRET_KEY=<STRIPE_SECRET_KEY>
STRIPE_WEBHOOK_SECRET=<STRIPE_WEBHOOK_SECRET>
SITE_URL=http://localhost:5002
DOWNLOAD_FILE_URL=http://localhost:8000/flux.dmg
PORT=5001
REACT_APP_API_URL=http://localhost:5001
```

**For Production** (Set these on your hosting platform):
```
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_secret
SITE_URL=https://yourdomain.com
DOWNLOAD_FILE_URL=https://your-cdn.com/flux.dmg
PORT=5001
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Make sure .env is NOT committed
git status  # Verify .env is not listed

# Commit all changes
git add .
git commit -m "Make project production-ready with environment variables"
git push origin main
```

### Step 2: Deploy Backend (Node.js Server)

Choose one of these platforms:

#### Option A: Railway (Recommended - Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option B: Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Set environment variables in dashboard
5. Deploy

#### Option C: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create your-app-name
git push heroku main
heroku config:set STRIPE_SECRET_KEY=sk_live_...
```

### Step 3: Deploy Frontend (React App)

Choose one of these platforms:

#### Option A: Vercel (Recommended - Easiest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
# Follow prompts, set REACT_APP_API_URL to your backend URL
```

#### Option B: Netlify
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Set environment variables: `REACT_APP_API_URL=https://your-backend.com`
5. Deploy

### Step 4: Update Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Update webhook URL to: `https://your-backend.com/api/stripe/webhook`
3. Copy new webhook secret
4. Update `STRIPE_WEBHOOK_SECRET` on your hosting platform

### Step 5: Update DNS (if using custom domain)

Point your domain to your frontend hosting provider's nameservers.

---

## 🧪 Testing Before Deployment

### Local Testing (Make sure this works first)

```bash
# Terminal 1: File server
python3 -m http.server 8000 --directory /tmp

# Terminal 2: Stripe webhook listener
stripe listen --forward-to localhost:5001/api/stripe/webhook

# Terminal 3: Backend
node server.js

# Terminal 4: Frontend
npm start
```

Then:
1. Go to `http://localhost:5002`
2. Click "Buy & Download"
3. Pay with `4242 4242 4242 4242`
4. Verify success page loads and file downloads
5. Check backend logs for webhook confirmation

### Production Testing

1. Deploy to staging environment first
2. Test full payment flow with test Stripe keys
3. Verify webhook is receiving events
4. Check logs for any errors
5. Then deploy to production

---

## 📋 Production Checklist

- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` has no real secrets
- [ ] All hardcoded `localhost` URLs removed
- [ ] `REACT_APP_API_URL` environment variable set on frontend
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] `SITE_URL` points to production frontend
- [ ] `DOWNLOAD_FILE_URL` points to production CDN
- [ ] Stripe webhook URL updated
- [ ] HTTPS enabled on both frontend and backend
- [ ] Tested full payment flow in production
- [ ] Monitored logs for errors

---

## 🔐 Security Best Practices

### Never Do This
❌ Commit `.env` file
❌ Hardcode API keys in source code
❌ Use test keys in production
❌ Expose webhook secret in frontend

### Always Do This
✅ Use environment variables for all secrets
✅ Keep `.env` in `.gitignore`
✅ Use different keys for test and production
✅ Rotate webhook secrets regularly
✅ Monitor logs for suspicious activity
✅ Use HTTPS everywhere
✅ Validate all inputs on backend

---

## 🆘 Troubleshooting

### Frontend can't reach backend
- Check `REACT_APP_API_URL` is set correctly
- Verify backend is running
- Check CORS is enabled on backend
- Check firewall/network rules

### Stripe webhook not firing
- Verify webhook URL is correct in Stripe dashboard
- Check webhook secret matches
- Check backend logs for errors
- Verify backend is publicly accessible

### Payment redirects to wrong URL
- Verify `SITE_URL` is set correctly
- Verify backend was restarted after changing env vars
- Clear browser cache and try again

### File won't download
- Verify `DOWNLOAD_FILE_URL` is accessible
- Check file exists at that URL
- Verify CORS headers if on different domain
- Check browser download settings

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com)
- [Railway Deployment](https://docs.railway.app)
- [Environment Variables in React](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## Summary

Your project is now:
- ✅ GitHub-ready (no secrets committed)
- ✅ Production-safe (environment variables everywhere)
- ✅ Easy to deploy (clear instructions above)
- ✅ Secure (secrets never exposed)
- ✅ Scalable (works on any platform)

Push to GitHub and deploy with confidence!
