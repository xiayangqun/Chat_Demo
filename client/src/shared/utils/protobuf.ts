import { loadProto } from '../../generated/chat_realtime';
import type {
  RealtimeEvent,
  MessageCreatedPayload,
  ConversationCreatedPayload,
  ConversationUpdatedPayload,
} from '../../generated/chat_realtime';

// ---------------------------------------------------------------------------
// Conversion options — camelCase keys, numeric enums, all defaults present
// ---------------------------------------------------------------------------

const TO_OBJECT_OPTIONS = {
  longs: String,
  enums: Number,
  defaults: true,
  arrays: true,
  objects: true,
  oneofs: true,
};

// ---------------------------------------------------------------------------
// Decode helpers — each function decodes a specific protobuf message type
// from binary (Uint8Array) into the corresponding TypeScript interface.
// ---------------------------------------------------------------------------

/**
 * Decode a top-level `RealtimeEvent` from its binary representation.
 * The returned object includes one of the oneof payload fields
 * (`messageCreated`, `conversationCreated`, `conversationUpdated`,
 * `typingUpdated`) depending on the event type.
 */
function toUint8Array(data: unknown): Uint8Array {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  throw new Error('Invalid binary data type');
}

export function decodeRealtimeEvent(data: unknown): RealtimeEvent {
  try {
    const root = loadProto();
    const Type = root.lookupType('chat.realtime.v1.RealtimeEvent');
    const message = Type.decode(toUint8Array(data));
    return Type.toObject(message, TO_OBJECT_OPTIONS) as RealtimeEvent;
  } catch (error) {
    console.error('Failed to decode RealtimeEvent:', error);
    throw error;
  }
}

/**
 * Decode a `MessageCreatedPayload` from its binary representation.
 */
export function decodeMessageCreated(data: Uint8Array): MessageCreatedPayload {
  try {
    const root = loadProto();
    const Type = root.lookupType('chat.realtime.v1.MessageCreatedPayload');
    const message = Type.decode(data);
    return Type.toObject(message, TO_OBJECT_OPTIONS) as MessageCreatedPayload;
  } catch (error) {
    console.error('Failed to decode MessageCreatedPayload:', error);
    throw error;
  }
}

/**
 * Decode a `ConversationCreatedPayload` from its binary representation.
 */
export function decodeConversationCreated(
  data: Uint8Array,
): ConversationCreatedPayload {
  try {
    const root = loadProto();
    const Type = root.lookupType(
      'chat.realtime.v1.ConversationCreatedPayload',
    );
    const message = Type.decode(data);
    return Type.toObject(
      message,
      TO_OBJECT_OPTIONS,
    ) as ConversationCreatedPayload;
  } catch (error) {
    console.error('Failed to decode ConversationCreatedPayload:', error);
    throw error;
  }
}

/**
 * Decode a `ConversationUpdatedPayload` from its binary representation.
 */
export function decodeConversationUpdated(
  data: Uint8Array,
): ConversationUpdatedPayload {
  try {
    const root = loadProto();
    const Type = root.lookupType(
      'chat.realtime.v1.ConversationUpdatedPayload',
    );
    const message = Type.decode(data);
    return Type.toObject(
      message,
      TO_OBJECT_OPTIONS,
    ) as ConversationUpdatedPayload;
  } catch (error) {
    console.error('Failed to decode ConversationUpdatedPayload:', error);
    throw error;
  }
}
