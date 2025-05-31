const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/frontend' });

// Connect to MQTT broker (use your MQTT broker URL)
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org");

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("vital/utente"); // same topic as ESP32 publishes
});

mqttClient.on("message", (topic, message) => {
  // message is Buffer — convert to string and parse JSON
  const data = message.toString();
  console.log("MQTT message received:", data);

  // Broadcast MQTT message to all WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});

// WebSocket connection handler
wss.on("connection", ws => {
  console.log("New WebSocket client connected");

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Optional REST endpoint for testing
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
