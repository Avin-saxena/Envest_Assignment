const { analyzeNewsImpact, batchAnalyzeNews, getPortfolioSentiment } = require('../utils/aiAnalyzer');
const { extractStockSymbols } = require('../utils/rssParser');

/**
 * Analyze a single news headline for stock impact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function analyzeSingleNews(req, res) {
  try {
    const { headline, description = '', stockSymbols = [] } = req.body;
    
    if (!headline || headline.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Please provide a news headline to analyze'
      });
    }
    
    console.log(`🤖 Analyzing single news: "${headline.substring(0, 50)}..."`);
    
    // Extract stock symbols if not provided
    let relevantStocks = stockSymbols;
    if (!relevantStocks || relevantStocks.length === 0) {
      relevantStocks = extractStockSymbols(`${headline} ${description}`);
    }
    
    // Analyze news impact
    const analysis = await analyzeNewsImpact(headline, description, relevantStocks);
    
    res.json({
      success: true,
      data: {
        headline: headline,
        description: description,
        relevantStocks: relevantStocks,
        analysis: {
          impact: analysis.impact,
          confidence: analysis.confidence,
          reasoning: analysis.reasoning
        }
      },
      message: 'News analysis completed successfully'
    });
    
  } catch (error) {
    console.error('❌ Error analyzing single news:', error);
    res.status(500).json({
      success: false,
      error: 'Analysis failed',
      message: 'Unable to analyze news at this time. Please try again later.'
    });
  }
}

/**
 * Analyze multiple news items for portfolio impact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function analyzePortfolioNews(req, res) {
  try {
    const { newsItems, maxItems = 10 } = req.body;
    
    if (!newsItems || !Array.isArray(newsItems) || newsItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Please provide an array of news items to analyze'
      });
    }
    
    console.log(`🔍 Analyzing ${newsItems.length} news items for portfolio impact...`);
    
    // Limit the number of items to analyze for performance and API costs
    const itemsToAnalyze = newsItems.slice(0, Math.min(maxItems, 15));
    
    // Add relevant stocks to each news item if not already present
    const enrichedNewsItems = itemsToAnalyze.map(item => ({
      ...item,
      relevantStocks: item.relevantStocks || extractStockSymbols(`${item.title} ${item.description || ''}`)
    }));
    
    // Batch analyze all news items
    const analyzedNews = await batchAnalyzeNews(enrichedNewsItems, 3);
    
    // Get overall portfolio sentiment
    const portfolioSentiment = getPortfolioSentiment(analyzedNews);
    
    res.json({
      success: true,
      data: {
        analyzedNews: analyzedNews.map(item => ({
          title: item.title,
          description: item.description,
          link: item.link,
          pubDate: item.pubDate,
          source: item.source,
          relevantStocks: item.relevantStocks,
          analysis: item.analysis
        })),
        portfolioSentiment: portfolioSentiment,
        summary: {
          totalAnalyzed: analyzedNews.length,
          averageConfidence: portfolioSentiment.confidence,
          overallImpact: portfolioSentiment.overall
        }
      },
      message: `Successfully analyzed ${analyzedNews.length} news items`
    });
    
  } catch (error) {
    console.error('❌ Error analyzing portfolio news:', error);
    res.status(500).json({
      success: false,
      error: 'Portfolio analysis failed',
      message: 'Unable to analyze portfolio news. Please try again later.'
    });
  }
}

/**
 * Get quick sentiment analysis for a list of headlines
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function quickSentimentAnalysis(req, res) {
  try {
    const { headlines } = req.body;
    
    if (!headlines || !Array.isArray(headlines) || headlines.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Please provide an array of headlines to analyze'
      });
    }
    
    console.log(`⚡ Quick sentiment analysis for ${headlines.length} headlines...`);
    
    // Limit to 5 headlines for quick analysis
    const headlinesToAnalyze = headlines.slice(0, 5);
    
    // Analyze each headline quickly
    const analyses = await Promise.all(
      headlinesToAnalyze.map(async (headline) => {
        try {
          const analysis = await analyzeNewsImpact(headline, '', []);
          return {
            headline: headline,
            impact: analysis.impact,
            confidence: analysis.confidence
          };
        } catch (error) {
          return {
            headline: headline,
            impact: 'Neutral',
            confidence: 0.5,
            error: 'Analysis failed'
          };
        }
      })
    );
    
    // Calculate overall sentiment
    const positiveCount = analyses.filter(a => a.impact === 'Positive').length;
    const negativeCount = analyses.filter(a => a.impact === 'Negative').length;
    const neutralCount = analyses.filter(a => a.impact === 'Neutral').length;
    
    let overallSentiment = 'Neutral';
    if (positiveCount > negativeCount) {
      overallSentiment = 'Positive';
    } else if (negativeCount > positiveCount) {
      overallSentiment = 'Negative';
    }
    
    res.json({
      success: true,
      data: {
        analyses: analyses,
        summary: {
          total: analyses.length,
          positive: positiveCount,
          negative: negativeCount,
          neutral: neutralCount,
          overallSentiment: overallSentiment
        }
      },
      message: 'Quick sentiment analysis completed'
    });
    
  } catch (error) {
    console.error('❌ Error in quick sentiment analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Quick analysis failed',
      message: 'Unable to perform quick sentiment analysis. Please try again later.'
    });
  }
}

/**
 * Get AI analysis for specific stock
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function analyzeStockNews(req, res) {
  try {
    const { stockSymbol, newsItems } = req.body;
    
    if (!stockSymbol || !newsItems || !Array.isArray(newsItems)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        message: 'Please provide a stock symbol and news items array'
      });
    }
    
    console.log(`📊 Analyzing news for stock: ${stockSymbol}`);
    
    // Filter news items relevant to the specific stock
    const relevantNews = newsItems.filter(item => {
      const text = `${item.title} ${item.description || ''}`.toLowerCase();
      return text.includes(stockSymbol.toLowerCase());
    });
    
    if (relevantNews.length === 0) {
      return res.json({
        success: true,
        data: {
          stockSymbol: stockSymbol,
          relevantNews: [],
          stockSentiment: {
            overall: 'Neutral',
            score: 0,
            confidence: 0
          }
        },
        message: `No relevant news found for ${stockSymbol}`
      });
    }
    
    // Analyze relevant news
    const analyzedNews = await batchAnalyzeNews(relevantNews.slice(0, 10), 2);
    
    // Calculate stock-specific sentiment
    const stockSentiment = getPortfolioSentiment(analyzedNews);
    
    res.json({
      success: true,
      data: {
        stockSymbol: stockSymbol,
        relevantNews: analyzedNews,
        stockSentiment: stockSentiment,
        summary: {
          newsCount: analyzedNews.length,
          averageConfidence: stockSentiment.confidence,
          recommendation: generateRecommendation(stockSentiment)
        }
      },
      message: `Analysis completed for ${stockSymbol}`
    });
    
  } catch (error) {
    console.error('❌ Error analyzing stock news:', error);
    res.status(500).json({
      success: false,
      error: 'Stock analysis failed',
      message: 'Unable to analyze stock news. Please try again later.'
    });
  }
}

/**
 * Generate a simple recommendation based on sentiment analysis
 * @param {Object} sentiment - Sentiment analysis result
 * @returns {string} Recommendation text
 */
function generateRecommendation(sentiment) {
  const { overall, score, confidence } = sentiment;
  
  if (confidence < 0.3) {
    return 'Insufficient data for reliable recommendation. Monitor closely.';
  }
  
  switch (overall) {
    case 'Positive':
      if (score > 0.6) {
        return 'Strong positive sentiment detected. Consider potential upside.';
      } else {
        return 'Moderate positive sentiment. Cautiously optimistic outlook.';
      }
    case 'Negative':
      if (score < -0.6) {
        return 'Strong negative sentiment detected. Exercise caution.';
      } else {
        return 'Moderate negative sentiment. Monitor for further developments.';
      }
    default:
      return 'Neutral sentiment. No clear directional bias detected.';
  }
}

module.exports = {
  analyzeSingleNews,
  analyzePortfolioNews,
  quickSentimentAnalysis,
  analyzeStockNews
}; 