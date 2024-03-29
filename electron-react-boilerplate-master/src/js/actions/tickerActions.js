import { fetchTickers } from '../utils/TickerAPI';

export const FETCH_TICKERS_REQUEST = 'FETCH_TICKERS_REQUEST';
export const FETCH_TICKERS_SUCCESS = 'FETCH_TICKERS_SUCCESS';
export const FETCH_TICKERS_FAILURE = 'FETCH_TICKERS_FAILURE';

export const fetchTickersRequest = () => ({
  type: FETCH_TICKERS_REQUEST,
});

export const fetchTickersSuccess = (tickers) => ({
  type: FETCH_TICKERS_SUCCESS,
  payload: tickers,
});

export const fetchTickersFailure = (error) => ({
  type: FETCH_TICKERS_FAILURE,
  payload: error,
});

export const fetchTickersAsync = () => {
  return async (dispatch) => {
    dispatch(fetchTickersRequest());
    try {
      const tickers = await fetchTickers();
      dispatch(fetchTickersSuccess(tickers));
    } catch (error) {
      dispatch(fetchTickersFailure(error.message));
    }
  };
};