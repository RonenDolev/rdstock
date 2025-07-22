<<<<<<< HEAD
import yahooFinance from 'yahoo-finance2';

export async function fetchStockData(symbol) {
  try {
    const endDate = new Date('2025-05-01');
    const startDate = new Date('2024-10-01');

    const history = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    });

    return history.map(item => ({
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      time: item.date.getTime()
=======
export async function fetchStockData(symbol) {
  try {
    const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2024-10-01/2025-05-01?adjusted=true&sort=desc&limit=60&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`);
    const data = await res.json();
    return data.results.map(item => ({
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
      volume: item.v,
      time: item.t
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
    }));
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    return [];
  }
}
