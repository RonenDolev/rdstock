import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 20 * 60 * 1000; // 20 דקות
const cache = {};

// חישוב SMA פשוט
function calculateSMA(data, period) {
  if (data.length < period) return null;
  const relevant = data.slice(-period);
  const sum = relevant.reduce((acc, val) => acc + val, 0);
  return sum / period;
}

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  const now = Date.now();

  if (cache[symbol] && now - cache[symbol].timestamp < CACHE_TTL) {
    return res.status(200).json(cache[symbol].data);
  }

  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 300); // 300 ימים אחורה

    const history = await yahooFinance.historical(symbol, {
      period1: start,
      period2: end,
      interval: '1d'
    });

    if (!Array.isArray(history) || history.length < 200) {
      console.warn(`⚠️ Not enough data to compute SMA for ${symbol}`);
      return res.status(200).json({ sma50: null, sma200: null });
    }

    const closes = history.map(day => day.close);

    const sma50 = calculateSMA(closes, 50);
    const sma200 = calculateSMA(closes, 200);

    const result = {
      sma50: sma50 !== null ? parseFloat(sma50.toFixed(2)) : null,
      sma200: sma200 !== null ? parseFloat(sma200.toFixed(2)) : null
    };

    cache[symbol] = { data: result, timestamp: now };

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(result);
  } catch (err) {
    console.error(`❌ Moving Avg error for ${symbol}:`, err.message);
    return res.status(200).json({ sma50: null, sma200: null });
  }
}
