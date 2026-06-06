// Initialize MongoDB collections, validators, and indexes for the Chat Demo.
// Usage:
//   mongosh "mongodb://localhost:27017/chat-demo" scripts/init-database.mongosh.js

const collections = ["users", "conversations", "conversation_members", "messages"];

for (const name of collections) {
  if (!db.getCollectionNames().includes(name)) {
    db.createCollection(name);
  }
}

db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "passwordHash", "name", "createdAt", "updatedAt"],
      properties: {
        username: { bsonType: "string", minLength: 3, maxLength: 32 },
        passwordHash: { bsonType: "string", minLength: 20 },
        name: { bsonType: "string", minLength: 1, maxLength: 40 },
        avatarUrl: { bsonType: ["string", "null"] },
        title: { bsonType: ["string", "null"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate"
});

db.runCommand({
  collMod: "conversations",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "avatarUrls", "createdAt", "updatedAt"],
      properties: {
        name: { bsonType: "string", minLength: 1, maxLength: 60 },
        type: { enum: ["GROUP", "DIRECT"] },
        avatarUrls: { bsonType: "array", items: { bsonType: "string" } },
        lastMessageId: { bsonType: ["objectId", "null"] },
        createdByUserId: { bsonType: ["objectId", "null"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate"
});

db.runCommand({
  collMod: "conversation_members",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["conversationId", "userId", "role", "unreadCount", "createdAt", "updatedAt"],
      properties: {
        conversationId: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        role: { enum: ["OWNER", "MEMBER"] },
        unreadCount: { bsonType: ["int", "long", "double"], minimum: 0 },
        lastReadAt: { bsonType: ["date", "null"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate"
});

db.runCommand({
  collMod: "messages",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["conversationId", "senderId", "type", "body", "mentionUserIds", "createdAt", "updatedAt"],
      properties: {
        conversationId: { bsonType: "objectId" },
        senderId: { bsonType: "objectId" },
        type: { enum: ["TEXT"] },
        body: { bsonType: "string", minLength: 1, maxLength: 4000 },
        quoteMessageId: { bsonType: ["objectId", "null"] },
        mentionUserIds: { bsonType: "array", items: { bsonType: "objectId" } },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate"
});

db.users.createIndex({ username: 1 }, { unique: true, name: "uniq_users_username" });
db.users.createIndex({ name: 1 }, { name: "idx_users_name" });
db.users.createIndex({ createdAt: -1 }, { name: "idx_users_createdAt" });

db.conversations.createIndex({ updatedAt: -1 }, { name: "idx_conversations_updatedAt" });
db.conversations.createIndex(
  { createdByUserId: 1, createdAt: -1 },
  { name: "idx_conversations_createdBy_createdAt" }
);

db.conversation_members.createIndex(
  { conversationId: 1, userId: 1 },
  { unique: true, name: "uniq_conversation_members_conversation_user" }
);
db.conversation_members.createIndex(
  { userId: 1, updatedAt: -1 },
  { name: "idx_conversation_members_user_updatedAt" }
);
db.conversation_members.createIndex(
  { conversationId: 1, role: 1 },
  { name: "idx_conversation_members_conversation_role" }
);

db.messages.createIndex(
  { conversationId: 1, createdAt: -1, _id: -1 },
  { name: "idx_messages_conversation_createdAt_id" }
);
db.messages.createIndex({ senderId: 1, createdAt: -1 }, { name: "idx_messages_sender_createdAt" });
db.messages.createIndex({ mentionUserIds: 1 }, { name: "idx_messages_mentions" });
db.messages.createIndex({ quoteMessageId: 1 }, { name: "idx_messages_quote" });

print("Chat Demo database initialized.");
