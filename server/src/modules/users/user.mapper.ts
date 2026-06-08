/**
 * Maps a Mongoose User document to a plain GraphQL User DTO.
 * NEVER includes passwordHash in the output.
 */

import type { IUserDocument } from "./user.model.js";

export interface UserDTO {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Convert a Mongoose User document to a GraphQL-safe User DTO.
 * Strips passwordHash and maps _id → id.
 */
export function toUserDTO(doc: IUserDocument): UserDTO {
  return {
    id: doc._id.toString(),
    username: doc.username,
    name: doc.name,
    avatarUrl: doc.avatarUrl ?? null,
    title: doc.title ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
