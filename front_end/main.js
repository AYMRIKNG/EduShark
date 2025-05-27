const { app, BrowserWindow, ipcMain } = require('electron');
const net = require('net');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      nodeIntegration: true,       // pour pouvoir utiliser require() dans renderer
      contextIsolation: false,     // désactivé pour nodeIntegration (pas sécurisé mais simple pour dev)
    }
  });

  mainWindow.loadFile('index.html');
mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  const client = new net.Socket();
  client.connect(12345, '127.0.0.1', () => {
    console.log('Connecté au serveur C++');
  });

client.on('data', (data) => {
  const packets = data.toString().split('\n').filter(s => s.trim().length > 0);
  packets.forEach(packet => {
    try {
      const json = JSON.parse(packet);
      console.log('Envoi au renderer:', json);
      if (mainWindow) {
        mainWindow.webContents.send('new-packet', json);
      }
    } catch (e) {
      console.error('Erreur JSON:', e);
    }
  });
});


  client.on('error', (err) => {
    console.error('Erreur client TCP:', err);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
