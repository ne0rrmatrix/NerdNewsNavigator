const { app, BrowserWindow } = require('electron');

const server = require('./app');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL('http://localhost:8080');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
if (require('electron-squirrel-startup')) app.quit();

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
