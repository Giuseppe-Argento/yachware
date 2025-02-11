import { WebSocketServer } from "ws";
import { randomFloat, randomInt } from "./utils.js"; // Ensure the correct import path

const PORT = 4000;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");

  const sendSensorData = () => {
    if (ws.readyState === ws.OPEN) {
      const data = {
        temperature: randomFloat(20, 35),
        humidity: randomInt(40, 80),
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(data));
    }
  };

  const interval = setInterval(sendSensorData, 1000);

  ws.on("close", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

console.log(`WebSocket Server running on ws://localhost:${PORT}`);
