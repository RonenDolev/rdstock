export const safeQuote = async (symbol, yahooFinance) => {
  try {
    const result = await yahooFinance.quote(symbol);
    if (!result || typeof result.regularMarketPrice !== 'number') {
      throw new Error("Incomplete or missing quote data");
    }
    return result;
  } catch (err) {
    console.warn(`⚠️ Yahoo quote failed for ${symbol}:`, err.message);
    return null; // fallback
  }
};
