import { unstable_noStore as noStore } from "next/cache";
import {
  defaultGeneralPagesContent,
  type GeneralPageId,
  type GeneralPagesContent,
  type LegalPageContentData,
  type OurCompanyPageData,
  type PageSeoMeta,
} from "../data/generalPages";
import { getMongoClient, cleanMongoDocument, throwMongoWriteError, resetMongoClient } from "./mongodb";
import { getFileGeneralPagesContent, saveFileGeneralPagesContent } from "./generalPageFileStore";
import { isFileStoreEnabled, isServerlessHosting } from "./courseDetailsFileStore";
import {
  CACHE_TAGS,
  getCachedPublicData,
  safeRevalidatePublicGeneralPagesData,
  shouldBypassPublicDataCache,
  type PublicDataOptions,
} from "./publicDataCache";
import { getLegalPageHtml } from "./generalPageUtils";

const DB_NAME = "germanskill";
const COLLECTION = "general_pages";
const DOCUMENT_ID = "site_general_pages";

type GeneralPagesDocument = GeneralPagesContent & { _id: string; updatedAt?: Date };

export type { GeneralPageId, GeneralPagesContent, LegalPageContentData, OurCompanyPageData };

function sanitizeStringList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return items.length ? items : fallback;
}

function sanitizePageSeo(
  value: Partial<PageSeoMeta> | undefined,
  fallback?: PageSeoMeta,
): PageSeoMeta | undefined {
  if (!fallback && !value) {
    return undefined;
  }

  return {
    metaTitle:
      typeof value?.metaTitle === "string" && value.metaTitle.trim()
        ? value.metaTitle.trim().slice(0, 70)
        : fallback?.metaTitle ?? "",
    metaKeyword:
      typeof value?.metaKeyword === "string" && value.metaKeyword.trim()
        ? value.metaKeyword.trim().slice(0, 160)
        : fallback?.metaKeyword ?? "",
    metaDescription:
      typeof value?.metaDescription === "string" && value.metaDescription.trim()
        ? value.metaDescription.trim().slice(0, 250)
        : fallback?.metaDescription ?? "",
  };
}

function sanitizeLegalContent(value: Partial<LegalPageContentData> | undefined, fallback: LegalPageContentData) {
  const seo = sanitizePageSeo(value?.seo, fallback.seo);
  return {
    html: getLegalPageHtml(value, fallback.html),
    ...(seo ? { seo } : {}),
  };
}

function sanitizeOurCompanyContent(
  value: Partial<OurCompanyPageData> | undefined,
  fallback: OurCompanyPageData,
): OurCompanyPageData {
  const intro = (value?.intro ?? {}) as Partial<OurCompanyPageData["intro"]>;
  const features = (value?.features ?? {}) as Partial<OurCompanyPageData["features"]>;
  const values = (value?.values ?? {}) as Partial<OurCompanyPageData["values"]>;
  const faculty = (value?.faculty ?? {}) as Partial<OurCompanyPageData["faculty"]>;
  const cta = (value?.cta ?? {}) as Partial<OurCompanyPageData["cta"]>;

  return {
    intro: {
      tag: typeof intro.tag === "string" && intro.tag.trim() ? intro.tag.trim() : fallback.intro.tag,
      heading:
        typeof intro.heading === "string" && intro.heading.trim()
          ? intro.heading.trim()
          : fallback.intro.heading,
      headingHighlight:
        typeof intro.headingHighlight === "string" && intro.headingHighlight.trim()
          ? intro.headingHighlight.trim()
          : fallback.intro.headingHighlight,
      headingSuffix:
        typeof intro.headingSuffix === "string" && intro.headingSuffix.trim()
          ? intro.headingSuffix.trim()
          : fallback.intro.headingSuffix,
      description:
        typeof intro.description === "string" && intro.description.trim()
          ? intro.description.trim()
          : fallback.intro.description,
      listItems: sanitizeStringList(intro.listItems, fallback.intro.listItems),
      primaryButtonText:
        typeof intro.primaryButtonText === "string" && intro.primaryButtonText.trim()
          ? intro.primaryButtonText.trim()
          : fallback.intro.primaryButtonText,
      secondaryButtonText:
        typeof intro.secondaryButtonText === "string" && intro.secondaryButtonText.trim()
          ? intro.secondaryButtonText.trim()
          : fallback.intro.secondaryButtonText,
      imageSrc:
        typeof intro.imageSrc === "string" && intro.imageSrc.trim()
          ? intro.imageSrc.trim()
          : fallback.intro.imageSrc,
      imageAlt:
        typeof intro.imageAlt === "string" && intro.imageAlt.trim()
          ? intro.imageAlt.trim()
          : fallback.intro.imageAlt,
      badgeValue:
        typeof intro.badgeValue === "string" && intro.badgeValue.trim()
          ? intro.badgeValue.trim()
          : fallback.intro.badgeValue,
      badgeLabel:
        typeof intro.badgeLabel === "string" && intro.badgeLabel.trim()
          ? intro.badgeLabel.trim()
          : fallback.intro.badgeLabel,
    },
    stats: Array.isArray(value?.stats) && value.stats.length
      ? value.stats.map((item, index) => ({
          value:
            typeof item?.value === "string" && item.value.trim()
              ? item.value.trim()
              : fallback.stats[index]?.value ?? "",
          label:
            typeof item?.label === "string" && item.label.trim()
              ? item.label.trim()
              : fallback.stats[index]?.label ?? "",
        }))
      : fallback.stats,
    features: {
      tag:
        typeof features.tag === "string" && features.tag.trim()
          ? features.tag.trim()
          : fallback.features.tag,
      heading:
        typeof features.heading === "string" && features.heading.trim()
          ? features.heading.trim()
          : fallback.features.heading,
      description:
        typeof features.description === "string" && features.description.trim()
          ? features.description.trim()
          : fallback.features.description,
      items: Array.isArray(features.items) && features.items.length
        ? features.items.map((item, index) => ({
            title:
              typeof item?.title === "string" && item.title.trim()
                ? item.title.trim()
                : fallback.features.items[index]?.title ?? "",
            text:
              typeof item?.text === "string" && item.text.trim()
                ? item.text.trim()
                : fallback.features.items[index]?.text ?? "",
          }))
        : fallback.features.items,
    },
    values: {
      tag:
        typeof values.tag === "string" && values.tag.trim() ? values.tag.trim() : fallback.values.tag,
      heading:
        typeof values.heading === "string" && values.heading.trim()
          ? values.heading.trim()
          : fallback.values.heading,
      items: Array.isArray(values.items) && values.items.length
        ? values.items.map((item, index) => ({
            title:
              typeof item?.title === "string" && item.title.trim()
                ? item.title.trim()
                : fallback.values.items[index]?.title ?? "",
            text:
              typeof item?.text === "string" && item.text.trim()
                ? item.text.trim()
                : fallback.values.items[index]?.text ?? "",
          }))
        : fallback.values.items,
    },
    faculty: {
      tag:
        typeof faculty.tag === "string" && faculty.tag.trim() ? faculty.tag.trim() : fallback.faculty.tag,
      heading:
        typeof faculty.heading === "string" && faculty.heading.trim()
          ? faculty.heading.trim()
          : fallback.faculty.heading,
      description:
        typeof faculty.description === "string" && faculty.description.trim()
          ? faculty.description.trim()
          : fallback.faculty.description,
      members: Array.isArray(faculty.members) && faculty.members.length
        ? faculty.members.map((item, index) => ({
            name:
              typeof item?.name === "string" && item.name.trim()
                ? item.name.trim()
                : fallback.faculty.members[index]?.name ?? "",
            image:
              typeof item?.image === "string" && item.image.trim()
                ? item.image.trim()
                : fallback.faculty.members[index]?.image ?? "",
            role:
              typeof item?.role === "string" && item.role.trim()
                ? item.role.trim()
                : fallback.faculty.members[index]?.role ?? "",
          }))
        : fallback.faculty.members,
    },
    cta: {
      heading:
        typeof cta.heading === "string" && cta.heading.trim()
          ? cta.heading.trim()
          : fallback.cta.heading,
      description:
        typeof cta.description === "string" && cta.description.trim()
          ? cta.description.trim()
          : fallback.cta.description,
      buttonText:
        typeof cta.buttonText === "string" && cta.buttonText.trim()
          ? cta.buttonText.trim()
          : fallback.cta.buttonText,
    },
  };
}

function sanitizeContent(value: Partial<GeneralPagesContent>): GeneralPagesContent {
  return {
    terms: sanitizeLegalContent(value.terms, defaultGeneralPagesContent.terms),
    privacy: sanitizeLegalContent(value.privacy, defaultGeneralPagesContent.privacy),
    refund: sanitizeLegalContent(value.refund, defaultGeneralPagesContent.refund),
    ourCompany: sanitizeOurCompanyContent(value.ourCompany, defaultGeneralPagesContent.ourCompany),
    applyJob: sanitizeLegalContent(
      (value as Partial<GeneralPagesContent>).applyJob,
      defaultGeneralPagesContent.applyJob,
    ),
  };
}

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection<GeneralPagesDocument>(COLLECTION);
}

async function getMongoContent(): Promise<GeneralPagesContent | null> {
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

async function fetchGeneralPagesContent(): Promise<GeneralPagesContent> {
  if (isFileStoreEnabled()) {
    try {
      const store = await getFileGeneralPagesContent();
      if (store) {
        return sanitizeContent(store);
      }
    } catch {
      // Fall through to MongoDB/default.
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const mongoContent = await getMongoContent();
      if (mongoContent) {
        return mongoContent;
      }
    } catch (error) {
      console.error("Failed to fetch general pages from MongoDB", error);
    }
  }

  return sanitizeContent(defaultGeneralPagesContent);
}

export async function getGeneralPagesContent(options: PublicDataOptions = {}): Promise<GeneralPagesContent> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchGeneralPagesContent();
  }

  return getCachedPublicData(
    ["general-pages", "v3"],
    [CACHE_TAGS.generalPages],
    fetchGeneralPagesContent,
  );
}

export async function getLegalPageContent(
  pageId: Extract<GeneralPageId, "terms" | "privacy" | "refund">,
  options: PublicDataOptions = {},
) {
  const content = await getGeneralPagesContent(options);
  return content[pageId];
}

export async function getOurCompanyPageContent(options: PublicDataOptions = {}) {
  const content = await getGeneralPagesContent(options);
  return content.ourCompany;
}

export async function getApplyJobPageContent(options: PublicDataOptions = {}) {
  const content = await getGeneralPagesContent(options);
  return content.applyJob ?? defaultGeneralPagesContent.applyJob;
}

async function persistContent(content: GeneralPagesContent) {
  const nextContent = sanitizeContent(content);

  if (isFileStoreEnabled()) {
    await saveFileGeneralPagesContent(nextContent);

    if (process.env.MONGODB_URI) {
      try {
        await saveMongoContent(nextContent);
      } catch (error) {
        console.warn("MongoDB sync skipped for general pages.", error);
      }
    }

    safeRevalidatePublicGeneralPagesData();
    return nextContent;
  }

  if (!process.env.MONGODB_URI) {
    if (!isServerlessHosting()) {
      await saveFileGeneralPagesContent(nextContent);
      safeRevalidatePublicGeneralPagesData();
      return nextContent;
    }

    throw new Error("MONGODB_URI is not configured.");
  }

  await saveMongoContent(nextContent);
  safeRevalidatePublicGeneralPagesData();
  return nextContent;
}

async function saveMongoContent(content: GeneralPagesContent) {
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

export async function saveGeneralPagesContent(content: GeneralPagesContent) {
  for (const page of ["terms", "privacy", "refund", "applyJob"] as const) {
    if (!content[page].html?.trim()) {
      throw new Error(`Main content is required for ${page}.`);
    }
  }

  if (!content.ourCompany.intro.heading.trim() || !content.ourCompany.intro.description.trim()) {
    throw new Error("Our Company intro content is required.");
  }

  return persistContent(content);
}

export async function saveGeneralPageContent(
  pageId: GeneralPageId,
  pageContent: LegalPageContentData | OurCompanyPageData,
) {
  const content = await getGeneralPagesContent({ fresh: true });

  if (pageId === "our-company") {
    return persistContent({
      ...content,
      ourCompany: sanitizeOurCompanyContent(pageContent as OurCompanyPageData, content.ourCompany),
    });
  }

  const contentKey =
    pageId === "apply-job" ? "applyJob" : (pageId as "terms" | "privacy" | "refund");
  const legalContent = sanitizeLegalContent(
    pageContent as LegalPageContentData,
    content[contentKey],
  );
  if (!legalContent.html?.trim()) {
    throw new Error("Main content is required.");
  }

  return persistContent({
    ...content,
    [contentKey]: legalContent,
  });
}
