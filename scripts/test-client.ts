import { io } from "socket.io-client";
import type { User } from "../src/types.js";

const socket = io("http://localhost:3000");

socket.on("joined", ({ you, users, history }) => {
  console.log(`I am ${you.name} (avatar ${you.avatarId})`);
  console.log(`Users: ${users.map((u: User) => u.name).join(", ")}`);
  console.log(`History: ${history.length} messages`);
  socket.emit("message", { text: `Hello, I'm ${you.name}` });
});

socket.on("user:joined", ({ user }) => console.log(`> ${user.name} joined`));
socket.on("user:left", ({ userId }) => console.log(`> ${userId} left`));
socket.on("message", (m) => console.log(`[${m.author.name}] ${m.text}`));
socket.on("room:error", (e) => console.log("error:", e.code));