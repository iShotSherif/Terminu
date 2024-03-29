import React from 'react';
import { useParams } from 'react-router-dom';

export const PopoutNews = () => {
  const { containerId } = useParams();

  const handleClose = () => {
    window.ipcRenderer.send('reopen-news', containerId);
    window.close();
  };

  return (
    <div>
      <h2>Popout News</h2>
      <div id="popoutNewsContainer" style={{ width: '100%', height: '100%' }}>
        News Content for {containerId}
      </div>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};