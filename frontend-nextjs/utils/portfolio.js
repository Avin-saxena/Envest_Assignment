// Portfolio management utilities for localStorage

const PORTFOLIO_KEY = 'envest_portfolio';

/**
 * Get user's portfolio from localStorage
 * @returns {Array} Array of stock symbols
 */
export const getPortfolio = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(PORTFOLIO_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading portfolio from localStorage:', error);
    return [];
  }
};

/**
 * Save portfolio to localStorage
 * @param {Array} stocks - Array of stock symbols
 */
export const savePortfolio = (stocks) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Validate and clean the stocks array
    const cleanedStocks = stocks
      .filter(stock => stock && typeof stock === 'string')
      .map(stock => stock.toUpperCase().trim())
      .filter((stock, index, arr) => arr.indexOf(stock) === index); // Remove duplicates
    
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(cleanedStocks));
    console.log('📁 Portfolio saved:', cleanedStocks);
  } catch (error) {
    console.error('Error saving portfolio to localStorage:', error);
  }
};

/**
 * Add a stock to the portfolio
 * @param {string} stock - Stock symbol to add
 * @returns {Array} Updated portfolio
 */
export const addToPortfolio = (stock) => {
  if (!stock || typeof stock !== 'string') return getPortfolio();
  
  const currentPortfolio = getPortfolio();
  const cleanStock = stock.toUpperCase().trim();
  
  if (!currentPortfolio.includes(cleanStock)) {
    const updatedPortfolio = [...currentPortfolio, cleanStock];
    savePortfolio(updatedPortfolio);
    return updatedPortfolio;
  }
  
  return currentPortfolio;
};

/**
 * Remove a stock from the portfolio
 * @param {string} stock - Stock symbol to remove
 * @returns {Array} Updated portfolio
 */
export const removeFromPortfolio = (stock) => {
  if (!stock || typeof stock !== 'string') return getPortfolio();
  
  const currentPortfolio = getPortfolio();
  const cleanStock = stock.toUpperCase().trim();
  const updatedPortfolio = currentPortfolio.filter(s => s !== cleanStock);
  
  savePortfolio(updatedPortfolio);
  return updatedPortfolio;
};

// Comprehensive Indian stock database with company names
const INDIAN_STOCKS = [
  // Top 50 NSE stocks
  { symbol: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Oil & Gas' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Limited', sector: 'IT Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT Services' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', sector: 'FMCG' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecom' },
  { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Limited', sector: 'Paints' },
  
  // Additional major stocks
  { symbol: 'LT', name: 'Larsen & Toubro Limited', sector: 'Construction' },
  { symbol: 'AXISBANK', name: 'Axis Bank Limited', sector: 'Banking' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited', sector: 'Automobiles' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Limited', sector: 'Pharmaceuticals' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', sector: 'Financial Services' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Limited', sector: 'IT Services' },
  { symbol: 'WIPRO', name: 'Wipro Limited', sector: 'IT Services' },
  { symbol: 'NESTLEIND', name: 'Nestle India Limited', sector: 'FMCG' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited', sector: 'Banking' },
  { symbol: 'LTIM', name: 'LTIMindtree Limited', sector: 'IT Services' },
  
  // Technology & IT
  { symbol: 'TECHM', name: 'Tech Mahindra Limited', sector: 'IT Services' },
  { symbol: 'MPHASIS', name: 'Mphasis Limited', sector: 'IT Services' },
  { symbol: 'MINDTREE', name: 'Mindtree Limited', sector: 'IT Services' },
  { symbol: 'COFORGE', name: 'Coforge Limited', sector: 'IT Services' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Limited', sector: 'IT Services' },
  
  // Banking & Financial Services
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Limited', sector: 'Financial Services' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Limited', sector: 'Banking' },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Limited', sector: 'Banking' },
  { symbol: 'FEDERALBNK', name: 'Federal Bank Limited', sector: 'Banking' },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking' },
  { symbol: 'CANBK', name: 'Canara Bank', sector: 'Banking' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking' },
  
  // Pharmaceuticals
  { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'CIPLA', name: 'Cipla Limited', sector: 'Pharmaceuticals' },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'BIOCON', name: 'Biocon Limited', sector: 'Pharmaceuticals' },
  { symbol: 'LUPIN', name: 'Lupin Limited', sector: 'Pharmaceuticals' },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Limited', sector: 'Pharmaceuticals' },
  
  // Automobiles
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automobiles' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Limited', sector: 'Automobiles' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited', sector: 'Automobiles' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Limited', sector: 'Automobiles' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Limited', sector: 'Automobiles' },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company Limited', sector: 'Automobiles' },
  
  // Energy & Oil
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'GAIL', name: 'GAIL (India) Limited', sector: 'Oil & Gas' },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy Limited', sector: 'Renewable Energy' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Limited', sector: 'Infrastructure' },
  
  // FMCG & Consumer
  { symbol: 'BRITANNIA', name: 'Britannia Industries Limited', sector: 'FMCG' },
  { symbol: 'DABUR', name: 'Dabur India Limited', sector: 'FMCG' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Limited', sector: 'FMCG' },
  { symbol: 'MARICO', name: 'Marico Limited', sector: 'FMCG' },
  { symbol: 'COLPAL', name: 'Colgate-Palmolive (India) Limited', sector: 'FMCG' },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Limited', sector: 'FMCG' },
  
  // Metals & Mining
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', sector: 'Metals' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Limited', sector: 'Metals' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Limited', sector: 'Metals' },
  { symbol: 'VEDL', name: 'Vedanta Limited', sector: 'Metals & Mining' },
  { symbol: 'COALINDIA', name: 'Coal India Limited', sector: 'Mining' },
  { symbol: 'NMDC', name: 'NMDC Limited', sector: 'Mining' },
  
  // Telecom & Media
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Limited', sector: 'Airlines' },
  { symbol: 'ZOMATO', name: 'Zomato Limited', sector: 'Food Delivery' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Limited', sector: 'E-commerce' },
  { symbol: 'PAYTM', name: 'One 97 Communications Limited', sector: 'Fintech' },
  
  // Cement
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Limited', sector: 'Cement' },
  { symbol: 'SHREECEM', name: 'Shree Cement Limited', sector: 'Cement' },
  { symbol: 'GRASIM', name: 'Grasim Industries Limited', sector: 'Cement' },
  
  // Real Estate
  { symbol: 'DLF', name: 'DLF Limited', sector: 'Real Estate' },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Limited', sector: 'Real Estate' },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Limited', sector: 'Real Estate' },
  
  // Retail
  { symbol: 'DMART', name: 'Avenue Supermarts Limited', sector: 'Retail' },
  { symbol: 'TRENT', name: 'Trent Limited', sector: 'Retail' },
  
  // Additional popular stocks
  { symbol: 'ADANIENT', name: 'Adani Enterprises Limited', sector: 'Conglomerate' },
  { symbol: 'JIO', name: 'Reliance Jio Infocomm Limited', sector: 'Telecom' },
  { symbol: 'IRCTC', name: 'Indian Railway Catering and Tourism Corporation Limited', sector: 'Tourism' },
  
  // More IT & Technology
  { symbol: 'MINDTREELTD', name: 'Mindtree Limited', sector: 'IT Services' },
  { symbol: 'L&TTS', name: 'L&T Technology Services Limited', sector: 'IT Services' },
  { symbol: 'CYIENT', name: 'Cyient Limited', sector: 'IT Services' },
  { symbol: 'RATEGAIN', name: 'RateGain Travel Technologies Limited', sector: 'IT Services' },
  { symbol: 'KPITTECH', name: 'KPIT Technologies Limited', sector: 'IT Services' },
  { symbol: 'ZENSAR', name: 'Zensar Technologies Limited', sector: 'IT Services' },
  { symbol: 'NIITLTD', name: 'NIIT Limited', sector: 'IT Services' },
  { symbol: 'SONATSOFTW', name: 'Sonata Software Limited', sector: 'IT Services' },
  { symbol: 'RAMCOCEM', name: 'The Ramco Cements Limited', sector: 'Cement' },
  
  // More Banking & Financial Services
  { symbol: 'YESBANK', name: 'Yes Bank Limited', sector: 'Banking' },
  { symbol: 'RBLBANK', name: 'RBL Bank Limited', sector: 'Banking' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Limited', sector: 'Banking' },
  { symbol: 'SOUTHBANK', name: 'South Indian Bank Limited', sector: 'Banking' },
  { symbol: 'CITYUNIONB', name: 'City Union Bank Limited', sector: 'Banking' },
  { symbol: 'DCBBANK', name: 'DCB Bank Limited', sector: 'Banking' },
  { symbol: 'KARURBANK', name: 'Karur Vysya Bank Limited', sector: 'Banking' },
  { symbol: 'UJJIVAN', name: 'Ujjivan Financial Services Limited', sector: 'Financial Services' },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment and Finance Company Limited', sector: 'Financial Services' },
  { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial Services Limited', sector: 'Financial Services' },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Limited', sector: 'Financial Services' },
  { symbol: 'BAJAJHLDNG', name: 'Bajaj Holdings & Investment Limited', sector: 'Financial Services' },
  { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Limited', sector: 'Financial Services' },
  { symbol: 'HUDCO', name: 'Housing and Urban Development Corporation Limited', sector: 'Financial Services' },
  { symbol: 'PNBHOUSING', name: 'PNB Housing Finance Limited', sector: 'Financial Services' },
  
  // More Pharmaceuticals & Healthcare
  { symbol: 'ALKEM', name: 'Alkem Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'CADILAHC', name: 'Cadila Healthcare Limited', sector: 'Pharmaceuticals' },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'ABBOTINDIA', name: 'Abbott India Limited', sector: 'Pharmaceuticals' },
  { symbol: 'PFIZER', name: 'Pfizer Limited', sector: 'Pharmaceuticals' },
  { symbol: 'GLAXO', name: 'GlaxoSmithKline Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'SANOFI', name: 'Sanofi India Limited', sector: 'Pharmaceuticals' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Limited', sector: 'Healthcare' },
  { symbol: 'FORTIS', name: 'Fortis Healthcare Limited', sector: 'Healthcare' },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute Limited', sector: 'Healthcare' },
  { symbol: 'NARAYANHYD', name: 'Narayana Hrudayalaya Limited', sector: 'Healthcare' },
  { symbol: 'METROPOLIS', name: 'Metropolis Healthcare Limited', sector: 'Healthcare' },
  { symbol: 'THYROCARE', name: 'Thyrocare Technologies Limited', sector: 'Healthcare' },
  { symbol: 'KRBL', name: 'KRBL Limited', sector: 'FMCG' },
  
  // More Automobiles & Auto Components
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland Limited', sector: 'Automobiles' },
  { symbol: 'FORCEMOT', name: 'Force Motors Limited', sector: 'Automobiles' },
  { symbol: 'ESCORTS', name: 'Escorts Limited', sector: 'Automobiles' },
  { symbol: 'SONACOMS', name: 'Sona BLW Precision Forgings Limited', sector: 'Auto Components' },
  { symbol: 'MOTHERSON', name: 'Motherson Sumi Systems Limited', sector: 'Auto Components' },
  { symbol: 'BOSCHLTD', name: 'Bosch Limited', sector: 'Auto Components' },
  { symbol: 'MRF', name: 'MRF Limited', sector: 'Auto Components' },
  { symbol: 'APOLLOTYRE', name: 'Apollo Tyres Limited', sector: 'Auto Components' },
  { symbol: 'CEATLTD', name: 'CEAT Limited', sector: 'Auto Components' },
  { symbol: 'JKTYRE', name: 'JK Tyre & Industries Limited', sector: 'Auto Components' },
  { symbol: 'BALKRISIND', name: 'Balkrishna Industries Limited', sector: 'Auto Components' },
  { symbol: 'EXIDEIND', name: 'Exide Industries Limited', sector: 'Auto Components' },
  { symbol: 'AMARON', name: 'Amara Raja Batteries Limited', sector: 'Auto Components' },
  
  // More Metals & Mining
  { symbol: 'SAILLTD', name: 'Steel Authority of India Limited', sector: 'Metals' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Limited', sector: 'Metals' },
  { symbol: 'RATNAMANI', name: 'Ratnamani Metals & Tubes Limited', sector: 'Metals' },
  { symbol: 'WELCORP', name: 'Welspun Corp Limited', sector: 'Metals' },
  { symbol: 'NALCO', name: 'National Aluminium Company Limited', sector: 'Metals' },
  { symbol: 'JSWENERGY', name: 'JSW Energy Limited', sector: 'Power' },
  { symbol: 'NTPC', name: 'NTPC Limited', sector: 'Power' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Limited', sector: 'Power' },
  { symbol: 'NHPC', name: 'NHPC Limited', sector: 'Power' },
  { symbol: 'SJVN', name: 'SJVN Limited', sector: 'Power' },
  
  // More Consumer & Retail
  { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks Limited', sector: 'Food & Beverages' },
  { symbol: 'WESTLIFE', name: 'Westlife Development Limited', sector: 'Food & Beverages' },
  { symbol: 'DEVYANI', name: 'Devyani International Limited', sector: 'Food & Beverages' },
  { symbol: 'SAPPHIRE', name: 'Sapphire Foods India Limited', sector: 'Food & Beverages' },
  { symbol: 'RELAXO', name: 'Relaxo Footwears Limited', sector: 'Footwear' },
  { symbol: 'BATA', name: 'Bata India Limited', sector: 'Footwear' },
  { symbol: 'TITAN', name: 'Titan Company Limited', sector: 'Jewellery' },
  { symbol: 'KALYAN', name: 'Kalyan Jewellers India Limited', sector: 'Jewellery' },
  { symbol: 'TANISHQ', name: 'Tanishq (Titan)', sector: 'Jewellery' },
  { symbol: 'SHOPERSTOP', name: 'Shoppers Stop Limited', sector: 'Retail' },
  { symbol: 'SPENCERS', name: 'Spencer\'s Retail Limited', sector: 'Retail' },
  { symbol: 'FRETAIL', name: 'Future Retail Limited', sector: 'Retail' },
  
  // Textiles & Apparel
  { symbol: 'RAYMOND', name: 'Raymond Limited', sector: 'Textiles' },
  { symbol: 'ADITBIRIA', name: 'Aditya Birla Fashion and Retail Limited', sector: 'Textiles' },
  { symbol: 'PAGEIND', name: 'Page Industries Limited', sector: 'Textiles' },
  { symbol: 'TRIDENTLTD', name: 'Trident Limited', sector: 'Textiles' },
  { symbol: 'WELSPUN', name: 'Welspun India Limited', sector: 'Textiles' },
  { symbol: 'VARDHMAN', name: 'Vardhman Textiles Limited', sector: 'Textiles' },
  { symbol: 'SIYARAM', name: 'Siyaram Silk Mills Limited', sector: 'Textiles' },
  
  // Media & Entertainment
  { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises Limited', sector: 'Media' },
  { symbol: 'SUNTV', name: 'Sun TV Network Limited', sector: 'Media' },
  { symbol: 'BALAJITELE', name: 'Balaji Telefilms Limited', sector: 'Media' },
  { symbol: 'EROS', name: 'Eros International Media Limited', sector: 'Media' },
  { symbol: 'INOXLEISUR', name: 'INOX Leisure Limited', sector: 'Entertainment' },
  { symbol: 'PVR', name: 'PVR Limited', sector: 'Entertainment' },
  
  // Hotels & Tourism
  { symbol: 'INDIANHUME', name: 'Indian Hotels Company Limited', sector: 'Hotels' },
  { symbol: 'LEMONTREE', name: 'Lemon Tree Hotels Limited', sector: 'Hotels' },
  { symbol: 'CHALET', name: 'Chalet Hotels Limited', sector: 'Hotels' },
  { symbol: 'MAHLOG', name: 'Mahindra Logistics Limited', sector: 'Logistics' },
  { symbol: 'GATI', name: 'Gati Limited', sector: 'Logistics' },
  { symbol: 'CONCOR', name: 'Container Corporation of India Limited', sector: 'Logistics' },
  { symbol: 'BLUEDART', name: 'Blue Dart Express Limited', sector: 'Logistics' },
  
  // Agriculture & Food Processing
  { symbol: 'UBL', name: 'United Breweries Limited', sector: 'Beverages' },
  { symbol: 'RADICO', name: 'Radico Khaitan Limited', sector: 'Beverages' },
  { symbol: 'UNITED', name: 'United Spirits Limited', sector: 'Beverages' },
  { symbol: 'VARUNBEV', name: 'Varun Beverages Limited', sector: 'Beverages' },
  { symbol: 'CCCL', name: 'Coca-Cola (India)', sector: 'Beverages' },
  { symbol: 'PEPSICOLA', name: 'PepsiCo India', sector: 'Beverages' },
  { symbol: 'HERITAGE', name: 'Heritage Foods Limited', sector: 'Food Processing' },
  { symbol: 'HATSUN', name: 'Hatsun Agro Product Limited', sector: 'Food Processing' },
  { symbol: 'AVANTI', name: 'Avanti Feeds Limited', sector: 'Food Processing' },
  { symbol: 'VENKEYS', name: 'Venky\'s (India) Limited', sector: 'Food Processing' },
  
  // Chemicals & Fertilizers
  { symbol: 'PIDILITE', name: 'Pidilite Industries Limited', sector: 'Chemicals' },
  { symbol: 'ACRYSIL', name: 'Acrysil Limited', sector: 'Chemicals' },
  { symbol: 'AKZOINDIA', name: 'Akzo Nobel India Limited', sector: 'Chemicals' },
  { symbol: 'CHAMBLFERT', name: 'Chambal Fertilisers & Chemicals Limited', sector: 'Fertilizers' },
  { symbol: 'COROMANDEL', name: 'Coromandel International Limited', sector: 'Fertilizers' },
  { symbol: 'GNFC', name: 'Gujarat Narmada Valley Fertilizers & Chemicals Limited', sector: 'Fertilizers' },
  { symbol: 'GSFC', name: 'Gujarat State Fertilizers & Chemicals Limited', sector: 'Fertilizers' },
  { symbol: 'DEEPAKNTR', name: 'Deepak Nitrite Limited', sector: 'Chemicals' },
  { symbol: 'TATACHEM', name: 'Tata Chemicals Limited', sector: 'Chemicals' },
  { symbol: 'GALAXYSURF', name: 'Galaxy Surfactants Limited', sector: 'Chemicals' },
  
  // Engineering & Capital Goods
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals Limited', sector: 'Capital Goods' },
  { symbol: 'BEL', name: 'Bharat Electronics Limited', sector: 'Defense' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Limited', sector: 'Defense' },
  { symbol: 'GRSE', name: 'Garden Reach Shipbuilders & Engineers Limited', sector: 'Defense' },
  { symbol: 'BEML', name: 'BEML Limited', sector: 'Capital Goods' },
  { symbol: 'THERMAX', name: 'Thermax Limited', sector: 'Capital Goods' },
  { symbol: 'KECL', name: 'KEC International Limited', sector: 'Capital Goods' },
  { symbol: 'ABB', name: 'ABB India Limited', sector: 'Capital Goods' },
  { symbol: 'SIEMENS', name: 'Siemens Limited', sector: 'Capital Goods' },
  { symbol: 'CROMPTON', name: 'Crompton Greaves Consumer Electricals Limited', sector: 'Electricals' },
  { symbol: 'HAVELLS', name: 'Havells India Limited', sector: 'Electricals' },
  { symbol: 'POLYCAB', name: 'Polycab India Limited', sector: 'Electricals' },
  { symbol: 'FINOLEX', name: 'Finolex Cables Limited', sector: 'Electricals' },
  
  // New Age & Tech Companies
  { symbol: 'POLICYBZR', name: 'PB Fintech Limited', sector: 'Fintech' },
  { symbol: 'NAUKRI', name: 'Info Edge (India) Limited', sector: 'Internet' },
  { symbol: 'JUSTDIAL', name: 'Just Dial Limited', sector: 'Internet' },
  { symbol: 'MATRIMONY', name: 'Matrimony.com Limited', sector: 'Internet' },
  { symbol: 'CARTRADE', name: 'CarTrade Tech Limited', sector: 'Internet' },
  { symbol: 'EASEMYTRIP', name: 'Easy Trip Planners Limited', sector: 'Travel Tech' },
  { symbol: 'IDEAFORGE', name: 'ideaForge Technology Limited', sector: 'Drones' },
  { symbol: 'CAMPUS', name: 'Campus Activewear Limited', sector: 'Footwear' },
  
  // Additional PSUs
  { symbol: 'IRCON', name: 'Ircon International Limited', sector: 'Construction' },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Limited', sector: 'Construction' },
  { symbol: 'NBCC', name: 'NBCC (India) Limited', sector: 'Construction' },
  { symbol: 'RAILTEL', name: 'RailTel Corporation of India Limited', sector: 'Telecom' },
  { symbol: 'MAZAGON', name: 'Mazagon Dock Shipbuilders Limited', sector: 'Defense' },
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard Limited', sector: 'Defense' },
  { symbol: 'INDIANB', name: 'Indian Bank', sector: 'Banking' },
  { symbol: 'UNIONBANK', name: 'Union Bank of India', sector: 'Banking' },
  { symbol: 'CENTRALBK', name: 'Central Bank of India', sector: 'Banking' },
  { symbol: 'INDIANOVS', name: 'Indian Overseas Bank', sector: 'Banking' },
  
  // More Regional & Private Banks
  { symbol: 'TMVL', name: 'TMB Limited', sector: 'Banking' },
  { symbol: 'JKBANK', name: 'Jammu & Kashmir Bank Limited', sector: 'Banking' },
  { symbol: 'KTKBANK', name: 'Karnataka Bank Limited', sector: 'Banking' },
  { symbol: 'DHANBK', name: 'Dhanlaxmi Bank Limited', sector: 'Banking' },
  { symbol: 'NKGSB', name: 'NKGSB Co-operative Bank Limited', sector: 'Banking' },
  { symbol: 'LAKSHMIBNK', name: 'Lakshmi Vilas Bank Limited', sector: 'Banking' },
  { symbol: 'EQUITAS', name: 'Equitas Small Finance Bank Limited', sector: 'Banking' },
  { symbol: 'ESAFSFB', name: 'ESAF Small Finance Bank Limited', sector: 'Banking' },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank Limited', sector: 'Banking' },
  { symbol: 'UJJIVANSFB', name: 'Ujjivan Small Finance Bank Limited', sector: 'Banking' },
  { symbol: 'FINCABLES', name: 'Fincare Small Finance Bank Limited', sector: 'Banking' },
  { symbol: 'SURYODAY', name: 'Suryoday Small Finance Bank Limited', sector: 'Banking' },
  
  // More NBFCs & Financial Services
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Limited', sector: 'Financial Services' },
  { symbol: 'MANAPPURAM', name: 'Manappuram Finance Limited', sector: 'Financial Services' },
  { symbol: 'EDELWEISS', name: 'Edelweiss Financial Services Limited', sector: 'Financial Services' },
  { symbol: 'MOTILALOFS', name: 'Motilal Oswal Financial Services Limited', sector: 'Financial Services' },
  { symbol: 'ANGELONE', name: 'Angel One Limited', sector: 'Financial Services' },
  { symbol: 'IIFL', name: 'IIFL Finance Limited', sector: 'Financial Services' },
  { symbol: 'REPCO', name: 'Repco Home Finance Limited', sector: 'Financial Services' },
  { symbol: 'CANFINHOME', name: 'Can Fin Homes Limited', sector: 'Financial Services' },
  { symbol: 'GRUH', name: 'Gruh Finance Limited', sector: 'Financial Services' },
  { symbol: 'APTUS', name: 'Aptus Value Housing Finance India Limited', sector: 'Financial Services' },
  { symbol: 'HOMEFIRST', name: 'Home First Finance Company India Limited', sector: 'Financial Services' },
  { symbol: 'CREDITACC', name: 'Credit Access Grameen Limited', sector: 'Financial Services' },
  { symbol: 'SPANDANA', name: 'Spandana Sphoorty Financial Limited', sector: 'Financial Services' },
  
  // More Specialty Chemicals & Materials
  { symbol: 'SRF', name: 'SRF Limited', sector: 'Chemicals' },
  { symbol: 'AAVAS', name: 'Aavas Financiers Limited', sector: 'Financial Services' },
  { symbol: 'CLEAN', name: 'Clean Science and Technology Limited', sector: 'Chemicals' },
  { symbol: 'ROSSARI', name: 'Rossari Biotech Limited', sector: 'Chemicals' },
  { symbol: 'CHEMCON', name: 'Chemcon Speciality Chemicals Limited', sector: 'Chemicals' },
  { symbol: 'FINEORG', name: 'Fine Organic Industries Limited', sector: 'Chemicals' },
  { symbol: 'VINATI', name: 'Vinati Organics Limited', sector: 'Chemicals' },
  { symbol: 'NOCIL', name: 'NOCIL Limited', sector: 'Chemicals' },
  { symbol: 'ALKYLAMINE', name: 'Alkyl Amines Chemicals Limited', sector: 'Chemicals' },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Limited', sector: 'IT Services' },
  { symbol: 'INTELLECT', name: 'Intellect Design Arena Limited', sector: 'IT Services' },
  { symbol: 'NEWGEN', name: 'Newgen Software Technologies Limited', sector: 'IT Services' },
  { symbol: 'SUBEX', name: 'Subex Limited', sector: 'IT Services' },
  
  // More Infrastructure & Construction
  { symbol: 'IRB', name: 'IRB Infrastructure Developers Limited', sector: 'Infrastructure' },
  { symbol: 'SADBHAV', name: 'Sadbhav Engineering Limited', sector: 'Construction' },
  { symbol: 'DILIPBUILD', name: 'Dilip Buildcon Limited', sector: 'Construction' },
  { symbol: 'GMELINFRA', name: 'GMR Infrastructure Limited', sector: 'Infrastructure' },
  { symbol: 'GICRE', name: 'General Insurance Corporation of India', sector: 'Insurance' },
  { symbol: 'NIACL', name: 'The New India Assurance Company Limited', sector: 'Insurance' },
  { symbol: 'ORIENTALINS', name: 'The Oriental Insurance Company Limited', sector: 'Insurance' },
  { symbol: 'UIIC', name: 'United India Insurance Company Limited', sector: 'Insurance' },
  { symbol: 'STARHEALTH', name: 'Star Health and Allied Insurance Company Limited', sector: 'Insurance' },
  { symbol: 'GODIGIT', name: 'Go Digit General Insurance Limited', sector: 'Insurance' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Limited', sector: 'Insurance' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Limited', sector: 'Insurance' },
  { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance Company Limited', sector: 'Insurance' },
  { symbol: 'MAXLIFE', name: 'Max Life Insurance Company Limited', sector: 'Insurance' },
  
  // More Renewable Energy & Power
  { symbol: 'ADANIPOWER', name: 'Adani Power Limited', sector: 'Power' },
  { symbol: 'JSPOWERTRANS', name: 'JSW Infrastructure Limited', sector: 'Infrastructure' },
  { symbol: 'RENUKA', name: 'Shree Renuka Sugars Limited', sector: 'Sugar' },
  { symbol: 'BALRAMCHIN', name: 'Balrampur Chini Mills Limited', sector: 'Sugar' },
  { symbol: 'DHAMPUR', name: 'Dhampur Sugar Mills Limited', sector: 'Sugar' },
  { symbol: 'BAJAJHIND', name: 'Bajaj Hindusthan Sugar Limited', sector: 'Sugar' },
  { symbol: 'SUZLON', name: 'Suzlon Energy Limited', sector: 'Renewable Energy' },
  { symbol: 'INOXWIND', name: 'Inox Wind Limited', sector: 'Renewable Energy' },
  { symbol: 'ORIENTGREEN', name: 'Orient Green Power Company Limited', sector: 'Renewable Energy' },
  { symbol: 'WEBSOL', name: 'Websol Energy System Limited', sector: 'Renewable Energy' },
  { symbol: 'VIKASECO', name: 'Vikas EcoTech Limited', sector: 'Renewable Energy' },
  
  // More Pharmaceuticals & Biotechnology
  { symbol: 'STRIDES', name: 'Strides Pharma Science Limited', sector: 'Pharmaceuticals' },
  { symbol: 'LAURUS', name: 'Laurus Labs Limited', sector: 'Pharmaceuticals' },
  { symbol: 'NEULAND', name: 'Neuland Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'DIVIS', name: 'Divis Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'GRANULES', name: 'Granules India Limited', sector: 'Pharmaceuticals' },
  { symbol: 'NATCOPHAR', name: 'Natco Pharma Limited', sector: 'Pharmaceuticals' },
  { symbol: 'BLISSGVS', name: 'Bliss GVS Pharma Limited', sector: 'Pharmaceuticals' },
  { symbol: 'CAPLIPOINT', name: 'Caplin Point Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'INDOCO', name: 'Indoco Remedies Limited', sector: 'Pharmaceuticals' },
  { symbol: 'JBCHEPHARM', name: 'JB Chemicals & Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'SOLARA', name: 'Solara Active Pharma Sciences Limited', sector: 'Pharmaceuticals' },
  { symbol: 'SEQUENT', name: 'Sequent Scientific Limited', sector: 'Pharmaceuticals' },
  { symbol: 'ERIS', name: 'Eris Lifesciences Limited', sector: 'Pharmaceuticals' },
  { symbol: 'SUVEN', name: 'Suven Life Sciences Limited', sector: 'Pharmaceuticals' },
  
  // More Consumer Goods & FMCG
  { symbol: 'EMAMI', name: 'Emami Limited', sector: 'FMCG' },
  { symbol: 'JYOTHYLAB', name: 'Jyothy Labs Limited', sector: 'FMCG' },
  { symbol: 'HONASA', name: 'Honasa Consumer Limited', sector: 'FMCG' },
  { symbol: 'VADILAL', name: 'Vadilal Industries Limited', sector: 'FMCG' },
  { symbol: 'ZYDUSWELL', name: 'Zydus Wellness Limited', sector: 'FMCG' },
  { symbol: 'VBLLTD', name: 'Varun Beverages Limited', sector: 'Beverages' },
  { symbol: 'TATAGLOB', name: 'Tata Global Beverages Limited', sector: 'Beverages' },
  { symbol: 'PRATAAP', name: 'Prataap Snacks Limited', sector: 'Food Processing' },
  { symbol: 'BIKAJI', name: 'Bikaji Foods International Limited', sector: 'Food Processing' },
  { symbol: 'MADHUR', name: 'Madhur Industries Limited', sector: 'Food Processing' },
  { symbol: 'AGRITECH', name: 'Agri-Tech (India) Limited', sector: 'Agriculture' },
  
  // More Textiles & Garments
  { symbol: 'GOKEX', name: 'Gokaldas Exports Limited', sector: 'Textiles' },
  { symbol: 'RSWM', name: 'RSWM Limited', sector: 'Textiles' },
  { symbol: 'SPENTEX', name: 'Spentex Industries Limited', sector: 'Textiles' },
  { symbol: 'TEXRAIL', name: 'Texmaco Rail & Engineering Limited', sector: 'Textiles' },
  { symbol: 'KESORAMIND', name: 'Kesoram Industries Limited', sector: 'Textiles' },
  { symbol: 'ALOKTEXT', name: 'Alok Textiles Limited', sector: 'Textiles' },
  { symbol: 'WEIZMANN', name: 'Weizmann Limited', sector: 'Textiles' },
  { symbol: 'SUTLEJ', name: 'Sutlej Textiles and Industries Limited', sector: 'Textiles' },
  { symbol: 'ORIENTBELL', name: 'Orient Bell Limited', sector: 'Ceramics' },
  { symbol: 'CERA', name: 'Cera Sanitaryware Limited', sector: 'Ceramics' },
  { symbol: 'HINDWARE', name: 'Hindware Home Innovation Limited', sector: 'Consumer Durables' },
  
  // More Technology & Software
  { symbol: 'ROUTE', name: 'Route Mobile Limited', sector: 'IT Services' },
  { symbol: 'HAPPIEST', name: 'Happiest Minds Technologies Limited', sector: 'IT Services' },
  { symbol: 'LATENTVIEW', name: 'LatentView Analytics Limited', sector: 'IT Services' },
  { symbol: 'BIRLASOFT', name: 'Birlasoft Limited', sector: 'IT Services' },
  { symbol: 'VAKRANGEE', name: 'Vakrangee Limited', sector: 'IT Services' },
  { symbol: 'RPOWER', name: 'Reliance Power Limited', sector: 'Power' },
  { symbol: 'COMPUAGE', name: 'Compuage Infocom Limited', sector: 'IT Services' },
  { symbol: 'ONMOBILE', name: 'OnMobile Global Limited', sector: 'IT Services' },
  { symbol: 'DATAPATTERN', name: 'Data Patterns (India) Limited', sector: 'IT Services' },
  { symbol: 'CGPOWER', name: 'CG Power and Industrial Solutions Limited', sector: 'Electricals' },
  { symbol: 'VOLTAMP', name: 'Voltamp Transformers Limited', sector: 'Electricals' },
  { symbol: 'INDIANHUME', name: 'Indian Hume Pipe Company Limited', sector: 'Infrastructure' },
  { symbol: 'HINDCOPPER', name: 'Hindustan Copper Limited', sector: 'Metals' },
  
  // More Agro & Food
  { symbol: 'RUCHI', name: 'Ruchi Soya Industries Limited', sector: 'Edible Oil' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Limited', sector: 'Ports' },
  { symbol: 'JTEKTINDIA', name: 'JTEKT India Limited', sector: 'Auto Components' },
  { symbol: 'SUNDRMFAST', name: 'Sundram Fasteners Limited', sector: 'Auto Components' },
  { symbol: 'ENDURANCE', name: 'Endurance Technologies Limited', sector: 'Auto Components' },
  { symbol: 'FIEM', name: 'Fiem Industries Limited', sector: 'Auto Components' },
  { symbol: 'LUMAX', name: 'Lumax Industries Limited', sector: 'Auto Components' },
  { symbol: 'TIINDIA', name: 'Tube Investments of India Limited', sector: 'Auto Components' },
  { symbol: 'WHEELS', name: 'Wheels India Limited', sector: 'Auto Components' },
  { symbol: 'IGARASHI', name: 'Igarashi Motors India Limited', sector: 'Auto Components' },
  { symbol: 'SUPRAJIT', name: 'Suprajit Engineering Limited', sector: 'Auto Components' },
  
  // More Logistics & Transportation
  { symbol: 'VTL', name: 'Vardhman Textiles Limited', sector: 'Logistics' },
  { symbol: 'ALLCARGO', name: 'Allcargo Logistics Limited', sector: 'Logistics' },
  { symbol: 'TCI', name: 'Transport Corporation of India Limited', sector: 'Logistics' },
  { symbol: 'AEGISCHEM', name: 'Aegis Logistics Limited', sector: 'Logistics' },
  { symbol: 'SNOWMAN', name: 'Snowman Logistics Limited', sector: 'Logistics' },
  { symbol: 'REDINGTON', name: 'Redington (India) Limited', sector: 'IT Distribution' },
  { symbol: 'RCOM', name: 'Reliance Communications Limited', sector: 'Telecom' },
  { symbol: 'GTLINFRA', name: 'GTL Infrastructure Limited', sector: 'Telecom Infrastructure' },
  { symbol: 'VINAYKUMAR', name: 'Vinayak Kumar Corporation Limited', sector: 'Telecom' },
  
  // More Aviation & Tourism
  { symbol: 'SPICEJET', name: 'SpiceJet Limited', sector: 'Airlines' },
  { symbol: 'MAHINDRA', name: 'Mahindra Holidays & Resorts India Limited', sector: 'Tourism' },
  { symbol: 'COX&KINGS', name: 'Cox & Kings Limited', sector: 'Tourism' },
  { symbol: 'THOMAS', name: 'Thomas Cook (India) Limited', sector: 'Tourism' },
  { symbol: 'SOTL', name: 'Shanti Overseas (India) Limited', sector: 'Tourism' },
  
  // More Specialty & Niche Companies
  { symbol: 'CARBORUNIV', name: 'Carborundum Universal Limited', sector: 'Abrasives' },
  { symbol: 'GRINDWELL', name: 'Grindwell Norton Limited', sector: 'Abrasives' },
  { symbol: 'TIMKEN', name: 'Timken India Limited', sector: 'Bearings' },
  { symbol: 'SCHAEFFLER', name: 'Schaeffler India Limited', sector: 'Bearings' },
  { symbol: 'SUPEREIGHT', name: 'Supereight India Limited', sector: 'Packaging' },
  { symbol: 'UFLEX', name: 'Uflex Limited', sector: 'Packaging' },
  { symbol: 'TCNSBRANDS', name: 'TCNS Clothing Co. Limited', sector: 'Fashion' },
  { symbol: 'VMART', name: 'V-Mart Retail Limited', sector: 'Retail' },
  { symbol: 'INDIAMART', name: 'IndiaMART InterMESH Limited', sector: 'B2B Commerce' },
  { symbol: 'RATEGAIN', name: 'RateGain Travel Technologies Limited', sector: 'Travel Tech' },
  { symbol: 'CHEMPLAST', name: 'Chemplast Sanmar Limited', sector: 'Chemicals' },
  { symbol: 'HEIDELBERG', name: 'HeidelbergCement India Limited', sector: 'Cement' },
  { symbol: 'PRISM', name: 'Prism Johnson Limited', sector: 'Cement' },
  { symbol: 'JKCEMENT', name: 'JK Cement Limited', sector: 'Cement' },
  { symbol: 'AMBUJACEMENT', name: 'Ambuja Cements Limited', sector: 'Cement' },
  { symbol: 'ACC', name: 'ACC Limited', sector: 'Cement' },
  { symbol: 'ORIENTCEM', name: 'Orient Cement Limited', sector: 'Cement' },
  { symbol: 'INDIACEM', name: 'The India Cements Limited', sector: 'Cement' },
  { symbol: 'DALMIASUGAR', name: 'Dalmia Bharat Sugar and Industries Limited', sector: 'Sugar' },
  { symbol: 'KSCL', name: 'Kaveri Seed Company Limited', sector: 'Seeds' },
  { symbol: 'RALLIS', name: 'Rallis India Limited', sector: 'Agrochemicals' },
  { symbol: 'UPL', name: 'UPL Limited', sector: 'Agrochemicals' },
  { symbol: 'ZUARI', name: 'Zuari Agro Chemicals Limited', sector: 'Agrochemicals' },
  { symbol: 'INSECTICIDE', name: 'Insecticides (India) Limited', sector: 'Agrochemicals' },
  
  // More PSU & Government Companies
  { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'GAIL', name: 'GAIL (India) Limited', sector: 'Oil & Gas' },
  { symbol: 'IOCL', name: 'Indian Oil Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'MRPL', name: 'Mangalore Refinery and Petrochemicals Limited', sector: 'Oil & Gas' },
  { symbol: 'CPCL', name: 'Chennai Petroleum Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'NRL', name: 'Numaligarh Refinery Limited', sector: 'Oil & Gas' },
  { symbol: 'BONGAIGAON', name: 'Bongaigaon Refinery & Petrochemicals Limited', sector: 'Oil & Gas' },
  { symbol: 'OIL', name: 'Oil India Limited', sector: 'Oil & Gas' },
  { symbol: 'RECLTD', name: 'Rural Electrification Corporation Limited', sector: 'Financial Services' },
  { symbol: 'PFC', name: 'Power Finance Corporation Limited', sector: 'Financial Services' },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corporation Limited', sector: 'Financial Services' },
  { symbol: 'NHPC', name: 'NHPC Limited', sector: 'Power' },
  { symbol: 'THDC', name: 'Tehri Hydro Development Corporation Limited', sector: 'Power' },
  { symbol: 'NEEPCO', name: 'North Eastern Electric Power Corporation Limited', sector: 'Power' },
  { symbol: 'NHDC', name: 'NHDC Limited', sector: 'Power' },
  { symbol: 'KPIL', name: 'Kalpataru Power Transmission Limited', sector: 'Power' },
  { symbol: 'KEC', name: 'KEC International Limited', sector: 'Power' },
  
  // More Real Estate & Housing
  { symbol: 'BRIGADE', name: 'Brigade Enterprises Limited', sector: 'Real Estate' },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects Limited', sector: 'Real Estate' },
  { symbol: 'PHOENIX', name: 'The Phoenix Mills Limited', sector: 'Real Estate' },
  { symbol: 'SUNTECK', name: 'Sunteck Realty Limited', sector: 'Real Estate' },
  { symbol: 'MAHLIFE', name: 'Mahindra Lifespace Developers Limited', sector: 'Real Estate' },
  { symbol: 'SOBHA', name: 'Sobha Limited', sector: 'Real Estate' },
  { symbol: 'KOLTE', name: 'Kolte-Patil Developers Limited', sector: 'Real Estate' },
  { symbol: 'ROHAN', name: 'Rohan Industries Limited', sector: 'Real Estate' },
  { symbol: 'ANANTRAJ', name: 'Anant Raj Limited', sector: 'Real Estate' },
  { symbol: 'UNITECH', name: 'Unitech Limited', sector: 'Real Estate' },
  { symbol: 'SUPERTECH', name: 'Supertech Limited', sector: 'Real Estate' },
  { symbol: 'IREO', name: 'IREO Limited', sector: 'Real Estate' },
  
  // More Mid & Small Cap IT Companies
  { symbol: 'MASTEK', name: 'Mastek Limited', sector: 'IT Services' },
  { symbol: 'ROLTA', name: 'Rolta India Limited', sector: 'IT Services' },
  { symbol: 'GEOMETRIC', name: 'Geometric Limited', sector: 'IT Services' },
  { symbol: 'HEXAWARE', name: 'Hexaware Technologies Limited', sector: 'IT Services' },
  { symbol: 'MINDSPACE', name: 'Mindspace Business Parks REIT', sector: 'IT Services' },
  { symbol: 'POLARIS', name: 'Polaris Software Lab Limited', sector: 'IT Services' },
  { symbol: 'RAMCO', name: 'Ramco Systems Limited', sector: 'IT Services' },
  { symbol: 'NUCLEUS', name: 'Nucleus Software Exports Limited', sector: 'IT Services' },
  { symbol: 'RATEGAIN', name: 'RateGain Travel Technologies Limited', sector: 'IT Services' },
  { symbol: 'TANLA', name: 'Tanla Platforms Limited', sector: 'IT Services' },
  { symbol: 'SAKSOFT', name: 'Saksoft Limited', sector: 'IT Services' },
  { symbol: 'NIITTECH', name: 'NIIT Technologies Limited', sector: 'IT Services' },
  { symbol: 'ECLERX', name: 'eClerx Services Limited', sector: 'IT Services' },
  { symbol: 'INFIBEAM', name: 'Infibeam Avenues Limited', sector: 'IT Services' },
  
  // More Engineering & Capital Goods
  { symbol: 'CUMMINS', name: 'Cummins India Limited', sector: 'Capital Goods' },
  { symbol: 'GREAVES', name: 'Greaves Cotton Limited', sector: 'Capital Goods' },
  { symbol: 'BHARAT', name: 'Bharat Dynamics Limited', sector: 'Defense' },
  { symbol: 'MIDHANI', name: 'Mishra Dhatu Nigam Limited', sector: 'Defense' },
  { symbol: 'ASTRA', name: 'Astra Microwave Products Limited', sector: 'Defense' },
  { symbol: 'PARAS', name: 'Paras Defence and Space Technologies Limited', sector: 'Defense' },
  { symbol: 'MUNOTH', name: 'Munoth Industries Limited', sector: 'Capital Goods' },
  { symbol: 'KIRLOSKAR', name: 'Kirloskar Industries Limited', sector: 'Capital Goods' },
  { symbol: 'KIRLPNU', name: 'Kirloskar Pneumatic Company Limited', sector: 'Capital Goods' },
  { symbol: 'KIRLFER', name: 'Kirloskar Ferrous Industries Limited', sector: 'Capital Goods' },
  { symbol: 'KIRLOSH', name: 'Kirloskar Oil Engines Limited', sector: 'Capital Goods' },
  { symbol: 'TEXMACO', name: 'Texmaco Rail & Engineering Limited', sector: 'Capital Goods' },
  { symbol: 'ELECON', name: 'Elecon Engineering Company Limited', sector: 'Capital Goods' },
  { symbol: 'MUKANDLTD', name: 'Mukand Limited', sector: 'Capital Goods' },
  
  // More Chemical & Specialty Companies
  { symbol: 'GUJALKALI', name: 'Gujarat Alkalies and Chemicals Limited', sector: 'Chemicals' },
  { symbol: 'FLUOROCHEM', name: 'Gujarat Fluorochemicals Limited', sector: 'Chemicals' },
  { symbol: 'NAVINFLUO', name: 'Navin Fluorine International Limited', sector: 'Chemicals' },
  { symbol: 'ATUL', name: 'Atul Limited', sector: 'Chemicals' },
  { symbol: 'BALRAMCHIN', name: 'Balrampur Chini Mills Limited', sector: 'Chemicals' },
  { symbol: 'DCMSHRIRAM', name: 'DCM Shriram Limited', sector: 'Chemicals' },
  { symbol: 'GHCL', name: 'GHCL Limited', sector: 'Chemicals' },
  { symbol: 'HATSUN', name: 'Hatsun Agro Product Limited', sector: 'Chemicals' },
  { symbol: 'HINDPETRO', name: 'Hindustan Petroleum Corporation Limited', sector: 'Chemicals' },
  { symbol: 'IPCALAB', name: 'IPCA Laboratories Limited', sector: 'Chemicals' },
  { symbol: 'JAYANT', name: 'Jayant Agro-Organics Limited', sector: 'Chemicals' },
  { symbol: 'KANSAINER', name: 'Kansai Nerolac Paints Limited', sector: 'Paints' },
  { symbol: 'BERGER', name: 'Berger Paints India Limited', sector: 'Paints' },
  { symbol: 'SHEELA', name: 'Sheela Foam Limited', sector: 'Chemicals' },
  { symbol: 'SHALBY', name: 'Shalby Limited', sector: 'Healthcare' },
  
  // More Textile & Apparel Companies
  { symbol: 'GRASIM', name: 'Grasim Industries Limited', sector: 'Textiles' },
  { symbol: 'INDHOTEL', name: 'The Indian Hotels Company Limited', sector: 'Textiles' },
  { symbol: 'CENTURY', name: 'Century Textiles & Industries Limited', sector: 'Textiles' },
  { symbol: 'ROHDE', name: 'Rohde & Schwarz India Limited', sector: 'Textiles' },
  { symbol: 'LAKSHMI', name: 'Lakshmi Machine Works Limited', sector: 'Textiles' },
  { symbol: 'BANSWARA', name: 'Banswara Syntex Limited', sector: 'Textiles' },
  { symbol: 'DONEAR', name: 'Donear Industries Limited', sector: 'Textiles' },
  { symbol: 'FILATEX', name: 'Filatex India Limited', sector: 'Textiles' },
  { symbol: 'GARWARE', name: 'Garware Technical Fibres Limited', sector: 'Textiles' },
  { symbol: 'HIMATSEIDE', name: 'Himatsingka Seide Limited', sector: 'Textiles' },
  { symbol: 'INDORAMA', name: 'Indo Rama Synthetics (India) Limited', sector: 'Textiles' },
  { symbol: 'JBFIND', name: 'JBF Industries Limited', sector: 'Textiles' },
  { symbol: 'NIKHIL', name: 'Nikhil Adhesives Limited', sector: 'Textiles' },
  { symbol: 'NIFTY', name: 'Nifty Limited', sector: 'Textiles' },
  
  // More Food & Beverages
  { symbol: 'GSKCONS', name: 'GlaxoSmithKline Consumer Healthcare Limited', sector: 'FMCG' },
  { symbol: 'GILLETTE', name: 'Gillette India Limited', sector: 'FMCG' },
  { symbol: 'VBL', name: 'Varun Beverages Limited', sector: 'Beverages' },
  { symbol: 'KHAITANLTD', name: 'Khaitan (India) Limited', sector: 'Beverages' },
  { symbol: 'KWALITY', name: 'Kwality Limited', sector: 'Food Processing' },
  { symbol: 'DYNAMATIC', name: 'Dynamatic Technologies Limited', sector: 'Food Processing' },
  { symbol: 'MILKFOOD', name: 'Milk Food Limited', sector: 'Food Processing' },
  { symbol: 'MODERN', name: 'Modern Dairies Limited', sector: 'Food Processing' },
  { symbol: 'PARAG', name: 'Parag Milk Foods Limited', sector: 'Food Processing' },
  { symbol: 'RKDL', name: 'Ruchi Soya Industries Limited', sector: 'Food Processing' },
  { symbol: 'TASTE', name: 'Tasty Bite Eatables Limited', sector: 'Food Processing' },
  { symbol: 'VADILAL', name: 'Vadilal Industries Limited', sector: 'Food Processing' },
  { symbol: 'WONDERLA', name: 'Wonderla Holidays Limited', sector: 'Entertainment' },
  
  // More Auto & Auto Components
  { symbol: 'MAHSCOOTER', name: 'Maharashtra Scooters Limited', sector: 'Automobiles' },
  { symbol: 'FORCEMOT', name: 'Force Motors Limited', sector: 'Automobiles' },
  { symbol: 'BAJAJCON', name: 'Bajaj Consumer Care Limited', sector: 'Auto Components' },
  { symbol: 'WABCO', name: 'WABCO India Limited', sector: 'Auto Components' },
  { symbol: 'SHANKARA', name: 'Shankara Building Products Limited', sector: 'Auto Components' },
  { symbol: 'GABRIEL', name: 'Gabriel India Limited', sector: 'Auto Components' },
  { symbol: 'MAHLE', name: 'MAHLE Filter Systems India Limited', sector: 'Auto Components' },
  { symbol: 'UCAL', name: 'UCAL Fuel Systems Limited', sector: 'Auto Components' },
  { symbol: 'SANDHAR', name: 'Sandhar Technologies Limited', sector: 'Auto Components' },
  { symbol: 'SETCO', name: 'Setco Automotive Limited', sector: 'Auto Components' },
  { symbol: 'AUTOAXLES', name: 'Automotive Axles Limited', sector: 'Auto Components' },
  { symbol: 'CAPRICORN', name: 'Capricorn Technologies Limited', sector: 'Auto Components' },
  { symbol: 'VAIBHAV', name: 'Vaibhav Global Limited', sector: 'Auto Components' },
  { symbol: 'WHEELS', name: 'Wheels India Limited', sector: 'Auto Components' },
  { symbol: 'ZF', name: 'ZF Commercial Vehicle Control Systems India Limited', sector: 'Auto Components' },
  
  // More Metals & Mining
  { symbol: 'MOIL', name: 'MOIL Limited', sector: 'Mining' },
  { symbol: 'GMDC', name: 'Gujarat Mineral Development Corporation Limited', sector: 'Mining' },
  { symbol: 'KIOCL', name: 'KIOCL Limited', sector: 'Mining' },
  { symbol: 'MANGALORE', name: 'Mangalore Chemicals & Fertilizers Limited', sector: 'Mining' },
  { symbol: 'ORISSA', name: 'Orissa Minerals Development Company Limited', sector: 'Mining' },
  { symbol: 'RSMINING', name: 'RS Mining Corporation Limited', sector: 'Mining' },
  { symbol: 'SESHAGIRI', name: 'Seshagiri Rao Sugar & Allied Industries Limited', sector: 'Mining' },
  { symbol: 'BALCO', name: 'Bharat Aluminium Company Limited', sector: 'Metals' },
  { symbol: 'FACOR', name: 'Facor Alloys Limited', sector: 'Metals' },
  { symbol: 'FERRO', name: 'Ferro Alloys Corporation Limited', sector: 'Metals' },
  { symbol: 'ISPAT', name: 'Ispat Industries Limited', sector: 'Metals' },
  { symbol: 'LLOYDS', name: 'Lloyds Metals and Energy Limited', sector: 'Metals' },
  { symbol: 'MUKAND', name: 'Mukand Limited', sector: 'Metals' },
  { symbol: 'OPTIEMUS', name: 'Optiemus Infracom Limited', sector: 'Metals' },
  { symbol: 'PENNAR', name: 'Pennar Industries Limited', sector: 'Metals' },
  { symbol: 'SAIL', name: 'Steel Authority of India Limited', sector: 'Metals' },
  { symbol: 'WELCORP', name: 'Welspun Corp Limited', sector: 'Metals' },
  
  // More Emerging & New Age Companies
  { symbol: 'BYJUS', name: 'Think & Learn Private Limited (Byju\'s)', sector: 'EdTech' },
  { symbol: 'SWIGGY', name: 'Bundl Technologies Private Limited (Swiggy)', sector: 'Food Delivery' },
  { symbol: 'PHONEPE', name: 'PhonePe Private Limited', sector: 'Fintech' },
  { symbol: 'CRED', name: 'Dreamplug Technologies Private Limited (CRED)', sector: 'Fintech' },
  { symbol: 'UPSTOX', name: 'RKSV Securities India Private Limited (Upstox)', sector: 'Fintech' },
  { symbol: 'ZERODHA', name: 'Zerodha Broking Limited', sector: 'Fintech' },
  { symbol: 'GROWW', name: 'Nextbillion Technology Private Limited (Groww)', sector: 'Fintech' },
  { symbol: 'VEDANTU', name: 'Vedantu Innovations Private Limited', sector: 'EdTech' },
  { symbol: 'UNACADEMY', name: 'Sorting Hat Technologies Private Limited (Unacademy)', sector: 'EdTech' },
  { symbol: 'MEESHO', name: 'Fashnear Technologies Private Limited (Meesho)', sector: 'E-commerce' },
  { symbol: 'OYO', name: 'Oravel Stays Private Limited (OYO)', sector: 'Hospitality' },
  { symbol: 'LENSKART', name: 'Valyoo Technologies Private Limited (Lenskart)', sector: 'E-commerce' },
  { symbol: 'URBAN', name: 'Urban Company Technologies India Private Limited', sector: 'Services' },
  { symbol: 'DREAM11', name: 'Dream Sports Private Limited (Dream11)', sector: 'Gaming' },
  { symbol: 'MPL', name: 'Mobile Premier League', sector: 'Gaming' },
  
  // More Regional & Cooperative Banks
  { symbol: 'APEXBANK', name: 'Apex Bank Limited', sector: 'Banking' },
  { symbol: 'COSMOSBANK', name: 'Cosmos Co-operative Bank Limited', sector: 'Banking' },
  { symbol: 'BASSEIN', name: 'Bassein Catholic Co-operative Bank Limited', sector: 'Banking' },
  { symbol: 'PUNJAB', name: 'Punjab & Sind Bank', sector: 'Banking' },
  { symbol: 'BENGALURU', name: 'Bengaluru City Co-operative Bank Limited', sector: 'Banking' },
  { symbol: 'MUMBAI', name: 'Mumbai District Central Co-operative Bank Limited', sector: 'Banking' },
  { symbol: 'RAJKOT', name: 'Rajkot Nagarik Sahakari Bank Limited', sector: 'Banking' },
  { symbol: 'SURAT', name: 'Surat District Co-operative Bank Limited', sector: 'Banking' },
  { symbol: 'AHMEDABAD', name: 'Ahmedabad District Central Co-operative Bank Limited', sector: 'Banking' },
  { symbol: 'NASHIK', name: 'Nashik District Central Co-operative Bank Limited', sector: 'Banking' },
  
  // More Pharmaceutical & Healthcare Specialty
  { symbol: 'KRSNAA', name: 'Krsnaa Diagnostics Limited', sector: 'Healthcare' },
  { symbol: 'LASA', name: 'Lasa Supergenerics Limited', sector: 'Pharmaceuticals' },
  { symbol: 'MACLEODS', name: 'Macleods Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'MOREPEN', name: 'Morepen Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'OPTIMUS', name: 'Optimus Pharma Limited', sector: 'Pharmaceuticals' },
  { symbol: 'POLYMED', name: 'Poly Medicure Limited', sector: 'Healthcare' },
  { symbol: 'RAINBOW', name: 'Rainbow Children\'s Medicare Limited', sector: 'Healthcare' },
  { symbol: 'RUBICON', name: 'Rubicon Research Private Limited', sector: 'Pharmaceuticals' },
  { symbol: 'SHALINA', name: 'Shalina Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'SURYA', name: 'Surya Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'UNICHEM', name: 'Unichem Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'VIMTA', name: 'Vimta Labs Limited', sector: 'Healthcare' },
  { symbol: 'YATHARTH', name: 'Yatharth Hospital & Trauma Care Services Limited', sector: 'Healthcare' }
];

/**
 * Get suggested stocks based on partial input with fuzzy matching
 * @param {string} input - Partial stock symbol or company name
 * @returns {Array} Array of suggested stock objects with symbol, name, and sector
 */
export const getSuggestedStocks = (input) => {
  if (!input || typeof input !== 'string' || input.trim().length === 0) return [];
  
  const searchTerm = input.toUpperCase().trim();
  const suggestions = [];
  
  INDIAN_STOCKS.forEach(stock => {
    let score = 0;
    
    // Exact symbol match (highest priority)
    if (stock.symbol === searchTerm) {
      score = 100;
    }
    // Symbol starts with input (high priority)
    else if (stock.symbol.startsWith(searchTerm)) {
      score = 90;
    }
    // Symbol contains input
    else if (stock.symbol.includes(searchTerm)) {
      score = 70;
    }
    // Company name starts with input
    else if (stock.name.toUpperCase().startsWith(searchTerm)) {
      score = 80;
    }
    // Company name contains input
    else if (stock.name.toUpperCase().includes(searchTerm)) {
      score = 60;
    }
    // Sector matches
    else if (stock.sector.toUpperCase().includes(searchTerm)) {
      score = 40;
    }
    
    if (score > 0) {
      suggestions.push({ ...stock, score });
    }
  });
  
  // Sort by score (descending) and return top 8 suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector
    }));
};

/**
 * Get popular stocks for quick selection
 * @returns {Array} Array of popular stock symbols
 */
export const getPopularStocks = () => {
  return [
    'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK',
    'BHARTIARTL', 'ITC', 'SBIN', 'HINDUNILVR', 'ASIANPAINT'
  ];
}; 