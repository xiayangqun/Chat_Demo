/**
 * Mongoose model for the `conversations` collection.
 * Fields match database_design.md §3.2 exactly.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IConversation {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: "GROUP" | "DIRECT";
  avatarUrls: string[];
  lastMessageId: mongoose.Types.ObjectId | null;
  createdByUserId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationDocument extends IConversation, Document {
  _id: mongoose.Types.ObjectId;
}

const conversationSchema = new Schema<IConversationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 60,
    },
    type: {
      type: String,
      required: true,
      enum: ["GROUP", "DIRECT"],
    },
    avatarUrls: {
      type: [String],
      default: [],
    },
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "conversations",
  },
);

// Indexes per database_design.md §3.2
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ createdByUserId: 1, createdAt: -1 });

export const ConversationModel: Model<IConversationDocument> =
  (mongoose.models.Conversation as Model<IConversationDocument>) ||
  mongoose.model<IConversationDocument>("Conversation", conversationSchema);
