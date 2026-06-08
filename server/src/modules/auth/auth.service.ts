/**
 * AuthService — register, login, verifyToken.
 * Follows backend_design.md §6.1.
 */

import { GraphQLError } from "graphql";
import { UserModel } from "../users/user.model.js";
import { toUserDTO, type UserDTO } from "../users/user.mapper.js";
import { hashPassword, comparePassword } from "./password.js";
import { signToken, verifyToken as jwtVerify } from "./jwt.js";

export interface AuthPayloadDTO {
  token: string;
  user: UserDTO;
}

const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;

/**
 * Register a new user.
 * - username: trim + lowercase, 3–32 chars, alphanumeric/underscore/hyphen, unique
 * - displayName: 1–40 chars → stored as `name`
 * - password: at least 6 chars
 */
export async function register(input: {
  username: string;
  displayName: string;
  password: string;
}): Promise<AuthPayloadDTO> {
  const username = input.username.trim().toLowerCase();
  const displayName = input.displayName.trim();
  const password = input.password;

  // Validation
  if (username.length < 3 || username.length > 32) {
    throw new GraphQLError("Username must be 3 to 32 characters.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  if (!USERNAME_RE.test(username)) {
    throw new GraphQLError(
      "Username can only contain letters, numbers, underscores, and hyphens.",
      { extensions: { code: "BAD_USER_INPUT" } },
    );
  }
  if (displayName.length < 1 || displayName.length > 40) {
    throw new GraphQLError("Display name must be 1 to 40 characters.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  if (password.length < 6) {
    throw new GraphQLError("Password must be at least 6 characters.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  // Check uniqueness
  const existing = await UserModel.findOne({ username }).lean();
  if (existing) {
    throw new GraphQLError("Username is already taken.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  // Create user
  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({
    username,
    passwordHash,
    name: displayName,
  });

  const token = signToken(user._id.toString());
  return { token, user: toUserDTO(user) };
}

/**
 * Login with username and password.
 * Returns UNAUTHENTICATED on failure.
 */
export async function login(input: {
  username: string;
  password: string;
}): Promise<AuthPayloadDTO> {
  const username = input.username.trim().toLowerCase();

  const user = await UserModel.findOne({ username });
  if (!user) {
    throw new GraphQLError("Invalid username or password.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new GraphQLError("Invalid username or password.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  const token = signToken(user._id.toString());
  return { token, user: toUserDTO(user) };
}

/**
 * Verify a JWT token and return the userId.
 * Returns null if invalid or expired.
 */
export function verifyToken(
  token: string,
): { userId: string } | null {
  const payload = jwtVerify(token);
  if (!payload) return null;
  return { userId: payload.sub };
}
