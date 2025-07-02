const express = require('express');
const router = express.Router();
const { 
  analyzeSingleNews, 
  analyzePortfolioNews, 
  quickSentimentAnalysis, 
  analyzeStockNews 
} = require('../controllers/aiController');

/**
 * @route   POST /api/analyze/single
 * @desc    Analyze a single news headline for stock impact
 * @access  Public
 * @body    { headline: "string", description: "string", stockSymbols: ["RELIANCE"] }
 */
router.post('/single', analyzeSingleNews);

/**
 * @route   POST /api/analyze/portfolio
 * @desc    Analyze multiple news items for portfolio impact
 * @access  Public
 * @body    { newsItems: [...], maxItems: 10 }
 */
router.post('/portfolio', analyzePortfolioNews);

/**
 * @route   POST /api/analyze/quick-sentiment
 * @desc    Get quick sentiment analysis for a list of headlines
 * @access  Public
 * @body    { headlines: ["headline1", "headline2"] }
 */
router.post('/quick-sentiment', quickSentimentAnalysis);

/**
 * @route   POST /api/analyze/stock
 * @desc    Analyze news specifically for a single stock
 * @access  Public
 * @body    { stockSymbol: "RELIANCE", newsItems: [...] }
 */
router.post('/stock', analyzeStockNews);

module.exports = router; 