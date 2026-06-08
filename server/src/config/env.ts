/**
 * Type-safe environment variable access.
 * All values are read from process.env after dotenv has loaded them.
 */

function parseBoolean(val: string | undefined, defaultVal: boolean): boolean {
  if (val === undefined || val === "") {
    return defaultVal;
  }
  return val === "true" || val === "1";
}

function parseNumber(val: string | undefined, defaultVal: number): number {
  if (val === undefined || val === "") {
    return defaultVal;
  }
  const n = parseInt(val, 10);
  return Number.isNaN(n) ? defaultVal : n;
}

export const config = {
  PORT: parseNumber(process.env.PORT, 4000),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/chat-demo",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  REDIS_KEY_PREFIX: process.env.REDIS_KEY_PREFIX || "chat-demo",
  CACHE_TTL_SECONDS: parseNumber(process.env.CACHE_TTL_SECONDS, 300),
  SOCKET_REDIS_ADAPTER_ENABLED: parseBoolean(
    process.env.SOCKET_REDIS_ADAPTER_ENABLED,
    true,
  ),
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  SEED_DATABASE: parseBoolean(process.env.SEED_DATABASE, false),
} as const;

export type Config = typeof config;
