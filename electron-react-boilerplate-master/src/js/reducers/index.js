// reducers/index.js
import { combineReducers } from 'redux';
import chartReducer from './chartReducer';
import klineDataReducer  from './klineReducer';
import tickerReducer from './tickerReducer';
import klineWsReducer from './klineWsReducer'

const rootReducer = combineReducers({
  chart: chartReducer,
  klineData: klineDataReducer ,
  tickers: tickerReducer,
  klineWS: klineWsReducer,
});

export default rootReducer;