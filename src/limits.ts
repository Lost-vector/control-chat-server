import type { Socket } from "socket.io";
import { config } from "./config.js";

const connectionsPerIp = new Map<string, number>();
const tempBans = new Map<string, number>();
const permanentBans = new Set(config.bannedIps);

export function getClientIp(socket: { handshake: Socket["handshake"] }): string {
  const header = socket.handshake.headers["x-forwarded-for"];
  const raw = Array.isArray(header) ? header.join(",") : header;
  if (config.trustProxyHops > 0 && raw) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const ip = parts[parts.length - config.trustProxyHops];
    if (ip) return ip;
  }
  return socket.handshake.address;
}

export function isBanned(ip: string): boolean {
  if (permanentBans.has(ip)) return true;
  const until = tempBans.get(ip);
  if (until === undefined) return false;
  if (until <= Date.now()) {
    tempBans.delete(ip);
    return false;
  }
  return true;
}

export function tempBan(ip: string, ms: number): void {
  tempBans.set(ip, Date.now() + ms);
}

export function canConnect(ip: string): boolean {
  return (connectionsPerIp.get(ip) ?? 0) < config.maxConnectionsPerIp;
}

export function trackConnection(ip: string): void {
  connectionsPerIp.set(ip, (connectionsPerIp.get(ip) ?? 0) + 1);
}

export function releaseConnection(ip: string): void {
  const n = (connectionsPerIp.get(ip) ?? 1) - 1;
  if (n <= 0) connectionsPerIp.delete(ip);
  else connectionsPerIp.set(ip, n);
}