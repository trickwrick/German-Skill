import { unstable_noStore as noStore } from "next/cache";
import type { CourseContent, CourseReview } from "../data/courseContent.types";
import type {
  AdminCoursePayload,
  CourseFaqItem,
  StoredCourseDetails,
} from "../data/adminCourseDetails.types";
import { defaultReviewsSummary } from "../data/adminCourseDetails.types";
import { getCourseBySlug, germanCourses, type GermanCourse } from "../data/germanCourses";
import { getCourseContent } from "../data/courseContents";
import { getFileCourseDetails, isFileStoreEnabled, saveFileCourseDetails } from "./courseDetailsFileStore";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";

const DB_NAME = "germanskill";
const COLLECTION = "course_details";

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

  if (isFileStoreEnabled()) {
    try {
      const fileDoc = await getFileCourseDetails(slug);
      if (fileDoc) {
        return fileDoc;
      }
    } catch {
      // Continue to MongoDB fallback below.
    }
  }

  try {
    if (process.env.MONGODB_URI) {
      return await getMongoCourseDetails(slug);
    }
  } catch {
    // No stored course details available.
  }

  return null;
}

export async function getCourseEditableDetails(slug: string) {
  noStore();

  const stored = await getStoredCourseDetails(slug);
  const fallback = getEditableFromContent(slug);

  if (!stored) {
    return fallback;
  }

  return {
    faqs: stored.faqs,
    reviewsSummary: stored.reviewsSummary,
    reviews: stored.reviews,
  };
}

export async function saveCourseDetails(payload: AdminCoursePayload) {
  if (!payload.slug?.trim()) {
    throw new Error("Course slug is required.");
  }

  const { slug, faqs, reviewsSummary, reviews, ...courseFields } = payload;

  const document: StoredCourseDetails = {
    slug,
    course: courseFields,
    faqs,
    reviewsSummary: {
      ...reviewsSummary,
      total: Number(courseFields.reviewCount) || reviews.length,
    },
    reviews,
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

export async function getCourseContentAsync(slug: string): Promise<CourseContent | undefined> {
  noStore();

  const base = getCourseContent(slug);
  if (!base) return undefined;

  const course = getCourseBySlug(slug);
  const stored = await getStoredCourseDetails(slug);

  if (!stored) {
    return {
      ...base,
      reviews: [],
      reviewsSummary: {
        ...base.reviewsSummary,
        total: Number(course?.reviewCount) || base.reviewsSummary.total,
      },
    };
  }

  const reviewCount = Number(stored.course.reviewCount) || stored.reviewsSummary.total;

  return {
    ...base,
    faqs: stored.faqs,
    reviewsSummary: {
      ...stored.reviewsSummary,
      total: reviewCount,
    },
    reviews: stored.reviews,
  };
}

export async function getGermanCoursesForDisplay(): Promise<GermanCourse[]> {
  noStore();

  return Promise.all(
    germanCourses.map(async (course) => {
      const stored = await getStoredCourseDetails(course.slug);
      const learningHours = stored?.course?.learningHours?.trim();

      if (!learningHours) {
        return course;
      }

      return {
        ...course,
        learningHours,
      };
    }),
  );
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

export function mergeStoredCourse(
  base: GermanCourse,
  stored?: Partial<GermanCourse>,
): GermanCourse {
  if (!stored) {
    return base;
  }

  return {
    ...base,
    ...stored,
    slug: base.slug,
    pathName: base.pathName,
    price: stored.price ? normalizeCoursePrice(stored.price) : base.price,
  };
}
