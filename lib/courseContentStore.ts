import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import type { CourseContent, CourseReview } from "../data/courseContent.types";
import type {
  AdminCoursePayload,
  CourseFaqItem,
  StoredCourseDetails,
} from "../data/adminCourseDetails.types";
import { defaultReviewsSummary } from "../data/adminCourseDetails.types";
import { getDefaultCourseSeoContent } from "../data/courseSeoContentDefaults";
import { getCourseBySlug, germanCourses, isStaticCourseSlug, getCourseByPathName, type GermanCourse } from "../data/germanCourses";
import { getCourseContent, getCourseContentForCourse } from "../data/courseContents";
import {
  getCourseFlexibleBatches,
  getDefaultFlexibleBatches,
  mergeFlexibleBatches,
} from "../data/courseFlexibleBatches";
import { getFileCourseDetails, getAllFileCourseDetails, deleteFileCourseDetails, isFileStoreEnabled, saveFileCourseDetails } from "./courseDetailsFileStore";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";
import {
  CACHE_TAGS,
  getCachedPublicData,
  safeRevalidatePublicCourseData,
  shouldBypassPublicDataCache,
  type PublicDataOptions,
} from "./publicDataCache";
import { slugifyCoursePath, formatDisplayPrice } from "./courseUtils";
import { mergeDescriptionTab } from "./courseDescriptionTabUtils";

const DB_NAME = "germanskill";
const COLLECTION = "course_details";

function courseFromStored(stored: StoredCourseDetails): GermanCourse {
  const base = getCourseBySlug(stored.slug);
  if (base) {
    return mergeStoredCourse(base, stored.course);
  }

  const course = stored.course;
  const duration = course.learningHours ?? course.hours ?? "";
  const pathName = course.pathName?.trim() || stored.slug;

  return {
    slug: stored.slug,
    pathName,
    title: course.title?.trim() || "German Course",
    description: course.description?.trim() || "",
    hours: duration,
    learningHours: duration,
    price: normalizeCoursePrice(course.price ?? "₹0.00"),
    image: course.image?.trim() || "/courses/german-a1.png",
    batchSize: course.batchSize ?? "20-40 Students",
    enrolled: course.enrolled ?? "0",
    rating: course.rating ?? "4.50",
    reviewCount: course.reviewCount ?? "0",
  };
}

async function getMongoCourseDetailsList(): Promise<StoredCourseDetails[]> {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const client = await getMongoClient();
  const docs = await client
    .db(DB_NAME)
    .collection<StoredCourseDetails>(COLLECTION)
    .find({})
    .toArray();

  return docs;
}

async function fetchAllStoredCourseDetailsList(): Promise<StoredCourseDetails[]> {
  const bySlug = new Map<string, StoredCourseDetails>();

  if (isFileStoreEnabled()) {
    try {
      for (const document of await getAllFileCourseDetails()) {
        bySlug.set(document.slug, sanitizeStoredDetails(document));
      }
    } catch {
      // Continue to MongoDB fallback below.
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      for (const document of await getMongoCourseDetailsList()) {
        if (!bySlug.has(document.slug)) {
          bySlug.set(document.slug, sanitizeStoredDetails(document));
        }
      }
    } catch (error) {
      console.error("Failed to fetch course details from MongoDB", error);
    }
  }

  return Array.from(bySlug.values());
}

const loadStoredCourseDetailsList = cache(fetchAllStoredCourseDetailsList);

export async function getAllStoredCourseDetailsList(
  options: PublicDataOptions = {},
): Promise<StoredCourseDetails[]> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchAllStoredCourseDetailsList();
  }

  return getCachedPublicData(
    ["all-course-details"],
    [CACHE_TAGS.courses],
    fetchAllStoredCourseDetailsList,
  );
}

export async function isCoursePathNameTaken(pathName: string, excludeSlug?: string) {
  const normalized = slugifyCoursePath(pathName);
  if (!normalized) {
    return true;
  }

  const staticMatch = germanCourses.find(
    (course) => course.pathName === normalized && course.slug !== excludeSlug,
  );
  if (staticMatch) {
    return true;
  }

  const storedCourses = await fetchAllStoredCourseDetailsList();
  return storedCourses.some((stored) => {
    if (stored.slug === excludeSlug) {
      return false;
    }

    const storedPath = stored.course.pathName?.trim() || stored.slug;
    return storedPath === normalized;
  });
}

async function fetchCourseBySlugAsync(slug: string): Promise<GermanCourse | undefined> {
  const storedCourses = await loadStoredCourseDetailsList();
  const storedBySlug = new Map(storedCourses.map((stored) => [stored.slug, stored]));

  const base = getCourseBySlug(slug);
  if (base) {
    const stored = storedBySlug.get(slug) ?? null;
    return enrichCourseWithOriginalPrice(mergeStoredCourse(base, stored?.course), stored);
  }

  const stored = storedBySlug.get(slug) ?? null;
  if (!stored?.course?.title?.trim()) {
    return undefined;
  }

  return enrichCourseWithOriginalPrice(courseFromStored(stored), stored);
}

export async function getCourseBySlugAsync(
  slug: string,
  options: PublicDataOptions = {},
): Promise<GermanCourse | undefined> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchCourseBySlugAsync(slug);
  }

  return getCachedPublicData(
    ["course-by-slug", slug],
    [CACHE_TAGS.courses, CACHE_TAGS.course(slug)],
    () => fetchCourseBySlugAsync(slug),
  );
}

async function fetchCourseByPathNameAsync(pathName: string): Promise<GermanCourse | undefined> {
  const decoded = decodeURIComponent(pathName);
  const staticCourse = getCourseByPathName(decoded);
  if (staticCourse) {
    return fetchCourseBySlugAsync(staticCourse.slug);
  }

  const storedCourses = await loadStoredCourseDetailsList();
  const stored = storedCourses.find((document) => {
    const storedPath = document.course.pathName?.trim() || document.slug;
    return storedPath === decoded;
  });

  if (!stored) {
    return undefined;
  }

  return enrichCourseWithOriginalPrice(courseFromStored(stored), stored);
}

export async function getCourseByPathNameAsync(
  pathName: string,
  options: PublicDataOptions = {},
): Promise<GermanCourse | undefined> {
  const decoded = decodeURIComponent(pathName);

  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchCourseByPathNameAsync(decoded);
  }

  return getCachedPublicData(
    ["course-by-path", decoded],
    [CACHE_TAGS.courses],
    () => fetchCourseByPathNameAsync(decoded),
  );
}

function getEditableFromContent(slug: string) {
  const content = getCourseContent(slug);
  const course = getCourseBySlug(slug);

  if (!content) {
    return {
      descriptionTab: mergeDescriptionTab(slug, null),
      faqs: [] as CourseFaqItem[],
      reviewsSummary: defaultReviewsSummary,
      reviews: [] as CourseReview[],
      seoContent: getDefaultCourseSeoContent(slug),
    };
  }

  return {
    descriptionTab: mergeDescriptionTab(slug, null),
    faqs: content.faqs,
    reviewsSummary: {
      ...content.reviewsSummary,
      total: Number(course?.reviewCount) || content.reviewsSummary.total,
    },
    reviews: content.reviews ?? [],
    seoContent: getDefaultCourseSeoContent(slug),
  };
}

function mergeCourseEditableFields(
  slug: string,
  stored: StoredCourseDetails | null,
) {
  const fallback = getEditableFromContent(slug);

  if (!stored) {
    return fallback;
  }

  const reviewCount =
    Number(stored.course?.reviewCount) ||
    stored.reviewsSummary?.total ||
    fallback.reviewsSummary.total;

  return {
    descriptionTab: mergeDescriptionTab(
      slug,
      stored.descriptionTab,
      stored.courseDescription,
    ),
    faqs: stored.faqs?.length ? stored.faqs : fallback.faqs,
    reviews: stored.reviews?.length ? stored.reviews : fallback.reviews,
    reviewsSummary: {
      ...fallback.reviewsSummary,
      ...stored.reviewsSummary,
      total: reviewCount,
      average: stored.reviewsSummary?.average || fallback.reviewsSummary.average,
    },
    seoContent: stored.seoContent?.trim() || fallback.seoContent,
  };
}

async function getMongoCourseDetails(slug: string): Promise<StoredCourseDetails | null> {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client
    .db(DB_NAME)
    .collection<StoredCourseDetails>(COLLECTION)
    .findOne({ slug });

  return doc;
}

async function saveMongoCourseDetails(document: StoredCourseDetails) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured. Add it in your hosting environment variables.");
  }

  async function writeDocument() {
    const client = await getMongoClient();

    await client
      .db(DB_NAME)
      .collection<StoredCourseDetails>(COLLECTION)
      .updateOne({ slug: document.slug }, { $set: document }, { upsert: true });
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

  return document;
}

async function fetchStoredCourseDetails(slug: string): Promise<StoredCourseDetails | null> {
  let stored: StoredCourseDetails | null = null;

  if (isFileStoreEnabled()) {
    try {
      stored = await getFileCourseDetails(slug);
    } catch {
      // Continue to MongoDB fallback below.
    }
  }

  if (!stored) {
    try {
      if (process.env.MONGODB_URI) {
        stored = await getMongoCourseDetails(slug);
      }
    } catch {
      // No stored course details available.
    }
  }

  if (!stored) {
    return null;
  }

  return sanitizeStoredDetails(stored);
}

export async function getStoredCourseDetails(
  slug: string,
  options: PublicDataOptions = { fresh: true },
): Promise<StoredCourseDetails | null> {
  if (options.fresh) {
    noStore();
    return fetchStoredCourseDetails(slug);
  }

  return getCachedPublicData(
    ["course-details", slug],
    [CACHE_TAGS.courses, CACHE_TAGS.course(slug)],
    () => fetchStoredCourseDetails(slug),
  );
}

export async function getCourseEditableDetails(slug: string) {
  noStore();

  const stored = await fetchStoredCourseDetails(slug);
  const editable = mergeCourseEditableFields(slug, stored);

  return {
    ...editable,
    flexibleBatches: mergeFlexibleBatches(
      getCourseFlexibleBatches(slug),
      stored?.flexibleBatches,
    ),
    seoContent: stored?.seoContent?.trim() || editable.seoContent || getDefaultCourseSeoContent(slug),
  };
}

export async function getCourseSeoContentAsync(slug: string): Promise<string> {
  noStore();

  const stored = await fetchStoredCourseDetails(slug);
  if (stored?.seoContent?.trim()) {
    return stored.seoContent.trim();
  }

  return getDefaultCourseSeoContent(slug);
}

export async function saveCourseDetails(payload: AdminCoursePayload) {
  if (!payload.slug?.trim()) {
    throw new Error("Course slug is required.");
  }

  const { slug, faqs, reviewsSummary, reviews, flexibleBatches, descriptionTab, seoContent, ...courseFields } = payload;
  const baseCourse = getCourseBySlug(slug);
  const isCustom = !baseCourse;
  const pathName =
    slugifyCoursePath(courseFields.pathName?.trim() || "") ||
    baseCourse?.pathName ||
    slug;

  const document: StoredCourseDetails = {
    slug,
    isCustom,
    course: mergeStoredCourse(baseCourse ?? ({ slug, pathName } as GermanCourse), {
      ...courseFields,
      slug,
      pathName,
    }),
    descriptionTab,
    faqs,
    reviewsSummary: {
      ...reviewsSummary,
      total: Number(courseFields.reviewCount) || reviews.length,
    },
    reviews,
    flexibleBatches,
    seoContent: seoContent?.trim() || undefined,
    updatedAt: new Date(),
  };

  if (isFileStoreEnabled()) {
    await saveFileCourseDetails(document);

    if (process.env.MONGODB_URI) {
      try {
        await saveMongoCourseDetails(document);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    safeRevalidatePublicCourseData(slug);
    return document;
  }

  const saved = await saveMongoCourseDetails(document);
  safeRevalidatePublicCourseData(slug);
  return saved;
}

async function deleteMongoCourseDetails(slug: string) {
  if (!process.env.MONGODB_URI) {
    return false;
  }

  const client = await getMongoClient();
  const result = await client
    .db(DB_NAME)
    .collection<StoredCourseDetails>(COLLECTION)
    .deleteOne({ slug });

  return result.deletedCount > 0;
}

export async function deleteCourseDetails(slug: string) {
  const isStandard = isStaticCourseSlug(slug);
  let removed = false;

  if (isFileStoreEnabled()) {
    removed = await deleteFileCourseDetails(slug);
  }

  if (process.env.MONGODB_URI) {
    try {
      const mongoRemoved = await deleteMongoCourseDetails(slug);
      removed = removed || mongoRemoved;
    } catch {
      if (!isFileStoreEnabled()) {
        throw new Error("Could not delete course.");
      }
    }
  }

  if (!removed && !isStandard) {
    throw new Error("Course not found.");
  }

  safeRevalidatePublicCourseData(slug);
  return { removed, reset: isStandard && removed };
}

async function fetchCourseContentAsync(slug: string): Promise<CourseContent | undefined> {
  const course = await fetchCourseBySlugAsync(slug);
  if (!course) {
    return undefined;
  }

  const base = getCourseContent(slug) ?? getCourseContentForCourse(course);
  if (!base) {
    return undefined;
  }

  const storedCourses = await loadStoredCourseDetailsList();
  const stored = storedCourses.find((item) => item.slug === slug) ?? null;
  const displayCourse = mergeStoredCourse(getCourseBySlug(slug) ?? course, stored?.course);
  const editable = mergeCourseEditableFields(slug, stored);
  const descriptionTab = editable.descriptionTab;

  return {
    ...base,
    sidebarPrice: displayCourse.price ?? base.sidebarPrice,
    aboutCourse: descriptionTab.aboutCourse,
    objectivesLeft: descriptionTab.objectivesLeft,
    objectivesRight: descriptionTab.objectivesRight,
    courseDescription: descriptionTab.courseDescription,
    goalsLessons: descriptionTab.goalsLessons,
    curriculumSections: descriptionTab.curriculumSections,
    targetAudience: descriptionTab.targetAudience,
    faqs: editable.faqs,
    reviews: editable.reviews,
    reviewsSummary: editable.reviewsSummary,
  };
}

export async function getCourseContentAsync(
  slug: string,
  options: PublicDataOptions = {},
): Promise<CourseContent | undefined> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchCourseContentAsync(slug);
  }

  return getCachedPublicData(
    ["course-content", slug],
    [CACHE_TAGS.courses, CACHE_TAGS.course(slug)],
    () => fetchCourseContentAsync(slug),
  );
}

async function fetchCourseFlexibleBatchesAsync(slug: string) {
  const storedCourses = await loadStoredCourseDetailsList();
  const stored = storedCourses.find((item) => item.slug === slug) ?? null;
  return mergeFlexibleBatches(getCourseFlexibleBatches(slug), stored?.flexibleBatches);
}

export async function getCourseFlexibleBatchesAsync(
  slug: string,
  options: PublicDataOptions = {},
) {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchCourseFlexibleBatchesAsync(slug);
  }

  return getCachedPublicData(
    ["course-batches", slug],
    [CACHE_TAGS.courses, CACHE_TAGS.course(slug)],
    () => fetchCourseFlexibleBatchesAsync(slug),
  );
}

async function fetchGermanCoursesForDisplay(): Promise<GermanCourse[]> {
  const storedCourses = await loadStoredCourseDetailsList();
  const storedBySlug = new Map(storedCourses.map((stored) => [stored.slug, stored]));

  const staticCourses = germanCourses.map((course) => {
    const stored = storedBySlug.get(course.slug) ?? null;
    const merged = mergeStoredCourse(course, stored?.course);
    return enrichCourseWithOriginalPrice(merged, stored);
  });

  const customCourses = storedCourses
    .filter((stored) => !isStaticCourseSlug(stored.slug))
    .map((stored) => enrichCourseWithOriginalPrice(courseFromStored(stored), stored));

  return [...staticCourses, ...customCourses];
}

export async function getGermanCoursesForDisplay(
  options: PublicDataOptions = {},
): Promise<GermanCourse[]> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    return fetchGermanCoursesForDisplay();
  }

  return getCachedPublicData(
    ["german-courses-display"],
    [CACHE_TAGS.courses],
    fetchGermanCoursesForDisplay,
  );
}

function enrichCourseWithOriginalPrice(
  course: GermanCourse,
  stored?: StoredCourseDetails | null,
): GermanCourse {
  const salePrice = formatDisplayPrice(course.price);
  const batches = mergeFlexibleBatches(
    isStaticCourseSlug(course.slug)
      ? getCourseFlexibleBatches(course.slug)
      : getDefaultFlexibleBatches(course.title, salePrice),
    stored?.flexibleBatches,
  );

  return {
    ...course,
    originalPrice: batches.originalPrice,
  };
}

function normalizeCoursePrice(price: string) {
  const cleaned = price.replace(/â‚¹/g, "₹").trim();
  if (cleaned.includes("₹")) {
    return cleaned;
  }

  const numeric = Number(cleaned.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) {
    return price;
  }

  return `₹${numeric.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function hasStoredIdentityMismatch(base: GermanCourse, stored?: Partial<GermanCourse>) {
  const storedPath = stored?.pathName?.trim();
  return Boolean(storedPath && storedPath !== base.pathName);
}

function sanitizeStoredDetails(stored: StoredCourseDetails): StoredCourseDetails {
  const base = getCourseBySlug(stored.slug);
  if (!base) {
    return stored;
  }

  return {
    ...stored,
    course: mergeStoredCourse(base, stored.course),
    faqs: Array.isArray(stored.faqs) ? stored.faqs : [],
    reviews: Array.isArray(stored.reviews) ? stored.reviews : [],
    reviewsSummary: stored.reviewsSummary ?? defaultReviewsSummary,
  };
}

export function mergeStoredCourse(
  base: GermanCourse,
  stored?: Partial<GermanCourse>,
): GermanCourse {
  if (!stored) {
    return base;
  }

  const price = stored.price ? normalizeCoursePrice(stored.price) : base.price;

  if (hasStoredIdentityMismatch(base, stored)) {
    return {
      ...base,
      learningHours: stored.learningHours ?? base.learningHours,
      batchSize: stored.batchSize ?? base.batchSize,
      enrolled: stored.enrolled ?? base.enrolled,
      rating: stored.rating ?? base.rating,
      reviewCount: stored.reviewCount ?? base.reviewCount,
      image: stored.image?.trim() || base.image,
      price,
    };
  }

  return {
    ...base,
    ...stored,
    slug: base.slug,
    pathName: base.pathName,
    price,
  };
}
