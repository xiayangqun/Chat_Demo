/**
 * Mongoose model for the `messages` collection.
 * Fields match database_design.md §3.4 exactly.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMessage {
  _id: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  type: "TEXT";
  body: string;
  quoteMessageId: mongoose.Types.ObjectId | null;
  mentionUserIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends IMessage, Document {
  _id: mongoose.Types.ObjectId;
}

const messageSchema = new Schema<IMessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["TEXT"],
      default: "TEXT",
    },
    body: {
      type: String,
      required: true,
      maxlength: 4000,
    },
    quoteMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    mentionUserIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "messages",
  },
);

// Indexes per database_design.md §3.4
messageSchema.index({ conversationId: 1, createdAt: -1, _id: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ mentionUserIds: 1 });
messageSchema.index({ quoteMessageId: 1 });

export const MessageModel: Model<IMessageDocument> =
  (mongoose.models.Message as Model<IMessageDocument>) ||
  mongoose.model<IMessageDocument>("Message", messageSchema);
