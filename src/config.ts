export const config = {
  port: Number(process.env.PORT ?? 3000),
  allowedOrigins: (process.env.ALLOWED_ORIGIN ?? "http://localhost:4200").split(",").map((s) => s.trim()),
  isProduction: process.env.NODE_ENV === "production",
  aiApiKey: process.env.AI_API_KEY ?? "",
  aiModel: process.env.AI_MODEL ?? "gpt-6-luna",

  trustProxyHops: Number(process.env.TRUST_PROXY_HOPS ?? 0),
  bannedIps: (process.env.BANNED_IPS ?? "").split(",").map((s) => s.trim()).filter(Boolean),

  maxConnectionsPerIp: 3,
  msgBurst: 5,
  msgRefillPerSec: 0.5,   // after burst, one msg token every 2s
  maxStrikes: 5,
  banMs: 10 * 60 * 1000,  // 10 minutes
  aiMaxCallsPerHour: 60,
};