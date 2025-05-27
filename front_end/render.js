const { ipcRenderer } = require('electron');

ipcRenderer.on('new-frame', (event, frame) => {
  console.log('Trame reçue:', frame);
  const container = document.getElementById('frames');
  const div = document.createElement('div');
  div.textContent = JSON.stringify(frame);
  container.appendChild(div);
});
