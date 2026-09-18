// Optional: `pnpm seed` adds any catalogue products the database is missing.
// The server already does this on every start (see src/index.ts), so this is
// only needed to populate the catalogue without starting the server.
// Safe to re-run — existing products (matched by name) are skipped.
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./lib/config/db.ts";
import { syncCatalog } from "./lib/catalog.ts";

async function seed() {
  await connectDB();
  const { added, total } = await syncCatalog();
  for (const name of added) console.log(`Seeded "${name}"`);
  console.log(`Done — ${added.length} added, ${total} products in the catalogue.`);
  await mongoose.disconnect();
}

seed();
