const net = require('net');

const client = new net.Socket();

client.connect(12345, '127.0.0.1', () => {
  console.log('Connecté au serveur C++');
});

client.on('data', (data) => {
  // Parfois les données peuvent arriver en morceaux, on peut split par \n
  const packets = data.toString().split('\n').filter(s => s.trim().length > 0);
  packets.forEach(packet => {
    try {
      const json = JSON.parse(packet);
      console.log('Paquet reçu:', json);
      // ici tu peux mettre à jour ton UI ou stocker les paquets
    } catch(e) {
      console.error('Erreur JSON:', e, 'avec data:', packet);
    }
  });
});

client.on('close', () => {
  console.log('Connexion fermée');
});

client.on('error', (err) => {
  console.error('Erreur client TCP:', err);
});
