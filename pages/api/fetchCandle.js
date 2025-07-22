import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  const { symbol, from, to } = req.query;

  if (!symbol || !from || !to) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // תומך בקבלת תאריכים מ-epoch או מחרוזת ISO
    const fromDate = isNaN(Number(from)) ? new Date(from) : new Date(Number(from) * 1000);
    const toDate = isNaN(Number(to)) ? new Date(to) : new Date(Number(to) * 1000);

    // הבאת היסטוריית נרות יומית
    const history = await yahooFinance.historical(symbol, {
      period1: fromDate,
      period2: toDate,
      interval: '1d'
    });

    if (!Array.isArray(history)) {
      return res.status(500).json({ error: 'No historical data returned' });
    }

    // המרה לפורמט דומה ל-Finnhub
    const c = history.map(h => h.close);
    const o = history.map(h => h.open);
    const h = history.map(h => h.high);
    const l = history.map(h => h.low);
    const v = history.map(h => h.volume);
    const t = history.map(h => Math.floor(new Date(h.date).getTime() / 1000)); // timestamps בשניות

    res.status(200).json({
      c, o, h, l, v, t,
      s: 'ok',
      // ניתן להוסיף שדות נוספים במידת הצורך
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
