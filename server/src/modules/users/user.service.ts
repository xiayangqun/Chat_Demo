/**
 * UserService — user queries for Members page, conversation members, batch lookups.
 */

import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { UserModel, type IUserDocument } from "./user.model.js";
import { toUserDTO, type UserDTO } from "./user.mapper.js";
import { ConversationMemberModel } from "../conversations/conversationMember.model.js";
import { CacheService } from "../../cache/cache.service.js";
import { cacheKeys } from "../../cache/cacheKeys.js";
import { config } from "../../config/env.js";

export class UserService {
  /**
   * Get a single user by ID. Returns UserDTO or throws NOT_FOUND.
   * Cached in Redis for CACHE_TTL_SECONDS.
   */
  static async getUserById(userId: string): Promise<UserDTO> {
    const key = cacheKeys.user(userId);
    return CacheService.remember(key, config.CACHE_TTL_SECONDS, async () => {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new GraphQLError("User not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return toUserDTO(user);
    });
  }

  /**
   * List all registered users with optional search query, limit, and skip.
   * Query filters by name or username case-insensitive.
   * Cached in Redis for 60s.
   */
  static async listUsers(
    query?: string,
    limit?: number,
    skip?: number,
  ): Promise<UserDTO[]> {
    const effectiveLimit = Math.min(limit ?? 50, 100);
    const effectiveSkip = skip ?? 0;
    const key = cacheKeys.usersList(query, effectiveLimit, effectiveSkip);

    return CacheService.remember(key, 60, async () => {
      const filter: Record<string, unknown> = {};

      if (query && query.trim().length > 0) {
        const regex = new RegExp(
          query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        );
        filter.$or = [{ name: regex }, { username: regex }];
      }

      const users = await UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(effectiveSkip)
        .limit(effectiveLimit)
        .lean();

      return users.map((u) =>
        toUserDTO(u as unknown as IUserDocument),
      );
    });
  }

  /**
   * Batch query users by IDs. Returns array of UserDTO in the same order.
   * Silently skips IDs that don't match any user.
   * Uses per-user cache; only fetches uncached users from DB.
   */
  static async getUsersByIds(userIds: string[]): Promise<UserDTO[]> {
    if (userIds.length === 0) return [];

    // Check cache for each user individually
    const result = new Map<string, UserDTO>();
    const uncachedIds: string[] = [];

    for (const id of userIds) {
      if (result.has(id)) continue;
      try {
        const cached = await CacheService.getJson<UserDTO>(cacheKeys.user(id));
        if (cached) {
          result.set(id, cached);
        } else {
          uncachedIds.push(id);
        }
      } catch {
        uncachedIds.push(id);
      }
    }

    // Fetch uncached users from DB
    if (uncachedIds.length > 0) {
      const objectIds = uncachedIds.map((id) => new mongoose.Types.ObjectId(id));
      const users = await UserModel.find({ _id: { $in: objectIds } }).lean();

      for (const u of users) {
        const dto = toUserDTO(u as unknown as IUserDocument);
        result.set(dto.id, dto);
        // Cache each user (fire-and-forget)
        void CacheService.setJson(cacheKeys.user(dto.id), dto).catch(() => {});
      }
    }

    // Preserve original order
    return userIds
      .map((id) => result.get(id))
      .filter((u): u is UserDTO => u !== undefined);
  }

  /**
   * Search conversation members for @mentions.
   * Returns users who are members of the given conversation,
   * optionally filtered by name or username query.
   * Cached in Redis for 120s.
   */
  static async searchConversationMembers(
    conversationId: string,
    query?: string,
    limit?: number,
  ): Promise<UserDTO[]> {
    const effectiveLimit = Math.min(limit ?? 10, 50);
    const key = cacheKeys.conversationMembers(
      conversationId,
      query,
      effectiveLimit,
    );

    return CacheService.remember(key, 120, async () => {
      const memberRecords = await ConversationMemberModel.find({
        conversationId: new mongoose.Types.ObjectId(conversationId),
      })
        .select("userId")
        .lean();

      const userIds = memberRecords.map((m) => m.userId);

      if (userIds.length === 0) return [];

      const filter: Record<string, unknown> = {
        _id: { $in: userIds },
      };

      if (query && query.trim().length > 0) {
        const regex = new RegExp(
          query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "i",
        );
        filter.$or = [{ name: regex }, { username: regex }];
      }

      const users = await UserModel.find(filter)
        .limit(effectiveLimit)
        .lean();

      return users.map((u) =>
        toUserDTO(u as unknown as IUserDocument),
      );
    });
  }
}
