<<<<<<< HEAD
import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 20 * 60 * 1000; // 20 דקות
const createCache = () => ({});

const priceCache = createCache();
const growthCache = createCache();
const fundamentalsCache = createCache();
const movingAvgCache = createCache();

const getCached = (cache, key) => {
  const item = cache[key];
  return item && Date.now() - item.timestamp < CACHE_TTL ? item.value : null;
};

const setCached = (cache, key, value) => {
  cache[key] = { value, timestamp: Date.now() };
};

// ✅ מחיר בזמן אמת
export const fetchRealTimePrice = async (symbol) => {
  const cached = getCached(priceCache, symbol);
  if (cached !== null) return cached;

  try {
    const quote = await yahooFinance.quote(symbol);
    const price = parseFloat(quote?.regularMarketPrice);
    const result = isNaN(price) ? 0 : price;
    setCached(priceCache, symbol, result);
    return result;
  } catch (err) {
    console.warn(`❌ Yahoo price fetch failed for ${symbol}:`, err.message);
=======
// File: utils/fetchStockData.js
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const baseUrl = 'https://api.polygon.io';

export const top100 = [
  { symbol: '^GSPC', name: 'S&P 500 Index' },
  { symbol: '^IXIC', name: 'Nasdaq Composite Index' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average' },
  { symbol: '^RUT', name: 'Russell 2000 Index' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq 100 ETF)' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Class A)' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc. (Class B)' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AVGO', name: 'Broadcom Inc.' },
  { symbol: 'GOOG', name: 'Alphabet Inc. (Class C)' },
  { symbol: 'LLY', name: 'Eli Lilly & Co.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.' },
  { symbol: 'UNH', name: 'UnitedHealth Group Inc.' },
  { symbol: 'MA', name: 'Mastercard Inc.' },
  { symbol: 'COST', name: 'Costco Wholesale Corp.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'HD', name: 'The Home Depot, Inc.' },
  { symbol: 'PG', name: 'Procter & Gamble Co.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'ABBV', name: 'AbbVie Inc.' },
  { symbol: 'CRM', name: 'Salesforce, Inc.' },
  { symbol: 'BAC', name: 'Bank of America Corp.' },
  { symbol: 'ORCL', name: 'Oracle Corp.' },
  { symbol: 'MRK', name: 'Merck & Co., Inc.' },
  { symbol: 'CVX', name: 'Chevron Corp.' },
  { symbol: 'WFC', name: 'Wells Fargo & Co.' },
  { symbol: 'KO', name: 'The Coca-Cola Company' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.' },
  { symbol: 'ACN', name: 'Accenture Plc' },
  { symbol: 'NOW', name: 'ServiceNow Inc.' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.' },
  { symbol: 'INTC', name: 'Intel Corp.' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific Inc.' },
  { symbol: 'MCD', name: 'McDonald’s Corp.' },
  { symbol: 'NKE', name: 'Nike, Inc.' },
  { symbol: 'TXN', name: 'Texas Instruments Inc.' },
  { symbol: 'LIN', name: 'Linde plc' },
  { symbol: 'ABT', name: 'Abbott Laboratories' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.' },
  { symbol: 'UPS', name: 'United Parcel Service Inc.' },
  { symbol: 'DHR', name: 'Danaher Corp.' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.' },
  { symbol: 'INTU', name: 'Intuit Inc.' },
  { symbol: 'NEE', name: 'NextEra Energy Inc.' },
  { symbol: 'AMGN', name: 'Amgen Inc.' },
  { symbol: 'LOW', name: 'Lowe’s Companies Inc.' },
  { symbol: 'SPGI', name: 'S&P Global Inc.' },
  { symbol: 'UNP', name: 'Union Pacific Corp.' },
  { symbol: 'MS', name: 'Morgan Stanley' },
  { symbol: 'BLK', name: 'BlackRock Inc.' },
  { symbol: 'AXP', name: 'American Express Co.' },
  { symbol: 'MDT', name: 'Medtronic plc' },
  { symbol: 'AMAT', name: 'Applied Materials Inc.' },
  { symbol: 'BA', name: 'Boeing Co.' },
  { symbol: 'ISRG', name: 'Intuitive Surgical Inc.' },
  { symbol: 'T', name: 'AT&T Inc.' },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.' },
  { symbol: 'CAT', name: 'Caterpillar Inc.' },
  { symbol: 'PLD', name: 'Prologis Inc.' },
  { symbol: 'VRTX', name: 'Vertex Pharmaceuticals Inc.' },
  { symbol: 'DE', name: 'Deere & Co.' },
  { symbol: 'ADI', name: 'Analog Devices Inc.' },
  { symbol: 'ELV', name: 'Elevance Health Inc.' },
  { symbol: 'LRCX', name: 'Lam Research Corp.' },
  { symbol: 'MMC', name: 'Marsh & McLennan Companies Inc.' },
  { symbol: 'SCHW', name: 'Charles Schwab Corp.' },
  { symbol: 'TGT', name: 'Target Corp.' },
  { symbol: 'MO', name: 'Altria Group Inc.' },
  { symbol: 'CB', name: 'Chubb Ltd.' },
  { symbol: 'ZTS', name: 'Zoetis Inc.' },
  { symbol: 'C', name: 'Citigroup Inc.' },
  { symbol: 'SO', name: 'Southern Co.' },
  { symbol: 'GILD', name: 'Gilead Sciences Inc.' },
  { symbol: 'DUK', name: 'Duke Energy Corp.' },
  { symbol: 'TJX', name: 'TJX Companies Inc.' },
  { symbol: 'PNC', name: 'PNC Financial Services Group Inc.' },
  { symbol: 'USB', name: 'U.S. Bancorp' },
  { symbol: 'ADP', name: 'Automatic Data Processing Inc.' },
  { symbol: 'BKNG', name: 'Booking Holdings Inc.' },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals Inc.' },
  { symbol: 'FIS', name: 'Fidelity National Information Services Inc.' },
  { symbol: 'SYK', name: 'Stryker Corp.' },
  { symbol: 'BDX', name: 'Becton, Dickinson and Co.' },
  { symbol: 'HUM', name: 'Humana Inc.' },
  { symbol: 'CL', name: 'Colgate-Palmolive Co.' },
  { symbol: 'EOG', name: 'EOG Resources Inc.' },
  { symbol: 'ITW', name: 'Illinois Tool Works Inc.' },
  { symbol: 'PGR', name: 'Progressive Corp.' },
  { symbol: 'MCO', name: 'Moody’s Corp.' },
  { symbol: 'FISV', name: 'Fiserv Inc.' },
  { symbol: 'AON', name: 'Aon plc' },
  { symbol: 'ETN', name: 'Eaton Corp. plc' },
  { symbol: 'BSX', name: 'Boston Scientific Corp.' },
  { symbol: 'FDX', name: 'FedEx Corp.' },
  { symbol: 'AIG', name: 'American International Group Inc.' },
  { symbol: 'HCA', name: 'HCA Healthcare Inc.' },
  { symbol: 'PSA', name: 'Public Storage' },
  { symbol: 'APD', name: 'Air Products and Chemicals Inc.' },
  { symbol: 'NOC', name: 'Northrop Grumman Corp.' },
  { symbol: 'CME', name: 'CME Group Inc.' },
  { symbol: 'TRV', name: 'Travelers Companies Inc.' },
  { symbol: 'KMB', name: 'Kimberly-Clark Corp.' },
  { symbol: 'EMR', name: 'Emerson Electric Co.' },
  { symbol: 'AEP', name: 'American Electric Power Co. Inc.' },
  { symbol: 'SRE', name: 'Sempra Energy' },
  { symbol: 'WELL', name: 'Welltower Inc.' },
  { symbol: 'D', name: 'Dominion Energy Inc.' },
  { symbol: 'ECL', name: 'Ecolab Inc.' },
  { symbol: 'STZ', name: 'Constellation Brands Inc.' },
  { symbol: 'PAYX', name: 'Paychex Inc.' },
  { symbol: 'ROST', name: 'Ross Stores Inc.' },
  { symbol: 'VLO', name: 'Valero Energy Corp.' },
  { symbol: 'MTD', name: 'Mettler-Toledo International Inc.' },
  { symbol: 'IDXX', name: 'IDEXX Laboratories Inc.' },
  { symbol: 'CTAS', name: 'Cintas Corp.' },
  { symbol: 'WMB', name: 'Williams Companies Inc.' },
  { symbol: 'SYY', name: 'Sysco Corp.' },
  { symbol: 'ROK', name: 'Rockwell Automation Inc.' },
  { symbol: 'EXC', name: 'Exelon Corp.' },
  { symbol: 'ED', name: 'Consolidated Edison Inc.' }
];


const normalizeSymbol = (symbol) => {
  const map = {
    '^GSPC': 'SPX',
    '^IXIC': 'NDX',
    '^DJI': 'DJI',
    '^RUT': 'RUT'
  };
  return map[symbol] || symbol;
};

export const fetchRealTimePrice = async (symbol) => {
  try {
    const res = await fetch(`/api/price?symbol=${symbol}`);
    const data = await res.json();

    if (!data.price) {
      console.warn(`⚠️ No price returned for ${symbol}`);
      return 0;
    }

    console.log(`✅ Live price from server for ${symbol}: $${data.price}`);
    return data.price;

  } catch (err) {
    console.error(`❌ Error fetching real-time price for ${symbol}:`, err?.message);
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
    return 0;
  }
};

<<<<<<< HEAD
// ✅ צמיחה תוך X חודשים
export const getGrowth = async (symbol, months = 6) => {
  const key = `${symbol}_${months}m`;
  const cached = getCached(growthCache, key);
  if (cached !== null) return cached;

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const history = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    });

    if (!Array.isArray(history) || history.length < 2) throw new Error('Not enough historical data');
    const growth = ((history.at(-1).close - history[0].close) / history[0].close) * 100;
    const result = parseFloat(growth.toFixed(2));
    setCached(growthCache, key, result);
    return result;
  } catch (err) {
    console.error(`❌ Growth fetch error for ${symbol}:`, err.message);
=======
export const getGrowth = async (symbol, months) => {
  try {
    const normalized = normalizeSymbol(symbol);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);
    const from = startDate.toISOString().split('T')[0];
    const to = endDate.toISOString().split('T')[0];

    const res = await axios.get(
      `${baseUrl}/v2/aggs/ticker/${normalized}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=5000&apiKey=${apiKey}`
    );

    const prices = res.data?.results;
    if (!prices || prices.length < 2) return null;

    const startPrice = prices[0].c;
    const endPrice = prices[prices.length - 1].c;

    return ((endPrice - startPrice) / startPrice) * 100;
  } catch (err) {
    console.error(`❌ Error fetching ${months}M growth for ${symbol}:`, err?.response?.data || err.message);
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
    return null;
  }
};

<<<<<<< HEAD
// ✅ נתונים פיננסיים
export const getFundamentals = async (symbol) => {
  const cached = getCached(fundamentalsCache, symbol);
  if (cached !== null) return cached;

  try {
    const data = await yahooFinance.quoteSummary(symbol, {
      modules: ['summaryDetail', 'defaultKeyStatistics']
    });

    const pe = parseFloat(data?.defaultKeyStatistics?.forwardPE || data?.defaultKeyStatistics?.trailingPE);
    const div = parseFloat(data?.summaryDetail?.dividendYield) * 100;

    const result = {
      peRatio: isNaN(pe) ? null : parseFloat(pe.toFixed(2)),
      dividendYield: isNaN(div) ? null : parseFloat(div.toFixed(2))
    };

    setCached(fundamentalsCache, symbol, result);
    return result;
  } catch (err) {
    console.error(`❌ Yahoo fundamentals fetch error for ${symbol}:`, err.message);
    return { peRatio: null, dividendYield: null };
  }
};

// ✅ ממוצעים נעים
export const getMovingAvg = async (symbol) => {
  const cached = getCached(movingAvgCache, symbol);
  if (cached !== null) return cached;

  try {
    const history = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      interval: '1d',
    });

    const closes = history.map(c => c.close);
    if (!closes || closes.length < 200) throw new Error('Not enough history for SMA');

    const sma = (arr, period) => {
      const recent = arr.slice(-period);
      const sum = recent.reduce((a, b) => a + b, 0);
      return parseFloat((sum / period).toFixed(2));
    };

    const result = {
      sma50: sma(closes, 50),
      sma200: sma(closes, 200)
    };

    setCached(movingAvgCache, symbol, result);
    return result;
  } catch (err) {
    console.warn(`⚠️ Failed to calculate moving averages for ${symbol}:`, err.message);
    return { sma50: null, sma200: null };
  }
};

// ✅ ניקוי המטמון
export const clearAllCaches = () => {
  [priceCache, growthCache, fundamentalsCache, movingAvgCache].forEach(cache => {
    Object.keys(cache).forEach(key => delete cache[key]);
  });
=======
export const getRiskReward = async (symbol) => {
  try {
    const normalized = normalizeSymbol(symbol);
    const currentPrice = await fetchRealTimePrice(normalized);
    if (!currentPrice || currentPrice === 0) return null;

    const growth3m = await getGrowth(normalized, 3);
    const growth12m = await getGrowth(normalized, 12);

    const buildMetrics = (growth) => {
      const supportMultiplier = 1 - (growth > 0 ? Math.min(growth / 200, 0.1) : 0.05);
      const targetMultiplier = 1 + (growth > 0 ? Math.min(growth / 100, 0.3) : 0.15);

      const support = currentPrice * supportMultiplier;
      const target = currentPrice * targetMultiplier;

      const risk = ((currentPrice - support) / currentPrice) * 100;
      const reward = ((target - currentPrice) / currentPrice) * 100;
      const ratio = reward / risk;

      return { support, target, risk, reward, ratio };
    };

    const shortTerm = buildMetrics(growth3m);
    const longTerm = buildMetrics(growth12m);

    return {
      entryRange: { min: shortTerm.support, max: currentPrice },
      target: longTerm.target,
      stopLoss: shortTerm.support,
      shortTerm,
      longTerm
    };
  } catch (err) {
    console.error(`❌ getRiskReward failed for ${symbol}:`, err?.message);
    return null;
  }
};

export const fetchMarketIndicators = async () => {
  const symbols = [
    { key: 'I:SPX', label: 'S&P 500', type: 'stocks' },
    { key: 'I:NDX', label: 'Nasdaq 100', type: 'stocks' },
    { key: 'I:DJI', label: 'Dow Jones', type: 'stocks' },
    { key: 'I:RUT', label: 'Russell 2000', type: 'stocks' },
    { key: 'C:EURUSD', label: 'EUR/USD', type: 'forex' },
    { key: 'C:USDILS', label: 'USD/ILS', type: 'forex' },
    { key: 'C:EURILS', label: 'EUR/ILS', type: 'forex' },
    { key: 'C:XAUUSD', label: 'Gold', type: 'forex' },
    { key: 'C:XAGUSD', label: 'Silver', type: 'forex' }
  ];

  const results = [];

  for (const { key, label, type } of symbols) {
    const endpoint = type === 'stocks'
      ? `${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers/${key}?apiKey=${apiKey}`
      : `${baseUrl}/v2/snapshot/locale/global/markets/forex/tickers/${key}?apiKey=${apiKey}`;

    try {
      const res = await axios.get(endpoint);
      const ticker = res.data?.ticker;

      const price =
        ticker?.lastTrade?.p ??
        ticker?.lastQuote?.bid ??
        ticker?.day?.close ??
        ticker?.min?.c ??
        0;

      const trend =
        ticker?.todaysChange > 0
          ? 'up'
          : ticker?.todaysChange < 0
          ? 'down'
          : 'flat';

      results.push({ label, price: price.toFixed(2), trend });
    } catch (err) {
      console.warn(`⚠️ ${label}: No data`, err?.response?.data || err.message);
      results.push({ label, price: '-', trend: 'flat' });
    }
  }

  return results;
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
};
