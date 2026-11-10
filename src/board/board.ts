import * as room from "../room.js"
import { askModel, type Turn } from "./ai.js"
import { tryConsumeAiCall } from "./budget.js";
import type { TypedServer, User } from "../types.js"

export const BOARD: User = { id: "board", name: "The Board", avatarId: 0 };

const MAX_TURNS = 10;
const FALLBACK = "The Board is not available at this time.";

let active = false;
let busy = false;
let epoch = 0; // increments each time the Board deactivates
let conversation: Turn[] = [];

export function isActive(): boolean {
  return active;
}

export function syncPresence(io: TypedServer) {
  const shouldBeActive = room.userCount() === 1;
  if (shouldBeActive === active) return;

  active = shouldBeActive;
  if (active) {
    io.emit("user:joined", { user: BOARD });
  } else {
    epoch++;
    conversation = [];
    io.emit("user:left", { userId: BOARD.id })
  }
}

function recentTurns(): Turn[] {
  const turns = conversation.slice(-MAX_TURNS);
  while (turns.length > 0 && turns[0].role !== "user") turns.shift();
  return turns;
}

export async function handleUserMessage(io: TypedServer, text: string): Promise<void> {
  if (!active || busy) return;

  if (!tryConsumeAiCall()) {
    io.emit("message", room.addMessage(BOARD, "The channel is closed. Return later, Operative."))
  }

  busy = true;
  const myEpoch = epoch;
  conversation.push({ role: "user", content: text });

  try {
    const reply = (await askModel(recentTurns())) || FALLBACK;

    // if epoch changed, someone joined while we waited: drop the reply.
    if (epoch !== myEpoch) return;

    conversation.push({ role: "assistant", content: reply });
    io.emit("message", room.addMessage(BOARD, reply));
  } catch (err) {
    console.error("Board error:", err);
    if (epoch === myEpoch) {
      conversation.pop(); // remove the unanswered user turn to keep roles alternating
      io.emit("message", room.addMessage(BOARD, FALLBACK));
    }
  } finally {
    busy = false;
  }
}