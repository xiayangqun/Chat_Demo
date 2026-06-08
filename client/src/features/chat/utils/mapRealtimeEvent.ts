import type {
  Message as ProtoMessage,
  Conversation as ProtoConversation,
  MessagePreview as ProtoMessagePreview,
  MessageQuote as ProtoMessageQuote,
  User as ProtoUser,
} from '../../../generated/chat_realtime';
import { ConversationType, MessageType } from '../../../generated/chat_realtime';

// ---------------------------------------------------------------------------
// GraphQL-compatible mapped types (include __typename for Apollo cache)
// ---------------------------------------------------------------------------

export interface GqlUser {
  __typename: 'User';
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  title: string | null;
}

export interface GqlMessagePreview {
  __typename: 'MessagePreview';
  id: string;
  conversationId: string;
  sender: GqlUser;
  body: string;
  type: string;
  createdAt: string;
}

export interface GqlMessageQuote {
  __typename: 'MessageQuote';
  id: string;
  sender: GqlUser;
  body: string;
  type: string;
  createdAt: string;
}

export interface GqlMessage {
  __typename: 'Message';
  id: string;
  conversationId: string;
  sender: GqlUser;
  type: string;
  body: string;
  quoteMessage: GqlMessageQuote | null;
  mentions: GqlUser[];
  createdAt: string;
  updatedAt: string;
}

export interface GqlConversation {
  __typename: 'Conversation';
  id: string;
  name: string;
  type: string;
  avatarUrls: string[];
  memberCount: number;
  unreadCount: number;
  mentionCount: number;
  lastMessage: GqlMessagePreview | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Enum mappers — numeric proto enums → GraphQL string enums
// ---------------------------------------------------------------------------

function mapConversationType(protoType: number): string {
  switch (protoType) {
    case ConversationType.GROUP:
      return 'GROUP';
    case ConversationType.DIRECT:
      return 'DIRECT';
    default:
      return 'GROUP';
  }
}

function mapMessageType(protoType: number): string {
  switch (protoType) {
    case MessageType.TEXT:
      return 'TEXT';
    default:
      return 'TEXT';
  }
}

// ---------------------------------------------------------------------------
// Object mappers
// ---------------------------------------------------------------------------

function mapUser(user: ProtoUser | undefined): GqlUser {
  return {
    __typename: 'User',
    id: user?.id ?? '',
    username: user?.username ?? '',
    name: user?.name ?? '',
    avatarUrl: user?.avatarUrl ?? null,
    title: user?.title ?? null,
  };
}

function mapMessagePreview(
  preview: ProtoMessagePreview | undefined,
): GqlMessagePreview | null {
  if (!preview) return null;
  return {
    __typename: 'MessagePreview',
    id: preview.id,
    conversationId: preview.conversationId,
    sender: mapUser(preview.sender),
    body: preview.body,
    type: mapMessageType(preview.type),
    createdAt: preview.createdAt,
  };
}

function mapMessageQuote(
  quote: ProtoMessageQuote | undefined,
): GqlMessageQuote | null {
  if (!quote) return null;
  return {
    __typename: 'MessageQuote',
    id: quote.id,
    sender: mapUser(quote.sender),
    body: quote.body,
    type: mapMessageType(quote.type),
    createdAt: quote.createdAt,
  };
}

// ---------------------------------------------------------------------------
// Public mappers
// ---------------------------------------------------------------------------

export function mapProtoMessageToGql(message: ProtoMessage): GqlMessage {
  return {
    __typename: 'Message',
    id: message.id,
    conversationId: message.conversationId,
    sender: mapUser(message.sender),
    type: mapMessageType(message.type),
    body: message.body,
    quoteMessage: mapMessageQuote(message.quoteMessage),
    mentions: message.mentions.map(mapUser),
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

export function mapProtoConversationToGql(
  conversation: ProtoConversation,
): GqlConversation {
  return {
    __typename: 'Conversation',
    id: conversation.id,
    name: conversation.name,
    type: mapConversationType(conversation.type),
    avatarUrls: conversation.avatarUrls,
    memberCount: conversation.memberCount,
    unreadCount: conversation.unreadCount,
    mentionCount: (conversation as unknown as { mentionCount?: number }).mentionCount ?? 0,
    lastMessage: mapMessagePreview(conversation.lastMessage),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}
