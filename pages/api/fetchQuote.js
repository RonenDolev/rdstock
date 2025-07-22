import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 20 * 60 * 1000; // 20 דקות
const cache = {};

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  const now = Date.now();
  if (cache[symbol] && now - cache[symbol].timestamp < CACHE_TTL) {
    return res.status(200).json({ price: cache[symbol].price });
  }

  try {
    const quote = await yahooFinance.quote(symbol);
    const price = parseFloat(quote?.regularMarketPrice);

    if (!price || isNaN(price)) {
      throw new Error('Invalid price from Yahoo');
    }

    cache[symbol] = { price, timestamp: now };
    return res.status(200).json({ price });
  } catch (err) {
    console.error('❌ Yahoo fetchQuote error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch price from Yahoo' });
  }
}
