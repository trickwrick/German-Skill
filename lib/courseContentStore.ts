import { unstable_noStore as noStore } from "next/cache";
import type { CourseContent, CourseReview } from "../data/courseContent.types";
import type {
  AdminCoursePayload,
  CourseFaqItem,
  StoredCourseDetails,
} from "../data/adminCourseDetails.types";
import { defaultReviewsSummary } from "../data/adminCourseDetails.types";
import { getCourseBySlug, germanCourses, isStaticCourseSlug, getCourseByPathName, type GermanCourse } from "../data/germanCourses";
import { getCourseContent, getCourseContentForCourse } from "../data/courseContents";
import {
  getCourseFlexibleBatches,
  getDefaultFlexibleBatches,
  mergeFlexibleBatches,
} from "../data/courseFlexibleBatches";
import { getFileCourseDetails, getAllFileCourseDetails, deleteFileCourseDetails, isFileStoreEnabled, saveFileCourseDetails } from "./courseDetailsFileStore";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";
import { slugifyCoursePath, formatDisplayPrice } from "./courseUtils";

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

export async function getAllStoredCourseDetailsList(): Promise<StoredCourseDetails[]> {
  noStore();

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
    } catch {
      // No stored course details available.
    }
  }

  return Array.from(bySlug.values());
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

  const storedCourses = await getAllStoredCourseDetailsList();
  return storedCourses.some((stored) => {
    if (stored.slug === excludeSlug) {
      return false;
    }

    const storedPath = stored.course.pathName?.trim() || stored.slug;
    return storedPath === normalized;
  });
}

export async function getCourseBySlugAsync(slug: string): Promise<GermanCourse | undefined> {
  noStore();

  const base = getCourseBySlug(slug);
  if (base) {
    const stored = await getStoredCourseDetails(slug);
    return enrichCourseWithOriginalPrice(mergeStoredCourse(base, stored?.course), stored);
  }

  const stored = await getStoredCourseDetails(slug);
  if (!stored?.course?.title?.trim()) {
    return undefined;
  }

  return enrichCourseWithOriginalPrice(courseFromStored(stored), stored);
}

export async function getCourseByPathNameAsync(pathName: string): Promise<GermanCourse | undefined> {
  noStore();

  const decoded = decodeURIComponent(pathName);
  const staticCourse = getCourseByPathName(decoded);
  if (staticCourse) {
    return getCourseBySlugAsync(staticCourse.slug);
  }

  const storedCourses = await getAllStoredCourseDetailsList();
  const stored = storedCourses.find((document) => {
    const storedPath = document.course.pathName?.trim() || document.slug;
    return storedPath === decoded;
  });

  if (!stored) {
    return undefined;
  }

  return enrichCourseWithOriginalPrice(courseFromStored(stored), stored);
}

function getEditableFromContent(slug: string) {
  const content = getCourseContent(slug);
  const course = getCourseBySlug(slug);

  if (!content) {
    return {
      faqs: [] as CourseFaqItem[],
      reviewsSummary: defaultReviewsSummary,
      reviews: [] as CourseReview[],
    };
  }

  return {
    faqs: content.faqs,
    reviewsSummary: {
      ...content.reviewsSummary,
      total: Number(course?.reviewCount) || content.reviewsSummary.total,
    },
    reviews: [] as CourseReview[],
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

export async function getStoredCourseDetails(slug: string): Promise<StoredCourseDetails | null> {
  noStore();

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

export async function getCourseEditableDetails(slug: string) {
  noStore();

  const stored = await getStoredCourseDetails(slug);
  const fallback = getEditableFromContent(slug);

  if (!stored) {
    return {
      ...fallback,
      flexibleBatches: getCourseFlexibleBatches(slug),
    };
  }

  return {
    faqs: stored.faqs,
    reviewsSummary: stored.reviewsSummary,
    reviews: stored.reviews,
    flexibleBatches: mergeFlexibleBatches(
      getCourseFlexibleBatches(slug),
      stored.flexibleBatches,
    ),
  };
}

export async function saveCourseDetails(payload: AdminCoursePayload) {
  if (!payload.slug?.trim()) {
    throw new Error("Course slug is required.");
  }

  const { slug, faqs, reviewsSummary, reviews, flexibleBatches, ...courseFields } = payload;
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
    faqs,
    reviewsSummary: {
      ...reviewsSummary,
      total: Number(courseFields.reviewCount) || reviews.length,
    },
    reviews,
    flexibleBatches,
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

    return document;
  }

  return saveMongoCourseDetails(document);
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

  return { removed, reset: isStandard && removed };
}

export async function getCourseContentAsync(slug: string): Promise<CourseContent | undefined> {
  noStore();

  const course = await getCourseBySlugAsync(slug);
  if (!course) {
    return undefined;
  }

  const base = getCourseContent(slug) ?? getCourseContentForCourse(course);
  if (!base) {
    return undefined;
  }

  const stored = await getStoredCourseDetails(slug);
  const displayCourse = mergeStoredCourse(getCourseBySlug(slug) ?? course, stored?.course);

  if (!stored) {
    return {
      ...base,
      sidebarPrice: displayCourse.price ?? base.sidebarPrice,
      aboutCourse: displayCourse.description ?? base.aboutCourse,
      reviews: [],
      reviewsSummary: {
        ...base.reviewsSummary,
        total: Number(displayCourse.reviewCount) || base.reviewsSummary.total,
      },
    };
  }

  const reviewCount = Number(stored.course.reviewCount) || stored.reviewsSummary.total;

  return {
    ...base,
    sidebarPrice: displayCourse.price ?? base.sidebarPrice,
    aboutCourse: displayCourse.description ?? base.aboutCourse,
    faqs: stored.faqs,
    reviewsSummary: {
      ...stored.reviewsSummary,
      total: reviewCount,
    },
    reviews: stored.reviews,
  };
}

export async function getCourseFlexibleBatchesAsync(slug: string) {
  noStore();

  const stored = await getStoredCourseDetails(slug);
  return mergeFlexibleBatches(getCourseFlexibleBatches(slug), stored?.flexibleBatches);
}

export async function getGermanCoursesForDisplay(): Promise<GermanCourse[]> {
  noStore();

  const staticCourses = await Promise.all(
    germanCourses.map(async (course) => {
      const stored = await getStoredCourseDetails(course.slug);
      const merged = mergeStoredCourse(course, stored?.course);
      return enrichCourseWithOriginalPrice(merged, stored);
    }),
  );

  const storedCourses = await getAllStoredCourseDetailsList();
  const customCourses = storedCourses
    .filter((stored) => !isStaticCourseSlug(stored.slug))
    .map((stored) => enrichCourseWithOriginalPrice(courseFromStored(stored), stored));

  return [...staticCourses, ...customCourses];
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

  const identityMismatch = hasStoredIdentityMismatch(base, stored.course);
  const content = getCourseContent(stored.slug);

  return {
    ...stored,
    course: mergeStoredCourse(base, stored.course),
    faqs: identityMismatch ? (content?.faqs ?? stored.faqs) : stored.faqs,
    reviews: identityMismatch ? [] : stored.reviews,
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
