export const config = {
  port: Number(process.env.PORT ?? 3000),
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? "http://localhost:4200",
  aiApiKey: process.env.AI_API_KEY ?? "",
  aiModel: process.env.AI_MODEL ?? "claude-haiku-5-5",
};