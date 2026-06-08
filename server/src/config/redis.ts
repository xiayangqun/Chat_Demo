import Redis from "ioredis";
import { config } from "./env.js";

/** Minimal subset of ioredis.Redis used by this module */
interface RedisLike {
  on(event: string, listener: (...args: unknown[]) => void): this;
  disconnect(): void;
}

let redis: RedisLike | null = null;
let redisAvailable = false;

export function connectRedis(): RedisLike {
  // ioredis has declaration-merged class+interface which breaks NodeNext
  // Use cast through unknown to bypass the type quirk
  const RedisConstructor = Redis as unknown as new (
    url: string,
    opts?: Record<string, unknown>,
  ) => RedisLike;

  redis = new RedisConstructor(config.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  redis.on("connect", () => {
    redisAvailable = true;
    console.log("Redis connected");
  });

  redis.on("error", (err: unknown) => {
    redisAvailable = false;
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Redis unavailable (server will continue):", message);
  });

  redis.on("close", () => {
    redisAvailable = false;
  });

  return redis;
}

export function disconnectRedis(): void {
  if (redis) {
    redis.disconnect();
    redis = null;
    redisAvailable = false;
  }
}

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

export function getRedis(): RedisLike | null {
  return redis;
}
