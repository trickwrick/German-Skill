import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import type { CourseContent, CourseReview } from "../data/courseContent.types";
import type {
  AdminCoursePayload,
  CourseFaqItem,
  CourseSeoMeta,
  StoredCourseDetails,
} from "../data/adminCourseDetails.types";
import { defaultReviewsSummary, getDefaultCourseSeoMeta } from "../data/adminCourseDetails.types";
import { getDefaultCourseSeoContent } from "../data/courseSeoContentDefaults";
import { getCourseBySlug, germanCourses, isStaticCourseSlug, getCourseByPathName, type GermanCourse } from "../data/germanCourses";
import { getCourseContent, getCourseContentForCourse } from "../data/courseContents";
import {
  getCourseFlexibleBatches,
  getDefaultFlexibleBatches,
  mergeFlexibleBatches,
} from "../data/courseFlexibleBatches";
import { getFileCourseDetails, getAllFileCourseDetails, deleteFileCourseDetails, isFileStoreEnabled, isServerlessHosting, saveFileCourseDetails } from "./courseDetailsFileStore";
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

function normalizeCourseSeo(value: unknown): CourseSeoMeta | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const seo = value as Record<string, unknown>;
  const metaTitle = typeof seo.metaTitle === "string" ? seo.metaTitle.trim() : "";
  const metaKeyword = typeof seo.metaKeyword === "string" ? seo.metaKeyword.trim() : "";
  const metaDescription = typeof seo.metaDescription === "string" ? seo.metaDescription.trim() : "";

  if (!metaTitle && !metaKeyword && !metaDescription) {
    return undefined;
  }

  return { metaTitle, metaKeyword, metaDescription };
}

function mergeCourseSeoMeta(
  course: Partial<GermanCourse> | undefined,
  stored?: CourseSeoMeta,
): CourseSeoMeta {
  const defaults = getDefaultCourseSeoMeta(course);

  return {
    metaTitle: stored?.metaTitle?.trim() || defaults.metaTitle,
    metaKeyword: stored?.metaKeyword?.trim() || defaults.metaKeyword,
    metaDescription: stored?.metaDescription?.trim() || defaults.metaDescription,
  };
}

function courseFromStored(stored: StoredCourseDetails): GermanCourse {
  const base = getCourseBySlug(stored.slug);
  if (base) {
    return mergeStoredCourse(base, stored.course);
  }

  const course = stored.course;
  const duration = course.learningHours ?? course.hours ?? "";
  const pathName = course.pathName?.trim() || stored.slug;
  const originalPrice =
    course.originalPrice?.trim() ||
    stored.flexibleBatches?.originalPrice?.trim() ||
    undefined;

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
    originalPrice: originalPrice ? formatDisplayPrice(originalPrice) : undefined,
  };
}

const STATIC_COURSE_SLUGS = new Set(germanCourses.map((course) => course.slug));

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

async function getMongoCourseDetailsByPathName(
  pathName: string,
): Promise<StoredCourseDetails | null> {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client.db(DB_NAME).collection<StoredCourseDetails>(COLLECTION).findOne({
    $or: [{ "course.pathName": pathName }, { slug: pathName }, { pathName }],
  });

  return doc ? sanitizeStoredDetails(doc) : null;
}

async function countMongoCustomCourses(): Promise<number> {
  if (!process.env.MONGODB_URI) {
    return 0;
  }

  const client = await getMongoClient();
  return client.db(DB_NAME).collection(COLLECTION).countDocuments({
    slug: { $nin: Array.from(STATIC_COURSE_SLUGS) },
  });
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
      // On live, never fall through to an empty stored-course list — that was
      // getting cached and wiping the all-in-one / custom courses from the site.
      if (isServerlessHosting() && !isFileStoreEnabled()) {
        throw error;
      }
    }
  }

  return Array.from(bySlug.values());
}

/**
 * Public list loader: refuse to cache a catalogue missing custom Mongo courses.
 */
async function fetchGermanCoursesForDisplayForPublicCache(): Promise<GermanCourse[]> {
  const courses = await fetchGermanCoursesForDisplay();
  const customOnPage = courses.filter((course) => !isStaticCourseSlug(course.slug)).length;

  if (customOnPage > 0 || !process.env.MONGODB_URI || isFileStoreEnabled()) {
    return courses;
  }

  try {
    const customInDb = await countMongoCustomCourses();
    if (customInDb > 0) {
      console.error(
        `Refusing to cache course list without custom courses while MongoDB has ${customInDb}.`,
      );
      throw new Error("Course list missing custom courses; skipping cache write");
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("skipping cache write")
    ) {
      throw error;
    }
    // Count failed — still avoid caching a suspicious static-only list on live.
    if (isServerlessHosting()) {
      throw error instanceof Error
        ? error
        : new Error("Could not verify custom courses before caching");
    }
  }

  return courses;
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
    ["all-course-details", "v3"],
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
    ["course-by-slug", "v2", slug],
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
  let stored = storedCourses.find((document) => {
    const storedPath = document.course.pathName?.trim() || document.slug;
    return storedPath === decoded;
  }) ?? null;

  // Direct Mongo fallback so a stale/empty list cache cannot 404 a real custom course.
  if (!stored && process.env.MONGODB_URI && !isFileStoreEnabled()) {
    try {
      stored = await getMongoCourseDetailsByPathName(decoded);
    } catch (error) {
      console.error("Failed to fetch course by path from MongoDB", error);
      if (isServerlessHosting()) {
        throw error;
      }
    }
  }

  if (!stored?.course?.title?.trim()) {
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
    ["course-by-path", "v3", decoded],
    [CACHE_TAGS.courses],
    async () => {
      const course = await fetchCourseByPathNameAsync(decoded);
      if (course) {
        return course;
      }

      // Never cache a miss when Mongo still has this custom path.
      if (process.env.MONGODB_URI && !isFileStoreEnabled()) {
        try {
          const exists = await getMongoCourseDetailsByPathName(decoded);
          if (exists?.course?.title?.trim()) {
            throw new Error(
              `Course path ${decoded} exists in MongoDB but failed to resolve; skipping cache write`,
            );
          }
        } catch (error) {
          if (
            error instanceof Error &&
            error.message.includes("skipping cache write")
          ) {
            throw error;
          }
          if (isServerlessHosting()) {
            throw error instanceof Error
              ? error
              : new Error("Could not verify course path before caching miss");
          }
        }
      }

      return undefined;
    },
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
      seo: getDefaultCourseSeoMeta(course),
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
    seo: getDefaultCourseSeoMeta(course),
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
    seo: mergeCourseSeoMeta(stored.course, stored.seo),
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
    seo: mergeCourseSeoMeta(stored?.course, stored?.seo ?? editable.seo),
  };
}

export async function getCoursePageSeoAsync(
  course: GermanCourse,
  options: PublicDataOptions = {},
): Promise<CourseSeoMeta> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    const stored = await fetchStoredCourseDetails(course.slug);
    return mergeCourseSeoMeta(course, stored?.seo);
  }

  return getCachedPublicData(
    ["course-page-seo", course.slug],
    [CACHE_TAGS.courses, CACHE_TAGS.course(course.slug)],
    async () => {
      const storedCourses = await loadStoredCourseDetailsList();
      const stored = storedCourses.find((item) => item.slug === course.slug) ?? null;
      return mergeCourseSeoMeta(course, stored?.seo);
    },
  );
}

export async function getCourseSeoContentAsync(
  slug: string,
  options: PublicDataOptions = {},
): Promise<string> {
  if (options.fresh || shouldBypassPublicDataCache()) {
    noStore();
    const stored = await fetchStoredCourseDetails(slug);
    if (stored?.seoContent?.trim()) {
      return stored.seoContent.trim();
    }
    return getDefaultCourseSeoContent(slug);
  }

  return getCachedPublicData(
    ["course-seo-content", slug],
    [CACHE_TAGS.courses, CACHE_TAGS.course(slug)],
    async () => {
      const storedCourses = await loadStoredCourseDetailsList();
      const stored = storedCourses.find((item) => item.slug === slug) ?? null;
      if (stored?.seoContent?.trim()) {
        return stored.seoContent.trim();
      }
      return getDefaultCourseSeoContent(slug);
    },
  );
}

async function removeStoredCourseDetailsRecord(slug: string) {
  if (isFileStoreEnabled()) {
    await deleteFileCourseDetails(slug);
  }

  if (process.env.MONGODB_URI) {
    await deleteMongoCourseDetails(slug);
  }
}

export async function saveCourseDetails(payload: AdminCoursePayload) {
  if (!payload.slug?.trim()) {
    throw new Error("Course slug is required.");
  }

  const {
    slug,
    previousSlug,
    faqs,
    reviewsSummary,
    reviews,
    flexibleBatches,
    descriptionTab,
    seoContent,
    seo,
    ...courseFields
  } = payload;
  const normalizedPreviousSlug = previousSlug?.trim() || "";
  const baseCourse = getCourseBySlug(slug);
  const isCustom = Boolean(normalizedPreviousSlug) || !baseCourse;
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
    seo: normalizeCourseSeo(seo),
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

    if (normalizedPreviousSlug && normalizedPreviousSlug !== slug) {
      await removeStoredCourseDetailsRecord(normalizedPreviousSlug);
      safeRevalidatePublicCourseData(normalizedPreviousSlug);
    }

    safeRevalidatePublicCourseData(slug, pathName);
    return document;
  }

  const saved = await saveMongoCourseDetails(document);

  if (normalizedPreviousSlug && normalizedPreviousSlug !== slug) {
    await removeStoredCourseDetailsRecord(normalizedPreviousSlug);
    safeRevalidatePublicCourseData(normalizedPreviousSlug);
  }

  safeRevalidatePublicCourseData(slug, pathName);
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

  const hasValidCurriculumSections =
    descriptionTab.curriculumSections.length > 0 &&
    descriptionTab.curriculumSections.some((s) => s.title.trim());

  return {
    ...base,
    sidebarPrice: displayCourse.price ?? base.sidebarPrice,
    aboutCourse: descriptionTab.aboutCourse?.trim() || base.aboutCourse,
    objectivesLeft: descriptionTab.objectivesLeft.length
      ? descriptionTab.objectivesLeft
      : base.objectivesLeft,
    objectivesRight: descriptionTab.objectivesRight.length
      ? descriptionTab.objectivesRight
      : base.objectivesRight,
    courseDescription: descriptionTab.courseDescription.length
      ? descriptionTab.courseDescription
      : base.courseDescription,
    goalsLessons: descriptionTab.goalsLessons.length
      ? descriptionTab.goalsLessons
      : base.goalsLessons,
    curriculumSections: hasValidCurriculumSections
      ? descriptionTab.curriculumSections
      : base.curriculumSections,
    targetAudience: descriptionTab.targetAudience.length
      ? descriptionTab.targetAudience
      : base.targetAudience,
    faqs: editable.faqs.length ? editable.faqs : base.faqs,
    reviews: editable.reviews.length ? editable.reviews : base.reviews,
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
    ["german-courses-display", "v7"],
    [CACHE_TAGS.courses],
    fetchGermanCoursesForDisplayForPublicCache,
  );
}

function priceAmount(price?: string) {
  if (!price) {
    return NaN;
  }
  return Number(String(price).replace(/[^\d.]/g, ""));
}

function enrichCourseWithOriginalPrice(
  course: GermanCourse,
  stored?: StoredCourseDetails | null,
): GermanCourse {
  const salePrice = formatDisplayPrice(course.price);
  const batches = mergeFlexibleBatches(
    getDefaultFlexibleBatches(course.title, salePrice),
    stored?.flexibleBatches,
  );
  const candidate =
    batches.originalPrice?.trim() ||
    course.originalPrice?.trim() ||
    stored?.course?.originalPrice?.trim() ||
    "";

  const saleAmount = priceAmount(salePrice);
  const originalAmount = priceAmount(candidate);
  const originalPrice =
    candidate &&
    !Number.isNaN(originalAmount) &&
    (Number.isNaN(saleAmount) || originalAmount > saleAmount)
      ? formatDisplayPrice(candidate)
      : undefined;

  return {
    ...course,
    originalPrice,
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

function pickStoredText(value: string | undefined, fallback?: string) {
  const trimmed = value?.trim();
  if (trimmed) {
    return trimmed;
  }
  return fallback;
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
  const duration =
    pickStoredText(stored.learningHours) ||
    pickStoredText(stored.hours) ||
    base.learningHours ||
    base.hours;

  // A1–C2 keep stable title/image/URL, but admin sale price, duration, and stats must apply.
  if (isStaticCourseSlug(base.slug)) {
    return {
      ...base,
      hours: duration,
      learningHours: duration,
      price,
      originalPrice: pickStoredText(stored.originalPrice, base.originalPrice),
      batchSize: pickStoredText(stored.batchSize, base.batchSize),
      enrolled: pickStoredText(stored.enrolled, base.enrolled),
      rating: pickStoredText(stored.rating, base.rating),
      reviewCount: pickStoredText(stored.reviewCount, base.reviewCount),
    };
  }

  if (hasStoredIdentityMismatch(base, stored)) {
    return {
      ...base,
      learningHours: duration,
      hours: duration,
      batchSize: pickStoredText(stored.batchSize, base.batchSize),
      enrolled: pickStoredText(stored.enrolled, base.enrolled),
      rating: pickStoredText(stored.rating, base.rating),
      reviewCount: pickStoredText(stored.reviewCount, base.reviewCount),
      image: pickStoredText(stored.image, base.image) || base.image,
      price,
      originalPrice: pickStoredText(stored.originalPrice, base.originalPrice),
    };
  }

  return {
    ...base,
    ...stored,
    slug: base.slug,
    pathName: pickStoredText(stored.pathName, base.pathName) || base.pathName,
    title: pickStoredText(stored.title, base.title) || base.title,
    description: pickStoredText(stored.description, base.description) || base.description,
    hours: duration,
    learningHours: duration,
    price,
    image: pickStoredText(stored.image, base.image) || base.image,
    batchSize: pickStoredText(stored.batchSize, base.batchSize),
    enrolled: pickStoredText(stored.enrolled, base.enrolled),
    rating: pickStoredText(stored.rating, base.rating),
    reviewCount: pickStoredText(stored.reviewCount, base.reviewCount),
    originalPrice: pickStoredText(stored.originalPrice, base.originalPrice),
  };
}
