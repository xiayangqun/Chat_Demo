/**
 * CacheService — thin wrapper around Redis for JSON get/set/del operations.
 * All operations are wrapped in try/catch and gracefully degrade when Redis
 * is unavailable. Follows redis_design.md §7.
 */

import { getRedis, isRedisAvailable } from "../config/redis.js";
import { config } from "../config/env.js";

/**
 * Minimal Redis command interface we need.
 * Avoids importing ioredis types directly (see MUST NOT rules).
 */
interface RedisCommands {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, ttl?: number): Promise<string | null>;
  setex(key: string, ttl: number, value: string): Promise<string>;
  del(...keys: string[]): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  sadd(key: string, ...members: string[]): Promise<number>;
}

function getRedisCommands(): RedisCommands | null {
  if (!isRedisAvailable()) return null;
  return getRedis() as unknown as RedisCommands | null;
}

const DEFAULT_TTL = config.CACHE_TTL_SECONDS; // 300s

export const CacheService = {
  /**
   * Get a JSON-serialized value from cache.
   * Returns parsed object or null on miss / error.
   */
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const r = getRedisCommands();
      if (!r) return null;
      const raw = await r.get(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /**
   * Set a JSON-serialized value in cache with TTL.
   * Silently no-ops on error.
   */
  async setJson(key: string, value: unknown, ttlSeconds = DEFAULT_TTL): Promise<void> {
    try {
      const r = getRedisCommands();
      if (!r) return;
      await r.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // graceful degradation
    }
  },

  /**
   * Delete a single cache key.
   * Silently no-ops on error.
   */
  async del(key: string): Promise<void> {
    try {
      const r = getRedisCommands();
      if (!r) return;
      await r.del(key);
    } catch {
      // graceful degradation
    }
  },

  /**
   * Delete multiple keys. If keys array is empty, no-op.
   * Supports pattern-based deletion by first resolving matching keys via KEYS.
   * Silently no-ops on error.
   */
  async delMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    try {
      const r = getRedisCommands();
      if (!r) return;

      // Each key might be a pattern (contains *), expand those
      const resolvedKeys: string[] = [];
      for (const k of keys) {
        if (k.includes("*")) {
          const matched = await r.keys(k);
          resolvedKeys.push(...matched);
        } else {
          resolvedKeys.push(k);
        }
      }

      if (resolvedKeys.length === 0) return;
      // Batch delete
      await r.del(...resolvedKeys);
    } catch {
      // graceful degradation
    }
  },

  /**
   * Cache-through pattern: check cache first, on miss call loader,
   * store result, and return it. On error, falls through to loader directly.
   */
  async remember<T>(
    key: string,
    ttlSeconds: number,
    loader: () => Promise<T>,
  ): Promise<T> {
    try {
      const cached = await CacheService.getJson<T>(key);
      if (cached !== null) return cached;
    } catch {
      // fall through to loader
    }

    const result = await loader();

    // Store in cache (fire-and-forget to avoid slowing the response)
    void CacheService.setJson(key, result, ttlSeconds).catch(() => {});

    return result;
  },
};
