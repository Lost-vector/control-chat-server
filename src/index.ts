import { createServer } from "node:http";
import { Server } from "socket.io";
import { config } from "./config.js";
import { registerHandlers } from "./socket.js";
import type { ClientToServerEvents, ServerToClientEvents } from "./types.js";

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200).end("ok");
    return;
  }
  res.writeHead(404).end();
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: config.allowedOrigins },
  maxHttpBufferSize: 10_000, // bytes per packet (default: 1 Mb)
  allowRequest: (req, callback) => {
    const origin = req.headers.origin;
    // CORS settings don't cover WebSocket upgrades, so check the header ourselves.
    // scripts without an Origin are only allowed outside production.
    const ok = origin ? config.allowedOrigins.includes(origin) : !config.isProduction;
    callback(null, ok);
  }
});

registerHandlers(io);

httpServer.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});