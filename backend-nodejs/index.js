const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const newsRoutes = require('./routes/news');
const aiAnalysisRoutes = require('./routes/aiAnalysis');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Envest Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      news: {
        general: 'GET /api/news/general',
        filtered: 'POST /api/news/filtered',
        portfolioSummary: 'POST /api/news/portfolio-summary',
        search: 'GET /api/news/search'
      },
      ai: {
        single: 'POST /api/analyze/single',
        portfolio: 'POST /api/analyze/portfolio',
        quickSentiment: 'POST /api/analyze/quick-sentiment',
        stock: 'POST /api/analyze/stock'
      }
    },
    documentation: 'API endpoints for Indian financial news curation and AI analysis'
  });
});

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/analyze', aiAnalysisRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Envest Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Envest Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 