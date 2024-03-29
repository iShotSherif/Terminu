const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
let mainWindow; // Ensure this is declared at the top level of your script

function createWindow() {
  mainWindow = new BrowserWindow({ // Removed the `const` keyword here
    width: 1200,
    height: 800,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null; // Properly handle the closure
  });

  mainWindow.loadFile('index.html');
}
if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  })
}

function createPopoutWindow(chartId) {
  const popoutWin = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Assuming you have a route set up in your React app for /popout-chart/:chartId
  // Pass the chartId via a hash in the URL, which you'll parse in the PopoutChart component
  popoutWin.loadURL(`file://${path.join(__dirname, 'index.html')}#/popout-chart/${chartId}`);
}

ipcMain.on('open-popout', (event, chartId) => {
  createPopoutWindow(chartId); // Call this function when the 'open-popout' message is received
});

ipcMain.on('reopen-chart', (event, chartId) => {
  if (mainWindow) {
    console.log(`Sending IPC message to reopen chart with ID: ${chartId}`);
    mainWindow.webContents.send('reopen-chart', chartId);
    } else {
    console.error('The main window is not defined.');
  }
});

function createPopoutNewsWindow(newsId) {
  const popoutNewsWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load your index.html with a specific hash route for the PopoutNews component
  popoutNewsWin.loadURL(`file://${path.join(__dirname, 'index.html')}#/popout-news/${newsId}`);
}

ipcMain.on('open-popout-news', (event, newsId) => {
  createPopoutNewsWindow(newsId); // Call the function when the 'open-popout-news' message is received
});

ipcMain.on('reopen-news', (event, containerId) => {
  mainWindow.webContents.send('reopen-news-widget', containerId);
});

app.whenReady().then(createWindow)