import { unstable_noStore as noStore } from "next/cache";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";
import {
  CACHE_TAGS,
  getCachedPublicData,
  safeRevalidatePublicSeoData,
  type PublicDataOptions,
} from "./publicDataCache";

export type SeoSettings = {
  title: string;
  description: string;
  updatedAt?: Date;
};

const DB_NAME = "germanskill";
const COLLECTION = "seo_settings";
const SETTINGS_ID = "global_seo";

const defaultSeoSettings: SeoSettings = {
  title: "Fluent AUF: Online German Language Classes",
  description: "A1–C2 Goethe certified live classes. Book your free demo class today.",
};

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection<SeoSettings & { _id: string }>(COLLECTION);
}

async function fetchSeoSettings(): Promise<SeoSettings> {
  if (!process.env.MONGODB_URI) {
    return defaultSeoSettings;
  }

  try {
    const collection = await getMongoCollection();
    const doc = await collection.findOne({ _id: SETTINGS_ID });

    if (!doc) {
      return defaultSeoSettings;
    }

    const { _id, ...settings } = doc;
    return settings as SeoSettings;
  } catch (error) {
    console.error("Failed to fetch SEO settings from DB", error);
    return defaultSeoSettings;
  }
}

export async function getSeoSettings(options: PublicDataOptions = {}): Promise<SeoSettings> {
  if (options.fresh) {
    noStore();
    return fetchSeoSettings();
  }

  return getCachedPublicData(
    ["seo-settings"],
    [CACHE_TAGS.seoSettings],
    fetchSeoSettings,
  );
}

export async function saveSeoSettings(payload: Partial<SeoSettings>) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const document: SeoSettings & { _id: string } = {
    _id: SETTINGS_ID,
    title: payload.title || defaultSeoSettings.title,
    description: payload.description || defaultSeoSettings.description,
    updatedAt: new Date(),
  };

  async function writeDocument() {
    const collection = await getMongoCollection();
    await collection.updateOne(
      { _id: SETTINGS_ID },
      { $set: document },
      { upsert: true },
    );
  }

  try {
    await writeDocument();
  } catch (error) {
    resetMongoClient();
    try {
      await writeDocument();
    } catch (retryError) {
      throw new Error(getMongoConnectionErrorMessage(retryError));
    }
  }

  safeRevalidatePublicSeoData();

  const { _id, ...savedSettings } = document;
  return savedSettings as SeoSettings;
}
