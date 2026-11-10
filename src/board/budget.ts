import { config } from "../config.js"

const WINDOW_MS = 60 * 60 * 1000;
let windowStart = Date.now();
let used = 0;

export function tryConsumeAiCall(): boolean {
  const now = Date.now();
  if (now - windowStart >= WINDOW_MS) {
    windowStart = now;
    used = 0;
  }
  if (used >= config.aiMaxCallsPerHour) return false;
  used++;
  return true;
}