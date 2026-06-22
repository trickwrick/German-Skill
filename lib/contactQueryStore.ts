import { randomUUID } from "crypto";
import { unstable_noStore as noStore } from "next/cache";
import type { ContactQuery, ContactQueryInput } from "../data/contactQuery.types";
import {
  addFileContactQuery,
  deleteFileContactQuery,
  getFileContactQueries,
} from "./contactQueriesFileStore";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";

const DB_NAME = "germanskill";
const COLLECTION = "contact_queries";

async function getMongoContactQueries(): Promise<ContactQuery[]> {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const client = await getMongoClient();
  const docs = await client
    .db(DB_NAME)
    .collection<ContactQuery>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs;
}

async function insertMongoContactQuery(query: ContactQuery) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured. Add it in your hosting environment variables.");
  }

  async function writeQuery() {
    const client = await getMongoClient();
    await client.db(DB_NAME).collection<ContactQuery>(COLLECTION).insertOne(query);
  }

  try {
    await writeQuery();
  } catch (error) {
    resetMongoClient();

    try {
      await writeQuery();
    } catch (retryError) {
      throw new Error(getMongoConnectionErrorMessage(retryError));
    }
  }

  return query;
}

async function removeMongoContactQuery(id: string) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured. Add it in your hosting environment variables.");
  }

  const client = await getMongoClient();
  const result = await client
    .db(DB_NAME)
    .collection<ContactQuery>(COLLECTION)
    .deleteOne({ id });

  return result.deletedCount > 0;
}

export async function getContactQueries(): Promise<ContactQuery[]> {
  noStore();

  if (isFileStoreEnabled()) {
    try {
      const fileQueries = await getFileContactQueries();
      if (fileQueries) {
        return fileQueries;
      }
    } catch {
      // Fall through to MongoDB.
    }
  }

  try {
    if (process.env.MONGODB_URI) {
      return await getMongoContactQueries();
    }
  } catch {
    // No stored queries available.
  }

  return [];
}

export async function saveContactQuery(input: ContactQueryInput): Promise<ContactQuery> {
  const query: ContactQuery = {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    course: input.course?.trim() || "General Inquiry",
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };

  if (isFileStoreEnabled()) {
    await addFileContactQuery(query);

    if (process.env.MONGODB_URI) {
      try {
        await insertMongoContactQuery(query);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return query;
  }

  return insertMongoContactQuery(query);
}

export async function deleteContactQuery(id: string) {
  if (!id.trim()) {
    return false;
  }

  if (isFileStoreEnabled()) {
    const removed = await deleteFileContactQuery(id);

    if (process.env.MONGODB_URI) {
      try {
        await removeMongoContactQuery(id);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return removed;
  }

  return removeMongoContactQuery(id);
}
