// KlineAPI.js

export const fetchCandlestickData = async (symbol) => {
    const url = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${symbol}&interval=60`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const { result } = await response.json();
        
      const reversedList = result.list
        ? result.list
            .map(([time, open, high, low, close]) => ({
              time: time / 1000,
              open: parseFloat(open),
              high: parseFloat(high),
              low: parseFloat(low),
              close: parseFloat(close),
            }))
            .reverse()
        : [];
  
      return reversedList;
    } catch (error) {
      console.error('Error fetching candlestick data:', error);
      return [];
    }
  };