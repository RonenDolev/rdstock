<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {
  fetchRealTimePrice,
  getGrowth,
  getRiskReward,
  scanAllStocks
} from '../utils/fetchStockData';
import { stockList } from '../utils/stockList';

const LOCAL_STORAGE_KEY = 'investmentTable';

function saveToLocalStorage(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

const LeftPanel = ({ onAnalysisReady, setProgress, onStockSelect }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [amount, setAmount] = useState(100);
  const [portfolio, setPortfolio] = useState([]);
  const [top5Short, setTop5Short] = useState([]);
  const [top5Long, setTop5Long] = useState([]);
  const [scanProgress, setScanProgress] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(3.7); // default fallback

  useEffect(() => {
    const fetchUsdToIlsRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate.host/latest?base=ILS&symbols=USD');
        const data = await res.json();
        if (data?.rates?.USD) {
          setExchangeRate(1 / data.rates.USD);
        }
      } catch (e) {
        console.error("Warning: Unable to fetch exchange rate, using default");
      }
    };
    fetchUsdToIlsRate();
  }, []);

  useEffect(() => {
    const stored = loadFromLocalStorage();
    if (stored.length) {
      setPortfolio(stored);
      updatePortfolioPrices(stored, setPortfolio);
    }
  }, []);

  useEffect(() => {
    if (typeof onStockSelect === 'function') {
      onStockSelect(selectedSymbol);
    }
  }, [selectedSymbol]);

  const updatePortfolioPrices = async (portfolio, setPortfolio) => {
    const updated = await Promise.all(
      portfolio.map(async (p) => {
        const livePrice = await fetchRealTimePrice(p.symbol);
        const amount = Number(p.amount || 0);
        const newValue = livePrice * amount;
        const originalCost = amount * p.price;
        const profit = newValue - originalCost;
        const percentChange = originalCost > 0 ? ((newValue - originalCost) / originalCost) * 100 : 0;
        return {
          ...p,
          currentPrice: livePrice,
          value: newValue,
          profit,
          percentChange
        };
      })
    );
    setPortfolio(updated);
    saveToLocalStorage(updated);
  };

  const handleBuy = async () => {
    const price = await fetchRealTimePrice(selectedSymbol);
    const quantity = amount / price;
    let updated = [...portfolio];
    const existing = updated.find(p => p.symbol === selectedSymbol);
    if (existing) {
      existing.amount += quantity;
    } else {
      updated.push({ symbol: selectedSymbol, amount: quantity, price });
    }
    setPortfolio(updated);
    saveToLocalStorage(updated);
    updatePortfolioPrices(updated, setPortfolio);
  };

  const handleSell = async () => {
    let updated = portfolio.map(p =>
      p.symbol === selectedSymbol ? { ...p, amount: p.amount - (amount / p.price) } : p
    ).filter(p => p.amount > 0);
    setPortfolio(updated);
    saveToLocalStorage(updated);
    updatePortfolioPrices(updated, setPortfolio);
  };

  const deleteRow = (symbol) => {
    const updated = portfolio.filter(p => p.symbol !== symbol);
    setPortfolio(updated);
    saveToLocalStorage(updated);
  };
 const startSmartScan = async () => {
  setProgress({ scanned: 0, total: stockList.length });
  const results = await scanAllStocks((scanned, total) => {
    setProgress({ scanned, total });
    setScanProgress({ scanned, total });
  });

  const validShort = results
    .filter(r => r.growth6m > 0)
    .sort((a, b) => b.growth6m - a.growth6m)
    .slice(0, 5);

  const validLong = results
    .filter(r => r.strategy?.longTerm?.ratio > 2)
    .sort((a, b) => b.strategy.longTerm.ratio - a.strategy.longTerm.ratio)
    .slice(0, 5);

  setTop5Short(validShort);
  setTop5Long(validLong);

  if (validShort.length > 0) {
    const selected = validShort[0];
    if (typeof onStockSelect === 'function') onStockSelect(selected.symbol);
    onAnalysisReady({
      symbol: selected.symbol,
      price: selected.price,
      growth3m: selected.growth6m,
      growth12m: null,
      strategy: selected.strategy
    });
  }

  setProgress(null);
  setScanProgress(null);
};

  const totalValue = portfolio.reduce((sum, p) => sum + (p.value || 0), 0);
  const totalCost = portfolio.reduce((sum, p) => sum + (p.price * p.amount), 0);
  const totalProfit = totalValue - totalCost;
  const percentGain = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const profitColor = totalProfit > 0 ? 'green' : totalProfit < 0 ? 'red' : 'gray';

  const scanned = scanProgress?.scanned || 0;
  const total = scanProgress?.total || 0;
  const percent = total > 0 ? Math.min(100, Math.round((scanned / total) * 100)) : 0;
  const remaining = total - scanned;
  const estimatedSeconds = remaining > 0 ? remaining * 3 : 0;

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', fontFamily: 'Bahnschrift Light' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Stock Analysis Tools</h2>

      <label style={{ fontSize: '14px' }}>Select Stock</label>
      <select
        value={selectedSymbol}
        onChange={e => setSelectedSymbol(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '14px' }}
      >
        {stockList.map(p => (
          <option key={p.symbol} value={p.symbol}>{p.symbol} - {p.name}</option>
        ))}
      </select>

      <label style={{ fontSize: '14px' }}>Amount of Investment (₪)</label><br />
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
        style={{ width: '50%', padding: '8px', fontSize: '14px', marginBottom: '10px' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button style={{ flex: 1, backgroundColor: 'green', color: 'white', padding: '10px', fontWeight: 'bold' }} onClick={handleBuy}>Buy</button>
        <button style={{ flex: 1, backgroundColor: 'red', color: 'white', padding: '10px', fontWeight: 'bold' }} onClick={handleSell}>Sell</button>
      </div>

      <button onClick={startSmartScan} style={{ padding: '10px', background: '#007bff', color: 'white', fontWeight: 'bold', width: '100%', marginBottom: '10px' }}>
        Start Analysis
      </button>

      {scanProgress && (
        <>
          <div style={{ fontSize: '14px', marginBottom: '6px' }}>
            🔄 Scanning Stocks... {scanned}/{total} ({percent}%)
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
            ⏳ Time remaining: {formatTime(estimatedSeconds)}
          </div>
          <div style={{ height: '12px', background: '#ccc', borderRadius: '6px', marginBottom: '20px' }}>
            <div style={{
              width: `${percent}%`,
              height: '100%',
              background: '#4caf50',
              borderRadius: '6px',
              transition: 'width 0.3s ease-out'
            }} />
          </div>
        </>
      )}
      <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>Top 5 Leading Stocks (Past 6 Months)</h4>
      <table style={{ width: '100%', fontSize: '12px', border: '1px solid #ccc', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead><tr><th>Symbol</th><th>Name</th><th>Growth</th></tr></thead>
        <tbody>
          {top5Short.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', color: '#aaa' }}>No data yet.</td></tr>
          ) : (
            top5Short.map((s, i) => (
              <tr key={i}>
                <td>{s.symbol}</td>
                <td>{s.name}</td>
                <td style={{ color: 'green' }}>{Number(s.growth6m || 0).toFixed(2)}%</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>Top 5 Long-Term (1Y) Buy Opportunities</h4>
      <table style={{ width: '100%', fontSize: '12px', border: '1px solid #ccc', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead><tr><th>Symbol</th><th>Name</th><th>Ratio</th></tr></thead>
        <tbody>
          {top5Long.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', color: '#aaa' }}>No data yet.</td></tr>
          ) : (
            top5Long.map((s, i) => (
              <tr key={i}>
                <td>{s.symbol}</td>
                <td>{s.name}</td>
                <td style={{ color: 'green' }}>{Number(s.strategy?.longTerm?.ratio || 0).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>My Investments</h4>
      <table style={{ width: '100%', fontSize: '12px', border: '1px solid #ccc', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Stock</th><th>Qty</th><th>Buy Price</th><th>Current</th><th>Value</th><th>%</th><th>Profit</th><th></th>
          </tr>
        </thead>
        <tbody>
          {portfolio.length === 0 ? 
            <tr><td colSpan="8">No investments yet.</td></tr>
          ) : portfolio.map((p, i) => {
            const amount = Number(p.amount || 0);
            const price = Number(p.price || 0);
            const currentPrice = Number(p.currentPrice || 0);
            const originalCost = amount * price;
            const currentValue = amount * currentPrice;
            const profit = currentValue - originalCost;
            const percent = originalCost > 0 ? (profit / originalCost) * 100 : 0;
            const color = profit > 0 ? 'green' : profit < 0 ? 'red' : 'gray';
            return (
              <tr key={i}>
                <td>{p.symbol}</td>
                <td>{amount.toFixed(2)}</td>
                <td>₪{price.toFixed(2)}</td>
                <td>₪{currentPrice.toFixed(2)}</td>
                <td>₪{currentValue.toFixed(2)}</td>
                <td style={{ color }}>{percent.toFixed(2)}%</td>
                <td style={{ color }}>₪{profit.toFixed(2)}</td>
                <td><button onClick={() => deleteRow(p.symbol)}>🗑️</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {portfolio.length > 0 && (
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '10px', color: profitColor }}>
          Total Profit: ₪{totalProfit.toFixed(2)} | ${ (totalProfit / exchangeRate).toFixed(2) } | {percentGain.toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
=======
import { useEffect, useState } from 'react';

export default function InvestmentTable() {
  const [data, setData] = useState([
    { stock: 'AAPL', amount: 100 },
    { stock: 'MSFT', amount: 150 }
  ]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const responses = await Promise.all(
          data.map(item =>
            fetch(`https://api.polygon.io/v2/aggs/ticker/${item.stock}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`)
              .then(res => res.json())
          )
        );

        const updated = data.map((item, index) => {
          const res = responses[index];
          const change = ((res.results[0].c - res.results[0].o) / res.results[0].o) * 100;
          const currentValue = item.amount * (1 + change / 100);

          return {
            ...item,
            change: change.toFixed(2) + '%',
            value: '$' + currentValue.toFixed(2),
            color: change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-orange-500'
          };
        });

        setData(updated);
      } catch (error) {
        console.error('Error fetching investment data:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const removeStock = (index) => {
    setData(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4 bg-white border rounded shadow">
      <h2 className="text-lg font-semibold p-2 border-b">Investment Table</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">% Change</th>
            <th className="p-2 text-left">Current Value</th>
            <th className="p-2 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{item.stock}</td>
              <td className={`p-2 ${item.color}`}>{item.change}</td>
              <td className="p-2">{item.value}</td>
              <td className="p-2 text-center">
                <button onClick={() => removeStock(idx)} className="text-red-500 font-bold">X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
