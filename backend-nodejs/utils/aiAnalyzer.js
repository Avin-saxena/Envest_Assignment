const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with API key
let genAI;
let model;

/**
 * Initialize Gemini AI model
 */
function initializeAI() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('✅ Gemini AI initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error.message);
    throw error;
  }
}

/**
 * Analyze news headline for stock impact using Gemini AI
 * @param {string} headline - News headline to analyze
 * @param {string} description - News description (optional)
 * @param {Array} stockSymbols - Relevant stock symbols mentioned
 * @returns {Promise<Object>} Analysis result with impact, confidence, and reasoning
 */
async function analyzeNewsImpact(headline, description = '', stockSymbols = []) {
  if (!model) {
    initializeAI();
  }
  
  try {
    console.log(`🤖 Analyzing news impact: "${headline.substring(0, 100)}..."`);
    
    // Construct the prompt for Gemini
    const prompt = createAnalysisPrompt(headline, description, stockSymbols);
    
    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the AI response
    const analysis = parseAIResponse(text);
    
    console.log(`🔍 Raw AI response: ${text}`);
    console.log(`✅ Analysis complete: ${analysis.impact} (${Math.round(analysis.confidence * 100)}%)`);
    return analysis;
    
  } catch (error) {
    console.error('❌ Error analyzing news with AI:', error.message);
    
    // Return a fallback analysis
    return {
      headline: headline,
      impact: "Neutral",
      confidence: 0.5,
      reasoning: "Unable to analyze due to technical error. Please try again.",
      error: true
    };
  }
}

/**
 * Create a structured prompt for Gemini AI analysis
 * @param {string} headline - News headline
 * @param {string} description - News description
 * @param {Array} stockSymbols - Relevant stock symbols
 * @returns {string} Formatted prompt for AI analysis
 */
function createAnalysisPrompt(headline, description, stockSymbols) {
  const stockContext = stockSymbols.length > 0 
    ? `\nRelevant stocks mentioned: ${stockSymbols.join(', ')}`
    : '';
    
  return `
You are a financial analyst expert in Indian stock markets. Analyze the following news for its potential impact on the mentioned company's stock price.

News Headline: "${headline}"
${description ? `News Description: "${description}"` : ''}${stockContext}

Evaluate this news and respond in the following exact JSON format:
{
  "impact": "[Positive/Negative/Neutral]",
  "confidence": [0.0 to 1.0],
  "reasoning": "[Brief 1-2 sentence explanation]"
}

Guidelines:
- Positive: News likely to increase stock price (earnings beats, new contracts, positive guidance, etc.)
- Negative: News likely to decrease stock price (losses, scandals, regulatory issues, etc.)
- Neutral: News with minimal or unclear impact on stock price
- Confidence: Provide a precise confidence score between 0.0 and 1.0 with exactly 2 decimal places
  IMPORTANT: You must NOT use round numbers ending in 0 or 5 (like 0.70, 0.75, 0.80, 0.85, 0.90, 0.95)
  Required format: 0.XX where X can be any digit 1-4 or 6-9
  Valid examples: 0.63, 0.67, 0.71, 0.74, 0.78, 0.82, 0.84, 0.87, 0.91, 0.94, 0.96, 0.98
  Invalid examples: 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95
- Keep reasoning concise and focused on financial impact

Respond only with the JSON object, no additional text.`;
}

/**
 * Parse AI response text and extract structured analysis
 * @param {string} responseText - Raw AI response
 * @returns {Object} Parsed analysis object
 */
function parseAIResponse(responseText) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      console.log(`🔍 Parsed confidence from AI: ${parsed.confidence} (type: ${typeof parsed.confidence})`);
      
      // Validate and normalize the response
      let finalConfidence = Math.max(0, Math.min(1, parseFloat(parsed.confidence) || 0.5));
      
      // If AI returned a round number (ending in 0 or 5), make it more granular
      const confidencePercent = Math.round(finalConfidence * 100);
      if (confidencePercent % 5 === 0 && confidencePercent !== 50) {
        // Add small variation to round numbers to make them more granular
        const variations = [-0.03, -0.02, -0.01, 0.01, 0.02, 0.03, 0.04];
        const randomVariation = variations[Math.floor(Math.random() * variations.length)];
        finalConfidence = Math.max(0, Math.min(1, finalConfidence + randomVariation));
        console.log(`🔄 Adjusted round confidence ${parsed.confidence} to ${finalConfidence.toFixed(2)}`);
      }
      
      console.log(`🔍 Final confidence after validation: ${finalConfidence}`);
      
      return {
        impact: normalizeImpact(parsed.impact),
        confidence: finalConfidence,
        reasoning: parsed.reasoning || 'No reasoning provided',
        error: false
      };
    } else {
      throw new Error('No JSON found in response');
    }
  } catch (error) {
    console.error('❌ Error parsing AI response:', error.message);
    console.log('Raw response:', responseText);
    
    // Fallback parsing - try to extract impact from text
    const text = responseText.toLowerCase();
    let impact = 'Neutral';
    let confidence = 0.5;
    
    if (text.includes('positive') || text.includes('bullish') || text.includes('good')) {
      impact = 'Positive';
      confidence = 0.6;
    } else if (text.includes('negative') || text.includes('bearish') || text.includes('bad')) {
      impact = 'Negative';
      confidence = 0.6;
    }
    
    return {
      impact,
      confidence,
      reasoning: 'Analysis based on text interpretation due to parsing error',
      error: true
    };
  }
}

/**
 * Normalize impact value to standard format
 * @param {string} impact - Raw impact value
 * @returns {string} Normalized impact value
 */
function normalizeImpact(impact) {
  if (!impact || typeof impact !== 'string') return 'Neutral';
  
  const normalized = impact.toLowerCase().trim();
  
  if (normalized.includes('positive') || normalized.includes('pos')) {
    return 'Positive';
  } else if (normalized.includes('negative') || normalized.includes('neg')) {
    return 'Negative';
  } else {
    return 'Neutral';
  }
}

/**
 * Analyze multiple news items in batch
 * @param {Array} newsItems - Array of news items to analyze
 * @param {number} maxConcurrent - Maximum concurrent analyses (default: 3)
 * @returns {Promise<Array>} Array of analysis results
 */
async function batchAnalyzeNews(newsItems, maxConcurrent = 3) {
  console.log(`🔄 Starting batch analysis of ${newsItems.length} news items...`);
  
  const results = [];
  
  // Process news items in batches to avoid rate limiting
  for (let i = 0; i < newsItems.length; i += maxConcurrent) {
    const batch = newsItems.slice(i, i + maxConcurrent);
    
    const batchPromises = batch.map(async (newsItem) => {
      const analysis = await analyzeNewsImpact(
        newsItem.title,
        newsItem.description,
        newsItem.relevantStocks || []
      );
      
      return {
        ...newsItem,
        analysis
      };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to respect rate limits
    if (i + maxConcurrent < newsItems.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`✅ Batch analysis complete: ${results.length} items processed`);
  return results;
}

/**
 * Get overall portfolio sentiment based on analyzed news
 * @param {Array} analyzedNews - Array of news items with analysis
 * @returns {Object} Overall portfolio sentiment summary
 */
function getPortfolioSentiment(analyzedNews) {
  if (!analyzedNews || analyzedNews.length === 0) {
    return {
      overall: 'Neutral',
      score: 0,
      breakdown: { positive: 0, negative: 0, neutral: 0 },
      confidence: 0
    };
  }
  
  const breakdown = { positive: 0, negative: 0, neutral: 0 };
  let totalScore = 0;
  let totalConfidence = 0;
  
  analyzedNews.forEach(item => {
    if (item.analysis) {
      const impact = item.analysis.impact.toLowerCase();
      const confidence = item.analysis.confidence;
      
      breakdown[impact]++;
      
      // Calculate weighted score based on impact and confidence
      if (impact === 'positive') {
        totalScore += confidence;
      } else if (impact === 'negative') {
        totalScore -= confidence;
      }
      
      totalConfidence += confidence;
    }
  });
  
  const avgScore = totalScore / analyzedNews.length;
  const avgConfidence = totalConfidence / analyzedNews.length;
  
  let overall = 'Neutral';
  if (avgScore > 0.2) overall = 'Positive';
  else if (avgScore < -0.2) overall = 'Negative';
  
  return {
    overall,
    score: Math.round(avgScore * 100) / 100,
    breakdown,
    confidence: Math.round(avgConfidence * 100) / 100
  };
}

module.exports = {
  initializeAI,
  analyzeNewsImpact,
  batchAnalyzeNews,
  getPortfolioSentiment
}; 