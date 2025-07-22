<<<<<<< HEAD
import React, { useEffect } from 'react';

const RightPanel = ({ analysis }) => {
  const symbol = analysis?.symbol || '—';
  const price = analysis?.price;
  const growth3m = analysis?.growth3m;
  const growth12m = analysis?.growth12m;
  const strategy = analysis?.strategy || {};

  const shortRisk = strategy.shortTerm?.risk;
  const shortReward = strategy.shortTerm?.reward;
  const shortRatio =
    typeof shortRisk === 'number' && shortRisk > 0 && typeof shortReward === 'number'
      ? shortReward / shortRisk
      : null;

  const longRisk = strategy.longTerm?.risk;
  const longReward = strategy.longTerm?.reward;
  const longRatio =
    typeof longRisk === 'number' && longRisk > 0 && typeof longReward === 'number'
      ? longReward / longRisk
      : null;

  useEffect(() => {
    console.log('📦 Received analysis:', analysis);
    console.log('📊 Strategy object:', strategy);
  }, [analysis]);

 const getRecBox = (label, ratio) => {
  let bgColor = '#444';       // רקע ניטרלי
  let textColor = '#eee';     // טקסט בהיר
  let arrow = '•';
  let text = 'No data';

  if (typeof ratio !== 'number' || isNaN(ratio)) {
    // No data
  } else if (ratio > 2) {
    bgColor = '#2e7d32';       // ירוק כהה
    textColor = '#d0f0d0';     // ירוק בהיר
    arrow = '🟢 ↑';
    text = 'Buy';
  } else if (ratio >= 1) {
    bgColor = '#6c5f00';       // זהוב כהה
    textColor = '#fff3b0';     // זהוב בהיר
    arrow = '🟠 →';
    text = 'Hold';
  } else if (ratio > 0 && ratio < 1) {
    bgColor = '#7a1f1f';       // אדום כהה
    textColor = '#ffd5d5';     // אדום בהיר
    arrow = '🔴 ↓';
    text = 'Sell';
  } else if (ratio <= 0) {
    bgColor = '#4b0000';       // אדום עמוק
    textColor = '#ffcccc';     // טקסט רך
    arrow = '❌';
    text = 'Strong Sell';
  }

  return (
    <div style={{
      backgroundColor: bgColor,
      color: textColor,
      padding: '15px 20px',
      borderRadius: '10px',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
    }}>
      <div style={{ fontSize: '16px', marginBottom: '4px', fontWeight: 'bold' }}>{label}</div>
      <div style={{ fontSize: '20px' }}>{arrow} {text}</div>
    </div>
  );
};


  return (
    <div className="panel right-panel">
      <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#eee' }}>Investment Strategy</h2>
      <hr style={{ border: '0.5px solid #ccc', marginBottom: '20px' }} />

      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <p>Stock: {symbol}</p>
        <p><strong>Current Price:</strong> {typeof price === 'number' ? `₪${price.toFixed(2)}` : 'N/A'}</p>

        <h3 style={{ fontSize: '18px', marginTop: '20px' }}>📉 Technical Performance</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Growth (3-Month): {typeof growth3m === 'number' ? `${growth3m.toFixed(2)}%` : 'N/A'}</li>
          <li>Growth (1-Year): {typeof growth12m === 'number' ? `${growth12m.toFixed(2)}%` : 'N/A'}</li>
        </ul>

        <hr style={{ border: '0.5px solid #ccc', margin: '20px 0' }} />
        <h3 style={{ fontSize: '18px' }}>🧭 Recommendation</h3>
        <p>
          Short-Term: {shortRatio !== null
            ? `Risk: ₪${shortRisk?.toFixed(2)} | Reward: ₪${shortReward?.toFixed(2)} | Ratio: ${shortRatio.toFixed(2)}`
            : 'N/A'}
        </p>
        <p>
          Long-Term: {longRatio !== null
            ? `Risk: ₪${longRisk?.toFixed(2)} | Reward: ₪${longReward?.toFixed(2)} | Ratio: ${longRatio.toFixed(2)}`
            : 'N/A'}
        </p>

        <hr style={{ border: '0.5px solid #ccc', margin: '20px 0 10px 0' }} />
        <h3 style={{ fontSize: '18px' }}>📊 Visual Recommendation</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {getRecBox('📈 Short-Term', shortRatio)}
          {getRecBox('📉 Long-Term', longRatio)}
        </div>

        <p><strong>Entry Range:</strong> {strategy.entryRange?.min && strategy.entryRange?.max
          ? `₪${strategy.entryRange.min.toFixed(2)} – ₪${strategy.entryRange.max.toFixed(2)}`
          : 'N/A'}</p>
        <p><strong>Target:</strong> {typeof strategy.target === 'number' ? `₪${strategy.target.toFixed(2)}` : 'N/A'}</p>
        <p><strong>Stop-Loss:</strong> {typeof strategy.stopLoss === 'number' ? `₪${strategy.stopLoss.toFixed(2)}` : 'N/A'}</p>

        <hr style={{ border: '0.5px solid #ccc', margin: '20px 0' }} />
        <p><strong>P/E Ratio:</strong> {typeof strategy.peRatio === 'number' ? strategy.peRatio.toFixed(2) : 'N/A'}</p>
        <p><strong>Dividend Yield:</strong> {typeof strategy.dividendYield === 'number' ? `${strategy.dividendYield.toFixed(2)}%` : 'N/A'}</p>

        <hr style={{ border: '0.5px solid #ccc', margin: '20px 0 10px 0' }} />
        <div style={{ fontSize: '12px', color: '#ccc' }}>
          📊 Strategy is based on:
          <ul>
            <li>📈 Recent price trends (is the price rising steadily?)</li>
            <li>📊 Moving averages: If the stock trades above its 50 and 200 day average</li>
            <li>📉 RSI (Relative Strength Index) between 45–70 indicates healthy momentum</li>
            <li>📌 MACD signal indicates bullish or bearish trend</li>
            <li>📍 Candlestick patterns like hammer or bullish engulfing suggest reversals</li>
            <li>💰 Fundamental factors: Low P/E and high dividend yield suggest value</li>
          </ul>
          <br />
          ➤ If overall score is high, we recommend: <strong>Buy</strong><br />
          ➤ If it's moderate, we recommend: <strong>Hold</strong><br />
          ➤ If score is weak or trends are negative: <strong>Sell</strong>
=======
// File: components/RightPanel.js
import React, { useEffect, useState } from 'react';
import { fetchRealTimePrice, getGrowth, getRiskReward } from '../utils/fetchStockData';
import RiskRewardChart from './RiskRewardChart';

// Normalize index symbols for backend API compatibility
const normalizeSymbol = (symbol) => {
  const map = {
    '^GSPC': 'SPX',
    '^IXIC': 'NDX',
    '^DJI': 'DJI',
    '^RUT': 'RUT'
  };
  return map[symbol] || symbol;
};

const RightPanel = ({ selectedStock, setAnalysis }) => {
  const [price, setPrice] = useState(null);
  const [growth3m, setGrowth3m] = useState(null);
  const [growth12m, setGrowth12m] = useState(null);
  const [riskReward, setRiskReward] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStock) return;

      try {
        console.log(`🔄 Fetching fresh data for ${selectedStock}`);
        const [price, g3, g12, rr] = await Promise.all([
          fetchRealTimePrice(selectedStock),
          getGrowth(selectedStock, 3),
          getGrowth(selectedStock, 12),
          getRiskReward(selectedStock)
        ]);

        setPrice(price);
        setGrowth3m(g3);
        setGrowth12m(g12);
        setRiskReward(rr);
        setAnalysis(rr); // ✅ send riskReward to Home.js
      } catch (err) {
        console.error("❌ Data fetch error in RightPanel:", err);
        setPrice(null);
        setGrowth3m(null);
        setGrowth12m(null);
        setRiskReward(null);
      }
    };

    loadData();
  }, [selectedStock]);

  const shortTermRecommendation = () => {
    if (growth3m === null) return 'No data';
    if (growth3m > 10) return '🟢 ↑ Buy';
    if (growth3m > 2) return '🟠 → Hold';
    return '🔴 ↓ Sell';
  };

  const longTermRecommendation = () => {
    if (growth12m === null) return 'No data';
    if (growth12m > 15) return '🟢 ↑ Buy';
    if (growth12m > 5) return '🟠 → Hold';
    return '🔴 ↓ Sell';
  };

  const sectionDivider = <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }} />;

  return (
    <div style={{ width: '100%', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h2 style={{ fontFamily: 'Bahnschrift Light', fontSize: '30px', marginBottom: '20px' }}>
        Investment Strategy
      </h2>

      <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
        <p><strong>Stock:</strong> {selectedStock || '—'}</p>
        <p><strong>Current Price:</strong> {price ? `$${price.toFixed(2)}` : 'N/A'}</p>

        {sectionDivider}
        <h3 style={{ fontSize: '18px', marginTop: '20px' }}>Technical Performance</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Growth (3-Month): {growth3m !== null ? `${growth3m.toFixed(2)}%` : 'No data'}</li>
          <li>Growth (1-Year): {growth12m !== null ? `${growth12m.toFixed(2)}%` : 'No data'}</li>
        </ul>

        {sectionDivider}
        <h3 style={{ fontSize: '18px', marginTop: '20px' }}>Recommendation</h3>
        <p><strong>Short-Term (&gt;3M):</strong> {shortTermRecommendation()}</p>
        <p><strong>Long-Term (&lt;1Y):</strong> {longTermRecommendation()}</p>

        {sectionDivider}
        <p><strong>Entry Range:</strong> {riskReward ? `$${riskReward.entryRange.min.toFixed(2)} – $${riskReward.entryRange.max.toFixed(2)}` : 'N/A'}</p>
        <p><strong>Target:</strong> {riskReward ? `$${riskReward.target.toFixed(2)}` : 'N/A'}</p>
        <p><strong>Stop-Loss:</strong> {riskReward ? `$${riskReward.stopLoss.toFixed(2)}` : 'N/A'}</p>

      {sectionDivider}
<h3 style={{ fontSize: '18px', marginTop: '20px' }}>Risk/Reward</h3>
<RiskRewardChart
  data={[
    { label: '3M', risk: riskReward?.shortTerm?.risk || 0, reward: riskReward?.shortTerm?.reward || 0 },
    { label: '1Y', risk: riskReward?.longTerm?.risk || 0, reward: riskReward?.longTerm?.reward || 0 }
  ]}
/>

<p>
  <strong>3M →</strong> Risk: {riskReward ? `${riskReward.shortTerm.risk.toFixed(2)}%` : 'N/A'} |
  Reward: {riskReward ? `${riskReward.shortTerm.reward.toFixed(2)}%` : 'N/A'} |
  Ratio: {riskReward ? `1:${riskReward.shortTerm.ratio.toFixed(2)}` : 'N/A'}
</p>
<p>
  <strong>1Y →</strong> Risk: {riskReward ? `${riskReward.longTerm.risk.toFixed(2)}%` : 'N/A'} |
  Reward: {riskReward ? `${riskReward.longTerm.reward.toFixed(2)}%` : 'N/A'} |
  Ratio: {riskReward ? `1:${riskReward.longTerm.ratio.toFixed(2)}` : 'N/A'}
</p>
<p style={{ fontSize: '13px', color: '#444', marginTop: '10px' }}>
  <strong>Tip:</strong> A risk/reward ratio above <strong>1:2</strong> is generally considered a good trade-off.
  The higher the ratio, the better the potential return for the risk taken.
  Use this to decide if the stock is worth buying — aim for <strong>1:2 or higher</strong> before entering a position.
</p>


        <div style={{ fontSize: '12px', marginTop: '20px', color: '#555' }}>
          *Strategy auto-generated based on chart patterns, fundamentals, and AI logic.
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
