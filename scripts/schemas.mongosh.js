// ──────────────────────────────────────────────────────────────
// Chat Demo — MongoDB Collection Schema Definitions
//
// This is the SINGLE SOURCE OF TRUTH for all collection schemas.
// Both init-database.mongosh.js (create + validate) read from here.
//
// Usage: load("scripts/schemas.mongosh.js")  →  sets global SCHEMAS
// ──────────────────────────────────────────────────────────────

var SCHEMAS = {

  // ────────────────────────────────────────────────────────────
  // users — Registered user accounts
  // ────────────────────────────────────────────────────────────
  users: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["username", "passwordHash", "name", "createdAt", "updatedAt"],
        properties: {
          // Unique login identifier (3-32 chars, alphanumeric + underscore)
          username:     { bsonType: "string", minLength: 3, maxLength: 32 },
          // bcrypt hash (min 20 chars ensures salt rounds present)
          passwordHash: { bsonType: "string", minLength: 20 },
          // Display name shown in UI (1-40 chars)
          name:         { bsonType: "string", minLength: 1, maxLength: 40 },
          // Optional profile picture URL
          avatarUrl:    { bsonType: ["string", "null"] },
          // Optional job title (e.g. "CTO@Apple")
          title:        { bsonType: ["string", "null"] },
          // Account creation timestamp
          createdAt:    { bsonType: "date" },
          // Last profile update timestamp
          updatedAt:    { bsonType: "date" }
        }
      }
    },
    validationLevel: "moderate",
    indexes: [
      { key: { username: 1 },  options: { unique: true, name: "uniq_users_username" } },
      { key: { name: 1 },      options: { name: "idx_users_name" } },
      { key: { createdAt: -1 }, options: { name: "idx_users_createdAt" } }
    ]
  },

  // ────────────────────────────────────────────────────────────
  // conversations — Chat rooms (GROUP or DIRECT)
  // ────────────────────────────────────────────────────────────
  conversations: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "type", "avatarUrls", "createdAt", "updatedAt"],
        properties: {
          // Conversation display name (1-60 chars)
          name:             { bsonType: "string", minLength: 1, maxLength: 60 },
          // "GROUP" for multi-user, "DIRECT" for 1:1
          type:             { enum: ["GROUP", "DIRECT"] },
          // Array of member avatar URLs (used for group avatar mosaic)
          avatarUrls:       { bsonType: "array", items: { bsonType: "string" } },
          // Reference to most recent message (null if empty conversation)
          lastMessageId:    { bsonType: ["objectId", "null"] },
          // User who created this conversation (null for system-created)
          createdByUserId:  { bsonType: ["objectId", "null"] },
          createdAt:        { bsonType: "date" },
          updatedAt:        { bsonType: "date" }
        }
      }
    },
    validationLevel: "moderate",
    indexes: [
      // Primary sort: conversations list ordered by most recent activity
      { key: { updatedAt: -1 },                      options: { name: "idx_conversations_updatedAt" } },
      // Creator's conversations sorted by creation time
      { key: { createdByUserId: 1, createdAt: -1 },  options: { name: "idx_conversations_createdBy_createdAt" } }
    ]
  },

  // ────────────────────────────────────────────────────────────
  // conversation_members — Membership junction table
  // Links users to conversations with per-user metadata.
  // ────────────────────────────────────────────────────────────
  conversation_members: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["conversationId", "userId", "role", "unreadCount", "mentionCount", "createdAt", "updatedAt"],
        properties: {
          // Reference to conversations._id
          conversationId: { bsonType: "objectId" },
          // Reference to users._id
          userId:         { bsonType: "objectId" },
          // "OWNER" (creator) or "MEMBER" (invited)
          role:           { enum: ["OWNER", "MEMBER"] },
          // Per-user unread message counter (reset on markConversationRead)
          unreadCount:    { bsonType: ["int", "long", "double"], minimum: 0 },
          // Per-user mention counter (reset on markConversationRead)
          mentionCount:   { bsonType: ["int", "long", "double"], minimum: 0 },
          // Timestamp of last markConversationRead call (null if never)
          lastReadAt:     { bsonType: ["date", "null"] },
          createdAt:      { bsonType: "date" },
          updatedAt:      { bsonType: "date" }
        }
      }
    },
    validationLevel: "moderate",
    indexes: [
      // Each user can be in a conversation only once
      { key: { conversationId: 1, userId: 1 },   options: { unique: true, name: "uniq_conversation_members_conversation_user" } },
      // User's conversations sorted by recent activity
      { key: { userId: 1, updatedAt: -1 },       options: { name: "idx_conversation_members_user_updatedAt" } },
      // Filter members by role within a conversation
      { key: { conversationId: 1, role: 1 },      options: { name: "idx_conversation_members_conversation_role" } }
    ]
  },

  // ────────────────────────────────────────────────────────────
  // messages — Chat messages with quote and mention support
  // ────────────────────────────────────────────────────────────
  messages: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["conversationId", "senderId", "type", "body", "mentionUserIds", "createdAt", "updatedAt"],
        properties: {
          // Reference to conversations._id
          conversationId: { bsonType: "objectId" },
          // Reference to users._id (the sender)
          senderId:       { bsonType: "objectId" },
          // Message type enum (currently only TEXT)
          type:           { enum: ["TEXT"] },
          // Message content (1-4000 chars, plaintext)
          body:           { bsonType: "string", minLength: 1, maxLength: 4000 },
          // Optional reference to messages._id being quoted (null if no quote)
          quoteMessageId: { bsonType: ["objectId", "null"] },
          // Array of user IDs mentioned via @mention
          mentionUserIds: { bsonType: "array", items: { bsonType: "objectId" } },
          createdAt:      { bsonType: "date" },
          updatedAt:      { bsonType: "date" }
        }
      }
    },
    validationLevel: "moderate",
    indexes: [
      // Primary: messages in a conversation sorted newest-first, with tiebreaker on _id
      { key: { conversationId: 1, createdAt: -1, _id: -1 }, options: { name: "idx_messages_conversation_createdAt_id" } },
      // Messages sent by a specific user
      { key: { senderId: 1, createdAt: -1 },                 options: { name: "idx_messages_sender_createdAt" } },
      // Find messages that mention a specific user
      { key: { mentionUserIds: 1 },                          options: { name: "idx_messages_mentions" } },
      // Find messages that quote a specific message
      { key: { quoteMessageId: 1 },                          options: { name: "idx_messages_quote" } }
    ]
  }

};
