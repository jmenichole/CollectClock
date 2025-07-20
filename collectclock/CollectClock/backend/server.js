const WebSocket = require('ws');
const express = require('express');
const casinosRouter = require('./routes/casinos');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

app.use(casinosRouter);

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send('Welcome to the chat!');
});

module.exports = app;
