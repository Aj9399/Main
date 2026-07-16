# 🚀 Deployment Guide

## Option 1: Vercel (Recommended — 30 seconds)

### Setup (First Time Only)

1. **Sign up at [vercel.com](https://vercel.com)** (free tier, no credit card)
2. **Connect your GitHub**
3. **Import this repository**
4. **Select branch**: `claude/kitchen-meal-assignment-kvzu3o`
5. **Click Deploy** ✓

That's it! Vercel auto-detects Vite, builds, and deploys in ~60 seconds.

### Live After Each Push

Every time you push to the branch, Vercel automatically rebuilds and redeploys. Just:

```bash
git push origin claude/kitchen-meal-assignment-kvzu3o
```

Your live URL appears in the Vercel dashboard.

---

## Option 2: Netlify (Also Free)

### Deploy via Netlify UI

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Select repo + branch
5. Build settings (Netlify auto-detects):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy

### Deploy via CLI

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Option 3: GitHub Pages (Free, No Backend Required)

```bash
# Build
npm run build

# Deploy dist/ to GitHub Pages
# Option A: Use GitHub Actions (recommended)
# Option B: Manual push to gh-pages branch
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [claude/kitchen-meal-assignment-kvzu3o]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Option 4: Firebase Hosting (Free)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Option 5: Traditional VPS/EC2

```bash
# Build locally
npm run build

# Copy dist/ to your server
scp -r dist/* user@your-server:/var/www/app/

# Serve with nginx/apache as static files
```

**nginx config:**
```nginx
server {
  listen 80;
  root /var/www/app;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Recommended for MVP: Vercel

**Why Vercel?**
- ✅ Builds in <1 minute
- ✅ Auto-deploys on push
- ✅ Custom domain support
- ✅ Free tier includes preview deploys
- ✅ Zero configuration needed
- ✅ Environment variables support (for future cloud DB)

---

## After Deployment

### Testing Live App

1. Visit your Vercel URL
2. Test all features:
   - Add customers
   - Add dishes
   - Run daily assignment
   - Print labels
   - Dashboard stats

### Monitoring

Vercel dashboard shows:
- Deployment history
- Build logs
- Performance analytics
- Custom domain management

---

## Local Build for Testing

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

Visit `http://localhost:4173` to test production version locally.

---

## Environment Variables (Future)

When you add cloud database (Firebase, Supabase), create `.env.local`:

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_PROJECT_ID=yyy
```

Vercel: Add in Project Settings → Environment Variables

---

## Troubleshooting

### Build fails
```bash
# Clean build
rm -rf node_modules dist
npm install
npm run build
```

### App doesn't load after deployment
- Check browser console (F12) for errors
- Verify `npm run build` works locally
- Check Vercel build logs

### Data not persisting
- Currently uses localStorage (local to each device)
- Future: Add cloud database for multi-device sync

---

## Next Steps for Production

1. **Custom Domain**: Add your domain in Vercel Settings
2. **SSL Certificate**: Vercel auto-enables HTTPS
3. **Cloud Database**: Add Firebase/Supabase for sync across devices
4. **User Auth**: Add login for multi-kitchen support
5. **Monitoring**: Set up error tracking (Sentry, LogRocket)

---

**Deployed? 🎉 Share your URL!**
