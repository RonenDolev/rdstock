// File: utils/strategy.js

export function getRiskReward({
  price,
  growth,
  growth12m,
  peRatio,
  dividendYield,
  rsi,
  macdSignal,
  movingAvg50,
  movingAvg200,
  bullishEngulf = false,
  hammerCount = 0
}) {
  // הגנה על מחיר לא תקין
  const safePrice = typeof price === 'number' && price > 0 ? price : 1;

  // ודאות נתונים
  const validGrowth = typeof growth === 'number' ? growth : 0;
  const validGrowth12m = typeof growth12m === 'number' ? growth12m : 0;

  // חישוב תשואות וסיכונים
  const shortReward = (validGrowth / 100) * safePrice;
  const longReward = (validGrowth12m / 100) * safePrice;
  const shortRisk = safePrice * 0.02;
  const longRisk = safePrice * 0.1;

  // טווח כניסה ויעדים
  const entryRange = {
    min: safePrice * 0.97,
    max: safePrice * 1.03
  };

  const target = safePrice + longReward;
  const stopLoss = safePrice - longRisk;

  // יחס תשואה-סיכון
  const shortRatio = shortRisk > 0 ? shortReward / shortRisk : null;
  const longRatio = longRisk > 0 ? longReward / longRisk : null;

  return {
    shortTerm: {
      risk: shortRisk,
      reward: shortReward,
      ratio: shortRatio
    },
    longTerm: {
      risk: longRisk,
      reward: longReward,
      ratio: longRatio
    },
    entryRange,
    target,
    stopLoss,
    peRatio,
    dividendYield
  };
}
