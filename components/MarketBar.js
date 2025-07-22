<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const symbols = [
  { key: 'SPY', label: 'S&P 500' },
  { key: 'QQQ', label: 'Nasdaq 100' },
  { key: 'DIA', label: 'Dow Jones' },
  { key: 'IWM', label: 'Russell 2000' },
  { key: 'C:EURUSD', label: 'USD/EUR' },
  { key: 'C:USDILS', label: 'ILS/USD' },
  { key: 'C:EURILS', label: 'ILS/EUR' },
];

const fetchMarketIndicators = async () => {
  return await Promise.all(symbols.map(async ({ key, label }) => {
    try {
      const res = await axios.get(`/api/market?symbol=${key}`);
      const { open, close } = res.data;
      const change = open && close ? ((parseFloat(close) - parseFloat(open)) / parseFloat(open)) * 100 : 0;
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';

      const isILS = ['ILS/USD', 'ILS/EUR'].includes(label);
      const isUSDEUR = label === 'USD/EUR';
      let adjustedTrend = trend;
      if (isILS) adjustedTrend = change > 0 ? 'down' : change < 0 ? 'up' : 'flat';
      if (isUSDEUR) adjustedTrend = trend;

      return {
        label,
        price: close ? parseFloat(close).toFixed(2) : '-',
        change: change ? change.toFixed(2) : '0.00',
        trend: adjustedTrend
      };
    } catch {
      return { label, price: '-', trend: 'flat' };
    }
  }));
};

const MarketBar = () => {
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    const loadIndicators = async () => {
      const data = await fetchMarketIndicators();
      setIndicators(data);
    };

    loadIndicators();
    const interval = setInterval(loadIndicators, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '10px 5%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '10px',
      fontSize: '16px'
    }}>
      {indicators.length === 0 ? (
        <div style={{ color: 'orange' }}>⚠️ No market data available</div>
      ) : (
        indicators.map((item, idx) => (
          <div
            key={idx}
            style={{
              color:
                item.trend === 'up'
                  ? 'lightgreen'
                  : item.trend === 'down'
                  ? 'red'
                  : 'orange',
            }}
          >
            {item.label}: {item.price} ({item.change}%) {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '■'}
          </div>
        ))
      )}
    </div>
  );
};

export default MarketBar;
=======
// File: components/MarketBar.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MarketBar() {
  const [data, setData] = useState([]);
  const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

  const tickers = [
    { name: 'S&P 500', symbol: 'I:SPX' },
    { name: 'Nasdaq 100', symbol: 'I:NDX' },
    { name: 'Dow Jones', symbol: 'I:DJI' },
    { name: 'Russell 2000', symbol: 'I:RUT' },
    { name: 'EUR/USD', symbol: 'C:EURUSD' },
    { name: 'USD/ILS', symbol: 'C:USDILS' },
    { name: 'EUR/ILS', symbol: 'C:EURILS' },
    { name: 'Gold', symbol: 'C:XAUUSD' },
    { name: 'Silver', symbol: 'C:XAGUSD' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        tickers.map(async ({ name, symbol }) => {
          try {
            const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`;
            const res = await axios.get(url);
            const { o, c } = res.data?.results?.[0] || {};
            const change = o && c ? ((c - o) / o) * 100 : 0;

            const color =
              change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-orange-400';

            return {
              name,
              value: `${c ? c.toFixed(2) : '-'} (${change ? change.toFixed(2) : '0.00'}%)`,
              color
            };
          } catch (err) {
            console.warn(`❌ ${name} fetch error:`, err?.message);
            return { name, value: '-', color: 'text-orange-400' };
          }
        })
      );

      setData(results);
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [POLYGON_API_KEY]);

  return (
    <div className="bg-gray-800 text-white py-2 px-4 text-[1.1rem] grid grid-cols-9 gap-2 justify-between">
      {data.map((item, idx) => (
        <div key={idx} className={`flex justify-center ${item.color} font-semibold`}>
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  );
}
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
