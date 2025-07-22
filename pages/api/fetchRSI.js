import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 20 * 60 * 1000; // 20 דקות
const cache = {};

function calculateRSI(closes, period = 14) {
  if (closes.length <= period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) gains += delta;
    else losses -= delta;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) avgGain = (avgGain * (period - 1) + delta) / period;
    else avgLoss = (avgLoss * (period - 1) - delta) / period;
  }

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
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
    start.setDate(end.getDate() - 100); // 100 ימים אחורה

    const history = await yahooFinance.historical(symbol, {
      period1: start,
      period2: end,
      interval: '1d',
    });

    if (!Array.isArray(history) || history.length < 20) {
      return res.status(200).json({ rsi: null });
    }

    const closes = history.map(day => day.close);
    const rsiValue = calculateRSI(closes);

    const result = {
      rsi: rsiValue !== null ? parseFloat(rsiValue.toFixed(2)) : null,
    };

    cache[symbol] = { data: result, timestamp: now };
    return res.status(200).json(result);
  } catch (err) {
    console.error(`RSI fetch error for ${symbol}:`, err.message);
    return res.status(500).json({ rsi: null, error: err.message });
  }
}
