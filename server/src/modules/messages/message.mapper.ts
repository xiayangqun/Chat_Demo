/**
 * Maps Mongoose Message documents to plain GraphQL DTOs.
 */

import type { IMessageDocument } from "./message.model.js";
import type { IUserDocument } from "../users/user.model.js";
import { toUserDTO, type UserDTO } from "../users/user.mapper.js";

export interface MessageDTO {
  id: string;
  conversationId: string;
  sender: UserDTO;
  type: string;
  body: string;
  quoteMessage: MessageQuoteDTO | null;
  mentions: UserDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessagePreviewDTO {
  id: string;
  conversationId: string;
  sender: UserDTO;
  body: string;
  type: string;
  createdAt: Date;
}

export interface MessageQuoteDTO {
  id: string;
  sender: UserDTO;
  body: string;
  type: string;
  createdAt: Date;
}

/**
 * Convert a hydrated message to a full Message DTO.
 * Requires: sender, quoteMessage (with sender), and mentions to be populated.
 */
export function toMessageDTO(params: {
  message: IMessageDocument | Record<string, unknown>;
  sender: IUserDocument | Record<string, unknown>;
  quoteMessage?: (IMessageDocument | Record<string, unknown>) | null;
  quoteMessageSender?: (IUserDocument | Record<string, unknown>) | null;
  mentions?: (IUserDocument | Record<string, unknown>)[];
}): MessageDTO {
  const msg = params.message as Record<string, unknown>;
  const msgId = (msg._id as { toString(): string }).toString();

  let quoteDTO: MessageQuoteDTO | null = null;
  if (params.quoteMessage && params.quoteMessageSender) {
    const q = params.quoteMessage as Record<string, unknown>;
    quoteDTO = {
      id: (q._id as { toString(): string }).toString(),
      sender: toUserDTO(params.quoteMessageSender as IUserDocument),
      body: q.body as string,
      type: q.type as string,
      createdAt: new Date(q.createdAt as string | Date),
    };
  }

  return {
    id: msgId,
    conversationId: (msg.conversationId as { toString(): string }).toString(),
    sender: toUserDTO(params.sender as IUserDocument),
    type: msg.type as string,
    body: msg.body as string,
    quoteMessage: quoteDTO,
    mentions: (params.mentions ?? []).map((u) => toUserDTO(u as IUserDocument)),
    createdAt: new Date(msg.createdAt as string | Date),
    updatedAt: new Date(msg.updatedAt as string | Date),
  };
}

/**
 * Convert a message to a MessagePreview DTO (for conversation list lastMessage).
 */
export function toMessagePreviewDTO(params: {
  message: IMessageDocument | Record<string, unknown>;
  sender: IUserDocument | Record<string, unknown>;
}): MessagePreviewDTO {
  const msg = params.message as Record<string, unknown>;
  return {
    id: (msg._id as { toString(): string }).toString(),
    conversationId: (msg.conversationId as { toString(): string }).toString(),
    sender: toUserDTO(params.sender as IUserDocument),
    body: msg.body as string,
    type: msg.type as string,
    createdAt: new Date(msg.createdAt as string | Date),
  };
}

/**
 * Convert a message to a MessageQuote DTO (for quote replies).
 */
export function toMessageQuoteDTO(params: {
  message: IMessageDocument | Record<string, unknown>;
  sender: IUserDocument | Record<string, unknown>;
}): MessageQuoteDTO {
  const msg = params.message as Record<string, unknown>;
  return {
    id: (msg._id as { toString(): string }).toString(),
    sender: toUserDTO(params.sender as IUserDocument),
    body: msg.body as string,
    type: msg.type as string,
    createdAt: new Date(msg.createdAt as string | Date),
  };
}
