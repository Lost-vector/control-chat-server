import type { Server } from "socket.io";
import * as room from "./room.js";
import { cleanMessageText } from "./validation.js";
import type { ClientToServerEvents, ServerToClientEvents } from "./types.js";

export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

export function registerHandlers(io: TypedServer): void {
  io.on("connection", (socket) => {
    if (room.isFull()) {
      socket.emit("room:error", { code: "room_full" });
      socket.disconnect(true);
      return;
    }

    const user = room.addUser(socket.id);
    console.log(`+ ${user.name} joined (${room.userCount()} in room)`);

    socket.emit("joined", {
      you: user,
      users: room.listUsers(),
      history: room.getHistory(),
    });

    socket.broadcast.emit("user:joined", { user });

    socket.on("message", (payload) => {
      const text = cleanMessageText(payload?.text);
      if (text === null) return;

      const message = room.addMessage(user, text);
      io.emit("message", message);
    });

    socket.on("disconnect", (reason) => {
      room.removeUser(socket.id);
      io.emit("user:left", { userId: socket.id });
      console.log(`- ${user.name} left (${reason}, ${room.userCount()} in room)`);
    });
  });
}