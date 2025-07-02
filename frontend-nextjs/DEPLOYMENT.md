# Frontend Deployment on Vercel

## Environment Variables Required:

```
BACKEND_URL=https://your-service-name.onrender.com
```

## Deployment Steps:

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

## Build Settings:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install` 