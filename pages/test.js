// pages/test.js
import React, { useState, useEffect } from 'react';

const testSymbols = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META',
  'C:EURUSD', 'C:USDILS', 'C:EURILS', 'C:XAUUSD', 'C:XAGUSD'
];

export default function StrategyTestPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const out = await Promise.all(testSymbols.map(async symbol => {
        try {
          const r = await fetch(`/api/strategy?symbol=${symbol}`);
          const data = await r.json();
          return {
            symbol,
            status: r.status,
            hasError: !!data?.error,
            ratio: data?.strategy?.longTerm?.ratio ?? null,
            error: data?.error || null
          };
        } catch (err) {
          return { symbol, status: 500, hasError: true, ratio: null, error: err.message };
        }
      }));
      setResults(out);
      setLoading(false);
    };

    fetchAll();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>🧪 Strategy API Test</h1>
      {loading ? (
        <p>Loading results...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Symbol</th>
              <th>Status</th>
              <th>Ratio</th>
              <th>Has Error</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx} style={{ backgroundColor: r.hasError ? '#ffe6e6' : '#e6ffe6' }}>
                <td>{r.symbol}</td>
                <td>{r.status}</td>
                <td>{r.ratio !== null ? r.ratio.toFixed(2) : '—'}</td>
                <td>{r.hasError ? 'Yes' : 'No'}</td>
                <td style={{ color: 'red' }}>{r.error || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
