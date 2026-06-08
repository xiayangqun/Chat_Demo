/**
 * MessageService — message CRUD with cursor-based pagination.
 */

import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { MessageModel, type IMessageDocument } from "./message.model.js";
import { UserModel, type IUserDocument } from "../users/user.model.js";
import { ConversationMemberModel } from "../conversations/conversationMember.model.js";
import { ConversationService } from "../conversations/conversation.service.js";
import {
  validateMessage,
  type SendMessageInput,
} from "./message.validation.js";
import {
  toMessageDTO,
  type MessageDTO,
} from "./message.mapper.js";
import { getRealtimeService } from "../../realtime/socketServer.js";
import {
  MessageType,
  ConversationType,
} from "../../generated/chat_realtime.js";
import { CacheService } from "../../cache/cache.service.js";
import { cacheKeys } from "../../cache/cacheKeys.js";

export interface MessageEdge {
  cursor: string;
  node: MessageDTO;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface MessageConnection {
  edges: MessageEdge[];
  nodes: MessageDTO[];
  pageInfo: PageInfo;
}

export interface SendMessagePayload {
  message: MessageDTO;
  conversation: Record<string, unknown>;
  clientMutationId: string | null;
}

export class MessageService {
  /**
   * Get messages for a conversation with cursor-based pagination.
   * Uses _id as cursor. Sorts by createdAt asc, _id asc.
   */
  static async getMessages(
    conversationId: string,
    userId: string,
    first?: number,
    after?: string,
  ): Promise<MessageConnection> {
    // Verify membership
    const membership = await ConversationMemberModel.findOne({
      conversationId: new mongoose.Types.ObjectId(conversationId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    if (!membership) {
      throw new GraphQLError("You are not a member of this conversation.", {
        extensions: { code: "FORBIDDEN" },
      });
    }

    const limit = Math.min(first ?? 30, 50);
    const key = cacheKeys.messages(conversationId, limit, after);

    return CacheService.remember(key, 30, async () => {
      // Build query filter
      const filter: Record<string, unknown> = {
        conversationId: new mongoose.Types.ObjectId(conversationId),
      };

      // Cursor pagination: _id > after
      if (after) {
        filter._id = { $gt: new mongoose.Types.ObjectId(after) };
      }

      // Fetch one extra to determine hasNextPage
      const messages = await MessageModel.find(filter)
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit + 1)
        .lean();

      const hasNextPage = messages.length > limit;
      const slicedMessages = hasNextPage ? messages.slice(0, limit) : messages;

      // Hydrate all messages
      const hydratedMessages = await MessageService.hydrateMessages(
        slicedMessages as unknown as IMessageDocument[],
      );

      const edges: MessageEdge[] = hydratedMessages.map((msg) => ({
        cursor: msg.id,
        node: msg,
      }));

      return {
        edges,
        nodes: hydratedMessages,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
      };
    });
  }

  /**
   * Send a message.
   * - Validates input
   * - Creates message document
   * - Updates conversation lastMessageId
   * - Increments unread for other members
   * - Returns SendMessagePayload
   */
  static async sendMessage(
    input: SendMessageInput,
    senderId: string,
  ): Promise<SendMessagePayload> {
    // Validate
    const validated = await validateMessage(input, senderId);

    // Create message
    const message = await MessageModel.create({
      conversationId: new mongoose.Types.ObjectId(validated.conversationId),
      senderId: new mongoose.Types.ObjectId(senderId),
      type: "TEXT",
      body: validated.body,
      quoteMessageId: validated.quoteMessageId
        ? new mongoose.Types.ObjectId(validated.quoteMessageId)
        : null,
      mentionUserIds: validated.mentionUserIds.map(
        (id) => new mongoose.Types.ObjectId(id),
      ),
    });

    // Update conversation lastMessage
    await ConversationService.setLastMessage(
      validated.conversationId,
      message._id.toString(),
    );

    // Increment unread for other members
    await ConversationService.incrementUnreadForOtherMembers(
      validated.conversationId,
      senderId,
    );

    // Hydrate the message for response
    const hydratedMessage = await MessageService.hydrateMessage(message);

    // Increment mentionCount for mentioned users
    if (hydratedMessage.mentions.length > 0) {
      const mentionUserIds = hydratedMessage.mentions.map((m) => m.id);
      await ConversationService.incrementMentionCount(
        validated.conversationId,
        mentionUserIds,
      );
    }

    // Get the updated conversation for the response
    const conversation = await ConversationService.getConversationById(
      validated.conversationId,
      senderId,
    );

    // ── Realtime: broadcast message.created + conversation.updated ────
    const realtimeService = getRealtimeService();

    const messagePayload = {
      id: hydratedMessage.id,
      conversationId: validated.conversationId,
      sender: {
        id: hydratedMessage.sender.id,
        username: hydratedMessage.sender.username,
        name: hydratedMessage.sender.name,
      },
      type: MessageType.TEXT,
      body: validated.body,
      mentions: hydratedMessage.mentions.map((m) => ({
        id: m.id,
        username: m.username,
        name: m.name,
      })),
      createdAt: hydratedMessage.createdAt.toISOString(),
      updatedAt: hydratedMessage.updatedAt.toISOString(),
    };

    const members = await ConversationMemberModel.find({
      conversationId: new mongoose.Types.ObjectId(validated.conversationId),
    }).lean();

    // Send to each member's user room
    for (const member of members) {
      if (member.userId.toString() === senderId) continue;
      void realtimeService.emitMessageCreatedToUser(member.userId.toString(), messagePayload);
    }

    const convType =
      conversation.type === "GROUP"
        ? ConversationType.GROUP
        : ConversationType.DIRECT;

    for (const member of members) {
      if (member.userId.toString() === senderId) continue;

      void realtimeService.emitConversationUpdated(member.userId.toString(), {
        id: conversation.id,
        name: conversation.name,
        type: convType,
        avatarUrls: conversation.avatarUrls,
        memberCount: conversation.memberCount,
        unreadCount: member.unreadCount ?? 0,
        mentionCount: member.mentionCount ?? 0,
        lastMessage: conversation.lastMessage
          ? {
              id: conversation.lastMessage.id,
              conversationId: conversation.lastMessage.conversationId,
              sender: {
                id: conversation.lastMessage.sender.id,
                username: conversation.lastMessage.sender.username,
                name: conversation.lastMessage.sender.name,
              },
              body: conversation.lastMessage.body,
              type: MessageType.TEXT,
              createdAt: new Date(conversation.lastMessage.createdAt).toISOString(),
            }
          : undefined,
        createdAt: new Date(conversation.createdAt).toISOString(),
        updatedAt: new Date(conversation.updatedAt).toISOString(),
      });
    }

    // Invalidate message cache for this conversation + all user conversation lists
    void CacheService.delMany([
      cacheKeys.messagesPattern(validated.conversationId),
      cacheKeys.conversationsForUserPattern(),
    ]).catch(() => {});

    return {
      message: hydratedMessage,
      conversation: conversation as unknown as Record<string, unknown>,
      clientMutationId: input.clientMutationId ?? null,
    };
  }

  /**
   * Hydrate a single message: populate sender, quoteMessage (with sender), and mentions.
   */
  static async hydrateMessage(
    message: IMessageDocument | Record<string, unknown>,
  ): Promise<MessageDTO> {
    const msg = message as Record<string, unknown>;
    const senderId = (msg.senderId as { toString(): string }).toString();
    const quoteMsgId = msg.quoteMessageId as { toString(): string } | null;
    const mentionIds =
      (msg.mentionUserIds as Array<{ toString(): string }>) ?? [];

    // Fetch sender
    const sender = await UserModel.findById(senderId).lean();
    if (!sender) {
      throw new GraphQLError("Message sender not found.", {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }

    // Fetch quote message and its sender if present
    let quoteMessage: Record<string, unknown> | null = null;
    let quoteMessageSender: Record<string, unknown> | null = null;
    if (quoteMsgId) {
      const qMsg = await MessageModel.findById(quoteMsgId.toString()).lean();
      if (qMsg) {
        quoteMessage = qMsg as unknown as Record<string, unknown>;
        const qSender = await UserModel.findById(qMsg.senderId).lean();
        quoteMessageSender = qSender as unknown as Record<string, unknown>;
      }
    }

    // Fetch mentions
    let mentions: Record<string, unknown>[] = [];
    if (mentionIds.length > 0) {
      const mentionObjectIds = mentionIds.map(
        (id) => new mongoose.Types.ObjectId(id.toString()),
      );
      const mentionDocs = await UserModel.find({
        _id: { $in: mentionObjectIds },
      }).lean();
      mentions = mentionDocs.map(
        (u) => u as unknown as Record<string, unknown>,
      );
    }

    return toMessageDTO({
      message: msg,
      sender: sender as unknown as IUserDocument,
      quoteMessage,
      quoteMessageSender,
      mentions: mentions as unknown as IUserDocument[],
    });
  }

  /**
   * Batch-hydrate multiple messages efficiently.
   */
  private static async hydrateMessages(
    messages: IMessageDocument[],
  ): Promise<MessageDTO[]> {
    if (messages.length === 0) return [];

    // Collect all unique IDs needed
    const senderIds = new Set<string>();
    const quoteMessageIds = new Set<string>();
    const mentionUserIds = new Set<string>();

    for (const msg of messages) {
      const m = msg as unknown as Record<string, unknown>;
      senderIds.add((m.senderId as { toString(): string }).toString());
      if (m.quoteMessageId) {
        quoteMessageIds.add(
          (m.quoteMessageId as { toString(): string }).toString(),
        );
      }
      const mIds =
        (m.mentionUserIds as Array<{ toString(): string }>) ?? [];
      for (const mid of mIds) {
        mentionUserIds.add(mid.toString());
      }
    }

    // Batch fetch all users
    const allUserIds = [...new Set([...senderIds, ...mentionUserIds])];
    const allUsers = await UserModel.find({
      _id: {
        $in: allUserIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    }).lean();

    const userMap = new Map<string, Record<string, unknown>>();
    for (const u of allUsers) {
      userMap.set(u._id.toString(), u as unknown as Record<string, unknown>);
    }

    // Batch fetch quote messages
    const quoteMessagesMap = new Map<string, Record<string, unknown>>();
    const quoteSenderIds = new Set<string>();
    if (quoteMessageIds.size > 0) {
      const qMsgs = await MessageModel.find({
        _id: {
          $in: [...quoteMessageIds].map(
            (id) => new mongoose.Types.ObjectId(id),
          ),
        },
      }).lean();
      for (const qm of qMsgs) {
        quoteMessagesMap.set(
          qm._id.toString(),
          qm as unknown as Record<string, unknown>,
        );
        quoteSenderIds.add(qm.senderId.toString());
      }

      // Fetch quote senders if not already loaded
      const missingQuoteSenderIds = [...quoteSenderIds].filter(
        (id) => !userMap.has(id),
      );
      if (missingQuoteSenderIds.length > 0) {
        const qSenders = await UserModel.find({
          _id: {
            $in: missingQuoteSenderIds.map(
              (id) => new mongoose.Types.ObjectId(id),
            ),
          },
        }).lean();
        for (const qs of qSenders) {
          userMap.set(
            qs._id.toString(),
            qs as unknown as Record<string, unknown>,
          );
        }
      }
    }

    // Build DTOs
    return messages.map((msg) => {
      const m = msg as unknown as Record<string, unknown>;
      const sId = (m.senderId as { toString(): string }).toString();
      const quoteMsgId = m.quoteMessageId as { toString(): string } | null;
      const mIds =
        (m.mentionUserIds as Array<{ toString(): string }>) ?? [];

      const sender = userMap.get(sId)!;
      const quoteMessage = quoteMsgId
        ? quoteMessagesMap.get(quoteMsgId.toString()) ?? null
        : null;
      const quoteMessageSender = quoteMessage
        ? userMap.get(
            (quoteMessage.senderId as { toString(): string }).toString(),
          ) ?? null
        : null;
      const mentions = mIds
        .map((mid) => userMap.get(mid.toString()))
        .filter((u): u is Record<string, unknown> => u !== undefined);

      return toMessageDTO({
        message: m,
        sender: sender as unknown as IUserDocument,
        quoteMessage,
        quoteMessageSender:
          quoteMessageSender as unknown as IUserDocument | null,
        mentions: mentions as unknown as IUserDocument[],
      });
    });
  }
}
