// src/js/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store';
import App from './App';
import { PopoutChart } from './components/PopoutChart';
import { PopoutNews } from './components/PopoutNews'; 

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/popout-chart/:chartId" element={<PopoutChart />} />
        <Route path="/popout-news/:newsId" element={<PopoutNews />} />
      </Routes>
    </Router>
  </Provider>
);