const express = require('express');
const router = express.Router();
const { 
  getGeneralNews, 
  getFilteredNews, 
  getPortfolioSummary, 
  searchNews 
} = require('../controllers/newsController');

/**
 * @route   GET /api/news/general
 * @desc    Get latest general financial news from all RSS sources
 * @access  Public
 */
router.get('/general', getGeneralNews);

/**
 * @route   POST /api/news/filtered
 * @desc    Get news filtered by user's stock portfolio
 * @access  Public
 * @body    { stocks: ["RELIANCE", "TCS", "INFOSYS"] }
 */
router.post('/filtered', getFilteredNews);

/**
 * @route   POST /api/news/portfolio-summary
 * @desc    Get portfolio summary with news statistics
 * @access  Public
 * @body    { stocks: ["RELIANCE", "TCS", "INFOSYS"] }
 */
router.post('/portfolio-summary', getPortfolioSummary);

/**
 * @route   GET /api/news/search
 * @desc    Search news by keyword
 * @access  Public
 * @query   ?query=reliance&limit=20
 */
router.get('/search', searchNews);

module.exports = router; 