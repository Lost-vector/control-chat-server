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
  cors: { origin: config.allowedOrigin },
});

registerHandlers(io);

httpServer.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});