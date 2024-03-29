import React, { useEffect, useRef } from 'react';
import { useGrid } from './GridContext';

const News = ({ containerId, onRemove }) => {
  const grid = useGrid();
  const newsRef = useRef(null);

  useEffect(() => {
    if (grid && containerId) {
      const widget = grid.addWidget({
        x: 0,
        y: 0,
        w: 3,
        h: 10,
        content: `
          <div id="news-${containerId}" style="width: 100%; height: 100%;">
            <button id="removeNews-${containerId}">Remove News</button>
            <button id="popoutNews-${containerId}">Pop out</button>
          </div>
        `,
        id: containerId,
      });

      newsRef.current = widget;

      const removeButton = document.getElementById(`removeNews-${containerId}`);
      removeButton.addEventListener('click', handleRemoveNews);

      const popoutButton = document.getElementById(`popoutNews-${containerId}`);
      popoutButton.addEventListener('click', handlePopoutNews);
    }

    return () => {
      // Clean up the widget and listeners if needed
      const removeButton = document.getElementById(`removeNews-${containerId}`);
      removeButton?.removeEventListener('click', handleRemoveNews);

      const popoutButton = document.getElementById(`popoutNews-${containerId}`);
      popoutButton?.removeEventListener('click', handlePopoutNews);

      grid.removeWidget(newsRef.current);
    };
  }, [grid, containerId]);

  const handleRemoveNews = () => {
    onRemove();
    grid.removeWidget(newsRef.current);
  };

  const handlePopoutNews = () => {
    window.ipcRenderer.send('open-popout-news', containerId);
    grid.removeWidget(newsRef.current);
  };

  return null;
};

export default News;