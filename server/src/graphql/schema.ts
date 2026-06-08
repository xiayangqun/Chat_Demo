/**
 * GraphQL schema — loaded from schema.graphql file.
 * Using .graphql file gives IDE syntax highlighting and error checking.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const typeDefs = readFileSync(join(__dirname, "schema.graphql"), "utf-8");
