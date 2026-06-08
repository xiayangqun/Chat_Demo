/**
 * Mongoose model for the `users` collection.
 * Fields match database_design.md §3.1 exactly.
 */

import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string | null;
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 32,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 40,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

// Indexes per database_design.md §3.1
// Note: username unique index is already implied by `unique: true` in the field definition
userSchema.index({ name: 1 });
userSchema.index({ createdAt: -1 });

export const UserModel: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>(
    "User",
    userSchema,
  );
