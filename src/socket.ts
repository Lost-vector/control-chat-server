import * as room from "./room.js";
import * as board from "./board/board.js"
import { config } from "./config.js";
import { canConnect, getClientIp, isBanned, releaseConnection, tempBan, trackConnection } from "./limits.js"
import { TokenBucket } from "./rateLimit.js";
import { cleanMessageText } from "./validation.js";
import type { TypedServer } from "./types.js";

export function registerHandlers(io: TypedServer): void {
  io.on("connection", (socket) => {
    const reject = (code: "room_full" | "too_many_connections" | "banned") => {
      socket.emit("room:error", { code });
      socket.disconnect(true);

    }

    const ip = getClientIp(socket);
    if (isBanned(ip)) return reject("banned");
    if (!canConnect(ip)) return reject("too_many_connections");
    if (room.isFull()) return reject("room_full");

    // connection accepted: every counter we increment
    // must be release in the "disconnect" handler
    trackConnection(ip);
    const user = room.addUser(socket.id);
    const bucket = new TokenBucket(config.msgBurst, config.msgRefillPerSec);
    let strikes = 0;

    socket.emit("joined", {
      you: user,
      users: room.listUsers(),
      history: room.getHistory(),
    });

    socket.broadcast.emit("user:joined", { user });
    board.syncPresence(io);

    socket.on("message", (payload) => {
      if (!bucket.take()) {
        strikes++;
        if (strikes >= config.maxStrikes) {
          tempBan(ip, config.banMs);
          socket.disconnect(true);
          return;
        }
        socket.emit("room:notice", { code: "rate_limited" });
        return;
      }

      const text = cleanMessageText(payload?.text);
      if (text === null) {
        socket.emit("room:notice", { code: "invalid_message" });
        return;
      }

      io.emit("message", room.addMessage(user, text));
      void board.handleUserMessage(io, text);
    });

    socket.on("disconnect", (reason) => {
      releaseConnection(ip);
      room.removeUser(socket.id);
      io.emit("user:left", { userId: socket.id });
      board.syncPresence(io);
    });
  });
}