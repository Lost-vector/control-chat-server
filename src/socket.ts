import type { Server } from "socket.io";
import * as room from "./room.js";
import * as board from "./board/board.js"
import { cleanMessageText } from "./validation.js";
import type { TypedServer } from "./types.js";

// export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

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
    board.syncPresence(io);

    socket.on("message", (payload) => {
      const text = cleanMessageText(payload?.text);
      if (text === null) return;

      const message = room.addMessage(user, text);
      io.emit("message", message);
      void board.handleUserMessage(io, text);
    });

    socket.on("disconnect", (reason) => {
      room.removeUser(socket.id);
      io.emit("user:left", { userId: socket.id });
      board.syncPresence(io);
      console.log(`- ${user.name} left (${reason}, ${room.userCount()} in room)`);
    });
  });
}