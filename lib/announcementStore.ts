import { unstable_noStore as noStore } from "next/cache";
import { getMongoClient, cleanMongoDocument } from "./mongodb";
import fs from "fs/promises";
import path from "path";
import {
  defaultAnnouncementData,
  type TopAnnouncementData,
} from "../data/announcement.types";

const DB_NAME = "germanskill";
const COLLECTION = "site_announcements";
const DOCUMENT_ID = "top_announcement_bar";
const DATA_FILE = path.join(process.cwd(), "data", "announcement.json");

export function sanitizeAnnouncement(
  value: Partial<TopAnnouncementData> | null | undefined
): TopAnnouncementData {
  if (!value) return defaultAnnouncementData;
  return {
    customText: typeof value.customText === "string" ? value.customText.trim() : "",
    isActive: typeof value.isActive === "boolean" ? value.isActive : true,
  };
}

type AnnouncementDocument = TopAnnouncementData & { _id: string; updatedAt?: Date };

export async function getAnnouncementData(): Promise<TopAnnouncementData> {
  noStore();

  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const doc = await client
        .db(DB_NAME)
        .collection<AnnouncementDocument>(COLLECTION)
        .findOne({ _id: DOCUMENT_ID });
      if (doc) return sanitizeAnnouncement(doc as Partial<TopAnnouncementData>);
    } catch (error) {
      console.error("MongoDB fetch failed for announcement", error);
    }
  }

  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return sanitizeAnnouncement(JSON.parse(data));
  } catch {
    return defaultAnnouncementData;
  }
}

export async function saveAnnouncementData(data: TopAnnouncementData) {
  const sanitized = sanitizeAnnouncement(data);

  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(sanitized, null, 2));
  } catch (error) {
    console.error("Failed to write to local announcement.json", error);
  }

  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const doc = cleanMongoDocument({ _id: DOCUMENT_ID, ...sanitized, updatedAt: new Date() });
      await client
        .db(DB_NAME)
        .collection<AnnouncementDocument>(COLLECTION)
        .updateOne({ _id: DOCUMENT_ID }, { $set: doc }, { upsert: true });
    } catch (error) {
      console.error("MongoDB save failed for announcement", error);
    }
  }

  return sanitized;
}
