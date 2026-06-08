/**
 * ConversationService — conversation CRUD, membership, unread management.
 */

import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import {
  ConversationModel,
} from "./conversation.model.js";
import {
  ConversationMemberModel,
} from "./conversationMember.model.js";
import { MessageModel } from "../messages/message.model.js";
import { UserModel, type IUserDocument } from "../users/user.model.js";
import { toConversationDTO, type ConversationDTO } from "./conversation.mapper.js";
import { getRealtimeService } from "../../realtime/socketServer.js";
import { ConversationType } from "../../generated/chat_realtime.js";
import { CacheService } from "../../cache/cache.service.js";
import { cacheKeys } from "../../cache/cacheKeys.js";

export class ConversationService {
  /**
   * Get all conversations for a user, sorted by updatedAt descending.
   * Returns hydrated ConversationDTOs with memberCount, unreadCount, and lastMessage.
   */
  static async getConversationsForUser(
    userId: string,
  ): Promise<ConversationDTO[]> {
    const key = cacheKeys.conversationsForUser(userId);
    return CacheService.remember(key, 60, async () => {
      // Find all conversation memberships for this user
      const memberships = await ConversationMemberModel.find({
        userId: new mongoose.Types.ObjectId(userId),
      })
        .sort({ updatedAt: -1 })
        .lean();

      if (memberships.length === 0) return [];

      const conversationIds = memberships.map((m) => m.conversationId);

      // Fetch all conversations
      const conversations = await ConversationModel.find({
        _id: { $in: conversationIds },
      })
        .sort({ updatedAt: -1 })
        .lean();

      // Build maps for efficient lookup
      const membershipMap = new Map<string, Record<string, unknown>>();
      for (const m of memberships) {
        membershipMap.set(m.conversationId.toString(), m as unknown as Record<string, unknown>);
      }

      // Batch fetch member counts for all conversations
      const memberCounts = await ConversationMemberModel.aggregate([
        { $match: { conversationId: { $in: conversationIds } } },
        { $group: { _id: "$conversationId", count: { $sum: 1 } } },
      ]);
      const memberCountMap = new Map<string, number>();
      for (const mc of memberCounts) {
        memberCountMap.set(mc._id.toString(), mc.count);
      }

      // Batch fetch last messages
      const lastMessageIds = conversations
        .map((c) => c.lastMessageId)
        .filter((id): id is mongoose.Types.ObjectId => id !== null);

      const lastMessageMap = new Map<string, Record<string, unknown>>();
      const lastMessageSenderMap = new Map<string, Record<string, unknown>>();

      if (lastMessageIds.length > 0) {
        const messages = await MessageModel.find({
          _id: { $in: lastMessageIds },
        }).lean();

        const senderIds = [
          ...new Set(messages.map((m) => m.senderId.toString())),
        ];
        const senders = await UserModel.find({
          _id: { $in: senderIds },
        }).lean();
        const senderMap = new Map<string, Record<string, unknown>>();
        for (const s of senders) {
          senderMap.set(s._id.toString(), s as unknown as Record<string, unknown>);
        }

        for (const msg of messages) {
          lastMessageMap.set(
            msg._id.toString(),
            msg as unknown as Record<string, unknown>,
          );
          lastMessageSenderMap.set(
            msg._id.toString(),
            senderMap.get(msg.senderId.toString())!,
          );
        }
      }

      // Build DTOs preserving the sorted order
      const conversationMap = new Map<string, Record<string, unknown>>();
      for (const c of conversations) {
        conversationMap.set(
          c._id.toString(),
          c as unknown as Record<string, unknown>,
        );
      }

      return conversationIds
        .map((cid) => {
          const conv = conversationMap.get(cid.toString());
          if (!conv) return null;
          const membership = membershipMap.get(cid.toString());
          const memberCount = memberCountMap.get(cid.toString()) ?? 0;
          const lastMsgId = (conv as Record<string, unknown>).lastMessageId as
            | { toString(): string }
            | null;
          const lastMsg = lastMsgId
            ? lastMessageMap.get(lastMsgId.toString()) ?? null
            : null;
          const lastMsgSender = lastMsgId
            ? lastMessageSenderMap.get(lastMsgId.toString()) ?? null
            : null;
          return toConversationDTO(
            conv,
            membership,
            memberCount,
            lastMsg,
            lastMsgSender,
          );
        })
        .filter((c): c is ConversationDTO => c !== null);
    });
  }

  /**
   * Get a single conversation by ID with membership check.
   * Throws FORBIDDEN if user is not a member, NOT_FOUND if conversation doesn't exist.
   */
  static async getConversationById(
    conversationId: string,
    userId: string,
  ): Promise<ConversationDTO> {
    const key = cacheKeys.conversationForUser(conversationId, userId);
    return CacheService.remember(key, 60, async () => {
      const conversation = await ConversationModel.findById(
        conversationId,
      ).lean();
      if (!conversation) {
        throw new GraphQLError("Conversation not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      const membership = await ConversationMemberModel.findOne({
        conversationId: new mongoose.Types.ObjectId(conversationId),
        userId: new mongoose.Types.ObjectId(userId),
      }).lean();

      if (!membership) {
        throw new GraphQLError("You are not a member of this conversation.", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const memberCount = await ConversationMemberModel.countDocuments({
        conversationId: new mongoose.Types.ObjectId(conversationId),
      });

      // Hydrate last message if exists
      let lastMsg: Record<string, unknown> | null = null;
      let lastMsgSender: Record<string, unknown> | null = null;
      if (conversation.lastMessageId) {
        const msg = await MessageModel.findById(
          conversation.lastMessageId,
        ).lean();
        if (msg) {
          lastMsg = msg as unknown as Record<string, unknown>;
          const sender = await UserModel.findById(msg.senderId).lean();
          lastMsgSender = sender as unknown as Record<string, unknown>;
        }
      }

      return toConversationDTO(
        conversation as unknown as Record<string, unknown>,
        membership as unknown as Record<string, unknown>,
        memberCount,
        lastMsg,
        lastMsgSender,
      );
    });
  }

  /**
   * Create a new group conversation.
   */
  static async createGroupConversation(
    input: { name: string; memberUserIds: string[] },
    creatorUserId: string,
  ): Promise<ConversationDTO> {
    const name = input.name.trim();
    if (name.length < 1 || name.length > 60) {
      throw new GraphQLError(
        "Conversation name must be 1 to 60 characters.",
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }

    // Deduplicate and include creator
    const uniqueMemberIds = [
      ...new Set([creatorUserId, ...input.memberUserIds]),
    ];

    if (uniqueMemberIds.length < 2) {
      throw new GraphQLError(
        "A group conversation needs at least 2 members.",
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }

    // Verify all member IDs are valid users
    const objectIds = uniqueMemberIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    const existingUsers = await UserModel.countDocuments({
      _id: { $in: objectIds },
    });
    if (existingUsers !== uniqueMemberIds.length) {
      throw new GraphQLError(
        "One or more memberUserIds are not valid users.",
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }

    // Create conversation
    const conversation = await ConversationModel.create({
      name,
      type: "GROUP",
      avatarUrls: [],
      createdByUserId: new mongoose.Types.ObjectId(creatorUserId),
    });

    // Create member records
    const now = new Date();
    const memberDocs = uniqueMemberIds.map((memberId) => ({
      conversationId: conversation._id,
      userId: new mongoose.Types.ObjectId(memberId),
      role: memberId === creatorUserId ? ("OWNER" as const) : ("MEMBER" as const),
      unreadCount: 0,
      lastReadAt: memberId === creatorUserId ? now : null,
    }));

    await ConversationMemberModel.insertMany(memberDocs);

    const convDTO = toConversationDTO(
      conversation as unknown as Record<string, unknown>,
      null,
      uniqueMemberIds.length,
      null,
      null,
    );

    const realtimeService = getRealtimeService();
    const convProto = {
      id: convDTO.id,
      name: convDTO.name,
      type: ConversationType.GROUP,
      avatarUrls: convDTO.avatarUrls,
      memberCount: convDTO.memberCount,
      unreadCount: 0,
      mentionCount: 0,
      createdAt: convDTO.createdAt.toISOString(),
      updatedAt: convDTO.updatedAt.toISOString(),
    };

    for (const memberId of uniqueMemberIds) {
      if (memberId === creatorUserId) {
        void realtimeService.emitConversationUpdated(creatorUserId, convProto);
      } else {
        void realtimeService.emitConversationCreated(memberId, convProto);
      }
    }

    // Invalidate conversation list cache for all members
    const convListKeys = uniqueMemberIds.map(
      (id) => cacheKeys.conversationsForUser(id),
    );
    void CacheService.delMany(convListKeys).catch(() => {});
    // Invalidate member cache for this conversation
    void CacheService.delMany([
      cacheKeys.conversationMembersPattern(conversation._id.toString()),
    ]).catch(() => {});

    return convDTO;
  }

  /**
   * Create a direct (1-on-1) conversation between the current user and another user.
   * If a DIRECT conversation already exists between them, returns the existing one.
   */
  static async createDirectConversation(
    targetUserId: string,
    currentUserId: string,
  ): Promise<ConversationDTO> {
    if (targetUserId === currentUserId) {
      throw new GraphQLError("Cannot create a conversation with yourself.", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Verify target user exists
    const targetUser = await UserModel.findById(targetUserId).lean();
    if (!targetUser) {
      throw new GraphQLError("User not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    // Check if a DIRECT conversation already exists between these two users
    const myMemberships = await ConversationMemberModel.find({
      userId: new mongoose.Types.ObjectId(currentUserId),
    }).lean();

    const myConvIds = myMemberships.map((m) => m.conversationId);

    if (myConvIds.length > 0) {
      const existingDirect = await ConversationMemberModel.findOne({
        conversationId: { $in: myConvIds },
        userId: new mongoose.Types.ObjectId(targetUserId),
      }).lean();

      if (existingDirect) {
        // Found existing DIRECT conversation — return it
        const conversation = await ConversationModel.findById(
          existingDirect.conversationId,
        ).lean();
        if (conversation && conversation.type === "DIRECT") {
          const memberCount = await ConversationMemberModel.countDocuments({
            conversationId: conversation._id,
          });
          const myMembership = myMemberships.find(
            (m) => m.conversationId.toString() === conversation._id.toString(),
          );
          return toConversationDTO(
            conversation as unknown as Record<string, unknown>,
            myMembership as unknown as Record<string, unknown>,
            memberCount,
            null,
            null,
          );
        }
      }
    }

    // Create new DIRECT conversation
    const targetName = targetUser.name || targetUser.username;
    const conversation = await ConversationModel.create({
      name: targetName,
      type: "DIRECT",
      avatarUrls: targetUser.avatarUrl ? [targetUser.avatarUrl] : [],
      createdByUserId: new mongoose.Types.ObjectId(currentUserId),
    });

    const now = new Date();
    const memberDocs = [
      {
        conversationId: conversation._id,
        userId: new mongoose.Types.ObjectId(currentUserId),
        role: "OWNER" as const,
        unreadCount: 0,
        lastReadAt: now,
      },
      {
        conversationId: conversation._id,
        userId: new mongoose.Types.ObjectId(targetUserId),
        role: "MEMBER" as const,
        unreadCount: 0,
        lastReadAt: null,
      },
    ];

    await ConversationMemberModel.insertMany(memberDocs);

    const convDTO = toConversationDTO(
      conversation as unknown as Record<string, unknown>,
      null,
      2,
      null,
      null,
    );

    const realtimeService = getRealtimeService();
    const convProto = {
      id: convDTO.id,
      name: convDTO.name,
      type: ConversationType.DIRECT,
      avatarUrls: convDTO.avatarUrls,
      memberCount: convDTO.memberCount,
      unreadCount: 0,
      mentionCount: 0,
      createdAt: convDTO.createdAt.toISOString(),
      updatedAt: convDTO.updatedAt.toISOString(),
    };

    void realtimeService.emitConversationUpdated(currentUserId, convProto);
    void realtimeService.emitConversationCreated(targetUserId, convProto);

    // Invalidate conversation list cache
    void CacheService.delMany([
      cacheKeys.conversationsForUser(currentUserId),
      cacheKeys.conversationsForUser(targetUserId),
    ]).catch(() => {});

    return convDTO;
  }

  /**
   * Mark a conversation as read for the given user.
   * Sets unreadCount=0 and lastReadAt=now.
   * Returns the updated conversation DTO.
   */
  static async markConversationRead(
    conversationId: string,
    userId: string,
  ): Promise<ConversationDTO> {
    const membership = await ConversationMemberModel.findOneAndUpdate(
      {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      {
        $set: { unreadCount: 0, mentionCount: 0, lastReadAt: new Date() },
      },
      { new: true },
    ).lean();

    if (!membership) {
      throw new GraphQLError("You are not a member of this conversation.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    // Return the conversation DTO
    const conversation = await ConversationModel.findById(
      conversationId,
    ).lean();
    if (!conversation) {
      throw new GraphQLError("Conversation not found.", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const memberCount = await ConversationMemberModel.countDocuments({
      conversationId: new mongoose.Types.ObjectId(conversationId),
    });

    const dto = toConversationDTO(
      conversation as unknown as Record<string, unknown>,
      membership as unknown as Record<string, unknown>,
      memberCount,
      null,
      null,
    );

    const realtimeService = getRealtimeService();
    void realtimeService.emitConversationUpdated(userId, {
      id: dto.id,
      name: dto.name,
      type: dto.type === "GROUP" ? ConversationType.GROUP : ConversationType.DIRECT,
      avatarUrls: dto.avatarUrls,
      memberCount: dto.memberCount,
      unreadCount: dto.unreadCount,
      mentionCount: dto.mentionCount,
      createdAt: dto.createdAt.toISOString(),
      updatedAt: dto.updatedAt.toISOString(),
    });

    // Invalidate user's conversation list and this conversation detail cache
    void CacheService.delMany([
      cacheKeys.conversationsForUser(userId),
      cacheKeys.conversationForUser(conversationId, userId),
    ]).catch(() => {});

    return dto;
  }

  /**
   * Increment unreadCount for all members of a conversation except the sender.
   */
  static async incrementUnreadForOtherMembers(
    conversationId: string,
    senderId: string,
  ): Promise<void> {
    await ConversationMemberModel.updateMany(
      {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        userId: { $ne: new mongoose.Types.ObjectId(senderId) },
      },
      {
        $inc: { unreadCount: 1 },
      },
    );
  }

  static async incrementMentionCount(
    conversationId: string,
    mentionedUserIds: string[],
  ): Promise<void> {
    await ConversationMemberModel.updateMany(
      {
        conversationId: new mongoose.Types.ObjectId(conversationId),
        userId: { $in: mentionedUserIds.map((id) => new mongoose.Types.ObjectId(id)) },
      },
      {
        $inc: { mentionCount: 1 },
      },
    );
  }

  /**
   * Update conversation's lastMessageId and bump updatedAt.
   */
  static async setLastMessage(
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessageId: new mongoose.Types.ObjectId(messageId),
        updatedAt: new Date(),
      },
    });
  }
}
