const MAX_LENGTH = 300;
const INVISIBLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g;

export function cleanMessageText(raw: unknown): string | null{
  if (typeof raw !== "string") return null;
  if (raw.length > MAX_LENGTH * 4) return null; // cheap early rejection
  const text = raw.replace(INVISIBLE, "").replace(/\s+/g, " ").trim();
  if (text.length === 0 || text.length > MAX_LENGTH) return null;
  return text;
}