import { unstable_noStore as noStore } from "next/cache";
import {
  defaultCityPageSeo,
  defaultCityPagesStore,
  defaultCityHeroDescription,
  type CityPage,
  type CityPageHighlight,
  type CityPageSeo,
  type CityPagesStore,
} from "../data/cityPages";
import { getMongoClient, cleanMongoDocument, throwMongoWriteError, resetMongoClient } from "./mongodb";
import { getFileCityPagesStore, saveFileCityPagesStore } from "./cityPageFileStore";
import { isFileStoreEnabled, isServerlessHosting } from "./courseDetailsFileStore";
import { slugifyCitySlug } from "./cityPageUtils";
import {
  CACHE_TAGS,
  getCachedPublicData,
  safeRevalidatePublicCityPagesData,
  shouldBypassPublicDataCache,
  type PublicDataOptions,
} from "./publicDataCache";

const DB_NAME = "germanskill";
const COLLECTION = "city_pages";
const DOCUMENT_ID = "site_city_pages";

type CityPagesDocument = CityPagesStore & { _id: string; updatedAt?: Date };

export type { CityPage, CityPagesStore };

function sanitizeHighlight(item: Partial<CityPageHighlight> | undefined): CityPageHighlight {
  return {
    title: typeof item?.title === "string" ? item.title.trim() : "",
    text: typeof item?.text === "string" ? item.text.trim() : "",
  };
}

function sanitizeSeo(value: Partial<CityPageSeo> | undefined, cityName: string): CityPageSeo {
  const fallback = defaultCityPageSeo(cityName || "India");
  return {
    metaTitle:
      typeof value?.metaTitle === "string" && value.metaTitle.trim()
        ? value.metaTitle.trim().slice(0, 70)
        : fallback.metaTitle,
    metaKeyword:
      typeof value?.metaKeyword === "string" && value.metaKeyword.trim()
        ? value.metaKeyword.trim().slice(0, 160)
        : fallback.metaKeyword,
    metaDescription:
      typeof value?.metaDescription === "string" && value.metaDescription.trim()
        ? value.metaDescription.trim().slice(0, 250)
        : fallback.metaDescription,
  };
}

function sanitizePage(value: Partial<CityPage> & { slug?: string; cityName?: string }): CityPage | null {
  const cityName = typeof value.cityName === "string" ? value.cityName.trim() : "";
  const slug =
    slugifyCitySlug(value.slug || "") ||
    slugifyCitySlug(cityName);

  if (!slug || !cityName) {
    return null;
  }

  const highlights = Array.isArray(value.highlights)
    ? value.highlights.map(sanitizeHighlight).filter((item) => item.title || item.text)
    : [];

  return {
    slug,
    cityName,
    title:
      typeof value.title === "string" && value.title.trim()
        ? value.title.trim()
        : `German Classes in ${cityName}`,
    subtitle:
      typeof value.subtitle === "string" && value.subtitle.trim()
        ? value.subtitle.trim()
        : "Live online A1–C2 training with certified tutors",
    heroDescription: (() => {
      const raw =
        typeof value.heroDescription === "string" ? value.heroDescription.trim() : "";
      if (!raw) {
        return defaultCityHeroDescription;
      }
      // Keep compact marketing copy on city heroes (avoid older long blurbs).
      if (
        raw.startsWith("Looking for German classes") ||
        raw.includes("Academic Prospects Such as") ||
        raw.includes("Austria / Switzerland opportunities") ||
        raw ===
          "Professional Goethe & TELC German learning from A1 to C2 for study abroad, careers & Germany pathways." ||
        raw ===
          "Professional German Goethe & TELC learning from A1 to C2 for study abroad, careers & Germany pathways."
      ) {
        return defaultCityHeroDescription;
      }
      return raw;
    })(),
    highlights,
    contentHtml: typeof value.contentHtml === "string" ? value.contentHtml.trim() : "",
    ctaHeading:
      typeof value.ctaHeading === "string" && value.ctaHeading.trim()
        ? value.ctaHeading.trim()
        : `Start learning German from ${cityName}`,
    ctaText:
      typeof value.ctaText === "string" && value.ctaText.trim()
        ? value.ctaText.trim()
        : "Book a free demo class and get the right level and batch recommendation.",
    ctaButtonText:
      typeof value.ctaButtonText === "string" && value.ctaButtonText.trim()
        ? value.ctaButtonText.trim()
        : "Book Free Demo",
    seo: sanitizeSeo(value.seo, cityName),
    isActive: value.isActive !== false,
    sortOrder: Number.isFinite(Number(value.sortOrder)) ? Number(value.sortOrder) : 0,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
  };
}

function sanitizeStore(value: Partial<CityPagesStore> | null | undefined): CityPagesStore {
  const pages = Array.isArray(value?.pages)
    ? value.pages
        .map((page) => sanitizePage(page))
        .filter((page): page is CityPage => Boolean(page))
        .sort((a, b) => a.sortOrder - b.sortOrder || a.cityName.localeCompare(b.cityName))
    : defaultCityPagesStore.pages;

  return { pages };
}

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection<CityPagesDocument>(COLLECTION);
}

async function getMongoStore(): Promise<CityPagesStore | null> {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const collection = await getMongoCollection();
  const doc = await collection.findOne({ _id: DOCUMENT_ID });
  if (!doc) {
    return null;
  }

  const { _id, updatedAt, ...rest } = doc;
  return sanitizeStore(rest);
}

async function saveMongoStore(store: CityPagesStore) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  async function writeDocument() {
    const collection = await getMongoCollection();
    const document = cleanMongoDocument({
      _id: DOCUMENT_ID,
      ...store,
      updatedAt: new Date(),
    });
    await collection.updateOne({ _id: DOCUMENT_ID }, { $set: document }, { upsert: true });
  }

  try {
    await writeDocument();
  } catch (error) {
    resetMongoClient();
    try {
      await writeDocument();
    } catch (retryError) {
      throwMongoWriteError(retryError);
    }
  }
}

async function fetchCityPagesStore(): Promise<CityPagesStore> {
  if (isFileStoreEnabled()) {
    try {
      const store = await getFileCityPagesStore();
      if (store?.pages?.length) {
        return sanitizeStore(store);
      }
    } catch {
      // Fall through to MongoDB/default.
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const mongoStore = await getMongoStore();
      if (mongoStore?.pages?.length) {
        return mongoStore;
      }
    } catch (error) {
      console.error("Failed to fetch city pages from MongoDB", error);
      if (isServerlessHosting() && !isFileStoreEnabled()) {
        throw error;
      }
    }
  }

  return sanitizeStore(defaultCityPagesStore);
}

async function persistStore(store: CityPagesStore) {
  const nextStore = sanitizeStore(store);

  if (isFileStoreEnabled()) {
    await saveFileCityPagesStore(nextStore);
    if (process.env.MONGODB_URI) {
      try {
        await saveMongoStore(nextStore);
      } catch {
        // Local file store remains source of truth in development.
      }
    }
  } else {
    await saveMongoStore(nextStore);
  }

  safeRevalidatePublicCityPagesData(...nextStore.pages.map((page) => page.slug));
  return nextStore;
}

export async function getCityPagesStore(options: PublicDataOptions = {}): Promise<CityPagesStore> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchCityPagesStore();
  }

  return getCachedPublicData(["city-pages", "v1"], [CACHE_TAGS.cityPages], fetchCityPagesStore);
}

export async function getCityPagesForDisplay(options: PublicDataOptions = {}): Promise<CityPage[]> {
  const store = await getCityPagesStore(options);
  return store.pages.filter((page) => page.isActive);
}

export async function getCityPageBySlug(
  slug: string,
  options: PublicDataOptions = {},
): Promise<CityPage | null> {
  const normalized = slugifyCitySlug(slug);
  if (!normalized) {
    return null;
  }

  const store = await getCityPagesStore(options);
  return store.pages.find((page) => page.slug === normalized && page.isActive) ?? null;
}

export async function saveCityPagesStore(store: CityPagesStore) {
  return persistStore(store);
}

export async function upsertCityPage(page: Partial<CityPage> & { cityName: string }) {
  const store = await getCityPagesStore({ fresh: true });
  const sanitized = sanitizePage({
    ...page,
    updatedAt: new Date().toISOString(),
  });

  if (!sanitized) {
    throw new Error("City name is required.");
  }

  if (!sanitized.title.trim()) {
    throw new Error("Page title is required.");
  }

  const existingIndex = store.pages.findIndex((item) => item.slug === sanitized.slug);
  const pages =
    existingIndex >= 0
      ? store.pages.map((item, index) => (index === existingIndex ? sanitized : item))
      : [...store.pages, sanitized];

  return persistStore({ pages });
}

export async function deleteCityPage(slug: string) {
  const normalized = slugifyCitySlug(slug);
  if (!normalized) {
    throw new Error("City slug is required.");
  }

  const store = await getCityPagesStore({ fresh: true });
  const pages = store.pages.filter((page) => page.slug !== normalized);
  if (pages.length === store.pages.length) {
    throw new Error("City page not found.");
  }

  return persistStore({ pages });
}
