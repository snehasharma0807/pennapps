# Chrome Extension Deployment Guide

## Fixing the Localhost Issue

The Chrome extension was previously hardcoded to use `localhost:3000`, which only works on the same device. This guide helps you deploy it to work across all devices.

## Quick Fix Steps

### 1. Deploy Your Next.js App to Vercel

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Chrome extension with production config"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Deploy (Vercel will auto-detect it's a Next.js app)

3. **Get your deployment URL**:
   - After deployment, you'll get a URL like: `https://your-app-name.vercel.app`
   - Copy this URL

### 2. Update Chrome Extension Configuration

1. **Edit `chrome-extension/config.js`**:
   ```javascript
   // Replace this line:
   production: 'https://workflow-ai-pennapps.vercel.app',
   
   // With your actual Vercel URL:
   production: 'https://your-actual-app-name.vercel.app',
   ```

2. **Update environment variables** (if needed):
   - In your Vercel dashboard, go to Settings → Environment Variables
   - Add all the variables from your `.env.local` file

### 3. Reload Chrome Extension

1. Go to `chrome://extensions/`
2. Find "WorkFlow AI" extension
3. Click the reload button (🔄)
4. Test the extension

## Configuration Options

The `config.js` file has several options:

### Option 1: Always Use Production (Recommended)
```javascript
getBaseUrl: () => {
  return CONFIG.urls.production; // Always use production URL
}
```

### Option 2: Auto-detect Environment
```javascript
getBaseUrl: () => {
  return CONFIG.isDevelopment() ? CONFIG.urls.development : CONFIG.urls.production;
}
```

### Option 3: Force Development Mode
```javascript
getBaseUrl: () => {
  return CONFIG.urls.development; // Always use localhost
}
```

## Testing Cross-Device

1. **Deploy your app** to Vercel
2. **Update the config** with your production URL
3. **Reload the extension**
4. **Test on different devices**:
   - Install the extension on another device
   - Click "Open Dashboard" - it should open your Vercel URL
   - Test all functionality

## Troubleshooting

### Extension Still Uses Localhost
- Make sure you updated `config.js` with the correct production URL
- Reload the extension in `chrome://extensions/`
- Check browser console for any errors

### API Calls Fail
- Verify your Vercel deployment is working
- Check that environment variables are set in Vercel
- Test the API endpoints directly in your browser

### CORS Issues
- Make sure your Next.js API routes allow requests from Chrome extensions
- Check the `host_permissions` in `manifest.json` (should include `<all_urls>`)

## Environment Variables for Production

Make sure these are set in your Vercel dashboard:

```env
MONGODB_URI=your-mongodb-connection-string
AUTH0_SECRET=your-auth0-secret
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_BASE_URL=https://your-app-name.vercel.app
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
GEMINI_API_KEY=your-gemini-api-key
```

## Quick Test

After deployment, test these URLs work:
- `https://your-app-name.vercel.app` (landing page)
- `https://your-app-name.vercel.app/dashboard` (dashboard)
- `https://your-app-name.vercel.app/api/emotions` (API endpoint)

If all work, your extension should work across all devices!


