import { fetchCandlestickData } from "../utils/KlineAPI";

export const FETCH_CANDLESTICK_DATA_START = 'FETCH_CANDLESTICK_DATA_START';
export const FETCH_CANDLESTICK_DATA_SUCCESS = 'FETCH_CANDLESTICK_DATA_SUCCESS';
export const FETCH_CANDLESTICK_DATA_ERROR = 'FETCH_CANDLESTICK_DATA_ERROR';

export const fetchCandlestickDataStart = (chartId) => ({
  type: FETCH_CANDLESTICK_DATA_START,
  payload: { chartId },
});

export const fetchCandlestickDataSuccess = (data, chartId) => ({
  type: FETCH_CANDLESTICK_DATA_SUCCESS,
  payload: { data, chartId },
});

export const fetchCandlestickDataError = (error, chartId) => ({
  type: FETCH_CANDLESTICK_DATA_ERROR,
  payload: { error, chartId },
});

export const fetchCandlestickDataAsync = (symbol, chartId) => async (dispatch) => {
  dispatch(fetchCandlestickDataStart(chartId));

  try {
    const data = await fetchCandlestickData(symbol);
    dispatch(fetchCandlestickDataSuccess(data, chartId));
  } catch (error) {
    dispatch(fetchCandlestickDataError(error, chartId));
  }
};