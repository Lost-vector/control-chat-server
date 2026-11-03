import { io } from "socket.io-client";

for (let i = 1; i <= 21; i++) {
  const s = io("http://localhost:3000");
  s.on("joined", ({ you }) => console.log(`#${i} joined as ${you.name}`));
  s.on("room:error", (e) => console.log(`#${i} rejected: ${e.code}`));
}