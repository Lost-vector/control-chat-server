import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected as", socket.id);
  socket.emit("message", { text: "Hello from the test client" });
});

socket.on("welcome", (payload) => console.log("welcome:", payload));
socket.on("disconnect", (reason) => console.log("disconnected:", reason));