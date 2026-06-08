/**
 * Mongoose model for the `conversation_members` collection.
 * Fields match database_design.md §3.3 exactly.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IConversationMember {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: "OWNER" | "MEMBER";
  unreadCount: number;
  mentionCount: number;
  lastReadAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationMemberDocument extends IConversationMember, Document {
  _id: mongoose.Types.ObjectId;
}

const conversationMemberSchema = new Schema<IConversationMemberDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["OWNER", "MEMBER"],
      default: "MEMBER",
    },
    unreadCount: {
      type: Number,
      required: true,
      default: 0,
    },
    mentionCount: {
      type: Number,
      required: true,
      default: 0,
    },
    lastReadAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "conversation_members",
  },
);

// Indexes per database_design.md §3.3
conversationMemberSchema.index({ conversationId: 1, userId: 1 }, { unique: true });
conversationMemberSchema.index({ userId: 1, updatedAt: -1 });
conversationMemberSchema.index({ conversationId: 1, role: 1 });

export const ConversationMemberModel: Model<IConversationMemberDocument> =
  (mongoose.models.ConversationMember as Model<IConversationMemberDocument>) ||
  mongoose.model<IConversationMemberDocument>(
    "ConversationMember",
    conversationMemberSchema,
  );
