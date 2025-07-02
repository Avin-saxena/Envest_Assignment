# 📊 Insightfolio - AI-Powered Indian Financial News Curator

A comprehensive web application that automatically curates financial news from Indian markets, allows users to manage their stock portfolio, and provides AI-generated insights about how recent news might affect their investments.

## 🌟 Features

- **📰 Real-time News Aggregation**: Fetches latest financial news from trusted Indian sources (Economic Times, Moneycontrol, Business Standard, LiveMint)
- **🤖 AI-Powered Analysis**: Uses Gemini 1.5 Flash API for sentiment analysis and investment impact assessment
- **💼 Portfolio Management**: Simple portfolio input and management with localStorage persistence
- **🎯 Personalized Filtering**: Shows only news relevant to your portfolio stocks
- **📱 Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **⚡ Real-time Insights**: Get instant AI analysis of how news affects your investments

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom components
- **Storage**: Browser localStorage for portfolio management
- **Icons**: Heroicons for consistent UI elements

### Backend (Node.js)
- **Framework**: Express.js with security middleware
- **News Sources**: RSS parsing from multiple Indian financial news sources
- **AI Integration**: Google Gemini 1.5 Flash API
- **Rate Limiting**: Built-in request limiting and error handling

## 📁 Project Structure

```
Insightfolio/
├── frontend-nextjs/
│   ├── pages/
│   │   ├── index.js              # General News
│   │   ├── portfolio.js          # Portfolio Management
│   │   └── filtered.js           # Filtered News + AI Insights
│   ├── components/
│   │   ├── Layout.js             # Main layout component
│   │   └── NewsCard.js           # News item component
│   ├── utils/
│   │   ├── api.js                # API client functions
│   │   └── portfolio.js          # Portfolio management
│   └── styles/
│       └── globals.css           # Global styles with Tailwind
│
├── backend-nodejs/
│   ├── routes/
│   │   ├── news.js               # News API routes
│   │   └── aiAnalysis.js         # AI analysis routes
│   ├── controllers/
│   │   ├── newsController.js     # News business logic
│   │   └── aiController.js       # AI analysis logic
│   ├── utils/
│   │   ├── rssParser.js          # RSS feed parsing
│   │   └── aiAnalyzer.js         # Gemini AI integration
│   └── index.js                  # Express server setup
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get it here](https://ai.google.dev/))

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend-nodejs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   # Create .env file
   cat > .env << EOF
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   EOF
   ```

4. **Start the backend server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or production mode
   npm start
   ```

   Backend will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend-nextjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3000`

## 🌐 API Endpoints

### News Endpoints
- `GET /api/news/general` - Get latest general financial news
- `POST /api/news/filtered` - Get news filtered by portfolio
- `POST /api/news/portfolio-summary` - Get portfolio statistics
- `GET /api/news/search?query=term` - Search news by keyword

### AI Analysis Endpoints
- `POST /api/analyze/single` - Analyze single news headline
- `POST /api/analyze/portfolio` - Analyze portfolio news
- `POST /api/analyze/quick-sentiment` - Quick sentiment analysis
- `POST /api/analyze/stock` - Stock-specific news analysis

### Health Check
- `GET /api/health` - Backend health status

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   cd frontend-nextjs
   vercel --prod
   ```

3. **Set environment variables in Vercel**:
   - Go to your Vercel dashboard
   - Add `BACKEND_URL` pointing to your deployed backend

### Backend Deployment (Render/Railway)

#### Option 1: Render

1. **Create account** at [render.com](https://render.com)

2. **Connect GitHub repo** and select backend folder

3. **Configure build settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set environment variables**:
   ```
   GEMINI_API_KEY=your_api_key
   NODE_ENV=production
   FRONTEND_URL=your_vercel_url
   ```

#### Option 2: Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**:
   ```bash
   cd backend-nodejs
   railway login
   railway deploy
   ```

3. **Set environment variables**:
   ```bash
   railway variables set GEMINI_API_KEY=your_api_key
   railway variables set NODE_ENV=production
   railway variables set FRONTEND_URL=your_vercel_url
   ```

## 🔧 Configuration

### Getting Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### RSS Feed Sources

The application uses these RSS feeds:
- **Economic Times**: `https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms`
- **Moneycontrol**: `https://www.moneycontrol.com/rss/marketshome.xml`
- **Business Standard**: `https://www.business-standard.com/rss/markets-106.rss`
- **LiveMint**: `https://www.livemint.com/rss/markets`

## 🎯 Usage Guide

### 1. General News
- Visit the homepage to see latest financial news from all sources
- Click on any article to read the full content
- Use "Analyze with AI" to get sentiment analysis

### 2. Portfolio Management
- Go to Portfolio page
- Add stock symbols (e.g., RELIANCE, TCS, INFOSYS)
- Popular stocks are provided for quick selection
- Portfolio is saved in browser localStorage

### 3. Filtered News & AI Insights
- Visit Filtered News page
- See news specifically related to your portfolio
- Get overall portfolio sentiment analysis
- Individual article analysis with confidence scores

## 🧪 Testing

### Backend Testing
```bash
cd backend-nodejs

# Test health endpoint
curl http://localhost:3001/api/health

# Test general news
curl http://localhost:3001/api/news/general

# Test filtered news
curl -X POST http://localhost:3001/api/news/filtered \
  -H "Content-Type: application/json" \
  -d '{"stocks": ["RELIANCE", "TCS"]}'
```

### Frontend Testing
- Navigate through all pages
- Test portfolio management
- Test news filtering
- Test AI analysis functionality

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific frontend origin
- **Input Validation**: Sanitized inputs and error handling
- **Security Headers**: Helmet.js for security headers

## ⚡ Performance Optimizations

- **RSS Caching**: Prevents excessive external API calls
- **Batch AI Analysis**: Processes multiple articles efficiently
- **Rate Limiting**: Protects against API abuse
- **Lazy Loading**: Components load as needed
- **Optimized Images**: Next.js automatic optimization

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**:
   - Check if port 3001 is available
   - Verify environment variables are set
   - Check Node.js version (18+ required)

2. **Frontend API errors**:
   - Ensure backend is running
   - Check CORS configuration
   - Verify API endpoints are correct

3. **AI analysis failing**:
   - Verify Gemini API key is valid
   - Check API quota limits
   - Ensure proper network connectivity

4. **News not loading**:
   - Check RSS feed URLs are accessible
   - Verify network connectivity
   - Check backend logs for errors

### Debug Commands

```bash
# Check backend logs
cd backend-nodejs
npm run dev

# Check frontend console
# Open browser developer tools and check console

# Test backend health
curl http://localhost:3001/api/health
```

## 📝 Environment Variables

### Backend (.env)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (Vercel)
```bash
BACKEND_URL=https://your-backend-url.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Please ensure compliance with news source terms of service and API usage policies.

## 🔗 Links

- **Demo**: [Your deployed URL]
- **Documentation**: This README
- **Issues**: [GitHub Issues](https://github.com/your-username/envest/issues)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Verify all environment variables are set correctly

---

**Built with ❤️ using Next.js, Express.js, and Google Gemini AI** 