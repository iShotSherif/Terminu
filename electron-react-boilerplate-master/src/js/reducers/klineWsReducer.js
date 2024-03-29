// klineWsReducer.js

import { UPDATE_KLINE_DATA } from '../actions/klineWsActions';

const initialState = {};

const klineWsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_KLINE_DATA:
      const { symbol, data } = action.payload;
      const newState = {
        ...state,
        [symbol]: {
          ...state[symbol],
          data: data,
        },
      };

      console.log('Updated state:', newState);
      return newState;

    default:
      return state;
  }
};

export default klineWsReducer;