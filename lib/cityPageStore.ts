import { unstable_noStore as noStore } from "next/cache";
import {
  DEFAULT_HERO_BADGE_PREFIX,
  defaultCityFaqs,
  defaultCityHeroDescription,
  defaultCityJourney,
  defaultCityPageSeo,
  defaultCityPagesStore,
  defaultCitySuccess,
  defaultCityVision,
  defaultCityWhyLearn,
  defaultHeroTypedPhrases,
  type CityFaqItem,
  type CityFaqSectionData,
  type CityJourneySectionData,
  type CityPage,
  type CityPageHighlight,
  type CityPageSeo,
  type CityPagesStore,
  type CitySuccessSectionData,
  type CityVisionSectionData,
  type CityWhyCollageItem,
  type CityWhyFeatureItem,
  type CityWhyLearnSectionData,
} from "../data/cityPages";
import { getMongoClient, cleanMongoDocument, throwMongoWriteError, resetMongoClient } from "./mongodb";
import { getFileCityPagesStore, saveFileCityPagesStore } from "./cityPageFileStore";
import { isFileStoreEnabled, isServerlessHosting } from "./courseDetailsFileStore";
import { normalizeCitySlug } from "./cityPageUtils";
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

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function sanitizeVision(
  value: Partial<CityVisionSectionData> | undefined,
  cityName: string,
): CityVisionSectionData {
  const fallback = defaultCityVision(cityName);
  const points = Array.isArray(value?.points)
    ? value.points.map((point) => asString(point)).filter(Boolean)
    : fallback.points;
  return {
    tag: asString(value?.tag, fallback.tag),
    heading: asString(value?.heading, fallback.heading),
    headingHighlight: asString(value?.headingHighlight, fallback.headingHighlight),
    headingSuffix: asString(
      (value as { headingSuffix?: string } | undefined)?.headingSuffix,
      fallback.headingSuffix,
    ),
    text: asString(value?.text, fallback.text),
    points: points.length ? points : fallback.points,
    imageSrc: asString(value?.imageSrc, fallback.imageSrc),
    imageAlt: asString(value?.imageAlt, fallback.imageAlt),
    badgeValue: asString(value?.badgeValue, fallback.badgeValue),
    badgeLabel: asString(value?.badgeLabel, fallback.badgeLabel),
    linkText: asString(value?.linkText, fallback.linkText),
    linkHref: asString(value?.linkHref, fallback.linkHref),
  };
}

function sanitizeWhyLearn(
  value: Partial<CityWhyLearnSectionData> | undefined,
  cityName: string,
): CityWhyLearnSectionData {
  const fallback = defaultCityWhyLearn(cityName);
  const tones: CityWhyFeatureItem["tone"][] = ["demo", "exam", "tutors", "batch"];

  const collage: CityWhyCollageItem[] = Array.isArray(value?.collage)
    ? value.collage
        .map((item, index) => ({
          src: asString(item?.src, fallback.collage[index]?.src || "/hero-students.jpg"),
          alt: asString(item?.alt, fallback.collage[index]?.alt || ""),
          label: asString(item?.label, fallback.collage[index]?.label || `Image ${index + 1}`),
        }))
        .filter((item) => item.src)
    : fallback.collage;

  const features: CityWhyFeatureItem[] = Array.isArray(value?.features)
    ? value.features
        .map((item, index) => {
          const tone = tones.includes(item?.tone as CityWhyFeatureItem["tone"])
            ? (item.tone as CityWhyFeatureItem["tone"])
            : fallback.features[index]?.tone || "demo";
          return {
            title: asString(item?.title, fallback.features[index]?.title || ""),
            text: asString(item?.text, fallback.features[index]?.text || ""),
            badge: asString(item?.badge, fallback.features[index]?.badge || ""),
            tone,
          };
        })
        .filter((item) => item.title || item.text)
    : fallback.features;

  return {
    headingBefore: asString(value?.headingBefore, fallback.headingBefore),
    headingHighlight: asString(value?.headingHighlight, fallback.headingHighlight),
    headingAfter: asString(value?.headingAfter, fallback.headingAfter),
    text: asString(value?.text, fallback.text),
    collage: collage.length ? collage : fallback.collage,
    features: features.length ? features : fallback.features,
  };
}

function sanitizeJourney(
  value: Partial<CityJourneySectionData> | undefined,
  cityName: string,
  legacy?: { ctaText?: string; ctaButtonText?: string },
): CityJourneySectionData {
  const fallback = defaultCityJourney(cityName);
  const text =
    asString(value?.text) ||
    (legacy?.ctaText && legacy.ctaText.trim().length > 80 ? legacy.ctaText.trim() : "") ||
    fallback.text;
  return {
    text,
    buttonText:
      asString(value?.buttonText) || asString(legacy?.ctaButtonText, fallback.buttonText),
    buttonHref: asString(value?.buttonHref, fallback.buttonHref),
  };
}

function sanitizeSuccess(
  value: Partial<CitySuccessSectionData> & { mosaicImages?: string[] } | undefined,
  cityName: string,
): CitySuccessSectionData {
  const fallback = defaultCitySuccess(cityName);
  const legacyImage = Array.isArray(value?.mosaicImages)
    ? value.mosaicImages.map((src) => asString(src)).find(Boolean)
    : "";
  const imageSrc =
    asString(value?.imageSrc) ||
    legacyImage ||
    fallback.imageSrc;

  return {
    badge: asString(value?.badge, fallback.badge),
    kicker: asString(value?.kicker, fallback.kicker),
    heading: asString(value?.heading, fallback.heading),
    headingHighlight: asString(value?.headingHighlight, fallback.headingHighlight),
    text: asString(value?.text, fallback.text),
    buttonText: asString(value?.buttonText, fallback.buttonText),
    buttonHref: asString(value?.buttonHref, fallback.buttonHref),
    imageSrc,
    imageAlt: asString(value?.imageAlt, fallback.imageAlt),
  };
}

function sanitizeFaqs(value: Partial<CityFaqSectionData> | undefined): CityFaqSectionData {
  const fallback = defaultCityFaqs();
  const items: CityFaqItem[] = Array.isArray(value?.items)
    ? value.items
        .map((item, index) => ({
          id: asString(item?.id, `faq-${index + 1}`),
          question: asString(item?.question),
          answer: asString(item?.answer),
        }))
        .filter((item) => item.question && item.answer)
    : fallback.items;

  return {
    title: asString(value?.title, fallback.title),
    subtitle: asString(value?.subtitle, fallback.subtitle),
    items: items.length ? items : fallback.items,
  };
}

function sanitizePage(value: Partial<CityPage> & { slug?: string; cityName?: string }): CityPage | null {
  const cityName = typeof value.cityName === "string" ? value.cityName.trim() : "";
  const slug = normalizeCitySlug(value.slug || "") || normalizeCitySlug(cityName);

  if (!slug || !cityName) {
    return null;
  }

  const highlights = Array.isArray(value.highlights)
    ? value.highlights.map(sanitizeHighlight).filter((item) => item.title || item.text)
    : [];

  const journey = sanitizeJourney(value.journey, cityName, {
    ctaText: value.ctaText,
    ctaButtonText: value.ctaButtonText,
  });

  const rawSubtitle =
    typeof value.subtitle === "string" && value.subtitle.trim()
      ? value.subtitle.trim()
      : DEFAULT_HERO_BADGE_PREFIX;
  const providedPhrases = Array.isArray(value.heroTypedPhrases)
    ? value.heroTypedPhrases.map((item) => asString(item)).filter(Boolean)
    : [];

  let subtitle = rawSubtitle;
  let heroTypedPhrases = providedPhrases;

  // Migrate older single-line badge: "Build Confidence in German Communication"
  if (!heroTypedPhrases.length) {
    const legacyMatch = rawSubtitle.match(/^(.*?)\s*(German Communication)\s*$/i);
    if (legacyMatch) {
      subtitle = legacyMatch[1]?.trimEnd() ? `${legacyMatch[1].trimEnd()} ` : DEFAULT_HERO_BADGE_PREFIX;
      heroTypedPhrases = [legacyMatch[2]];
    } else if (rawSubtitle === "Build Confidence in German Communication") {
      subtitle = DEFAULT_HERO_BADGE_PREFIX;
      heroTypedPhrases = defaultHeroTypedPhrases();
    } else {
      heroTypedPhrases = defaultHeroTypedPhrases();
      if (!subtitle.endsWith(" ")) {
        subtitle = `${subtitle} `;
      }
    }
  } else if (
    rawSubtitle === "Build Confidence in German Communication" ||
    /German Communication\s*$/i.test(rawSubtitle)
  ) {
    subtitle = DEFAULT_HERO_BADGE_PREFIX;
  }

  return {
    slug,
    cityName,
    title:
      typeof value.title === "string" && value.title.trim()
        ? value.title.trim()
        : `German Classes in ${cityName}`,
    subtitle,
    heroTypedPhrases: heroTypedPhrases.length ? heroTypedPhrases : defaultHeroTypedPhrases(),
    heroDescription: (() => {
      const raw = typeof value.heroDescription === "string" ? value.heroDescription.trim() : "";
      if (!raw) {
        return defaultCityHeroDescription;
      }
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
    vision: sanitizeVision(value.vision, cityName),
    whyLearn: sanitizeWhyLearn(value.whyLearn, cityName),
    journey,
    success: sanitizeSuccess(value.success, cityName),
    faqs: sanitizeFaqs(value.faqs),
    ctaHeading:
      typeof value.ctaHeading === "string" && value.ctaHeading.trim()
        ? value.ctaHeading.trim()
        : `Start learning German from ${cityName}`,
    ctaText: journey.text,
    ctaButtonText: journey.buttonText,
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
      if (store && store.pages) {
        return sanitizeStore(store);
      }
    } catch {
      // Fall through to MongoDB/default.
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const mongoStore = await getMongoStore();
      if (mongoStore && mongoStore.pages) {
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

  return getCachedPublicData(["city-pages", "v4"], [CACHE_TAGS.cityPages], fetchCityPagesStore);
}

export async function getCityPagesForDisplay(options: PublicDataOptions = {}): Promise<CityPage[]> {
  const store = await getCityPagesStore(options);
  return store.pages.filter((page) => page.isActive);
}

export async function getCityPageBySlug(
  slug: string,
  options: PublicDataOptions = {},
): Promise<CityPage | null> {
  const normalized = normalizeCitySlug(slug);
  if (!normalized) {
    return null;
  }

  const store = await getCityPagesStore(options);
  return store.pages.find((page) => page.slug === normalized && page.isActive) ?? null;
}

export async function saveCityPagesStore(store: CityPagesStore) {
  return persistStore(store);
}

export async function upsertCityPage(
  page: Partial<CityPage> & { cityName: string; originalSlug?: string },
) {
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

  if (!sanitized.slug.trim()) {
    throw new Error("Page URL is required.");
  }

  const originalSlug = normalizeCitySlug(page.originalSlug || "") || sanitized.slug;
  const conflict = store.pages.find(
    (item) => item.slug === sanitized.slug && item.slug !== originalSlug,
  );
  if (conflict) {
    throw new Error("A city page with this URL already exists.");
  }

  const existingIndex = store.pages.findIndex((item) => item.slug === originalSlug);
  const pages =
    existingIndex >= 0
      ? store.pages.map((item, index) => (index === existingIndex ? sanitized : item))
      : [...store.pages, sanitized];

  return persistStore({ pages });
}

export async function deleteCityPage(slug: string) {
  const normalized = normalizeCitySlug(slug);
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
