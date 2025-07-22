import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import axios from 'axios';

const StrategyBox = ({ selectedStock, isScanning = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedStock || isScanning) return;
    fetchStrategyData(selectedStock);
  }, [selectedStock, isScanning]);

  const fetchStrategyData = async (symbol) => {
    setLoading(true);
    setError(null);

    try {
      const priceRes = await axios.get(`/api/price?symbol=${symbol}`);
      const price = parseFloat(priceRes.data?.price);
      if (!price || isNaN(price)) throw new Error('Invalid price');

      const [growthRes, maRes, fundamentalsRes, rsiRes, macdRes] = await Promise.all([
        axios.get(`/api/growth?symbol=${symbol}&months=6`),
        axios.get(`/api/moving-avg?symbol=${symbol}`),
        axios.get(`/api/fundamentals?symbol=${symbol}`),
        axios.get(`/api/rsi?symbol=${symbol}`),
        axios.get(`/api/macd?symbol=${symbol}`)
      ]);

      const growth6m = growthRes.data?.growth ?? 0;
      const movingAvg50 = maRes.data?.sma50 ?? price;
      const movingAvg200 = maRes.data?.sma200 ?? price;
      const peRatio = fundamentalsRes.data?.peRatio ?? null;
      const dividendYield = fundamentalsRes.data?.dividendYield ?? null;
      const rsi = rsiRes.data?.rsi ?? 50;
      const macdSignal = macdRes.data?.macdSignal ?? false;

      const hammerCount = Math.floor(Math.random() * 6);
      const bullishEngulf = Math.floor(Math.random() * 4);

      const strategy = {
        shortTerm: {
          risk: Math.random() * 5,
          reward: Math.random() * 15
        },
        longTerm: {
          risk: Math.random() * 10,
          reward: Math.random() * 30
        },
        entryRange: {
          min: price * 0.95,
          max: price * 1.05
        },
        stopLoss: price * 0.9,
        target: price * 1.15,
        peRatio,
        dividendYield
      };

      strategy.shortTerm.ratio = strategy.shortTerm.reward / (strategy.shortTerm.risk || 1);
      strategy.longTerm.ratio = strategy.longTerm.reward / (strategy.longTerm.risk || 1);

      strategy.rating = calculateCompositeStrategy({
        peRatio,
        growth6m,
        price,
        movingAvg50,
        movingAvg200,
        hammerCount,
        bullishEngulf,
        macdSignal,
        rsi,
        dividendYield
      });

      setData({
        symbol,
        price,
        growth6m,
        rsi,
        macdSignal,
        hammerCount,
        bullishEngulf,
        strategy
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch strategy data.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompositeStrategy = ({
    peRatio = 0,
    growth6m = 0,
    price = 0,
    movingAvg50 = 0,
    movingAvg200 = 0,
    hammerCount = 0,
    bullishEngulf = 0,
    macdSignal = false,
    rsi = 50,
    dividendYield = 0
  }) => {
    let score = 0;

    if (growth6m > 10) score += 2;
    else if (growth6m > 3) score += 1;

    if (price > movingAvg50) score += 1;
    if (price > movingAvg200) score += 1;

    if (macdSignal) score += 1;
    if (rsi > 45 && rsi < 70) score += 1;

    if (hammerCount >= 3) score += 1;
    if (bullishEngulf >= 2) score += 1;

    if (typeof peRatio === 'number' && peRatio < 20) score += 1;
    if (typeof dividendYield === 'number' && dividendYield > 2) score += 1;

    if (score >= 7) return 'Buy';
    if (score >= 4) return 'Hold';
    return 'Sell';
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', fontFamily: 'Bahnschrift Light' }}>
      {loading ? (
        <p>Loading strategy...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : data ? (
        <>
          <p><strong>Current Price:</strong> ₪{data.price.toFixed(2)}</p>
          <p><strong>P/E Ratio:</strong> {data.strategy.peRatio != null ? data.strategy.peRatio.toFixed(2) : 'N/A'}</p>
          <p><strong>Growth (6M):</strong> {data.growth6m.toFixed(2)}%</p>
          <p><strong>MACD:</strong> {data.macdSignal ? 'Positive' : 'Negative'} | <strong>RSI:</strong> {data.rsi.toFixed(2)}</p>
          <p><strong>Hammer Candles:</strong> {data.hammerCount} | <strong>Bullish Engulfing:</strong> {data.bullishEngulf}</p>
          <p><strong>Dividend Yield:</strong> {data.strategy.dividendYield != null ? `${data.strategy.dividendYield.toFixed(2)}%` : 'N/A'}</p>
          <h3 style={{ color: data.strategy.rating === 'Buy' ? 'green' : data.strategy.rating === 'Hold' ? 'orange' : 'red' }}>
            Recommendation: {data.strategy.rating === 'Buy' ? '🟢 Buy' : data.strategy.rating === 'Hold' ? '🟠 Hold' : '🔴 Sell'}
          </h3>
        </>
      ) : null}
=======
import {
  fetchRealTimePrice,
  fetchStockDetails,
  getGrowth
} from '../utils/fetchStockData';

const StrategyBox = ({ selectedSymbol, setAnalysis }) => {
  const [price, setPrice] = useState(null);
  const [details, setDetails] = useState({});
  const [growth3M, setGrowth3M] = useState(null);
  const [growth1Y, setGrowth1Y] = useState(null);
  const [shortTermRec, setShortTermRec] = useState('—');
  const [longTermRec, setLongTermRec] = useState('—');
  const [entryMin, setEntryMin] = useState(null);
  const [entryMax, setEntryMax] = useState(null);
  const [target, setTarget] = useState(null);
  const [stopLoss, setStopLoss] = useState(null);
  const [risk, setRisk] = useState(null);
  const [reward, setReward] = useState(null);
  const [rrRatio, setRrRatio] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedSymbol) return;

      const current = await fetchRealTimePrice(selectedSymbol);
      const g3 = await getGrowth(selectedSymbol, 3);
      const g12 = await getGrowth(selectedSymbol, 12);

      setPrice(current);
      setGrowth3M(g3);
      setGrowth1Y(g12);

      const entryMin = current * 0.97;
      const entryMax = current * 1.02;
      const target = current * 1.15;
      const stop = current * 0.95;

      const calculatedRisk = ((current - stop) / current) * 100;
      const calculatedReward = ((target - current) / current) * 100;
      const calculatedRatio = calculatedReward / calculatedRisk;

      setEntryMin(entryMin);
      setEntryMax(entryMax);
      setTarget(target);
      setStopLoss(stop);
      setRisk(calculatedRisk);
      setReward(calculatedReward);
      setRrRatio(calculatedRatio);

      if (g3 >= 10 && calculatedRatio >= 2.0) setShortTermRec('🟢 ↑ Buy');
      else if (g3 <= 0 || calculatedRatio < 1.5) setShortTermRec('🔴 ↓ Sell');
      else setShortTermRec('🟠 → Hold');

      if (g12 >= 15 && calculatedRatio >= 2.0) setLongTermRec('🟢 ↑ Buy');
      else if (g12 <= 5 || calculatedRatio < 1.5) setLongTermRec('🔴 ↓ Sell');
      else setLongTermRec('🟠 → Hold');

      // ✅ Pass values up to CenterPanel via setAnalysis
      if (typeof setAnalysis === 'function') {
        setAnalysis({
          risk: calculatedRisk,
          reward: calculatedReward,
          rrRatio: calculatedRatio,
          price: current,
          growth3M: g3,
          growth1Y: g12
        });
      }
    };

    loadData();
  }, [selectedSymbol, setAnalysis]);

  const formatCurrency = (val) => val ? `$${val.toFixed(2)}` : '—';
  const formatPercent = (val) => val !== null ? `${val.toFixed(2)}%` : '—';

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', fontFamily: 'Bahnschrift Light' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Investment Strategy</h3>
      <p><strong>Stock:</strong> {selectedSymbol}</p>
      <p><strong>Current Price:</strong> {formatCurrency(price)}</p>

      <h4 style={{ marginTop: '20px' }}>Technical Analysis</h4>
      <ul>
        <li>📈 Growth (3-Month): {formatPercent(growth3M)}</li>
        <li>📉 Growth (1-Year): {formatPercent(growth1Y)}</li>
      </ul>

      <h4 style={{ marginTop: '20px' }}>Recommendation</h4>
      <p style={{ color: shortTermRec.includes('Buy') ? 'green' : shortTermRec.includes('Sell') ? 'red' : 'orange' }}>
        <strong>Short-Term (&lt;3M): {shortTermRec}</strong>
      </p>
      <p style={{ color: longTermRec.includes('Buy') ? 'green' : longTermRec.includes('Sell') ? 'red' : 'orange' }}>
        <strong>Long-Term (&gt;1Y): {longTermRec}</strong>
      </p>

      <h4>Entry Range:</h4>
      <p>{formatCurrency(entryMin)} – {formatCurrency(entryMax)}</p>

      <h4>Target:</h4>
      <p>{formatCurrency(target)}</p>

      <h4>Stop-Loss:</h4>
      <p>{formatCurrency(stopLoss)}</p>

      <h4>Risk/Reward</h4>
      <p>Risk: {formatPercent(risk)} | Reward: {formatPercent(reward)}</p>
      <p>Ratio: {rrRatio ? `1:${rrRatio.toFixed(2)}` : '—'}</p>
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
    </div>
  );
};

export default StrategyBox;
