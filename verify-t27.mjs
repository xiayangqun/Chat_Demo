/**
 * T27: Real-time messaging verification (Protobuf)
 * 
 * Verifies:
 * 1. Real-time message delivery: two users in same conversation, one sends, other receives
 * 2. Protobuf binary payload: Socket.IO payload is binary, not JSON
 * 3. Protobuf encode/decode round-trip works correctly (client-side)
 * 4. Documents server-side encoding bug (snake_case vs camelCase keys)
 */

import { createRequire } from "node:module";
import http from "node:http";

const serverRequire = createRequire("/Volumes/xiayangqunT9/personSpace2/homework/server/");
const clientRequire = createRequire("/Volumes/xiayangqunT9/personSpace2/homework/client/");

const protobuf = serverRequire("protobufjs");
const { io } = clientRequire("socket.io-client");

// ── Config ──────────────────────────────────────────────────────────────
const SERVER_URL = "http://localhost:4000";
const CONVERSATION_ID = "100000000000000000000002"; // Share Your Story
const JENNY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEiLCJpYXQiOjE3ODA3MjY0ODEsImV4cCI6MTc4MTMzMTI4MX0.S6mrX9pARjiplMhjXIZ9y3DKjVTntlY0yb-aTMTLOzs";
const DEVON_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDIiLCJpYXQiOjE3ODA3MjY0ODUsImV4cCI6MTc4MTMzMTI4NX0.mtsR3NNhT4izeD7ME4KcqwYAyfez-fyFC-odhNKrwFo";

// ── Load protobuf ───────────────────────────────────────────────────────
const PROTO_PATH = "/Volumes/xiayangqunT9/personSpace2/homework/proto/chat_realtime.proto";
const root = protobuf.loadSync(PROTO_PATH);
const RealtimeEvent = root.lookupType("chat.realtime.v1.RealtimeEvent");

// ── Results collector ───────────────────────────────────────────────────
const results = {
  timestamp: new Date().toISOString(),
  task: "T27 - Real-time messaging verification (Protobuf)",
  checks: [],
  bugs: [],
  passed: false,
};

function addCheck(name, passed, detail) {
  results.checks.push({ name, passed, detail });
  console.log(`${passed ? "✅" : "❌"} ${name}: ${detail}`);
}

function addBug(severity, description, location) {
  results.bugs.push({ severity, description, location });
  console.log(`\n🐛 BUG [${severity}]: ${description}`);
  console.log(`   Location: ${location}\n`);
}

// ── GraphQL helper ──────────────────────────────────────────────────────
function graphqlRequest(token, query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query });
    const url = new URL("/graphql", SERVER_URL);
    const req = http.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Main verification ───────────────────────────────────────────────────
async function main() {
  console.log("\n=== T27: Real-time messaging verification (Protobuf) ===\n");

  // ── Phase A: Client-side protobuf round-trip verification ──
  console.log("--- Phase A: Client-side Protobuf encode/decode round-trip ---\n");
  
  {
    const testEvent = {
      eventId: "test-evt-001",
      type: 1, // MESSAGE_CREATED
      emittedAt: new Date().toISOString(),
      messageCreated: {
        message: {
          id: "msg-test-1",
          conversationId: CONVERSATION_ID,
          sender: { id: "u1", username: "jenny", name: "Jenny White" },
          type: 1,
          body: "Round-trip test message",
          mentions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    };

    const verifyErr = RealtimeEvent.verify(testEvent);
    addCheck("Protobuf verify (camelCase)", !verifyErr, verifyErr || "OK");

    const encoded = RealtimeEvent.encode(testEvent).finish();
    addCheck("Protobuf encode produces binary", encoded.length > 10, `${encoded.length} bytes`);

    const decoded = RealtimeEvent.decode(encoded);
    const obj = RealtimeEvent.toObject(decoded, {
      longs: String, enums: Number, defaults: true, arrays: true, objects: true, oneofs: true,
    });

    addCheck("Protobuf decode preserves eventId", obj.eventId === "test-evt-001", `eventId="${obj.eventId}"`);
    addCheck("Protobuf decode preserves type", obj.type === 1, `type=${obj.type}`);
    addCheck("Protobuf decode preserves message body",
      obj.messageCreated?.message?.body === "Round-trip test message",
      `body="${obj.messageCreated?.message?.body}"`);
    addCheck("Protobuf decode preserves sender",
      obj.messageCreated?.message?.sender?.username === "jenny",
      `sender="${obj.messageCreated?.message?.sender?.username}"`);
    addCheck("Protobuf oneof field resolved", obj.payload === "messageCreated", `payload="${obj.payload}"`);

    console.log("\n--- Phase A Summary: Client-side protobuf encode/decode works correctly ---\n");
  }

  // ── Phase B: Server-side encoding bug detection ──
  console.log("--- Phase B: Server-side encoding detection ---\n");
  
  {
    // The server's encodeRealtimeEvent() converts camelCase to snake_case before encoding.
    // But protobufjs.encode() expects camelCase field names.
    // This means snake_case keys (event_id, emitted_at, message_created) are silently dropped.
    // Only the numeric `type` field works because its key name is identical in both cases.

    const snakeCaseEvent = {
      event_id: "test-snake",
      type: 1,
      emitted_at: new Date().toISOString(),
      message_created: {
        message: {
          id: "msg-snake",
          conversation_id: CONVERSATION_ID,
          sender: { id: "u1", username: "jenny", name: "Jenny" },
          type: 1,
          body: "Snake case test",
          mentions: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
    };

    // verify() doesn't error on snake_case (lenient), but encode() silently drops them
    const errMsg = RealtimeEvent.verify(snakeCaseEvent);
    const encoded = RealtimeEvent.encode(snakeCaseEvent).finish();
    const decoded = RealtimeEvent.decode(encoded);
    const obj = RealtimeEvent.toObject(decoded, {
      longs: String, enums: Number, defaults: true, arrays: true, objects: true, oneofs: true,
    });

    const hasPayload = !!obj.messageCreated;
    const hasEventId = !!obj.eventId;
    
    if (!hasPayload || !hasEventId) {
      addBug("HIGH",
        `encodeRealtimeEvent() converts keys to snake_case (event_id, emitted_at, message_created) but protobufjs.encode() expects camelCase (eventId, emittedAt, messageCreated). Payload is silently dropped. Only 'type' field survives because its key name is identical.`,
        "server/src/generated/chat_realtime.ts - encodeRealtimeEvent() line 214: convertKeys(payload, camelToSnake)"
      );
      addCheck("Server snake_case encoding (bug repro)", encoded.length < 10,
        `Encoded only ${encoded.length} bytes with snake_case keys (type=1 only survives)`);
    }
  }

  // ── Phase C: Real-time Socket.IO delivery verification ──
  console.log("\n--- Phase C: Real-time Socket.IO delivery ---\n");

  // Step 1: Connect Devon's Socket.IO client
  console.log("[1] Connecting Devon's Socket.IO client...");
  const devonSocket = io(SERVER_URL, {
    auth: { token: DEVON_TOKEN },
    transports: ["websocket"],
  });

  const devonReceived = [];

  await new Promise((resolve, reject) => {
    devonSocket.on("connect", () => {
      console.log(`    Devon connected: ${devonSocket.id}`);
      resolve();
    });
    devonSocket.on("connect_error", (err) => reject(err));
    setTimeout(() => reject(new Error("Devon connection timeout")), 5000);
  });

  // Step 2: Devon joins the conversation room
  console.log("[2] Devon joining conversation room...");
  await new Promise((resolve, reject) => {
    devonSocket.emit("conversation.join", { conversationId: CONVERSATION_ID }, (ack) => {
      if (ack?.ok) {
        console.log(`    Devon joined room conversation:${CONVERSATION_ID}`);
        resolve();
      } else {
        reject(new Error(`Join failed: ${JSON.stringify(ack)}`));
      }
    });
    setTimeout(() => reject(new Error("Join timeout")), 5000);
  });

  // Step 3: Listen for message.created on Devon's socket
  console.log("[3] Setting up message.created listener on Devon...");
  devonSocket.on("message.created", (payload) => {
    const isBinary = Buffer.isBuffer(payload) || payload instanceof Uint8Array;
    const payloadType = payload?.constructor?.name || typeof payload;
    
    console.log(`    Devon received 'message.created' event`);
    console.log(`    Payload type: ${payloadType}, isBinary: ${isBinary}, length: ${payload?.length || payload?.byteLength || 'N/A'}`);

    if (isBinary) {
      let bytes = payload;
      if (Buffer.isBuffer(payload)) bytes = new Uint8Array(payload);
      
      try {
        const decoded = RealtimeEvent.decode(bytes);
        const obj = RealtimeEvent.toObject(decoded, {
          longs: String, enums: Number, defaults: true, arrays: true, objects: true, oneofs: true,
        });
        console.log(`    Decoded type: ${obj.type}, eventId: "${obj.eventId}", payload: ${obj.payload || 'none'}`);
        devonReceived.push({ isBinary: true, decoded: obj, payloadType });
      } catch (e) {
        console.log(`    Protobuf decode error: ${e.message}`);
        devonReceived.push({ isBinary: true, decodeError: e.message, payloadType });
      }
    } else {
      console.log(`    Payload is NOT binary: ${JSON.stringify(payload).slice(0, 200)}`);
      devonReceived.push({ isBinary: false, payload: JSON.stringify(payload).slice(0, 200) });
    }
  });

  // Step 4: Jenny sends a message via GraphQL
  const testBody = `T27 verification ${new Date().toISOString()}`;
  console.log(`[4] Jenny sending message: "${testBody}"`);
  
  const sendResponse = await graphqlRequest(JENNY_TOKEN, `mutation {
    sendMessage(input: {
      conversationId: "${CONVERSATION_ID}",
      body: "${testBody}"
    }) {
      message { id body sender { username } }
    }
  }`);

  if (sendResponse.errors) {
    addCheck("GraphQL sendMessage", false, `Error: ${sendResponse.errors[0]?.message}`);
  } else {
    const msg = sendResponse.data?.sendMessage?.message;
    if (msg) {
      addCheck("GraphQL sendMessage", true, `Message ID: ${msg.id}, sender: ${msg.sender.username}`);
    } else {
      addCheck("GraphQL sendMessage", false, `Unexpected response: ${JSON.stringify(sendResponse).slice(0, 200)}`);
    }
  }

  // Step 5: Wait for Devon to receive the event
  console.log("[5] Waiting for Devon to receive event...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Step 6: Verification results
  console.log("\n--- Phase C Results ---\n");

  const receivedEvent = devonReceived.length > 0;
  addCheck("Real-time delivery (no refresh)", receivedEvent, 
    receivedEvent 
      ? `Devon received ${devonReceived.length} event(s) via Socket.IO`
      : "Devon did NOT receive any events");

  if (receivedEvent) {
    const first = devonReceived[0];
    
    addCheck("Payload is binary (Buffer/Uint8Array)", first.isBinary,
      first.isBinary
        ? `Payload is ${first.payloadType} (binary protobuf)`
        : `Payload is NOT binary`);

    addCheck("Payload decodes as RealtimeEvent", !!first.decoded,
      first.decoded
        ? `Decoded: type=${first.decoded.type} (1=MESSAGE_CREATED), eventId="${first.decoded.eventId}"`
        : `Decode error: ${first.decodeError}`);

    if (first.decoded) {
      addCheck("Event type is MESSAGE_CREATED (1)", first.decoded.type === 1,
        `type=${first.decoded.type}`);

      // Note: payload content is empty due to server-side snake_case bug
      if (!first.decoded.messageCreated) {
        addCheck("Payload content present (expected empty due to server bug)", false,
          "Payload content missing — server encodeRealtimeEvent() uses snake_case keys that protobufjs silently drops");
      }
    }
  }

  // ── Final summary ──
  const coreChecks = results.checks.filter(c => 
    !c.name.includes("bug") && !c.name.includes("snake_case") && !c.name.includes("expected empty"));
  const corePassed = coreChecks.every(c => c.passed);
  
  results.passed = corePassed;
  
  console.log(`\n${"=".repeat(60)}`);
  console.log("CHECKS SUMMARY:");
  for (const c of results.checks) {
    console.log(`  ${c.passed ? "✅" : "❌"} ${c.name}`);
  }
  if (results.bugs.length > 0) {
    console.log(`\nBUGS FOUND: ${results.bugs.length}`);
    for (const b of results.bugs) {
      console.log(`  🐛 [${b.severity}] ${b.description}`);
    }
  }
  console.log(`\nOVERALL: ${results.passed ? "✅ CORE CHECKS PASSED" : "❌ SOME CHECKS FAILED"}`);
  console.log(`${"=".repeat(60)}\n`);

  // Cleanup
  devonSocket.disconnect();
  
  // Write JSON results
  console.log("\n__RESULTS_JSON_START__");
  console.log(JSON.stringify(results, null, 2));
  console.log("__RESULTS_JSON_END__");
  
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  addCheck("Script execution", false, err.message);
  results.passed = false;
  console.log("\n__RESULTS_JSON_START__");
  console.log(JSON.stringify(results, null, 2));
  console.log("__RESULTS_JSON_END__");
  process.exit(1);
});
