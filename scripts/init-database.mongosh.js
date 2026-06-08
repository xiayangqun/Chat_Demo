// Initialize MongoDB collections, validators, and indexes for the Chat Demo.
// Idempotent: safe to run multiple times. Does not destroy existing data.
//
// Schema definitions live in schemas.mongosh.js (single source of truth).
//
// Usage:
//   mongosh "mongodb://localhost:27017/chat-demo" scripts/init-database.mongosh.js

// ──────────────────────────────────────────────
// 1. Load schema definitions from external file
// ──────────────────────────────────────────────

const SCRIPT_DIR = (typeof __dirname !== "undefined")
  ? __dirname
  : pwd() + "/scripts";

load(SCRIPT_DIR + "/schemas.mongosh.js");

if (typeof SCHEMAS === "undefined") {
  print("ERROR: Failed to load SCHEMAS from schemas.mongosh.js");
  quit(1);
}

// ──────────────────────────────────────────────
// 2. Helper: pretty-print JSON inline
// ──────────────────────────────────────────────

function jsonStr(obj) {
  return JSON.stringify(obj, null, 2)
    .split("\n")
    .map(line => "    " + line)
    .join("\n");
}

// ──────────────────────────────────────────────
// 3. Per-collection ensure logic
// ──────────────────────────────────────────────

function ensureCollection(name, schema) {
  const exists = db.getCollectionNames().includes(name);

  if (!exists) {
    // ── Create new collection with validator ──
    print(`\nCreating collection "${name}" with schema validator...`);
    db.createCollection(name, {
      validator: schema.validator,
      validationLevel: schema.validationLevel
    });
    print(`  ✔ Collection "${name}" created.`);
  } else {
    // ── Validate existing schema ──
    const info = db.getCollectionInfos({ name })[0];
    const currentValidator = info.options?.validator || {};
    const expectedValidator = schema.validator;

    const validatorsMatch =
      JSON.stringify(currentValidator) === JSON.stringify(expectedValidator);

    if (!validatorsMatch) {
      print(`\n⚠ WARNING: Collection "${name}" validator does not match expected schema.`);
      print(`  Expected:`);
      print(jsonStr(expectedValidator));
      print(`  Actual:`);
      print(jsonStr(currentValidator));
      print(`  Applying collMod to correct.`);
    }

    // ── Apply collMod (idempotent — safe to re-run) ──
    db.runCommand({
      collMod: name,
      validator: schema.validator,
      validationLevel: schema.validationLevel
    });
    if (validatorsMatch) {
      print(`  ✔ Collection "${name}" validator matches expected (verified via collMod).`);
    } else {
      print(`  ✔ Collection "${name}" validator corrected via collMod.`);
    }
  }

  // ── Ensure indexes ──
  const collection = db.getCollection(name);
  const existingIndexes = collection.getIndexes();

  for (const idx of schema.indexes) {
    const desiredKey = JSON.stringify(idx.key);
    const desiredName = idx.options.name;

    // Check if an index with the same key pattern already exists (any name)
    const conflict = existingIndexes.find(
      existing => JSON.stringify(existing.key) === desiredKey && existing.name !== desiredName
    );

    if (conflict) {
      // An index with the same keys but different name already exists — skip
      print(`  ⚠ Index "${desiredName}" skipped: equivalent index "${conflict.name}" already exists.`);
      continue;
    }

    // Check if the exact named index already exists
    const exact = existingIndexes.find(
      existing => existing.name === desiredName
    );

    if (exact) {
      // Already exists with correct name — createIndex is idempotent but skip to avoid noise
      continue;
    }

    // No conflict — create it
    collection.createIndex(idx.key, idx.options);
  }
  print(`  ✔ Collection "${name}" indexes ensured.`);
}

// ──────────────────────────────────────────────
// 4. Run for all collections
// ──────────────────────────────────────────────

print("Chat Demo — Database Schema Initialization");
print("==========================================");
print(`Loaded ${Object.keys(SCHEMAS).length} schemas from schemas.mongosh.js`);

for (const [name, schema] of Object.entries(SCHEMAS)) {
  ensureCollection(name, schema);
}

// ──────────────────────────────────────────────
// 5. Verdict
// ──────────────────────────────────────────────

print("\n==========================================");
print("VERDICT: All collections validated/created successfully.");
print("==========================================");
