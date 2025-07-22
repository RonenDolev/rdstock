import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 20 * 60 * 1000;
const cache = new Map(); // { symbol: { timestamp, data } }

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  const cleanSymbol = symbol.trim().toUpperCase();
  const now = Date.now();

  const cached = cache.get(cleanSymbol);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return res.status(200).json(cached.data);
  }

  try {
    const summary = await yahooFinance.quoteSummary(cleanSymbol, {
      modules: ['summaryDetail', 'defaultKeyStatistics']
    });

    const peRaw = summary.defaultKeyStatistics?.trailingPE;
    const dividendRaw = summary.summaryDetail?.dividendYield;

    const peRatio = parseFloat(peRaw);
    const dividendYield = parseFloat(dividendRaw) * 100;

    const result = {
      peRatio: !isNaN(peRatio) && isFinite(peRatio) ? parseFloat(peRatio.toFixed(2)) : null,
      dividendYield: !isNaN(dividendYield) && isFinite(dividendYield) ? parseFloat(dividendYield.toFixed(2)) : null
    };

    // אם גם PE וגם Dividend לא תקינים – זה שגוי
    if (result.peRatio === null && result.dividendYield === null) {
      throw new Error('Invalid fundamentals');
    }

    cache.set(cleanSymbol, { timestamp: now, data: result });
    return res.status(200).json(result);
  } catch (err) {
    console.error(`❌ Yahoo fundamentals fetch error for ${symbol}:`, err.message);
    return res.status(500).json({ error: 'Invalid fundamentals', symbol });
  }
}
