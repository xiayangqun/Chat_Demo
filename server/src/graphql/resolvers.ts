/**
 * GraphQL resolvers — full implementation for all queries and mutations.
 */

import { GraphQLError, GraphQLScalarType, Kind } from "graphql";
import type { GraphQLContext } from "./context.js";
import {
  register as registerUser,
  login as loginUser,
} from "../modules/auth/auth.service.js";
import { UserModel } from "../modules/users/user.model.js";
import { toUserDTO } from "../modules/users/user.mapper.js";
import { UserService } from "../modules/users/user.service.js";
import { ConversationService } from "../modules/conversations/conversation.service.js";
import { ConversationMemberModel } from "../modules/conversations/conversationMember.model.js";
import { MessageService } from "../modules/messages/message.service.js";

/** DateTime scalar — accepts/returns ISO 8601 strings */
const DateTime = new GraphQLScalarType({
  name: "DateTime",
  description: "ISO 8601 date-time string",
  serialize(value) {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    return null;
  },
  parseValue(value) {
    if (typeof value === "string") return new Date(value);
    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return null;
  },
});

/** Helper: throw UNAUTHENTICATED if no userId in context */
function requireAuth(ctx: GraphQLContext): string {
  if (!ctx.userId) {
    throw new GraphQLError("You must be logged in.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return ctx.userId;
}

export const resolvers = {
  DateTime,

  Conversation: {
    members: async (parent: Record<string, unknown>) => {
      const conversationId = parent.id as string;
      const members = await ConversationMemberModel.find({ conversationId })
        .populate('userId')
        .lean();
      return members.map((m) => {
        const user = m.userId as unknown;
        return toUserDTO(user as Parameters<typeof toUserDTO>[0]);
      });
    },
  },

  Query: {
    me: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      const userId = requireAuth(ctx);
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new GraphQLError("User not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return toUserDTO(user);
    },

    users: async (
      _parent: unknown,
      args: { query?: string; limit?: number; skip?: number },
      ctx: GraphQLContext,
    ) => {
      requireAuth(ctx);
      return UserService.listUsers(args.query, args.limit, args.skip);
    },

    conversations: async (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext,
    ) => {
      const userId = requireAuth(ctx);
      return ConversationService.getConversationsForUser(userId);
    },

    conversation: async (
      _parent: unknown,
      args: { id: string },
      ctx: GraphQLContext,
    ) => {
      const userId = requireAuth(ctx);
      return ConversationService.getConversationById(args.id, userId);
    },

    messages: async (
      _parent: unknown,
      args: { conversationId: string; first?: number; after?: string; last?: number; before?: string },
      ctx: GraphQLContext,
    ) => {
      const userId = requireAuth(ctx);
      return MessageService.getMessages(
        args.conversationId,
        userId,
        args.first,
        args.after,
        args.last,
        args.before,
      );
    },

    conversationMembers: async (
      _parent: unknown,
      args: { conversationId: string; query?: string; limit?: number },
      ctx: GraphQLContext,
    ) => {
      requireAuth(ctx);
      return UserService.searchConversationMembers(
        args.conversationId,
        args.query,
        args.limit,
      );
    },
  },

  Mutation: {
    register: async (
      _parent: unknown,
      _args: { input: { username: string; displayName: string; password: string } },
      _ctx: GraphQLContext,
    ) => {
      return registerUser(_args.input);
    },

    login: async (
      _parent: unknown,
      _args: { input: { username: string; password: string } },
      _ctx: GraphQLContext,
    ) => {
      return loginUser(_args.input);
    },

    createGroupConversation: async (
      _parent: unknown,
      args: { input: { name: string; memberUserIds: string[] } },
      ctx: GraphQLContext,
    ) => {
      const userId = requireAuth(ctx);
      return ConversationService.createGroupConversation(args.input, userId);
    },

    createDirectConversation: async (
      _parent: unknown,
      args: { input: { userId: string } },
      ctx: GraphQLContext,
    ) => {
      const currentUserId = requireAuth(ctx);
      return ConversationService.createDirectConversation(
        args.input.userId,
        currentUserId,
      );
    },

    sendMessage: async (
      _parent: unknown,
      args: {
        input: {
          conversationId: string;
          body: string;
          quoteMessageId?: string;
          mentionUserIds?: string[];
          clientMutationId?: string;
        };
      },
      ctx: GraphQLContext,
    ) => {
      const userId = requireAuth(ctx);
      return MessageService.sendMessage(args.input, userId);
    },

    markConversationRead: async (
      _parent: unknown,
      args: { conversationId: string },
      ctx: GraphQLContext,
    ) => {
      const userId = requireAuth(ctx);
      return ConversationService.markConversationRead(
        args.conversationId,
        userId,
      );
    },
  },
};
