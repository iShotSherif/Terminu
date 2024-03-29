// klineWsActions.js

import { connectBybitWebSocket, disconnectBybitWebSocket } from '../utils/KlineWS';

export const UPDATE_KLINE_DATA = 'UPDATE_KLINE_DATA';

export const updateWsKlineData = (symbol, data) => ({
  type: UPDATE_KLINE_DATA,
  payload: { symbol, data },
});

export const connectWebSocket = (symbol) => {
  return (dispatch) => {
    connectBybitWebSocket(symbol, dispatch);
  };
};

export const disconnectWebSocket = () => {
  return () => {
    disconnectBybitWebSocket();
  };
};