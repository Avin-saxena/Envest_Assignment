import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for API calls
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Methods
export const newsAPI = {
  // Get general financial news
  getGeneralNews: async () => {
    try {
      const response = await api.get('/api/news/general');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch general news');
    }
  },

  // Get filtered news based on portfolio
  getFilteredNews: async (stocks) => {
    try {
      const response = await api.post('/api/news/filtered', { stocks });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered news');
    }
  },

  // Get portfolio summary
  getPortfolioSummary: async (stocks) => {
    try {
      const response = await api.post('/api/news/portfolio-summary', { stocks });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch portfolio summary');
    }
  },

  // Search news by keyword
  searchNews: async (query, limit = 20) => {
    try {
      const response = await api.get('/api/news/search', {
        params: { query, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search news');
    }
  }
};

export const aiAPI = {
  // Analyze single news headline
  analyzeSingle: async (headline, description = '', stockSymbols = []) => {
    try {
      const response = await api.post('/api/analyze/single', {
        headline,
        description,
        stockSymbols
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze news');
    }
  },

  // Analyze portfolio news
  analyzePortfolio: async (newsItems, maxItems = 10) => {
    try {
      const response = await api.post('/api/analyze/portfolio', {
        newsItems,
        maxItems
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze portfolio news');
    }
  },

  // Quick sentiment analysis
  quickSentiment: async (headlines) => {
    try {
      const response = await api.post('/api/analyze/quick-sentiment', {
        headlines
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze sentiment');
    }
  },

  // Analyze stock-specific news
  analyzeStock: async (stockSymbol, newsItems) => {
    try {
      const response = await api.post('/api/analyze/stock', {
        stockSymbol,
        newsItems
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze stock news');
    }
  }
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend service is unavailable');
    }
  }
};

export default api; 