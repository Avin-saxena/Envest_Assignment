# Frontend Deployment Guide

This guide covers deploying the Envest Frontend to both Vercel and Render.

## Option 1: Deploy to Vercel (Recommended)

### Environment Variables Required:

```
BACKEND_URL=https://your-service-name.onrender.com
```

### Deployment Steps:

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Build Settings:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

---

## Option 2: Deploy to Render (Static Site)

### Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub

### Deployment Steps

#### 1. Create New Static Site

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Static Site"**
3. Connect your GitHub repository
4. Select your repository and branch

#### 2. Configure Static Site Settings

**Basic Settings:**
- **Name**: `envest-frontend` (or your preferred name)
- **Branch**: `main`
- **Root Directory**: `frontend-nextjs`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `out`

#### 3. Environment Variables

Add these environment variables in Render:

```
BACKEND_URL=https://envest-assignment.onrender.com
NODE_ENV=production
```

#### 4. Deploy

1. Click **"Create Static Site"**
2. Render will automatically build and deploy your application
3. Wait for the deployment to complete (usually 3-5 minutes)

### Post-Deployment

#### Test Your Frontend

Your frontend will be available at: `https://your-site-name.onrender.com`

#### Update Backend CORS

Update your backend's `CORS_ORIGIN` environment variable in Render:

```
CORS_ORIGIN=https://your-frontend-site.onrender.com
```

### Build Configuration

The frontend is configured for static export with these settings:
- **Static Export**: Enabled (`output: 'export'`)
- **Image Optimization**: Disabled (required for static sites)
- **Trailing Slash**: Enabled for better static hosting
- **Output Directory**: `out/` (contains the static files)

### Auto-Deploy

Render automatically redeploys when you push to your connected branch.

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that `package.json` is in `frontend-nextjs/` directory
   - Verify all dependencies are installed
   - Check build logs for specific errors

2. **Static Export Issues**
   - Ensure no server-side features are used (API routes, getServerSideProps)
   - Check that all images use the `unoptimized` flag

3. **CORS Issues**
   - Verify backend `CORS_ORIGIN` matches your frontend URL
   - Ensure no trailing slash in CORS configuration

### Environment Variables Checklist:
- ✅ `BACKEND_URL` - Your backend URL
- ✅ `NODE_ENV` - Set to `production`

## Render vs Vercel Comparison

| Feature | Vercel | Render |
|---------|---------|---------|
| **Ease of Setup** | Excellent | Good |
| **Build Speed** | Very Fast | Fast |
| **Global CDN** | Yes | Yes |
| **Custom Domains** | Free | Paid plans |
| **Static Sites** | Optimized | Good |
| **Cost** | Free tier generous | Free tier limited |

**Recommendation**: Use Vercel for frontend and Render for backend for the best of both platforms. 