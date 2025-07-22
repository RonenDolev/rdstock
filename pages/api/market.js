import yahooFinance from 'yahoo-finance2';

// קאש בזיכרון (פשוט) לשיפור ביצועים
const cache = {};
const CACHE_DURATION = 1000 * 60 * 10; // 10 דקות

// מיפוי סמלים "ידידותיים" לשמות של Yahoo Finance
const symbolMap = {
  'SPY': 'SPY',
  'QQQ': 'QQQ',
  'DIA': 'DIA',
  'IWM': 'IWM',
  'C:EURUSD': 'EURUSD=X',
  'C:USDILS': 'USDILS=X',
  'C:EURILS': 'EURILS=X',
};

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter' });
  }

  const cleanSymbol = symbol.toUpperCase().trim();
  const mappedSymbol = symbolMap[cleanSymbol] || cleanSymbol;
  const now = Date.now();

  // 🔁 בדיקת קאש
  if (
    cache[mappedSymbol] &&
    now - cache[mappedSymbol].timestamp < CACHE_DURATION
  ) {
    const cachedData = cache[mappedSymbol].data;
    console.log(`🧊 [CACHE] ${cleanSymbol} | open: ${cachedData.open}, close: ${cachedData.close}`);
    return res.status(200).json(cachedData);
  }

  try {
    // 📡 קריאה ל־Yahoo Finance
    const quote = await yahooFinance.quote(mappedSymbol);

    if (!quote || quote.regularMarketOpen == null || quote.regularMarketPrice == null) {
      throw new Error('Missing market data from Yahoo');
    }

    const open = parseFloat(quote.regularMarketOpen);
    const close = parseFloat(quote.regularMarketPrice);
    const change = open !== 0 ? ((close - open) / open) * 100 : 0;

    // קביעת מגמה כללית
    let trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';

    // 🎯 התאמות מגמה למטבעות ILS
    const isILS = ['ILS/USD', 'ILS/EUR'].includes(cleanSymbol);
    const isUSDEUR = cleanSymbol === 'USD/EUR';

    if (isILS) {
      trend = change > 0 ? 'down' : change < 0 ? 'up' : 'flat';
    } else if (isUSDEUR) {
      trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    }

    const result = {
      open: open.toFixed(2),
      close: close.toFixed(2),
      change: change.toFixed(2),
      trend,
    };

    // ✨ שמירה בקאש
    cache[mappedSymbol] = { data: result, timestamp: now };

    console.log(`📈 [LIVE] ${cleanSymbol} | open: ${result.open}, close: ${result.close}, trend: ${result.trend}`);
    return res.status(200).json(result);

  } catch (err) {
    console.error(`🔥 Market API error for ${symbol}:`, err.message);
    return res.status(500).json({
      error: 'Market data fetch failed',
      details: err.message,
    });
  }
}
