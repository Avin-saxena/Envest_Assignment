const { fetchAllNews, filterNewsByPortfolio, extractStockSymbols } = require('../utils/rssParser');

/**
 * Get general financial news from all RSS sources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getGeneralNews(req, res) {
  try {
    console.log('📰 Request for general news received');
    
    // Fetch all news from RSS feeds
    const news = await fetchAllNews();
    
    // Limit to latest 50 news items for performance
    const limitedNews = news.slice(0, 50);
    
    // Extract stock symbols for each news item
    const newsWithStocks = limitedNews.map(item => ({
      ...item,
      relevantStocks: extractStockSymbols(`${item.title} ${item.description}`)
    }));
    
    // Calculate source distribution statistics
    const sourceStats = {};
    newsWithStocks.forEach(item => {
      const source = item.source;
      sourceStats[source] = (sourceStats[source] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: newsWithStocks,
      count: newsWithStocks.length,
      sourceDistribution: sourceStats,
      balancingInfo: {
        totalSources: Object.keys(sourceStats).length,
        balancingEnabled: true,
        targetArticles: 50
      },
      message: 'Balanced news feed fetched successfully'
    });
    
  } catch (error) {
    console.error('❌ Error fetching general news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
      message: 'Unable to retrieve news at this time. Please try again later.'
    });
  }
}

/**
 * Get filtered news based on user's portfolio
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getFilteredNews(req, res) {
  try {
    const { stocks } = req.body;
    
    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid portfolio',
        message: 'Please provide an array of stock symbols in your portfolio'
      });
    }
    
    console.log(`📊 Request for filtered news received for stocks: ${stocks.join(', ')}`);
    
    // Fetch all news
    const allNews = await fetchAllNews();
    
    // Filter news based on portfolio
    const filteredNews = filterNewsByPortfolio(allNews, stocks);
    
    // Limit to latest 30 filtered news items
    const limitedFilteredNews = filteredNews.slice(0, 30);
    
    // Add relevant stocks information to each news item
    const newsWithStocks = limitedFilteredNews.map(item => ({
      ...item,
      relevantStocks: extractStockSymbols(`${item.title} ${item.description}`)
        .filter(stock => stocks.map(s => s.toLowerCase()).includes(stock.toLowerCase()))
    }));
    
    res.json({
      success: true,
      data: newsWithStocks,
      count: newsWithStocks.length,
      portfolio: stocks,
      message: `Found ${newsWithStocks.length} news items relevant to your portfolio`
    });
    
  } catch (error) {
    console.error('❌ Error fetching filtered news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to filter news',
      message: 'Unable to filter news for your portfolio. Please try again later.'
    });
  }
}

/**
 * Get portfolio summary with basic statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getPortfolioSummary(req, res) {
  try {
    const { stocks } = req.body;
    
    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid portfolio',
        message: 'Please provide an array of stock symbols in your portfolio'
      });
    }
    
    console.log(`📈 Request for portfolio summary: ${stocks.join(', ')}`);
    
    // Fetch all news
    const allNews = await fetchAllNews();
    
    // Filter news for each stock individually
    const stockSummaries = stocks.map(stock => {
      const stockNews = filterNewsByPortfolio(allNews, [stock]);
      return {
        symbol: stock,
        newsCount: stockNews.length,
        latestNews: stockNews.slice(0, 5).map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: item.source
        }))
      };
    });
    
    // Overall portfolio news
    const portfolioNews = filterNewsByPortfolio(allNews, stocks);
    
    res.json({
      success: true,
      data: {
        portfolio: stocks,
        totalNewsCount: portfolioNews.length,
        stockSummaries,
        lastUpdated: new Date().toISOString()
      },
      message: 'Portfolio summary generated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error generating portfolio summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate portfolio summary',
      message: 'Unable to generate portfolio summary. Please try again later.'
    });
  }
}

/**
 * Search news by keyword
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function searchNews(req, res) {
  try {
    const { query, limit = 20 } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search query',
        message: 'Please provide a search query'
      });
    }
    
    console.log(`🔍 Search request for: "${query}"`);
    
    // Fetch all news
    const allNews = await fetchAllNews();
    
    // Search in title and description
    const searchResults = allNews.filter(item => {
      const searchText = `${item.title} ${item.description}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });
    
    // Limit results
    const limitedResults = searchResults.slice(0, parseInt(limit));
    
    // Add relevant stocks to each result
    const resultsWithStocks = limitedResults.map(item => ({
      ...item,
      relevantStocks: extractStockSymbols(`${item.title} ${item.description}`)
    }));
    
    res.json({
      success: true,
      data: resultsWithStocks,
      count: resultsWithStocks.length,
      query: query,
      message: `Found ${resultsWithStocks.length} news items matching "${query}"`
    });
    
  } catch (error) {
    console.error('❌ Error searching news:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: 'Unable to search news. Please try again later.'
    });
  }
}

module.exports = {
  getGeneralNews,
  getFilteredNews,
  getPortfolioSummary,
  searchNews
}; 