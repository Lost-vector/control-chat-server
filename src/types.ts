import type { Server } from "socket.io";

export interface User {
  id: string;
  name: string;
  avatarId: number;
}

export interface ChatMessage {
  id: string;
  author: User;
  text: string;
  timeStamp: number;
}

export interface ServerToClientEvents {
  joined: (payload: { you: User; users: User[]; history: ChatMessage[]; }) => void;
  "user:joined": (payload: { user: User }) => void;
  "user:left": (payload: { userId: string }) => void;
  message: (message: ChatMessage) => void;
  "room:notice": (payload: { code: "rate_limited" | "invalid_message" }) => void;
  "room:error": (payload: { code: "room_full" | "too_many_connections" | "banned" }) => void;
}

export interface ClientToServerEvents {
  message: (payload: { text: string }) => void;
}

export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;