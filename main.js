const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const server = require('./app');
if (require('electron-squirrel-startup')) app.quit();

app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:8080');

  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile('splash.html');
  splash.center();
  setTimeout(() => {
    splash.close();
    mainWindow.webContents.reloadIgnoringCache();
    mainWindow.show();
  }, 5000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('resize', (e, x, y) => {
  mainWindow.setSize(x, y);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
