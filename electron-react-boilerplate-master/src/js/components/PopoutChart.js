// PopoutChart.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeChart } from '../actions/chartActions';
import { useParams } from 'react-router-dom';

export const PopoutChart = () => {
  const dispatch = useDispatch();
  const { chartId } = useParams();


  const handleClosePopoutChart = () => {
    dispatch(removeChart(chartId));
    window.ipcRenderer.send('reopen-chart', chartId)
    window.close();
  };

  return (
    <div>
      <h2>Popout Chart</h2>
      <div id="popoutChartContainer" style={{ width: '100%', height: '400px' }}></div>
      <button onClick={handleClosePopoutChart}>Close</button>
    </div>
  );
};