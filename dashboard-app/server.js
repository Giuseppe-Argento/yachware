import { createServer } from 'http';
import next from 'next';
import { startWebSocketServer } from './lib/wsServer.js'; // Ensure .js extension

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));
  startWebSocketServer(server); // Attach WebSocket server

  server.listen(4000, () => {
    console.log('> WebSocket running on ws://localhost:4000');
  });
});
