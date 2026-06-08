/**
 * JWT utilities using jsonwebtoken.
 * Token payload: { sub: userId }.
 * Expiry: 7 days (from config).
 */

import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../../config/env.js";

export interface JwtPayload {
  sub: string;
}

/**
 * Sign a JWT token for the given userId.
 * Uses JWT_SECRET and JWT_EXPIRES_IN from config.
 */
export function signToken(userId: string): string {
  const payload: JwtPayload = { sub: userId };
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
}

/**
 * Verify a JWT token and return the decoded payload.
 * Returns null if the token is invalid or expired.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    if (typeof decoded.sub === "string") {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}
