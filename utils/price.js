// File: pages/api/price.js
import axios from 'axios';

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter' });
  }

  const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  try {
    // Use Polygon.io real-time last trade price endpoint
    const url = `https://api.polygon.io/v1/last/stocks/${symbol}?apiKey=${apiKey}`;
    const response = await axios.get(url);
    const price = response.data?.last?.price;

    if (!price || isNaN(price)) {
      throw new Error('Invalid price returned from API');
    }

    res.status(200).json({ price });
  } catch (err) {
    console.error(`Polygon API error for ${symbol}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
}
