import {
    FETCH_TICKERS_REQUEST,
    FETCH_TICKERS_SUCCESS,
    FETCH_TICKERS_FAILURE,
  } from '../actions/tickerActions';
  
  const initialState = {
    loading: false,
    tickers: [],
    error: null,
  };
  
  const tickerReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_TICKERS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case FETCH_TICKERS_SUCCESS:
        return {
          ...state,
          loading: false,
          tickers: action.payload,
        };
      case FETCH_TICKERS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default tickerReducer;