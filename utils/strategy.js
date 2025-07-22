export function getRiskReward({
  price,
  growth,
  growth12m,
  peRatio,
  dividendYield,
  rsi,
  macdValue,          // מקבל את ערך ה-MACD (לדוגמה, ההבדל בין MACD ל-Signal)
  movingAvg50,
  movingAvg200,
  bullishEngulf = false,
  hammerCount = 0,
  atr                   // Average True Range למדידת תנודתיות
}) {
  const safe = (x, def = 0) => (typeof x === 'number' && !isNaN(x) ? x : def);
  
  const p = safe(price, 1);
  const g = safe(growth);
  const g12 = safe(growth12m);
  const pe = safe(peRatio);
  const div = safe(dividendYield);
  const rsiVal = safe(rsi);
  const macd = safe(macdValue);
  const volatility = safe(atr, p * 0.02);  // אם אין ATR, נניח 2% מהמחיר
  
  // משקל דינמי לצמיחה (משקל לפי תנודתיות)
  const growthWeightShort = volatility > p * 0.03 ? 0.6 : 0.4;
  const growthWeightLong = 1 - growthWeightShort;
  
  const baseReward = p * ((g * growthWeightShort) + (g12 * growthWeightLong)) / 100;
  
  // סיכון מבוסס ATR (יותר רלוונטי מתלות באחוז קבוע)
  const baseRisk = volatility + (100 - rsiVal) / 100;

  // תוספות דפוסי נרות – מגדילות תשואה
  const bullishMultiplier = bullishEngulf ? 1.25 : 1;
  const hammerMultiplier = hammerCount > 0 ? 1 + hammerCount * 0.05 : 1;
  
  // שיפור סיכון/תשואה לטווח קצר, עם MACD חיובי
  const macdMultiplier = macd > 0 ? 1.2 : 0.9;
  
  const shortTermReward = baseReward * bullishMultiplier * hammerMultiplier * macdMultiplier;
  const shortTermRisk = baseRisk * (rsiVal < 30 ? 0.75 : 1);
  
  // לטווח ארוך – דיבידנדים ויחס P/E
  const divMultiplier = div > 2 ? 1.3 : 1;
  const peMultiplier = pe > 25 ? 0.85 : pe < 15 ? 1.2 : 1;
  const longTermReward = baseReward * divMultiplier * peMultiplier;
  const longTermRisk = baseRisk * (pe > 25 ? 1.3 : 1);
  
  // טווח כניסה - בין ממוצעים נעים, או סביב המחיר הנוכחי
  const entryMin = movingAvg50 && movingAvg200 ? Math.min(movingAvg50, movingAvg200) : p * 0.95;
  const entryMax = movingAvg50 && movingAvg200 ? Math.max(movingAvg50, movingAvg200) : p * 1.05;
  
  // עצירת הפסד דינמית לפי ATR (1.5 * ATR מתחת למחיר)
  const stopLoss = p - 1.5 * volatility;
  const target = p + longTermReward * 1.2;
  
  return {
    shortTerm: {
      reward: shortTermReward,
      risk: shortTermRisk,
      ratio: shortTermRisk > 0 ? shortTermReward / shortTermRisk : null
    },
    longTerm: {
      reward: longTermReward,
      risk: longTermRisk,
      ratio: longTermRisk > 0 ? longTermReward / longTermRisk : null
    },
    peRatio: pe,
    dividendYield: div,
    entryRange: {
      min: entryMin,
      max: entryMax
    },
    stopLoss,
    target
  };
}
