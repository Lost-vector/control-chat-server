const MAX_LENGTH = 300;

export function cleanMessageText(raw: unknown): string | null{
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  if (text.length === 0 || text.length > MAX_LENGTH) return null;
  return text;
}