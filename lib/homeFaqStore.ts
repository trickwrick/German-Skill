import { unstable_noStore as noStore } from "next/cache";
import { defaultHomeFaqContent, type HomeFaqContent, type HomeFaqItem } from "../data/homeFaqs";
import { getMongoClient, cleanMongoDocument, throwMongoWriteError, resetMongoClient } from "./mongodb";
import { getFileHomeFaqContent, saveFileHomeFaqContent } from "./homeFaqFileStore";
import { isFileStoreEnabled, isServerlessHosting } from "./courseDetailsFileStore";
import { slugifyHomeFaqId, sortHomeFaqItems } from "./homeFaqUtils";
import {
  CACHE_TAGS,
  getCachedPublicData,
  safeRevalidatePublicHomeFaqsData,
  shouldBypassPublicDataCache,
  type PublicDataOptions,
} from "./publicDataCache";

const DB_NAME = "germanskill";
const COLLECTION = "home_faqs";
const DOCUMENT_ID = "homepage";

type HomeFaqDocument = HomeFaqContent & { _id: string; updatedAt?: Date };

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection<HomeFaqDocument>(COLLECTION);
}

export type { HomeFaqContent, HomeFaqItem };

function sanitizeItem(item: Partial<HomeFaqItem> & { id: string }): HomeFaqItem {
  return {
    id: slugifyHomeFaqId(item.id),
    question: typeof item.question === "string" ? item.question.trim() : "",
    answer: typeof item.answer === "string" ? item.answer.trim() : "",
    sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
    isActive: item.isActive !== false,
  };
}

function sanitizeContent(value: Partial<HomeFaqContent>): HomeFaqContent {
  const title =
    typeof value.title === "string" && value.title.trim()
      ? value.title.trim()
      : defaultHomeFaqContent.title;
  const subtitle =
    typeof value.subtitle === "string" && value.subtitle.trim()
      ? value.subtitle.trim()
      : defaultHomeFaqContent.subtitle;
  const items = Array.isArray(value.items)
    ? sortHomeFaqItems(value.items.map((item) => sanitizeItem(item)))
    : defaultHomeFaqContent.items;

  return { title, subtitle, items };
}

async function getMongoContent(): Promise<HomeFaqContent | null> {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const collection = await getMongoCollection();
  const doc = await collection.findOne({ _id: DOCUMENT_ID });
  if (!doc) {
    return null;
  }

  const { _id, updatedAt, ...rest } = doc;
  return sanitizeContent(rest);
}

async function fetchHomeFaqContent(): Promise<HomeFaqContent> {
  if (isFileStoreEnabled()) {
    try {
      const store = await getFileHomeFaqContent();
      if (store?.items?.length) {
        return sanitizeContent(store);
      }
    } catch {
      // Fall through to MongoDB/default.
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const mongoContent = await getMongoContent();
      if (mongoContent?.items?.length) {
        return mongoContent;
      }
    } catch (error) {
      console.error("Failed to fetch homepage FAQs from MongoDB", error);
    }
  }

  return sanitizeContent(defaultHomeFaqContent);
}

export async function getHomeFaqContent(options: PublicDataOptions = {}): Promise<HomeFaqContent> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchHomeFaqContent();
  }

  return getCachedPublicData(["home-faqs"], [CACHE_TAGS.homeFaqs], fetchHomeFaqContent);
}

export async function getActiveHomeFaqItems(options: PublicDataOptions = {}): Promise<HomeFaqContent> {
  const content = await getHomeFaqContent(options);
  return {
    ...content,
    items: content.items.filter((item) => item.isActive && item.question && item.answer),
  };
}

async function persistContent(content: HomeFaqContent) {
  const nextContent = sanitizeContent(content);

  if (isFileStoreEnabled()) {
    await saveFileHomeFaqContent(nextContent);

    if (process.env.MONGODB_URI) {
      try {
        await saveMongoContent(nextContent);
      } catch (error) {
        console.warn("MongoDB sync skipped for homepage FAQs.", error);
      }
    }

    safeRevalidatePublicHomeFaqsData();
    return nextContent;
  }

  if (!process.env.MONGODB_URI) {
    if (!isServerlessHosting()) {
      await saveFileHomeFaqContent(nextContent);
      safeRevalidatePublicHomeFaqsData();
      return nextContent;
    }

    throw new Error("MONGODB_URI is not configured.");
  }

  await saveMongoContent(nextContent);
  safeRevalidatePublicHomeFaqsData();
  return nextContent;
}

async function saveMongoContent(content: HomeFaqContent) {
  async function writeContent() {
    const collection = await getMongoCollection();
    const document = cleanMongoDocument({
      _id: DOCUMENT_ID,
      ...content,
      updatedAt: new Date(),
    });

    await collection.updateOne({ _id: DOCUMENT_ID }, { $set: document }, { upsert: true });
  }

  try {
    await writeContent();
  } catch (error) {
    resetMongoClient();
    try {
      await writeContent();
    } catch (retryError) {
      throwMongoWriteError(retryError);
    }
  }
}

export async function saveHomeFaqContent(content: HomeFaqContent) {
  if (!content.title?.trim()) {
    throw new Error("FAQ section title is required.");
  }

  if (!content.subtitle?.trim()) {
    throw new Error("FAQ section subtitle is required.");
  }

  for (const item of content.items) {
    if (!item.question.trim() || !item.answer.trim()) {
      throw new Error("Each FAQ needs both a question and an answer.");
    }
  }

  return persistContent(content);
}

export async function upsertHomeFaqItem(
  payload: HomeFaqItem,
  section?: Partial<Pick<HomeFaqContent, "title" | "subtitle">>,
) {
  const item = sanitizeItem(payload);
  if (!item.question || !item.answer) {
    throw new Error("Question and answer are required.");
  }

  const content = await getHomeFaqContent({ fresh: true });
  const title = section?.title?.trim() || content.title;
  const subtitle = section?.subtitle?.trim() || content.subtitle;
  const index = content.items.findIndex((entry) => entry.id === item.id);
  let nextItems: HomeFaqItem[];

  if (index === -1) {
    nextItems = [{ ...item, sortOrder: 1 }, ...content.items.filter((entry) => entry.id !== item.id)];
  } else {
    nextItems = content.items.map((entry) => (entry.id === item.id ? item : entry));
  }

  nextItems = nextItems.map((entry, entryIndex) => ({
    ...sanitizeItem(entry),
    sortOrder: entryIndex + 1,
  }));

  return persistContent({ title, subtitle, items: nextItems });
}

export async function deleteHomeFaqItem(id: string) {
  const normalizedId = slugifyHomeFaqId(id);
  const content = await getHomeFaqContent({ fresh: true });
  const nextItems = content.items
    .filter((item) => item.id !== normalizedId)
    .map((entry, index) => ({ ...entry, sortOrder: index + 1 }));

  return persistContent({ ...content, items: nextItems });
}

export async function updateHomeFaqSectionMeta(title: string, subtitle: string) {
  const content = await getHomeFaqContent({ fresh: true });
  return persistContent({ ...content, title: title.trim(), subtitle: subtitle.trim() });
}
