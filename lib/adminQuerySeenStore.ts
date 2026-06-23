import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ContactQuery } from "../data/contactQuery.types";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getContactQueries } from "./contactQueryStore";
import { getMongoClient } from "./mongodb";

const DB_NAME = "germanskill";
const SETTINGS_COLLECTION = "admin_settings";
const SETTINGS_ID = "queries_seen";
const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "admin-queries-seen.json");

type SeenStore = {
  lastSeenAt: string | null;
};

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

async function readFileSeenStore(): Promise<SeenStore> {
  if (!existsSync(STORE_FILE)) {
    return { lastSeenAt: null };
  }

  try {
    const raw = stripBom(await readFile(STORE_FILE, "utf8"));
    const parsed = JSON.parse(raw) as SeenStore;
    return {
      lastSeenAt: typeof parsed.lastSeenAt === "string" ? parsed.lastSeenAt : null,
    };
  } catch {
    return { lastSeenAt: null };
  }
}

async function writeFileSeenStore(store: SeenStore) {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }

  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function readMongoSeenStore(): Promise<SeenStore | null> {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client
    .db(DB_NAME)
    .collection<{ _id: string; lastSeenAt?: string }>(SETTINGS_COLLECTION)
    .findOne({ _id: SETTINGS_ID });

  if (!doc?.lastSeenAt) {
    return { lastSeenAt: null };
  }

  return { lastSeenAt: doc.lastSeenAt };
}

async function writeMongoSeenStore(store: SeenStore) {
  if (!process.env.MONGODB_URI) {
    return;
  }

  const client = await getMongoClient();
  await client
    .db(DB_NAME)
    .collection<{ _id: string; lastSeenAt?: string | null }>(SETTINGS_COLLECTION)
    .updateOne(
      { _id: SETTINGS_ID },
      { $set: { lastSeenAt: store.lastSeenAt } },
      { upsert: true },
    );
}

async function getSeenStore(): Promise<SeenStore> {
  if (isFileStoreEnabled()) {
    try {
      return await readFileSeenStore();
    } catch {
      // Fall through to MongoDB.
    }
  }

  try {
    const mongoStore = await readMongoSeenStore();
    if (mongoStore) {
      return mongoStore;
    }
  } catch {
    // Use default empty seen state.
  }

  return { lastSeenAt: null };
}

async function saveSeenStore(store: SeenStore) {
  if (isFileStoreEnabled()) {
    await writeFileSeenStore(store);

    if (process.env.MONGODB_URI) {
      try {
        await writeMongoSeenStore(store);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return;
  }

  await writeMongoSeenStore(store);
}

export async function getQueriesLastSeenAt(): Promise<string | null> {
  const store = await getSeenStore();
  return store.lastSeenAt;
}

export async function markQueriesAsSeen() {
  await saveSeenStore({ lastSeenAt: new Date().toISOString() });
}

export function filterUnseenQueries(queries: ContactQuery[], lastSeenAt: string | null) {
  if (!lastSeenAt) {
    return queries;
  }

  const seenTime = new Date(lastSeenAt).getTime();
  if (Number.isNaN(seenTime)) {
    return queries;
  }

  return queries.filter((query) => {
    const createdTime = new Date(query.createdAt).getTime();
    return !Number.isNaN(createdTime) && createdTime > seenTime;
  });
}

export function countUnseenQueries(queries: ContactQuery[], lastSeenAt: string | null) {
  return filterUnseenQueries(queries, lastSeenAt).length;
}

export async function getUnseenContactQueries(): Promise<ContactQuery[]> {
  const queries = await getContactQueries();
  const lastSeenAt = await getQueriesLastSeenAt();
  return filterUnseenQueries(queries, lastSeenAt);
}

export async function getUnseenQueryCount(queries: ContactQuery[]) {
  const lastSeenAt = await getQueriesLastSeenAt();
  return countUnseenQueries(queries, lastSeenAt);
}
