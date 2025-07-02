const Parser = require('rss-parser');
const axios = require('axios');

// Initialize RSS parser with custom fields
const parser = new Parser({
  customFields: {
    item: ['description', 'pubDate', 'link', 'guid']
  }
});

// Browser-like headers to bypass bot detection
const getBrowserHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1'
});

// RSS feed URLs for Indian financial news - Updated with working sources
const RSS_FEEDS = {
  'Economic Times': 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'LiveMint': 'https://www.livemint.com/rss/markets'
};

// Source configuration with quality weights and limits
const SOURCE_CONFIG = {
  'Economic Times': {
    weight: 0.60,        // 60% of final articles
    maxArticles: 30,     // Max articles per fetch
    qualityScore: 9,     // Quality rating (1-10)
    priority: 'high'     // Priority level
  },
  'LiveMint': {
    weight: 0.40,        // 40% of final articles
    maxArticles: 20,     // Max articles per fetch
    qualityScore: 8,     // Good quality rating
    priority: 'medium'   // Medium priority
  }
};

// Target total articles for balanced feed
const TARGET_TOTAL_ARTICLES = 50;

/**
 * Fetch news from a single RSS feed with fallback to proxy
 * @param {string} feedUrl - RSS feed URL
 * @param {string} source - Source name for identification
 * @returns {Promise<Array>} Array of parsed news items
 */
async function fetchRSSFeed(feedUrl, source) {
  try {
    console.log(`📡 Fetching RSS feed from ${source}...`);
    
    // First attempt: Direct access with browser-like headers
    const response = await axios.get(feedUrl, {
      headers: getBrowserHeaders(),
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status < 400
    });
    
    // Check if response is HTML (blocked) instead of XML/RSS
    if (response.data && response.data.includes('<HTML>') || response.data.includes('<html>')) {
      console.warn(`⚠️  ${source} returned HTML instead of RSS - blocked, trying proxy...`);
      return await fetchViaProxy(feedUrl, source);
    }
    
    // Parse the fetched XML content
    const feed = await parser.parseString(response.data);
    console.log(`✅ Direct access successful for ${source} (${feed.items.length} items)`);
    
    return feed.items.map(item => ({
      title: item.title || '',
      description: item.description || item.contentSnippet || '',
      link: item.link || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: source,
      guid: item.guid || item.link || ''
    }));
    
  } catch (error) {
    // If direct access fails with 403, try RSS proxy as fallback
    if (error.response && error.response.status === 403) {
      console.warn(`⚠️  Direct access blocked for ${source} - trying RSS proxy fallback...`);
      return await fetchViaProxy(feedUrl, source);
    } else if (error.response?.status) {
      console.error(`❌ HTTP error fetching ${source}: ${error.response.status} ${error.response.statusText}`);
    } else if (error.code === 'ENOTFOUND') {
      console.error(`❌ Network error for ${source} - check internet connection`);
    } else if (error.message.includes('timeout')) {
      console.error(`❌ Request timeout for ${source} - site may be slow`);
    } else {
      console.error(`❌ Error fetching RSS feed from ${source}:`, error.message);
    }
    return [];
  }
}

/**
 * Fetch RSS feed via proxy service as fallback
 * @param {string} feedUrl - Original RSS feed URL
 * @param {string} source - Source name for identification
 * @returns {Promise<Array>} Array of parsed news items
 */
async function fetchViaProxy(feedUrl, source) {
  try {
    // Using rssproxy.migor.org as a reliable RSS proxy service
    const proxyUrl = `https://rssproxy.migor.org/api/rss?url=${encodeURIComponent(feedUrl)}`;
    
    const response = await axios.get(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Envest-NewsAggregator/1.0)',
        'Accept': 'application/json, application/xml, text/xml',
      },
      timeout: 20000, // Longer timeout for proxy
      validateStatus: (status) => status < 400
    });
    
    // The proxy returns XML, so parse it
    const feed = await parser.parseString(response.data);
    console.log(`✅ Proxy access successful for ${source} (${feed.items.length} items)`);
    
    return feed.items.map(item => ({
      title: item.title || '',
      description: item.description || item.contentSnippet || '',
      link: item.link || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: `${source} (via proxy)`, // Indicate proxy usage for transparency
      guid: item.guid || item.link || ''
    }));
    
  } catch (proxyError) {
    console.error(`❌ Proxy also failed for ${source}:`, proxyError.message);
    return [];
  }
}

/**
 * Fetch news from all configured RSS feeds with intelligent balancing
 * @returns {Promise<Array>} Balanced array of news items from all sources
 */
async function fetchAllNews() {
  try {
    console.log('🔄 Fetching news from all RSS sources with intelligent balancing...');
    
    const feedPromises = Object.entries(RSS_FEEDS).map(([source, url]) => 
      fetchRSSFeed(url, source)
    );
    
    const feedResults = await Promise.allSettled(feedPromises);
    
    // Process each source with quality scoring and limits
    const sourceArticles = {};
    feedResults.forEach((result, index) => {
      const sourceName = Object.keys(RSS_FEEDS)[index];
      
      if (result.status === 'fulfilled') {
        const articles = result.value;
        
        // Sort articles by date (newest first) for this source
        articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // Apply source-specific limits
        const config = SOURCE_CONFIG[sourceName];
        const limitedArticles = articles.slice(0, config.maxArticles);
        
        // Add quality scoring to each article
        const scoredArticles = limitedArticles.map(article => ({
          ...article,
          qualityScore: config.qualityScore,
          priority: config.priority,
          sourceWeight: config.weight
        }));
        
        sourceArticles[sourceName] = scoredArticles;
        console.log(`✅ ${sourceName}: ${limitedArticles.length}/${articles.length} articles (quality: ${config.qualityScore}/10)`);
      } else {
        console.error(`❌ Failed to fetch from ${sourceName}:`, result.reason);
        sourceArticles[sourceName] = [];
      }
    });
    
    // Apply weighted distribution to create balanced feed
    const balancedNews = createBalancedFeed(sourceArticles);
    
    // Remove duplicates based on title similarity
    const uniqueNews = removeDuplicates(balancedNews);
    
    // Final sort by quality score and date
    uniqueNews.sort((a, b) => {
      // First by quality score (higher is better)
      if (a.qualityScore !== b.qualityScore) {
        return b.qualityScore - a.qualityScore;
      }
      // Then by publication date (newer is better)
      return new Date(b.pubDate) - new Date(a.pubDate);
    });
    
    console.log(`✅ Successfully created balanced feed with ${uniqueNews.length} unique news items`);
    return uniqueNews;
    
  } catch (error) {
    console.error('❌ Error fetching all news:', error);
    throw error;
  }
}

/**
 * Create a balanced news feed based on source weights and quality
 * @param {Object} sourceArticles - Articles grouped by source
 * @returns {Array} Balanced array of articles
 */
function createBalancedFeed(sourceArticles) {
  const balancedFeed = [];
  const sourceStats = {};
  
  // Calculate target articles per source based on weights
  Object.keys(SOURCE_CONFIG).forEach(source => {
    const config = SOURCE_CONFIG[source];
    const targetCount = Math.round(TARGET_TOTAL_ARTICLES * config.weight);
    const availableCount = sourceArticles[source]?.length || 0;
    const actualCount = Math.min(targetCount, availableCount);
    
    sourceStats[source] = {
      target: targetCount,
      available: availableCount,
      selected: actualCount,
      weight: config.weight
    };
    
    // Add the calculated number of articles from this source
    if (sourceArticles[source]) {
      balancedFeed.push(...sourceArticles[source].slice(0, actualCount));
    }
  });
  
  // Log balancing statistics
  console.log('📊 Source balancing applied:');
  Object.entries(sourceStats).forEach(([source, stats]) => {
    console.log(`   ${source}: ${stats.selected}/${stats.available} articles (${Math.round(stats.weight * 100)}% weight)`);
  });
  
  return balancedFeed;
}

/**
 * Filter news based on user's stock portfolio
 * @param {Array} newsItems - Array of news items
 * @param {Array} stockSymbols - Array of stock symbols (e.g., ['RELIANCE', 'TCS'])
 * @returns {Array} Filtered news items relevant to the portfolio
 */
function filterNewsByPortfolio(newsItems, stockSymbols) {
  if (!stockSymbols || stockSymbols.length === 0) {
    return newsItems;
  }
  
  // Convert stock symbols to lowercase for case-insensitive matching
  const lowerStockSymbols = stockSymbols.map(symbol => symbol.toLowerCase());
  
  // Common stock name mappings for better matching
  const stockNameMappings = {
    'reliance': ['reliance', 'ril', 'reliance industries'],
    'tcs': ['tcs', 'tata consultancy', 'tata consultancy services'],
    'infosys': ['infosys', 'infy'],
    'hdfcbank': ['hdfc bank', 'hdfc', 'hdfcbank'],
    'icicibank': ['icici bank', 'icici', 'icicibank'],
    'bhartiairtel': ['bharti airtel', 'airtel', 'bharti'],
    'itc': ['itc', 'indian tobacco'],
    'sbin': ['sbi', 'state bank', 'state bank of india'],
    'hindunilvr': ['hindustan unilever', 'hul', 'unilever'],
    'asianpaint': ['asian paints', 'asian paint']
  };
  
  return newsItems.filter(item => {
    const titleLower = item.title.toLowerCase();
    const descriptionLower = item.description.toLowerCase();
    const combinedText = `${titleLower} ${descriptionLower}`;
    
    return lowerStockSymbols.some(symbol => {
      // Direct symbol match
      if (combinedText.includes(symbol)) {
        return true;
      }
      
      // Check mapped variations
      const variations = stockNameMappings[symbol] || [symbol];
      return variations.some(variation => combinedText.includes(variation));
    });
  });
}

/**
 * Remove duplicate news items based on title similarity, preferring higher quality sources
 * @param {Array} newsItems - Array of news items
 * @returns {Array} Array with duplicates removed, keeping highest quality versions
 */
function removeDuplicates(newsItems) {
  const titleMap = new Map();
  
  newsItems.forEach(item => {
    // Create a normalized version of the title for comparison
    const normalizedTitle = item.title.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    
    // If we haven't seen this title, or this version has higher quality, keep it
    if (!titleMap.has(normalizedTitle) || 
        (item.qualityScore && item.qualityScore > titleMap.get(normalizedTitle).qualityScore)) {
      titleMap.set(normalizedTitle, item);
    }
  });
  
  return Array.from(titleMap.values());
}

/**
 * Extract stock symbols mentioned in news text
 * @param {string} text - News title and description
 * @returns {Array} Array of potential stock symbols found
 */
function extractStockSymbols(text) {
  const textLower = text.toLowerCase();
  const commonStocks = [
    'reliance', 'tcs', 'infosys', 'hdfcbank', 'icicibank', 
    'bhartiairtel', 'itc', 'sbin', 'hindunilvr', 'asianpaint',
    'maruti', 'bajfinance', 'hcltech', 'wipro', 'ongc',
    'tatamotors', 'sunpharma', 'nestleind', 'kotakbank', 'ltim'
  ];
  
  return commonStocks.filter(stock => textLower.includes(stock));
}

module.exports = {
  fetchAllNews,
  fetchRSSFeed,
  filterNewsByPortfolio,
  extractStockSymbols,
  RSS_FEEDS,
  SOURCE_CONFIG,
  TARGET_TOTAL_ARTICLES
}; 