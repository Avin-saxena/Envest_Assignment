# Backend Deployment on Railway

## Environment Variables Required:

```
GOOGLE_AI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-app-name.vercel.app
```

## Deployment Steps:

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Deploy automatically

## Health Check:
- Endpoint: `/api/health`
- Timeout: 300 seconds 