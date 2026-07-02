import { unstable_noStore as noStore } from "next/cache";
import { defaultVideoTestimonials, type VideoTestimonial } from "../data/videoTestimonials";
import { getMongoClient, cleanMongoDocument, throwMongoWriteError, resetMongoClient } from "./mongodb";
import { getFileVideoTestimonials, saveFileVideoTestimonials } from "./videoTestimonialFileStore";
import { isFileStoreEnabled, isServerlessHosting } from "./courseDetailsFileStore";
import { getYoutubeVideoId, slugifyTestimonialId } from "./videoTestimonialUtils";
import {
  CACHE_TAGS,
  getCachedPublicData,
  type PublicDataOptions,
} from "./publicDataCache";
import { revalidateTag } from "next/cache";

const DB_NAME = "germanskill";
const COLLECTION = "video_testimonials";

export type { VideoTestimonial };

function sanitizeItem(item: Partial<VideoTestimonial> & { id: string }): VideoTestimonial {
  const rating = Number(item.rating);
  const youtubeUrl = typeof item.youtubeUrl === "string" ? item.youtubeUrl.trim() : "";

  return {
    id: slugifyTestimonialId(item.id),
    name: typeof item.name === "string" ? item.name.trim() : "Student",
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 5,
    youtubeUrl,
    image: typeof item.image === "string" && item.image.trim() ? item.image.trim() : "/webinar-student.jpg",
    sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
    isActive: item.isActive !== false,
  };
}

function sortItems(items: VideoTestimonial[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

function normalizeSortOrders(items: VideoTestimonial[]) {
  return items.map((entry, index) => ({
    ...sanitizeItem(entry),
    sortOrder: index + 1,
  }));
}

async function getMongoItems(): Promise<VideoTestimonial[]> {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const client = await getMongoClient();
  const docs = await client.db(DB_NAME).collection<VideoTestimonial>(COLLECTION).find({}).toArray();
  return docs.map((doc) => {
    const { _id, ...rest } = doc as VideoTestimonial & { _id?: unknown };
    return sanitizeItem(rest);
  });
}

async function fetchAllVideoTestimonials(): Promise<VideoTestimonial[]> {
  let items: VideoTestimonial[] = [];

  if (isFileStoreEnabled()) {
    try {
      const store = await getFileVideoTestimonials();
      items = store?.items ?? [];
    } catch {
      items = [];
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const mongoItems = await getMongoItems();
      if (mongoItems.length > 0) {
        items = mongoItems;
      }
    } catch (error) {
      console.error("Failed to fetch video testimonials from MongoDB", error);
    }
  }

  if (items.length === 0) {
    return defaultVideoTestimonials;
  }

  return sortItems(items.map((item) => sanitizeItem(item)));
}

function revalidateVideoTestimonials() {
  try {
    revalidateTag(CACHE_TAGS.videoTestimonials);
  } catch (error) {
    console.error("Failed to revalidate video testimonials cache", error);
  }
}

export async function getAllVideoTestimonials(options: PublicDataOptions = {}): Promise<VideoTestimonial[]> {
  if (options.fresh) {
    noStore();
    return fetchAllVideoTestimonials();
  }

  return getCachedPublicData(
    ["video-testimonials"],
    [CACHE_TAGS.videoTestimonials],
    fetchAllVideoTestimonials,
  );
}

export async function getVideoTestimonials(options: PublicDataOptions = {}): Promise<VideoTestimonial[]> {
  const items = await getAllVideoTestimonials(options);
  return items.filter((item) => item.isActive && getYoutubeVideoId(item.youtubeUrl));
}

async function persistItems(items: VideoTestimonial[]) {
  const nextItems = sortItems(items.map((item) => sanitizeItem(item)));

  if (isFileStoreEnabled()) {
    await saveFileVideoTestimonials(nextItems);

    if (process.env.MONGODB_URI) {
      try {
        await saveMongoItems(nextItems);
      } catch (error) {
        console.warn("MongoDB sync skipped for video testimonials.", error);
      }
    }

    revalidateVideoTestimonials();
    return nextItems;
  }

  if (!process.env.MONGODB_URI) {
    if (!isServerlessHosting()) {
      await saveFileVideoTestimonials(nextItems);
      revalidateVideoTestimonials();
      return nextItems;
    }

    throw new Error("MONGODB_URI is not configured.");
  }

  await saveMongoItems(nextItems);
  revalidateVideoTestimonials();
  return nextItems;
}

async function saveMongoItems(items: VideoTestimonial[]) {
  async function writeItems() {
    const client = await getMongoClient();
    const collection = client.db(DB_NAME).collection<VideoTestimonial>(COLLECTION);
    const ids = items.map((item) => item.id);

    if (ids.length > 0) {
      await collection.deleteMany({ id: { $nin: ids } });
    } else {
      await collection.deleteMany({});
    }

    for (const item of items) {
      const { createdAt, ...fieldsToSet } = cleanMongoDocument({
        ...item,
        updatedAt: new Date(),
      }) as VideoTestimonial & { updatedAt: Date; createdAt?: Date };

      await collection.updateOne(
        { id: item.id },
        {
          $set: fieldsToSet,
          $setOnInsert: { createdAt: createdAt ?? new Date() },
        },
        { upsert: true },
      );
    }
  }

  try {
    await writeItems();
  } catch (error) {
    resetMongoClient();
    try {
      await writeItems();
    } catch (retryError) {
      throwMongoWriteError(retryError);
    }
  }
}

export async function saveVideoTestimonials(items: VideoTestimonial[]) {
  for (const item of items) {
    if (!getYoutubeVideoId(item.youtubeUrl)) {
      throw new Error(`Please enter a valid YouTube link for ${item.name || "this testimonial"}.`);
    }
  }

  return persistItems(items);
}

export async function upsertVideoTestimonial(payload: VideoTestimonial) {
  const item = sanitizeItem(payload);
  if (!getYoutubeVideoId(item.youtubeUrl)) {
    throw new Error("Please enter a valid YouTube video link.");
  }

  const items = await getAllVideoTestimonials({ fresh: true });
  const index = items.findIndex((entry) => entry.id === item.id);
  let nextItems: VideoTestimonial[];

  if (index === -1) {
    nextItems = [item, ...items.filter((entry) => entry.id !== item.id)];
  } else {
    nextItems = items.map((entry) => (entry.id === item.id ? item : entry));
  }

  return persistItems(normalizeSortOrders(nextItems));
}

export async function deleteVideoTestimonial(id: string) {
  const normalizedId = slugifyTestimonialId(id);
  const items = await getAllVideoTestimonials({ fresh: true });
  const nextItems = items.filter((item) => item.id !== normalizedId);
  return persistItems(nextItems);
}
