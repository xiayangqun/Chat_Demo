/**
 * Maps a Mongoose Conversation document to a plain GraphQL Conversation DTO.
 */

import type { IConversationDocument } from "./conversation.model.js";
import type { IConversationMemberDocument } from "./conversationMember.model.js";
import type { IMessageDocument } from "../messages/message.model.js";
import type { IUserDocument } from "../users/user.model.js";
import { toUserDTO } from "../users/user.mapper.js";

export interface MessagePreviewDTO {
  id: string;
  conversationId: string;
  sender: { id: string; username: string; name: string; avatarUrl: string | null; title: string | null; createdAt: Date; updatedAt: Date };
  body: string;
  type: string;
  createdAt: Date;
}

export interface ConversationDTO {
  id: string;
  name: string;
  type: "GROUP" | "DIRECT";
  avatarUrls: string[];
  memberCount: number;
  unreadCount: number;
  mentionCount: number;
  lastMessage: MessagePreviewDTO | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Convert a Mongoose Conversation document to a GraphQL-safe Conversation DTO.
 *
 * @param conversation - The conversation document (may be a plain object from .lean())
 * @param memberRecord - Optional: the current user's ConversationMember record (for unreadCount)
 * @param memberCount - The total number of members in this conversation
 * @param lastMessage - Optional: hydrated last message document with sender populated
 */
export function toConversationDTO(
  conversation: IConversationDocument | Record<string, unknown>,
  memberRecord?: IConversationMemberDocument | Record<string, unknown> | null,
  memberCount?: number,
  lastMessage?: IMessageDocument | Record<string, unknown> | null,
  lastMessageSender?: IUserDocument | Record<string, unknown> | null,
): ConversationDTO {
  const conv = conversation as Record<string, unknown>;
  const convId = (conv._id as { toString(): string }).toString();

  let lastMessageDTO: MessagePreviewDTO | null = null;
  if (lastMessage && lastMessageSender) {
    const msg = lastMessage as Record<string, unknown>;
    lastMessageDTO = {
      id: (msg._id as { toString(): string }).toString(),
      conversationId: (msg.conversationId as { toString(): string }).toString(),
      sender: toUserDTO(lastMessageSender as IUserDocument),
      body: msg.body as string,
      type: msg.type as string,
      createdAt: msg.createdAt as Date,
    };
  }

  return {
    id: convId,
    name: conv.name as string,
    type: conv.type as "GROUP" | "DIRECT",
    avatarUrls: (conv.avatarUrls as string[]) ?? [],
    memberCount: memberCount ?? 0,
    unreadCount: (memberRecord as Record<string, unknown> | null)?.unreadCount as number ?? 0,
    mentionCount: (memberRecord as Record<string, unknown> | null)?.mentionCount as number ?? 0,
    lastMessage: lastMessageDTO,
    createdAt: new Date(conv.createdAt as string | Date),
    updatedAt: new Date(conv.updatedAt as string | Date),
  };
}
