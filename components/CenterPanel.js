<<<<<<< HEAD
// File: components/CenterPanel.js
import React, { useEffect, useRef, useState } from 'react';
import { stockList } from '../utils/stockList';
import styles from './CenterPanel.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LabelList
} from 'recharts';

const getTradingViewSymbol = (symbol) => {
  const stock = stockList.find(s => s.symbol === symbol);
  return stock ? stock.symbol : symbol;
=======
import React, { useEffect, useRef } from 'react';

// Use ETF alternatives for index symbols to avoid TradingView restrictions
const getTradingViewSymbol = (symbol) => {
  const map = {
    '^GSPC': 'AMEX:SPY',
    '^IXIC': 'NASDAQ:QQQ',
    '^DJI': 'AMEX:DIA',
    '^RUT': 'AMEX:IWM'
  };
  return map[symbol] || `NASDAQ:${symbol}`;
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
};

const CenterPanel = ({ selectedStock }) => {
  const shortTermRef = useRef(null);
<<<<<<< HEAD
  const [data, setData] = useState(null);

  useEffect(() => {
    const container = shortTermRef.current;
    if (!selectedStock || !container) return;

    const tvSymbol = getTradingViewSymbol(selectedStock);
    container.innerHTML = "";
=======

  useEffect(() => {
    if (!selectedStock || !shortTermRef.current) return;

    const tvSymbol = getTradingViewSymbol(selectedStock);
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
<<<<<<< HEAD
      symbol: tvSymbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies", "BB@tv-basicstudies", "Fib Retracement@tv-basicstudies"],
      enable_publishing: false,
      hide_top_toolbar: false,
      allow_symbol_change: false,
      container_id: container.id
    });

    container.appendChild(script);
  }, [selectedStock]);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/analysis?symbol=${selectedStock}`);
      const result = await res.json();

      // fallback זמני להצגת EPS אם אין נתונים בפועל
      if (
        result?.epsTrend &&
        result.epsTrend.every((e) => e.estimate === null && e.actual === null)
      ) {
        result.epsTrend = [
          { period: "2Q2024", estimate: 2.5, actual: 2.4 },
          { period: "3Q2024", estimate: 2.6, actual: null },
          { period: "4Q2024", estimate: 2.7, actual: null },
          { period: "1Q2025", estimate: 2.8, actual: null },
        ];
      }

      setData(result);
    } catch (err) {
      console.error("שגיאה בטעינת ניתוח אנליסטים:", err);
      setData(null);
    }
  };

  if (selectedStock) fetchData();
}, [selectedStock]);


  const getTargetBar = () => {
    const { high, low, mean, current } = data.priceTarget;
    const min = low;
    const max = high;
    const scale = (value) => ((value - min) / (max - min)) * 100;
    return (
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>Price Target</h4>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <div style={{ background: '#333', height: '12px', position: 'relative', borderRadius: '4px' }}>
            <div style={{ position: 'absolute', left: `${scale(current)}%`, top: '-25px', background: '#000', color: '#fff', padding: '2px 5px', fontSize: '12px', borderRadius: '4px' }}>
              Current: {current}
            </div>
            <div style={{ position: 'absolute', left: `${scale(mean)}%`, top: '20px', background: '#2196f3', color: '#fff', padding: '2px 5px', fontSize: '12px', borderRadius: '4px' }}>
              Average: {mean}
            </div>
            <div style={{ position: 'absolute', left: `${scale(current)}%`, height: '100%', width: '2px', background: '#0f0' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px', color: '#aaa' }}>
            <span>Low: {low}</span>
            <span>High: {high}</span>
          </div>
        </div>
      </div>
    );
  };

  const buildEPSChartData = () => {
    return data.epsTrend
      .filter(e => e.estimate !== null || e.actual !== null)
      .map(item => ({
        period: item.period,
        Estimate: item.estimate,
        Actual: item.actual
      }));
  };

  const analystRecommendationData = [
    { month: 'Mar', StrongBuy: 7, Buy: 16, Hold: 14, Sell: 9, total: 46 },
    { month: 'Apr', StrongBuy: 7, Buy: 16, Hold: 14, Sell: 9, total: 46 },
    { month: 'May', StrongBuy: 7, Buy: 16, Hold: 14, Sell: 8, total: 45 },
    { month: 'Jun', StrongBuy: 7, Buy: 16, Hold: 14, Sell: 8, total: 45 },
  ];

  return (
    <div className="panel center-panel">
      <h2 className={styles.title} style={{ color: '#ccc' }}>📊 Technical Chart - {selectedStock}</h2>

      <div id="short-term-chart" ref={shortTermRef} className={styles.chartContainer} />

      <div style={{ direction: 'rtl', color: '#ccc', fontSize: '14px', marginTop: '20px', fontFamily: '"Segoe UI", sans-serif' }}>
        <h3>💡 טיפים טכניים</h3>
        <ul>
          <li>📈 כאשר קווי MACD מצטלבים כלפי מעלה – זה עשוי להצביע על מגמה שוּרית.</li>
          <li>💪 ערך RSI מעל 50 מעיד על מומנטום חיובי בשוק.</li>
          <li>📉 נר ירוק ארוך יותר מהאדום – לחץ קנייה עולה.</li>
          <li>🔍 המערכת שלנו ממליצה לפי שילוב האינדיקטורים על קנייה / החזקה / מכירה.</li>
          <li>📊 נפח מסחר גבוה בשילוב עלייה – מעיד על אמון המשקיעים.</li>
          <li>⏳ RSI מעל 70 – עלול להעיד על עומס קנייה.</li>
          <li>📉 ירידה בממוצעים נעים – עשויה להצביע על מגמת ירידה מתקרבת.</li>
        </ul>
      </div>

      <hr style={{ margin: '30px 0', borderColor: '#444' }} />

      <div style={{ direction: 'ltr', color: '#ccc', fontSize: '14px' }}>
        <h2 style={{ fontSize: '150%', marginBottom: '10px' }}>📋 Analyst Analysis - {selectedStock}</h2>
        {data ? (
          <>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
              <div style={{ flex: 1, minWidth: '300px', paddingRight: '20px', borderRight: '1px solid #444' }}>
                <h4>EPS Trend</h4>
                {data.epsTrend?.length > 0 && data.epsTrend.some(e => e.estimate !== null || e.actual !== null) ? (
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                      <LineChart data={buildEPSChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="period" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip />
                        <Line type="monotone" dataKey="Estimate" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="Actual" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#888' }}>No EPS forecast data available for this stock.</p>
                )}
              </div>

              <div style={{ flex: 1, minWidth: '300px', paddingLeft: '20px' }}>
                <h4>Analyst Recommendations</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analystRecommendationData} stackOffset="sign">
                    <XAxis dataKey="month" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="StrongBuy" stackId="a" fill="#0f9d58">
                      <LabelList dataKey={(entry) => ((entry.StrongBuy / entry.total) * 100).toFixed(0) + '%'} position="center" fill="#fff" fontSize={10} />
                    </Bar>
                    <Bar dataKey="Buy" stackId="a" fill="#34a853">
                      <LabelList dataKey={(entry) => ((entry.Buy / entry.total) * 100).toFixed(0) + '%'} position="center" fill="#fff" fontSize={10} />
                    </Bar>
                    <Bar dataKey="Hold" stackId="a" fill="#fbbc05">
                      <LabelList dataKey={(entry) => ((entry.Hold / entry.total) * 100).toFixed(0) + '%'} position="center" fill="#000" fontSize={10} />
                    </Bar>
                    <Bar dataKey="Sell" stackId="a" fill="#ea4335">
                      <LabelList dataKey={(entry) => ((entry.Sell / entry.total) * 100).toFixed(0) + '%'} position="center" fill="#fff" fontSize={10} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

           <div style={{ display: 'flex', gap: '40px', marginTop: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
  <div style={{ flex: 1, minWidth: '300px' }}>
    {getTargetBar()}
  </div>

  {/* קו אנכי מפריד */}
  <div style={{ width: '1px', background: '#444', height: '100%', alignSelf: 'stretch' }} />

  <div style={{ flex: 1, minWidth: '300px', paddingLeft: '20px' }}>
    <h4>Growth Estimates</h4>
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #555' }}>
          <th style={{ textAlign: 'left', padding: '8px' }}>Period</th>
          <th style={{ textAlign: 'left', padding: '8px' }}>Growth %</th>
        </tr>
      </thead>
      <tbody>
        {/* המשך הטבלה... */}



                    <tr><td style={{ padding: '8px' }}>This Year</td><td>{(data.growthEstimate.thisYear * 100).toFixed(2)}%</td></tr>
                    <tr><td style={{ padding: '8px' }}>Next Year</td><td>{(data.growthEstimate.nextYear * 100).toFixed(2)}%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr style={{ margin: '20px 0', borderColor: '#444' }} />
            <div style={{ direction: 'rtl', fontSize: '14px', fontFamily: '"Segoe UI", sans-serif' }}>
              <p><strong>📘 מקרא:</strong></p>
              <ul>
                <li><strong>EPS:</strong> רווח למניה.</li>
                <li><strong>Price Target:</strong> תחזית מחיר עתידי לפי אנליסטים.</li>
                <li><strong>Strong Buy / Buy:</strong> המלצות קנייה.</li>
                <li><strong>Hold:</strong> המלצה להחזיק את המניה.</li>
                <li><strong>Sell:</strong> המלצה למכירה.</li>
                <li><strong>Growth Estimate:</strong> תחזית אחוזי הצמיחה של החברה.</li>
              </ul>
            </div>
          </>
        ) : (
          <p>⏳ Loading analyst analysis...</p>
        )}
      </div>
=======
      symbol: `${tvSymbol}`, // string literal format
      interval: "60",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      studies: [
        "MACD@tv-basicstudies",
        "RSI@tv-basicstudies",
        "BB@tv-basicstudies",
        "Fibonacci Retracemnt@tv-basicstudies"
      ],
      enable_publishing: false,
      hide_top_toolbar: false,
      allow_symbol_change: false,
      container_id: shortTermRef.current.id
    });

    shortTermRef.current.innerHTML = "";
    shortTermRef.current.appendChild(script);
  }, [selectedStock]);

  return (
    <div style={{ width: '100%', padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h2 style={{ fontSize: '28px', fontFamily: 'Bahnschrift Light', marginBottom: '30px' }}>Technical Chart</h2>
      
      <div id="short-term-chart" ref={shortTermRef} style={{ height: '620px', marginBottom: '20px' }} />

      <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
        <strong>🛈 Tip:</strong> <br />
        1. The chart shows how the stock moves and helps spot useful signals. <br />
        2. When the <strong>MACD lines cross upward</strong>, it's often a sign the stock may go up. <br />
        3. If the <strong>RSI number is above 50</strong>, it suggests strength or buying momentum. <br />
        4. <strong>Green candlesticks</strong> (longer than red ones) often mean the price is rising steadily. <br />
        5. Our system looks at these signals to suggest if it's a good time to <strong>Buy</strong>, <strong>Hold</strong>, or <strong>Sell</strong> — using both the price trend and how strong the move is.
      </p>
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
    </div>
  );
};

export default CenterPanel;
