import type { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "./types.js";

export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function registerHandlers(io: TypedServer): void {
  io.on("connection", (socket) => {
    const online = io.engine.clientsCount;
    console.log(`+ ${socket.id} connected (${online} online)`);

    socket.emit("welcome", { id: socket.id, online });

    socket.on("message", (payload) => {
      console.log(`${socket.id} says: ${payload.text}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`- ${socket.id} left (${reason})`);
    });
  });
}