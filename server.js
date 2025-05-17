const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: '/frontend' });

let clients = new Set();

wss.on('connection', ws => {
  console.log('Cliente WebSocket conectado');
  clients.add(ws);

  ws.on('message', message => {
    console.log('Dados recebidos do ESP32:', message);

    // Retransmitir para todos os clientes (frontend)
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
