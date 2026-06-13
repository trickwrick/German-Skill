import { unstable_noStore as noStore } from "next/cache";
import type { CourseContent, CourseReview } from "../data/courseContent.types";
import type {
  AdminCoursePayload,
  CourseFaqItem,
  StoredCourseDetails,
} from "../data/adminCourseDetails.types";
import { defaultReviewsSummary } from "../data/adminCourseDetails.types";
import { getCourseContent } from "../data/courseContents";
import { getFileCourseDetails, saveFileCourseDetails } from "./courseDetailsFileStore";
import { getMongoClient } from "./mongodb";

const DB_NAME = "germanskill";
const COLLECTION = "course_details";

function getEditableFromContent(slug: string) {
  const content = getCourseContent(slug);

  if (!content) {
    return {
      faqs: [] as CourseFaqItem[],
      reviewsSummary: defaultReviewsSummary,
      reviews: [] as CourseReview[],
    };
  }

  return {
    faqs: content.faqs,
    reviewsSummary: content.reviewsSummary,
    reviews: content.reviews,
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

export async function getStoredCourseDetails(slug: string): Promise<StoredCourseDetails | null> {
  noStore();

  try {
    const fileDoc = await getFileCourseDetails(slug);
    if (fileDoc) {
      return fileDoc;
    }
  } catch {
    // Continue to MongoDB fallback below.
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
      total: reviews.length,
    },
    reviews,
    updatedAt: new Date(),
  };

  await saveFileCourseDetails(document);

  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();

      await client
        .db(DB_NAME)
        .collection<StoredCourseDetails>(COLLECTION)
        .updateOne({ slug }, { $set: document }, { upsert: true });
    } catch {
      // Local file store is the source of truth when Atlas is unreachable.
    }
  }

  return document;
}

export async function getCourseContentAsync(slug: string): Promise<CourseContent | undefined> {
  noStore();

  const base = getCourseContent(slug);
  if (!base) return undefined;

  const stored = await getStoredCourseDetails(slug);

  if (!stored) {
    return base;
  }

  return {
    ...base,
    faqs: stored.faqs,
    reviewsSummary: stored.reviewsSummary,
    reviews: stored.reviews,
  };
}
