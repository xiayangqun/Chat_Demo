import type { Server as SocketIOServer } from "socket.io";
import {
  encodeRealtimeEvent,
  RealtimeEventType,
  type RealtimeEventTypeValue,
  type Message,
  type Conversation,
} from "../generated/chat_realtime.js";

/**
 * RealtimeService wraps Socket.IO operations and Protobuf encoding.
 *
 * The emit methods are **skeleton stubs** – they will be completed when the
 * GraphQL resolvers call them (Task 16).  For now they encode + emit but are
 * not wired to any service.
 */
export class RealtimeService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  /* ── Room name helpers ──────────────────────────────────────────── */

  conversationRoom(conversationId: string): string {
    return `conversation:${conversationId}`;
  }

  userRoom(userId: string): string {
    return `user:${userId}`;
  }

  /* ── Low-level emit ─────────────────────────────────────────────── */

  /**
   * Encode a RealtimeEvent and emit it as binary to a Socket.IO room.
   */
  emitToRoom(room: string, eventName: string, type: RealtimeEventTypeValue, payload: object): void {
    const data = encodeRealtimeEvent(type, payload);
    this.io.to(room).emit(eventName, data);
  }

  /* ── High-level emit stubs ──────────────────────────────────────── */

  /**
   * Broadcast `message.created` to a conversation room.
   *
   * TODO: Called by MessageService after persisting a message.
   */
  emitMessageCreatedToUser(userId: string, message: Message): void {
    const room = this.userRoom(userId);
    this.emitToRoom(room, "message.created", RealtimeEventType.MESSAGE_CREATED, {
      message,
    });
  }

  /**
   * Emit `conversation.created` to a single user's room.
   *
   * TODO: Called by ConversationService after creating a group conversation.
   * Should be called once per member.
   */
  emitConversationCreated(userId: string, conversation: Conversation): void {
    const room = this.userRoom(userId);
    this.emitToRoom(room, "conversation.created", RealtimeEventType.CONVERSATION_CREATED, {
      conversation,
    });
  }

  /**
   * Emit `conversation.updated` to a single user's room.
   *
   * TODO: Called after sendMessage / markConversationRead.
   * Because unreadCount differs per user, this must be called per-user.
   */
  emitConversationUpdated(userId: string, conversation: Conversation): void {
    const room = this.userRoom(userId);
    this.emitToRoom(room, "conversation.updated", RealtimeEventType.CONVERSATION_UPDATED, {
      conversation,
    });
  }
}
