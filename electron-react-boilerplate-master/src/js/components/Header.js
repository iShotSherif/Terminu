import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChart } from '../actions/chartActions';
import { GridProvider } from './GridContext';
import Chart from './Chart';
import News from './News';
import { SearchProvider } from '../utils/SearchContext';

const Header = () => {
  const dispatch = useDispatch();
  const chartIds = useSelector(state => state.chart.chartIds);
  const [showNews, setShowNews] = useState(false);

  const handleAddChart = () => {
    dispatch(addChart(`chart-${Date.now()}`));
  };

  const handleToggleNews = () => {
    setShowNews(prevShowNews => !prevShowNews);
  };

  return (
    <GridProvider>
      <div>
        <header>
          <button onClick={handleAddChart}>Add Chart</button>
          <button onClick={handleToggleNews}>Add News</button>
        </header>
        <SearchProvider>
        {chartIds.map(chartId => (
          <Chart key={chartId} chartId={chartId} symbol="DGBUSDT"/>
        ))}
        </SearchProvider>
        {showNews && <News containerId="news" onRemove={handleToggleNews} />}
      </div>
    </GridProvider>
  );
};

export default Header;