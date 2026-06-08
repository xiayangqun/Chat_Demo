#!/usr/bin/env node
/**
 * generate-client-proto.ts
 *
 * Reads proto/chat_realtime.proto and generates client/src/generated/chat_realtime.ts
 * with an inline proto definition and TypeScript interfaces.
 *
 * Usage: npx tsx scripts/generate-client-proto.ts
 */

import fs from "node:fs";
import path from "node:path";
import protobuf from "protobufjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PROTO_PATH = path.join(ROOT, "proto", "chat_realtime.proto");
const OUT_PATH = path.join(ROOT, "client", "src", "generated", "chat_realtime.ts");

// ── 1. Read the raw .proto source ──────────────────────────────────────
const protoSource = fs.readFileSync(PROTO_PATH, "utf-8");

// ── 2. Parse with protobufjs ───────────────────────────────────────────
const root = protobuf.loadSync(PROTO_PATH);

// ── 3. Extract enum definitions ────────────────────────────────────────
interface EnumDef {
  name: string;
  values: { name: string; number: number }[];
}

function extractEnums(): EnumDef[] {
  const enums: EnumDef[] = [];
  const ns = root.nested?.["chat"]?.nested?.["realtime"]?.nested?.["v1"];
  if (!ns?.nested) return enums;

  for (const [name, obj] of Object.entries(ns.nested)) {
    if (obj instanceof protobuf.Enum) {
      enums.push({
        name,
        values: Object.entries(obj.values).map(([n, v]) => ({
          name: n,
          number: v as number,
        })),
      });
    }
  }
  return enums;
}

// ── 4. Extract message type definitions ────────────────────────────────
interface FieldDef {
  name: string;
  type: string;
  optional: boolean;
  repeated: boolean;
}

interface MessageDef {
  name: string;
  fields: FieldDef[];
}

function protoTypeToTs(protoType: string, isEnum: boolean): string {
  if (isEnum) return protoType;
  switch (protoType) {
    case "string":
      return "string";
    case "int32":
    case "int64":
    case "uint32":
    case "uint64":
    case "float":
    case "double":
      return "number";
    case "bool":
      return "boolean";
    case "bytes":
      return "Uint8Array";
    default:
      return protoType;
  }
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function extractMessages(): MessageDef[] {
  const messages: MessageDef[] = [];
  const ns = root.nested?.["chat"]?.nested?.["realtime"]?.nested?.["v1"];
  if (!ns?.nested) return messages;

  const enumNames = new Set<string>();
  for (const [name, obj] of Object.entries(ns.nested)) {
    if (obj instanceof protobuf.Enum) enumNames.add(name);
  }

  for (const [name, obj] of Object.entries(ns.nested)) {
    if (obj instanceof protobuf.Type) {
      const fields: FieldDef[] = [];
      for (const field of obj.fieldsArray) {
        const isEnum = enumNames.has(field.type);
        fields.push({
          name: snakeToCamel(field.name),
          type: protoTypeToTs(field.type, isEnum),
          optional: field.optional ?? false,
          repeated: field.repeated ?? false,
        });
      }
      messages.push({ name, fields });
    }
  }
  return messages;
}

// ── 5. Generate TypeScript source ──────────────────────────────────────
function generate(): string {
  const enums = extractEnums();
  const messages = extractMessages();

  // Extract just the messages part of the proto (skip syntax, package, enums)
  const messageLines: string[] = [];
  const rawLines = protoSource.split("\n");
  let inMessage = false;
  let braceDepth = 0;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("message ")) {
      inMessage = true;
      braceDepth = 0;
      messageLines.push(line);
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      if (braceDepth === 0) inMessage = false;
      continue;
    }
    if (inMessage) {
      messageLines.push(line);
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      if (braceDepth <= 0) inMessage = false;
      continue;
    }
  }

  // Build the proto source to inline (enums + messages only)
  const protoInline = rawLines
    .filter((line) => {
      const t = line.trim();
      return (
        t.startsWith("syntax") ||
        t.startsWith("package") ||
        t.startsWith("enum") ||
        t.startsWith("message") ||
        t === "}" ||
        (t !== "" &&
          !t.startsWith("//") &&
          !t.startsWith("oneof") &&
          !t.startsWith("optional") &&
          !t.startsWith("repeated") &&
          !t.startsWith("string") &&
          !t.startsWith("int32") &&
          !t.startsWith("bool") &&
          !t.startsWith("oneof"))
      );
    })
    .join("\n");

  // Actually, simplest approach: just copy the entire proto content
  const fullProtoInline = protoSource.trim();

  // Build enum const objects
  const enumBlocks = enums
    .map((e) => {
      const entries = e.values
        .map((v) => `  ${v.name}: ${v.number},`)
        .join("\n");
      return `export const ${e.name} = {
${entries}
} as const;
export type ${e.name} = (typeof ${e.name})[keyof typeof ${e.name}];`;
    })
    .join("\n\n");

  // Build TypeScript interfaces
  const interfaceBlocks = messages
    .map((m) => {
      const fields = m.fields
        .map((f) => {
          let tsType = f.type;
          if (f.repeated) {
            tsType += "[]";
          }
          if (f.optional) {
            return `  ${f.name}?: ${tsType};`;
          }
          return `  ${f.name}: ${tsType};`;
        })
        .join("\n");
      return `export interface ${m.name} {\n${fields}\n}`;
    })
    .join("\n\n");

  return `import * as protobuf from 'protobufjs';

// ---------------------------------------------------------------------------
// Proto definition — sourced from proto/chat_realtime.proto
// Kept inline so protobufjs can parse it at runtime without filesystem access.
// Auto-generated by scripts/generate-client-proto.ts — DO NOT EDIT MANUALLY
// ---------------------------------------------------------------------------

const PROTO_SOURCE = /* proto */ \`
${fullProtoInline}
\`;

// ---------------------------------------------------------------------------
// Parse the proto definition synchronously at module load time.
// ---------------------------------------------------------------------------

const { root: protoRoot } = protobuf.parse(PROTO_SOURCE);

/**
 * Returns the protobufjs Root for the \`chat.realtime.v1\` package.
 */
export function loadProto(): protobuf.Root {
  return protoRoot;
}

// ---------------------------------------------------------------------------
// Enum const objects — compatible with \`erasableSyntaxOnly: true\`
// ---------------------------------------------------------------------------

${enumBlocks}

// ---------------------------------------------------------------------------
// TypeScript interfaces — match the proto message shapes (camelCase)
// ---------------------------------------------------------------------------

${interfaceBlocks}
`;
}

// ── 6. Write output ────────────────────────────────────────────────────
const output = generate();
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, output, "utf-8");

console.log(`✔ Generated ${path.relative(ROOT, OUT_PATH)} from ${path.relative(ROOT, PROTO_PATH)}`);
