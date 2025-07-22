// File: pages/api/analysis.js
import yahooFinance from 'yahoo-finance2';
import { stockList } from '../../utils/stockList';

export default async function handler(req, res) {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });

  try {
    const data = await yahooFinance.quoteSummary(symbol, {
      modules: [
        'financialData',
    'recommendationTrend',
    'earningsTrend',
    'earnings', // ← הוסף את זה
    'defaultKeyStatistics',
    'calendarEvents',
    'summaryDetail',
    'price'
      ],
    });

    // המלצות אנליסטים (trend האחרון בלבד)
    const trend = data.recommendationTrend?.trend?.[0] || {};
    const recommendations = {
      strongBuy: trend.strongBuy ?? 0,
      buy: trend.buy ?? 0,
      hold: trend.hold ?? 0,
      sell: trend.sell ?? 0,
    };

    // יעד מחיר
    const priceTarget = {
      high: data.financialData?.targetHighPrice ?? null,
      mean: data.financialData?.targetMeanPrice ?? null,
      low: data.financialData?.targetLowPrice ?? null,
      current: data.financialData?.currentPrice ?? null,
    };

    // EPS (estimate + actual)
      const earnings = data.earnings?.earningsChart?.quarterly ?? [];

const epsTrend = earnings.map(item => ({
  period: item.date,
  estimate: item.estimate?.raw ?? null,
  actual: item.actual?.raw ?? null,
}));

     
    // תחזיות צמיחה
    const trendList = data.earningsTrend?.trend ?? [];
    const growthEstimate = {
      thisYear: trendList[1]?.growth ?? null,
      nextYear: trendList[2]?.growth ?? null,
    };

    // טיקרים קשורים (רנדומלי מתוך stockList)
    const otherTickers = stockList
      .filter(s => s.symbol !== symbol)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const relatedTickers = await Promise.all(
      otherTickers.map(async (item) => {
        try {
          const quote = await yahooFinance.quote(item.symbol);
          return {
            symbol: item.symbol,
            price: quote.regularMarketPrice ?? null,
            change: quote.regularMarketChangePercent ?? null,
          };
        } catch {
          return null;
        }
      })
    );

    res.status(200).json({
      recommendations,
      priceTarget,
      epsTrend,
      growthEstimate,
      relatedTickers: relatedTickers.filter(Boolean),
    });

  } catch (err) {
    console.error(`❌ Analysis API failed for ${symbol}:`, err.message);
    res.status(500).json({ error: 'Failed to load analysis data' });
  }
}
