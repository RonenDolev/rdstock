import yahooFinance from 'yahoo-finance2';

const CACHE_TTL = 20 * 60 * 1000; // 20 דקות
const cache = {};

function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  const ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema[i] = data[i] * k + ema[i - 1] * (1 - k);
  }
  return ema;
}

function calculateMACD(closes) {
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macdLine = ema12.map((val, i) => val - (ema26[i] || 0));
  const signalLine = calculateEMA(macdLine, 9);
  const histogram = macdLine.map((val, i) => val - (signalLine[i] || 0));
  return { macdLine, signalLine, histogram };
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
    start.setDate(end.getDate() - 100); // 100 ימים היסטוריה

    const history = await yahooFinance.historical(symbol, {
      period1: start,
      period2: end,
      interval: '1d'
    });

    if (!Array.isArray(history) || history.length < 35) {
      return res.status(200).json({ macdSignal: null });
    }

    const closes = history.map(day => day.close);
    const { macdLine, signalLine } = calculateMACD(closes);

    const macdCurrent = macdLine.at(-1);
    const signalCurrent = signalLine.at(-1);
    const macdPrev = macdLine.at(-2);
    const signalPrev = signalLine.at(-2);

    if (
      isNaN(macdCurrent) ||
      isNaN(signalCurrent) ||
      isNaN(macdPrev) ||
      isNaN(signalPrev)
    ) {
      return res.status(200).json({ macdSignal: null });
    }

    // אות קנייה אם ה-MACD עובר מעל הסיגנל (cross up)
    const macdSignal = macdCurrent > signalCurrent && macdPrev <= signalPrev;

    const result = { macdSignal };

    cache[symbol] = { data: result, timestamp: now };

    return res.status(200).json(result);
  } catch (err) {
    console.error(`MACD fetch error for ${symbol}:`, err.message);
    return res.status(500).json({ macdSignal: null, error: err.message });
  }
}
