# Backend Deployment Guide - Render

This guide covers deploying the Envest Backend API to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Google AI API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Deployment Steps

### 1. Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository and branch

### 2. Configure Service Settings

**Basic Settings:**
- **Name**: `envest-backend` (or your preferred name)
- **Region**: `Oregon (US West)` (or closest to your users)
- **Branch**: `main`
- **Root Directory**: `backend-nodejs`

**Build & Deploy:**
- **Runtime**: `Node.js`
- **Build Command**: `yarn install`
- **Start Command**: `yarn start`

### 3. Environment Variables

Add these environment variables in Render:

```
NODE_ENV=production
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
CORS_ORIGIN=https://your-frontend-domain.vercel.app
PORT=10000
```

**Important Notes:**
- Replace `your_google_ai_api_key_here` with your actual Google AI API key
- Replace `https://your-frontend-domain.vercel.app` with your frontend URL
- `PORT` is automatically set by Render, but you can override if needed

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your application
3. Wait for the deployment to complete (usually 2-3 minutes)

## Post-Deployment

### Test Your API

Your backend will be available at: `https://your-service-name.onrender.com`

Test these endpoints:
- **Root**: `GET /` - API documentation
- **Health Check**: `GET /api/health` - Service status
- **General News**: `GET /api/news/general` - Fetch latest news

### Configure Frontend

Update your frontend's `BACKEND_URL` environment variable to point to your Render URL:

```
BACKEND_URL=https://your-service-name.onrender.com
```

## Monitoring & Logs

- **Logs**: Available in Render Dashboard → Your Service → Logs
- **Metrics**: Monitor performance in the Metrics tab
- **Health Check**: Render automatically monitors `/api/health`

## Auto-Deploy

Render automatically redeploys when you push to your connected branch. You can disable this in service settings if needed.

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that `package.json` is in `backend-nodejs/` directory
   - Verify all dependencies are listed in `package.json`

2. **Runtime Errors**
   - Check environment variables are set correctly
   - Review logs in Render Dashboard

3. **CORS Issues**
   - Verify `CORS_ORIGIN` is set to your frontend URL
   - Ensure no trailing slash in the URL

### Environment Variables Checklist:
- ✅ `GOOGLE_AI_API_KEY` - Your Google AI API key
- ✅ `NODE_ENV` - Set to `production`
- ✅ `CORS_ORIGIN` - Your frontend URL
- ✅ `PORT` - Automatically handled by Render

## Security Notes

- Never commit API keys to Git
- Use Render's environment variables for sensitive data
- Enable HTTPS (automatic on Render)
- Monitor usage and set up alerts

## Scaling

Render offers:
- **Free Tier**: Limited resources, good for testing
- **Paid Plans**: Better performance, custom domains, more resources

For production use, consider upgrading to a paid plan for better reliability and performance. 
