import {
  FETCH_CANDLESTICK_DATA_START,
  FETCH_CANDLESTICK_DATA_SUCCESS,
  FETCH_CANDLESTICK_DATA_ERROR
} from '../actions/klineActions';

const initialState = {};

const klineDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CANDLESTICK_DATA_START:
      return {
        ...state,
        [action.payload.chartId]: {
          loading: true,
          data: [],
          error: null,
        },
      };
    case FETCH_CANDLESTICK_DATA_SUCCESS:
      return {
        ...state,
        [action.payload.chartId]: {
          loading: false,
          data: action.payload.data,
          error: null,
        },
      };
    case FETCH_CANDLESTICK_DATA_ERROR:
      return {
        ...state,
        [action.payload.chartId]: {
          loading: false,
          data: [],
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};

export default klineDataReducer;