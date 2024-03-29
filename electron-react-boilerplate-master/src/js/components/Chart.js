import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGrid } from './GridContext';
import { removeChart, popoutChart, addChart } from '../actions/chartActions';
import { fetchCandlestickDataAsync } from '../actions/klineActions';
import { connectWebSocket, disconnectWebSocket } from '../actions/klineWsActions';
import { createChart } from 'lightweight-charts';

const Chart = ({ chartId, symbol }) => {
  const dispatch = useDispatch();
  const klineData = useSelector(state => state.klineData[chartId]);
  const klineWSData = useSelector(state => state.klineWS[symbol]);
  const grid = useGrid();
  const chartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const filterData = useCallback((searchTerm) => {
    if (!tickers.list || !Array.isArray(tickers.list)) return [];

    const upperCaseSearchTerm = searchTerm.toUpperCase();
    return tickers.list.filter(item => item.symbol.startsWith(upperCaseSearchTerm) && item.quoteCoin === "USDT");
  }, [tickers]);

  const renderSearchResults = useCallback((results, searchResultsElement) => {
    searchResultsElement.innerHTML = '';

    results.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.symbol;
      li.addEventListener('click', () => {
        handleSymbolClick(item.symbol);
        setSearchTerm('');
        setSearchResults([]);
      });
      searchResultsElement.appendChild(li);
    });
  }, [handleSymbolClick]);

  const handleSymbolClick = useCallback((newSymbol) => {
    dispatch(fetchCandlestickDataAsync(newSymbol, chartId));
    dispatch(disconnectWebSocket());
    dispatch(connectWebSocket(newSymbol));

    const searchInput = document.getElementById(`searchInput-${chartId}`);
    searchInput.value = newSymbol;

    // Reset the existing candlestick series
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData([]);
    }
  }, [dispatch, chartId]);

  useEffect(() => {
    if (chartId && symbol) {
      dispatch(fetchCandlestickDataAsync(symbol, chartId));
      dispatch(connectWebSocket(symbol));
    }

    return () => {
      dispatch(disconnectWebSocket());
    };
  }, [dispatch, chartId, symbol]);

  useEffect(() => {
    console.log('klineData changed:', klineData);

    const candlestickSeries = candlestickSeriesRef.current;
    if (candlestickSeries && klineData && klineData.data) {
      console.log('Setting initial data:', klineData.data);
      candlestickSeries.setData(klineData.data);
    }
  }, [klineData]);

  useEffect(() => {
    const handleSearchInput = (event) => {
      const searchTerm = event.target.value.trim();
      setSearchTerm(searchTerm);

      if (searchTerm !== '') {
        const filteredResults = filterData(searchTerm);
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    };

    const initializeChart = () => {
      if (grid && chartId) {
        const widget = grid.addWidget({
          x: 0,
          y: 10,
          w: 6,
          h: 20,
          content: `
            <div id="${chartId}" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
              <div class="card-header">
                <div class="chart-header" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background-color: #f0f0f0; cursor: move;">
                  <div style="display: flex; align-items: center;">
                    <input
                      type="text"
                      id="searchInput-${chartId}"
                      placeholder="Search symbol..."
                      style="width: 200px; padding: 5px; margin-right: 10px;"
                    />
                    <ul id="searchResults-${chartId}" style="list-style-type: none; padding: 0; margin: 0;"></ul>
                  </div>
                  <div>
                    <button id="removeChart-${chartId}" style="margin-left: 10px;">Remove Chart</button>
                    <button id="popoutChart-${chartId}" style="margin-left: 10px;">Pop out</button>
                  </div>
                </div>
              </div>
              <div id="chartContainer-${chartId}" style="width: 100%; height: calc(100% - 50px);"></div>
            </div>
          `,
          id: chartId,
        });

        chartRef.current = widget;
        chartContainerRef.current = document.getElementById(`chartContainer-${chartId}`);
        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
          handleScale: {
            mouseWheel: true,
            pinch: true,
            axisDoubleClickReset: true,
            axisPressedMouseMove: {
              time: true,
              price: true,
            },
          },
          handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
          },
        });
        chartInstanceRef.current = chart;

        const candlestickSeries = chart.addCandlestickSeries();
        candlestickSeriesRef.current = candlestickSeries;

        const searchInput = document.getElementById(`searchInput-${chartId}`);
        const searchResults = document.getElementById(`searchResults-${chartId}`);

        searchInput.addEventListener('input', handleSearchInput);

        const removeButton = document.getElementById(`removeChart-${chartId}`);
        removeButton.addEventListener('click', handleRemoveChart);

        const popoutButton = document.getElementById(`popoutChart-${chartId}`);
        popoutButton.addEventListener('click', handlePopoutChart);

        const resizeObserver = new ResizeObserver(entries => {
          const { width, height } = entries[0].contentRect;
          chart.applyOptions({ width, height });
        });
        resizeObserver.observe(chartContainerRef.current);

        return () => {
          if (chartRef.current) {
            grid.removeWidget(chartRef.current);
          }
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
          searchInput.removeEventListener('input', handleSearchInput);
        };
      }
    };

    const cleanup = initializeChart();

    return cleanup;
  }, [grid, chartId, filterData, renderSearchResults, handleRemoveChart, handlePopoutChart]);

  useEffect(() => {
    const searchResultsElement = document.getElementById(`searchResults-${chartId}`);
    renderSearchResults(searchResults, searchResultsElement);
  }, [chartId, searchResults, renderSearchResults]);

  useEffect(() => {
    console.log('klineWSData changed:', klineWSData);

    const candlestickSeries = candlestickSeriesRef.current;
    if (candlestickSeries && klineWSData && klineWSData.data) {
      console.log('Received WebSocket data from Redux store:', klineWSData.data);

      const newData = klineWSData.data;
      console.log('Latest WebSocket data point:', newData);

      if (newData) {
        const existingData = candlestickSeries.getData();
        const lastExistingBar = existingData[existingData.length - 1];

        if (lastExistingBar && lastExistingBar.time === newData.time) {
          console.log('Updating last bar:', newData);
          candlestickSeries.update(newData);
        } else {
          console.log('Adding new bar:', newData);
          candlestickSeries.update(newData);
        }

        const chartInstance = chartInstanceRef.current;
        if (chartInstance) {
          const priceScale = chartInstance.priceScale();
          priceScale.applyOptions({
            autoScale: true,
            scaleMargins: {
              top: 0.1,
              bottom: 0.1,
            },
          });
          chartInstance.timeScale().fitContent();
        }
      }
    }
  }, [klineWSData]);

  const handleRemoveChart = useCallback(() => {
    dispatch(removeChart(chartId));
    grid.removeWidget(chartRef.current);
    dispatch(disconnectWebSocket());
  }, [dispatch, chartId, grid]);

  const handlePopoutChart = useCallback(() => {
    dispatch(popoutChart(chartId));
    grid.removeWidget(chartRef.current);
    window.ipcRenderer.send('open-popout', chartId);
    dispatch(disconnectWebSocket());
  }, [dispatch, chartId, grid]);

  useEffect(() => {
    const handleReopenChart = (id) => {
      if (id === chartId) {
        dispatch(addChart(chartId));
        dispatch(connectWebSocket(symbol));
      }
    };
    window.ipcRenderer.on('reopen-chart', handleReopenChart);
    return () => {
      window.ipcRenderer.removeListener('reopen-chart', handleReopenChart);
    };
  }, [chartId, dispatch, symbol]);

  return null;
};

export default Chart;