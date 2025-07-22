import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ChartCard({ selectedStock }) {
  const [chartData, setChartData] = useState([]);
  const [recommendation, setRecommendation] = useState('🟠 Hold');

  useEffect(() => {
    const fetchData = async () => {
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString().split('T')[0];
      const url = `https://api.polygon.io/v2/aggs/ticker/${selectedStock}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const candles = data.results?.map(c => ({
          x: new Date(c.t),
          y: [c.o, c.h, c.l, c.c],
          close: c.c,
        })) || [];
        setChartData(candles);

        // Simple strategy logic (example)
        if (candles.length > 1) {
          const latest = candles[candles.length - 1].close;
          const previous = candles[candles.length - 2].close;
          const change = latest - previous;
          if (change > 2) setRecommendation('🟢 Buy');
          else if (change < -2) setRecommendation('🔴 Sell');
        }
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      }
    };

    if (selectedStock) fetchData();
  }, [selectedStock]);

  return (
    <div className="bg-zinc-900 text-white rounded-2xl shadow-md p-6 w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">📊 {selectedStock} Chart Overview</h2>
        <p className="text-sm text-zinc-400">Auto-generated analysis based on daily movement</p>
      </div>

      {chartData.length > 0 ? (
        <ApexChart
          type="candlestick"
          height={300}
          series={[{ data: chartData }]}
          options={{
            chart: { type: 'candlestick', toolbar: { show: false }, background: '#18181b' },
            theme: { mode: 'dark' },
            xaxis: { type: 'datetime' },
            yaxis: { tooltip: { enabled: true } },
          }}
        />
      ) : (
        <p className="text-sm text-zinc-400">Loading chart...</p>
      )}

      <div className="mt-6 bg-zinc-800 p-4 rounded-xl">
        <h3 className="text-lg font-medium">Recommendation</h3>
        <p className="text-xl mt-1">
          {recommendation}
        </p>
      </div>
    </div>
  );
}
