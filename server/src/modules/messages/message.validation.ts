/**
 * Message validation — input validation for sendMessage.
 */

import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { ConversationMemberModel } from "../conversations/conversationMember.model.js";
import { MessageModel } from "./message.model.js";

export interface SendMessageInput {
  conversationId: string;
  body: string;
  quoteMessageId?: string | null;
  mentionUserIds?: string[] | null;
  clientMutationId?: string | null;
}

/**
 * Validate a sendMessage input.
 * - body must be 1-4000 chars after trim
 * - sender must be a member of the conversation
 * - quoteMessageId (if provided) must exist in the same conversation
 * - mentionUserIds (if provided) are deduplicated
 *
 * Returns validated/cleaned input.
 */
export async function validateMessage(
  input: SendMessageInput,
  senderId: string,
): Promise<{
  conversationId: string;
  body: string;
  quoteMessageId: string | null;
  mentionUserIds: string[];
}> {
  const body = input.body.trim();
  if (body.length < 1 || body.length > 4000) {
    throw new GraphQLError("Message body must be 1 to 4000 characters.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  // Verify sender is a conversation member
  const membership = await ConversationMemberModel.findOne({
    conversationId: new mongoose.Types.ObjectId(input.conversationId),
    userId: new mongoose.Types.ObjectId(senderId),
  }).lean();

  if (!membership) {
    throw new GraphQLError("You are not a member of this conversation.", {
      extensions: { code: "FORBIDDEN" },
    });
  }

  // Validate quoteMessageId if provided
  let quoteMessageId: string | null = null;
  if (input.quoteMessageId) {
    const quoted = await MessageModel.findOne({
      _id: new mongoose.Types.ObjectId(input.quoteMessageId),
      conversationId: new mongoose.Types.ObjectId(input.conversationId),
    }).lean();

    if (!quoted) {
      throw new GraphQLError(
        "Quoted message not found in this conversation.",
        { extensions: { code: "BAD_USER_INPUT" } },
      );
    }
    quoteMessageId = input.quoteMessageId;
  }

  // Deduplicate mentionUserIds
  const mentionUserIds = [
    ...new Set(input.mentionUserIds ?? []),
  ];

  return {
    conversationId: input.conversationId,
    body,
    quoteMessageId,
    mentionUserIds,
  };
}
