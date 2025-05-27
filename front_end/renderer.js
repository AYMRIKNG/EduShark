const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const ul = document.getElementById('packets-list');

  ipcRenderer.on('new-packet', (event, packet) => {
    const li = document.createElement('li');
     console.log('Packet reçu dans renderer:', packet);
    li.textContent = JSON.stringify(packet, null, 2);
    ul.prepend(li);
  });
});
