import dotenv from "dotenv";
dotenv.config();

import http from "node:http";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { config } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { initializeSocketServer } from "./realtime/socketServer.js";
import { seedDatabase } from "./seed/seedDatabase.js";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { createContext } from "./graphql/context.js";
import type { Server as SocketIOServer } from "socket.io";

const app = express();

app.use(
  cors({
    origin: config.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const httpServer = http.createServer(app);

let io: SocketIOServer;

async function start(): Promise<void> {
  await connectDatabase();

  if (config.SEED_DATABASE) {
    await seedDatabase();
  }

  connectRedis();

  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  app.use(
    "/graphql",
    expressMiddleware(apolloServer, { context: createContext })
  );

  io = initializeSocketServer(httpServer, config);

  httpServer.listen(config.PORT, () => {
    console.log(`Server ready on port ${config.PORT}`);
  });
}

start();

async function shutdown(): Promise<void> {
  console.log("Shutting down gracefully...");
  await disconnectDatabase();
  disconnectRedis();
  httpServer.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export { app, httpServer, io };
