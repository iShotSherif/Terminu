// App.js
import React, { useEffect } from 'react';
import Header from './components/Header';
import { useDispatch } from 'react-redux';
import { GridProvider } from './components/GridContext';
import { fetchTickersAsync } from './actions/tickerActions';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTickersAsync());
  }, [dispatch]);

  return (
    <GridProvider>
      <div className="grid-stack">
        <Header />
        {/* Any other components that need access to the grid */}
      </div>
    </GridProvider>
  );
};

export default App;