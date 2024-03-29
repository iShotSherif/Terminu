// KlineWS.js

import { updateWsKlineData } from '../actions/klineWsActions';

let bybitSocket = null;
let subscriptions = new Set();
let isConnected = false;

const mapWebSocketData = (data) => {
  return {
    time: data.start / 1000,
    open: parseFloat(data.open),
    high: parseFloat(data.high),
    low: parseFloat(data.low),
    close: parseFloat(data.close),
    volume: parseFloat(data.volume),
  };
};

export const connectBybitWebSocket = (symbol, dispatch) => {
  if (!bybitSocket) {
    bybitSocket = new WebSocket('wss://stream.bybit.com/contract/usdt/public/v3');

    bybitSocket.onopen = () => {
      console.log('WebSocket connection opened');
      isConnected = true;
      subscribeToSymbol(symbol);
    };

    bybitSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.topic && data.topic.startsWith('kline.')) {
        const symbol = data.topic.split('.')[2];
        const klineData = data.data;
        console.log(klineData);
        const mappedData = klineData.map(mapWebSocketData);
        dispatch(updateWsKlineData(symbol, mappedData));
      }
    };

    bybitSocket.onclose = () => {
      console.log('WebSocket connection closed');
      bybitSocket = null;
      subscriptions.clear();
      isConnected = false;
    };
  } else if (isConnected) {
    subscribeToSymbol(symbol);
  }
};

const subscribeToSymbol = (symbol) => {
  if (!subscriptions.has(symbol)) {
    bybitSocket.send(JSON.stringify({
      op: 'subscribe',
      args: [`kline.1.${symbol}`],
    }));
    subscriptions.add(symbol);
  }
};

export const disconnectBybitWebSocket = (symbol) => {
  if (bybitSocket && subscriptions.has(symbol)) {
    bybitSocket.send(JSON.stringify({
      op: 'unsubscribe',
      args: [`kline.1.${symbol}`],
    }));
    subscriptions.delete(symbol);

    if (subscriptions.size === 0) {
      bybitSocket.close();
    }
  }
};