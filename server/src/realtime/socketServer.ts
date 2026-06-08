import { Server as SocketIOServer, Socket } from "socket.io";
import type http from "node:http";
import jwt from "jsonwebtoken";
import type { Config } from "../config/env.js";
import { RealtimeService } from "./realtimeService.js";

/** Shape of the JWT payload we sign in auth flows. */
interface JwtPayload {
  sub: string;
  [key: string]: unknown;
}

/** Data attached to every socket after successful auth. */
export interface SocketData {
  userId: string;
}

/** Module-level singleton, initialised in initializeSocketServer(). */
let realtimeService: RealtimeService;

/**
 * Return the RealtimeService singleton.
 * Must be called AFTER initializeSocketServer() has been invoked.
 */
export function getRealtimeService(): RealtimeService {
  return realtimeService;
}

/**
 * Initialise a Socket.IO server on top of the existing HTTP server.
 *
 * - Verifies JWT from `socket.handshake.auth.token`
 * - On success, joins `user:{userId}` room
 * - Registers `conversation.join` / `conversation.leave` handlers
 */
export function initializeSocketServer(
  httpServer: http.Server,
  config: Config,
): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  /* ── Auth middleware ──────────────────────────────────────────── */
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) {
      next(new Error("UNAUTHENTICATED"));
      return;
    }

    try {
      const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      const userId = payload.sub;

      if (!userId) {
        next(new Error("UNAUTHENTICATED"));
        return;
      }

      (socket.data as SocketData).userId = userId;
      next();
    } catch {
      next(new Error("UNAUTHENTICATED"));
    }
  });

  /* ── Connection handler ──────────────────────────────────────── */
  io.on("connection", (socket: Socket) => {
    const userId = (socket.data as SocketData).userId;
    const userRoom = `user:${userId}`;

    // Auto-join the per-user room
    void socket.join(userRoom);
    console.log(`Socket connected: ${socket.id} (user ${userId})`);

    /* disconnect */
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  console.log("Socket.IO ready");
  realtimeService = new RealtimeService(io);
  return io;
}
