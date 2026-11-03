import { randomUUID } from "crypto";
import { randomName } from "./identity.js";
import type { ChatMessage, User } from "./types.js";

const MAX_USERS = 20;
const MAX_HISTORY = 50;
const AVATAR_COUNT = 20;

const users = new Map<string, User>();
const history: ChatMessage[] = [];

export function isFull(): boolean {
  return users.size >= MAX_USERS;
}

export function userCount(): number {
  return users.size;
}

export function addUser(id: string): User {
  const used = new Set([...users.values()].map((u) => u.avatarId));
  const free = Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1).filter((n) => !used.has(n));
  
  if (free.length === 0) throw new Error("No free avatar: check isFull() first");

  const user: User = {
    id,
    name: randomName(),
    avatarId: free[Math.floor(Math.random() * free.length)],
  };

  users.set(id, user);
  return user;
}

export function removeUser(id: string): User | undefined {
  const user = users.get(id);
  users.delete(id);
  return user;
}

export function listUsers(): User[] {
  return [...users.values()];
}

export function getHistory(): ChatMessage[] {
  return [...history];
}

export function addMessage(author: User, text: string): ChatMessage {
  const message: ChatMessage = { id: randomUUID(), author, text, timeStamp: Date.now() };
  history.push(message);
  if (history.length > MAX_HISTORY) history.shift();
  return message;
}