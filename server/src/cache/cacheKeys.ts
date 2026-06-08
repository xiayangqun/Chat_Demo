/**
 * Cache key builder for all Redis cache keys.
 * Follows redis_design.md §5 naming convention with `chat-demo:` prefix.
 */

import { config } from "../config/env.js";

const P = config.REDIS_KEY_PREFIX; // "chat-demo"

export const cacheKeys = {
  /** chat-demo:user:{userId} — single user DTO, TTL 300s */
  user(userId: string): string {
    return `${P}:user:${userId}`;
  },

  /** chat-demo:user-id-by-username:{username} — userId string, TTL 300s */
  userIdByUsername(username: string): string {
    return `${P}:user-id-by-username:${username}`;
  },

  /** chat-demo:users:list:{query}:{limit}:{skip} — UserDTO[], TTL 60s */
  usersList(query: string | undefined, limit: number, skip: number): string {
    const q = query?.trim() || "_all";
    return `${P}:users:list:${q}:${limit}:${skip}`;
  },

  /**
   * chat-demo:cache-index:users-list — Redis SET tracking all users list keys.
   * Used for bulk invalidation on user registration.
   */
  usersListIndex(): string {
    return `${P}:cache-index:users-list`;
  },

  /** chat-demo:conversations:user:{userId} — ConversationDTO[], TTL 60s */
  conversationsForUser(userId: string): string {
    return `${P}:conversations:user:${userId}`;
  },

  /** chat-demo:conversation:{conversationId}:user:{userId} — ConversationDTO, TTL 60s */
  conversationForUser(conversationId: string, userId: string): string {
    return `${P}:conversation:${conversationId}:user:${userId}`;
  },

  /**
   * chat-demo:conversation-members:{conversationId}:{query}:{limit}
   * UserDTO[] — TTL 120s
   */
  conversationMembers(
    conversationId: string,
    query: string | undefined,
    limit: number,
  ): string {
    const q = query?.trim() || "_all";
    return `${P}:conversation-members:${conversationId}:${q}:${limit}`;
  },

  /**
   * chat-demo:messages:{conversationId}:first:{first}:after:{cursorHash}
   * MessageConnection — TTL 30s
   */
  messages(
    conversationId: string,
    first: number,
    after: string | undefined,
    before?: string | undefined,
    last?: number | undefined,
  ): string {
    const cursor = after || "_start";
    const bCursor = before || "_none";
    const lVal = last ?? "_none";
    return `${P}:messages:${conversationId}:first:${first}:after:${cursor}:before:${bCursor}:last:${lVal}`;
  },

  // ── Glob patterns for bulk invalidation ──────────────────────────────

  /** chat-demo:users:list:* — matches all user list caches */
  usersListPattern(): string {
    return `${P}:users:list:*`;
  },

  /** chat-demo:messages:{conversationId}:* — matches all message caches for a conversation */
  messagesPattern(conversationId: string): string {
    return `${P}:messages:${conversationId}:*`;
  },

  /** chat-demo:conversations:user:* — matches all user conversation list caches */
  conversationsForUserPattern(): string {
    return `${P}:conversations:user:*`;
  },

  /** chat-demo:conversation-members:{conversationId}:* — matches all member caches for a conversation */
  conversationMembersPattern(conversationId: string): string {
    return `${P}:conversation-members:${conversationId}:*`;
  },
};
