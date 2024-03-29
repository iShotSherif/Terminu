const { createStore, applyMiddleware } = require('redux');
const { thunk } = require('redux-thunk'); // Make sure this import is correct for your redux-thunk version
const rootReducer = require('./reducers').default;

const initialState = {};

// Logging middleware
const loggerMiddleware = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(loggerMiddleware, thunk) // Apply middleware
);

module.exports = store;
