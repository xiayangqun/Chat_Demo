/**
 * Seed database with demo data.
 * Run: SEED_DATABASE=true npm run dev
 * Or:  npm run seed
 *
 * Follows backend_design.md §11 and product_design.md §11.
 */

import mongoose from "mongoose";
import { hashPassword } from "../modules/auth/password.js";
import { UserModel } from "../modules/users/user.model.js";
import { ConversationModel } from "../modules/conversations/conversation.model.js";
import { ConversationMemberModel } from "../modules/conversations/conversationMember.model.js";
import { MessageModel } from "../modules/messages/message.model.js";

// ---------------------------------------------------------------------------
// Fixed ObjectIds for cross-collection references
// ---------------------------------------------------------------------------

const oid = (hex: string) => new mongoose.Types.ObjectId(hex.padStart(24, "0"));

// Users
const U = {
  jenny:    oid("000000000000000000000001"),
  devon:    oid("000000000000000000000002"),
  darrell:  oid("000000000000000000000003"),
  jerry:    oid("000000000000000000000004"),
  allen:    oid("000000000000000000000005"),
  tim:      oid("000000000000000000000006"),
  courtney: oid("000000000000000000000007"),
  albert:   oid("000000000000000000000008"),
  darlene:  oid("000000000000000000000009"),
  eric:     oid("00000000000000000000000a"),
  grace:    oid("00000000000000000000000b"),
  lynne:    oid("00000000000000000000000c"),
} as const;

// Conversations
const C = {
  announcements:   oid("100000000000000000000001"),
  shareYourStory:  oid("100000000000000000000002"),
  general:         oid("100000000000000000000003"),
  courtneyDm:      oid("100000000000000000000004"),
  albertDm:        oid("100000000000000000000005"),
  darleneDm:       oid("100000000000000000000006"),
  designProduct:   oid("100000000000000000000007"),
  productTeam:     oid("100000000000000000000008"),
  randomChat:      oid("100000000000000000000009"),
} as const;

// Messages (only in Share Your Story)
const M = {
  msg1: oid("200000000000000000000001"),
  msg2: oid("200000000000000000000002"),
  msg3: oid("200000000000000000000003"),
  msg4: oid("200000000000000000000004"),
} as const;

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------

export async function seedDatabase(): Promise<void> {
  console.log("Seeding database...");

  // 1. Clear collections
  const db = mongoose.connection.db!;
  await db.dropCollection("users").catch(() => {});
  await db.dropCollection("conversations").catch(() => {});
  await db.dropCollection("conversation_members").catch(() => {});
  await db.dropCollection("messages").catch(() => {});

  // Recreate collections with indexes
  await UserModel.createCollection();
  await ConversationModel.createCollection();
  await ConversationMemberModel.createCollection();
  await MessageModel.createCollection();

  // 2. Hash password once (shared by all seed users)
  const passwordHash = await hashPassword("password123");

  // 3. Insert users
  await UserModel.insertMany([
    { _id: U.jenny,    username: "jenny",    passwordHash, name: "Jenny White" },
    { _id: U.devon,    username: "devon",    passwordHash, name: "Devon Lane" },
    { _id: U.darrell,  username: "darrell",  passwordHash, name: "Darrell Steward", title: "CTO@Apple" },
    { _id: U.jerry,    username: "jerry",    passwordHash, name: "Jerry" },
    { _id: U.allen,    username: "allen",    passwordHash, name: "Allen" },
    { _id: U.tim,      username: "tim",      passwordHash, name: "Tim" },
    { _id: U.courtney, username: "courtney", passwordHash, name: "Courtney Henry" },
    { _id: U.albert,   username: "albert",   passwordHash, name: "Albert Flores" },
    { _id: U.darlene,  username: "darlene",  passwordHash, name: "Darlene Robertson" },
    { _id: U.eric,     username: "eric",     passwordHash, name: "Eric" },
    { _id: U.grace,    username: "grace",    passwordHash, name: "Grace" },
    { _id: U.lynne,    username: "lynne",    passwordHash, name: "Lynne" },
  ]);
  console.log("  ✓ 12 users created");

  // 4. Insert conversations
  const now = new Date();
  await ConversationModel.insertMany([
    { _id: C.announcements,  name: "Announcements",       type: "GROUP",  lastMessageId: null, createdByUserId: U.jenny, createdAt: now, updatedAt: now },
    { _id: C.shareYourStory, name: "Share Your Story",    type: "GROUP",  lastMessageId: null, createdByUserId: U.jenny, createdAt: now, updatedAt: now },
    { _id: C.general,        name: "General",             type: "GROUP",  lastMessageId: null, createdByUserId: U.jenny, createdAt: now, updatedAt: now },
    { _id: C.courtneyDm,     name: "Courtney Henry",      type: "DIRECT", lastMessageId: null, createdByUserId: U.jenny, createdAt: now, updatedAt: now },
    { _id: C.albertDm,       name: "Albert Flores",       type: "DIRECT", lastMessageId: null, createdByUserId: U.jenny, createdAt: now, updatedAt: now },
    { _id: C.darleneDm,      name: "Darlene Robertson",   type: "DIRECT", lastMessageId: null, createdByUserId: U.jenny, createdAt: now, updatedAt: now },
    { _id: C.designProduct,  name: "Design product",      type: "GROUP",  lastMessageId: null, createdByUserId: U.eric,  createdAt: now, updatedAt: now },
    { _id: C.productTeam,    name: "Product team",        type: "GROUP",  lastMessageId: null, createdByUserId: U.grace, createdAt: now, updatedAt: now },
    { _id: C.randomChat,     name: "Random",              type: "GROUP",  lastMessageId: null, createdByUserId: U.tim,   createdAt: now, updatedAt: now },
  ]);
  console.log("  ✓ 9 conversations created");

  // 5. Insert conversation members
  //    Jenny is OWNER of conversations she created; others are MEMBER
  const members: Array<{
    conversationId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: "OWNER" | "MEMBER";
    unreadCount: number;
    lastReadAt: Date | null;
  }> = [];

  const addMember = (
    convId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    role: "OWNER" | "MEMBER",
    unreadCount = 0,
    lastReadAt: Date | null = null,
  ) => members.push({ conversationId: convId, userId, role, unreadCount, lastReadAt });

  // Announcements — Jenny (owner, unread 3), Jerry (member), Allen, Tim, Devon
  addMember(C.announcements, U.jenny,   "OWNER",  3);
  addMember(C.announcements, U.jerry,   "MEMBER");
  addMember(C.announcements, U.allen,   "MEMBER");
  addMember(C.announcements, U.tim,     "MEMBER");
  addMember(C.announcements, U.devon,   "MEMBER");

  // Share Your Story — Jenny (owner, unread 6), Devon, Allen, Darrell, Tim
  addMember(C.shareYourStory, U.jenny,   "OWNER",  6);
  addMember(C.shareYourStory, U.devon,   "MEMBER");
  addMember(C.shareYourStory, U.allen,   "MEMBER");
  addMember(C.shareYourStory, U.darrell, "MEMBER");
  addMember(C.shareYourStory, U.tim,     "MEMBER");

  // General — all 12 users
  for (const userId of Object.values(U)) {
    addMember(C.general, userId, userId.equals(U.jenny) ? "OWNER" : "MEMBER");
  }

  // DM: Courtney Henry — Jenny + Courtney
  addMember(C.courtneyDm, U.jenny,   "OWNER");
  addMember(C.courtneyDm, U.courtney, "MEMBER");

  // DM: Albert Flores — Jenny + Albert
  addMember(C.albertDm, U.jenny,  "OWNER");
  addMember(C.albertDm, U.albert, "MEMBER");

  // DM: Darlene Robertson — Jenny + Darlene
  addMember(C.darleneDm, U.jenny,   "OWNER");
  addMember(C.darleneDm, U.darlene, "MEMBER");

  // Design product — Eric (owner), Jenny, Devon, Allen
  addMember(C.designProduct, U.eric,  "OWNER");
  addMember(C.designProduct, U.jenny, "MEMBER");
  addMember(C.designProduct, U.devon, "MEMBER");
  addMember(C.designProduct, U.allen, "MEMBER");

  // Product team — Grace (owner), Jenny, Tim, Lynne
  addMember(C.productTeam, U.grace, "OWNER");
  addMember(C.productTeam, U.jenny, "MEMBER");
  addMember(C.productTeam, U.tim,   "MEMBER");
  addMember(C.productTeam, U.lynne, "MEMBER");

  // Random — Tim (owner), Jenny, Eric, Albert
  addMember(C.randomChat, U.tim,    "OWNER");
  addMember(C.randomChat, U.jenny,  "MEMBER");
  addMember(C.randomChat, U.eric,   "MEMBER");
  addMember(C.randomChat, U.albert, "MEMBER");

  await ConversationMemberModel.insertMany(members);
  console.log(`  ✓ ${members.length} conversation members created`);

  // 6. Insert messages in "Share Your Story"
  const messages = [
    {
      _id: M.msg1,
      conversationId: C.shareYourStory,
      senderId: U.jenny,
      type: "TEXT" as const,
      body: "If you want to learn from community builders & spur ideas from how others run virtual events, check out Vanilla Forums (11/17 - 11/18/20) for free.",
      quoteMessageId: null,
      mentionUserIds: [],
    },
    {
      _id: M.msg2,
      conversationId: C.shareYourStory,
      senderId: U.devon,
      type: "TEXT" as const,
      body: "Check out Vanilla Forums (11/17 - 11/18/20) for free.",
      quoteMessageId: null,
      mentionUserIds: [],
    },
    {
      _id: M.msg3,
      conversationId: C.shareYourStory,
      senderId: U.jenny,
      type: "TEXT" as const,
      body: "Many thanks!",
      quoteMessageId: M.msg2,
      mentionUserIds: [],
    },
    {
      _id: M.msg4,
      conversationId: C.shareYourStory,
      senderId: U.jenny,
      type: "TEXT" as const,
      body: "I will take a look in case it's useful for us.",
      quoteMessageId: null,
      mentionUserIds: [],
    },
  ];

  await MessageModel.insertMany(messages);
  console.log("  ✓ 4 messages created in 'Share Your Story'");

  // 7. Set lastMessageId on conversations
  //    Share Your Story → last message is msg4 (by Jenny)
  await ConversationModel.findByIdAndUpdate(C.shareYourStory, {
    lastMessageId: M.msg4,
    updatedAt: new Date(),
  });

  //    Announcements → last message by Jerry (we'll create a placeholder message)
  const annMsg = await MessageModel.create({
    conversationId: C.announcements,
    senderId: U.jerry,
    type: "TEXT",
    body: "[File] Design Guideline.pdf",
    quoteMessageId: null,
    mentionUserIds: [],
  });
  await ConversationModel.findByIdAndUpdate(C.announcements, {
    lastMessageId: annMsg._id,
    updatedAt: new Date(),
  });

  //    General → last message by Tim
  const genMsg = await MessageModel.create({
    conversationId: C.general,
    senderId: U.tim,
    type: "TEXT",
    body: "If you want to learn more about the project, check the docs.",
    quoteMessageId: null,
    mentionUserIds: [],
  });
  await ConversationModel.findByIdAndUpdate(C.general, {
    lastMessageId: genMsg._id,
    updatedAt: new Date(),
  });

  //    Courtney Henry DM → last message
  const courtneyMsg = await MessageModel.create({
    conversationId: C.courtneyDm,
    senderId: U.courtney,
    type: "TEXT",
    body: "So, what's your plan this weekend?",
    quoteMessageId: null,
    mentionUserIds: [],
  });
  await ConversationModel.findByIdAndUpdate(C.courtneyDm, {
    lastMessageId: courtneyMsg._id,
    updatedAt: new Date(),
  });

  //    Albert Flores DM → last message
  const albertMsg = await MessageModel.create({
    conversationId: C.albertDm,
    senderId: U.albert,
    type: "TEXT",
    body: "What's the progress on that task?",
    quoteMessageId: null,
    mentionUserIds: [],
  });
  await ConversationModel.findByIdAndUpdate(C.albertDm, {
    lastMessageId: albertMsg._id,
    updatedAt: new Date(),
  });

  //    Darlene Robertson DM → last message
  const darleneMsg = await MessageModel.create({
    conversationId: C.darleneDm,
    senderId: U.darlene,
    type: "TEXT",
    body: "Yeah! You're right.",
    quoteMessageId: null,
    mentionUserIds: [],
  });
  await ConversationModel.findByIdAndUpdate(C.darleneDm, {
    lastMessageId: darleneMsg._id,
    updatedAt: new Date(),
  });

  //    Design product → last message by Eric
  const designMsg = await MessageModel.create({
    conversationId: C.designProduct,
    senderId: U.eric,
    type: "TEXT",
    body: "Yeah I know",
    quoteMessageId: null,
    mentionUserIds: [],
  });
  await ConversationModel.findByIdAndUpdate(C.designProduct, {
    lastMessageId: designMsg._id,
    updatedAt: new Date(),
  });

  //    Product team → last message by Grace mentioning Lynne
  const productMsg = await MessageModel.create({
    conversationId: C.productTeam,
    senderId: U.grace,
    type: "TEXT",
    body: "@Lynne have time to huddle?",
    quoteMessageId: null,
    mentionUserIds: [U.lynne],
  });
  await ConversationModel.findByIdAndUpdate(C.productTeam, {
    lastMessageId: productMsg._id,
    updatedAt: new Date(),
  });

  //    Random → no lastMessage (newly created, empty)
  //    Already null from creation

  console.log("  ✓ lastMessageId set on conversations");
  console.log("Seeding complete!");
}

// ---------------------------------------------------------------------------
// Standalone execution: tsx src/seed/seedDatabase.ts
// ---------------------------------------------------------------------------

const isDirectExecution =
  process.argv[1]?.endsWith("seedDatabase.ts") ||
  process.argv[1]?.endsWith("seedDatabase.js");

if (isDirectExecution) {
  const { connectDatabase, disconnectDatabase } = await import(
    "../config/database.js"
  );
  await connectDatabase();
  await seedDatabase();
  await disconnectDatabase();
  process.exit(0);
}
