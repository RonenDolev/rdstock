// File: pages/api/fetchSMA.js
import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 20 * 60 * 1000;
const cache = {};

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
    const period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // שנה אחורה
    const candles = await yahooFinance.historical(symbol, {
      period1,
      interval: '1d',
    });

    if (!candles || candles.length < 200) {
      return res.status(200).json({ sma50: null, sma200: null });
    }

    const closes = candles.map(c => c.close);

    const sma50 = calculateSMA(closes, 50);
    const sma200 = calculateSMA(closes, 200);

    const result = {
      sma50: sma50 ? parseFloat(sma50.toFixed(2)) : null,
      sma200: sma200 ? parseFloat(sma200.toFixed(2)) : null,
    };

    cache[symbol] = { data: result, timestamp: now };

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(result);
  } catch (err) {
    console.error(`❌ Error fetching SMA for ${symbol}:`, err.message);
    return res.status(500).json({ error: 'Failed to fetch SMA data' });
  }
}
