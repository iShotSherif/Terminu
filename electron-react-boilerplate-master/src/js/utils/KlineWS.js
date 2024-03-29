// KlineWS.js

import { updateWsKlineData } from '../actions/klineWsActions';

let bybitSocket = null;

const mapWebSocketData = (data) => {
  return {
    time: data.start,
    open: parseFloat(data.open),
    high: parseFloat(data.high),
    low: parseFloat(data.low),
    close: parseFloat(data.close),
    volume: parseFloat(data.volume),
  };
};

export const connectBybitWebSocket = (symbol, dispatch) => {
  if (bybitSocket) {
    bybitSocket.close();
  }

  bybitSocket = new WebSocket('wss://stream.bybit.com/contract/usdt/public/v3');

  bybitSocket.onopen = () => {
    console.log('WebSocket connection opened');
    bybitSocket.send(JSON.stringify({
      op: 'subscribe',
      args: [`kline.60.${symbol}`],
    }));
  };

  bybitSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.topic && data.topic.startsWith('kline.')) {
      const klineData = data.data;
      console.log(klineData);

      const mappedData = klineData.map(mapWebSocketData);
      dispatch(updateWsKlineData(symbol, mappedData));
    }
  };

  bybitSocket.onclose = () => {
    console.log('WebSocket connection closed');
  };
};

export const disconnectBybitWebSocket = () => {
  if (bybitSocket) {
    bybitSocket.close();
  }
};