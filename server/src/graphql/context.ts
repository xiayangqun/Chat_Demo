/**
 * GraphQL context factory for Apollo Server 4.
 * Extracts userId from the Authorization: Bearer <token> header
 * using real JWT verification via AuthService.
 */

import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { verifyToken } from "../modules/auth/jwt.js";

export interface GraphQLContext {
  userId: string | null;
}

/**
 * Parse a Bearer token from the Authorization header and verify it.
 * Returns the userId (sub claim) if valid, null otherwise.
 */
function extractUserId(authHeader: string | undefined): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  const token = parts[1];
  if (!token) return null;

  const payload = verifyToken(token);
  return payload ? payload.sub : null;
}

export async function createContext({
  req,
}: ExpressContextFunctionArgument): Promise<GraphQLContext> {
  const authHeader = req.headers.authorization;
  const userId = extractUserId(authHeader);
  return { userId };
}
