import { NextResponse } from "next/server";
import type { AdminCoursePayload } from "../../../../data/adminCourseDetails.types";
import { getCourseBySlug } from "../../../../data/germanCourses";
import { getCourseContent } from "../../../../data/courseContents";
import {
  getCourseEditableDetails,
  getStoredCourseDetails,
  saveCourseDetails,
} from "../../../../lib/courseContentStore";

function validateCourse(body: AdminCoursePayload) {
  if (!body.title?.trim()) {
    return "Course title is required.";
  }

  if (!body.slug?.trim()) {
    return "Course level is required.";
  }

  if (!body.pathName?.trim()) {
    return "URL slug is required.";
  }

  if (!body.description?.trim()) {
    return "Short description is required.";
  }

  if (!body.price?.trim()) {
    return "Price is required.";
  }

  if (!body.hours?.trim()) {
    return "Hours are required.";
  }

  if (!body.image?.trim()) {
    return "Course image is required.";
  }

  if (!Array.isArray(body.faqs) || body.faqs.length === 0) {
    return "Add at least one FAQ.";
  }

  for (const faq of body.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) {
      return "Each FAQ needs both question and answer.";
    }
  }

  if (!Array.isArray(body.reviews)) {
    return "Reviews are required.";
  }

  for (const review of body.reviews) {
    if (!review.name.trim() || !review.text.trim()) {
      return "Each review needs a student name and review text.";
    }
  }

  if (!body.flexibleBatches?.title?.trim()) {
    return "Flexible batches title is required.";
  }

  if (!body.flexibleBatches.subtitle?.trim() || !body.flexibleBatches.highlight?.trim()) {
    return "Flexible batches subtitle and highlight are required.";
  }

  if (!body.flexibleBatches.originalPrice?.trim()) {
    return "Flexible batches original price is required.";
  }

  if (!Array.isArray(body.flexibleBatches.batches) || body.flexibleBatches.batches.length === 0) {
    return "Add at least one batch in Flexible batches.";
  }

  for (const batch of body.flexibleBatches.batches) {
    if (!batch.date.trim() || !batch.schedule.trim() || !batch.time.trim()) {
      return "Each batch needs date, schedule, and time.";
    }
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Course slug is required." }, { status: 400 });
  }

  const course = getCourseBySlug(slug);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const content = getCourseContent(slug);
  const editable = await getCourseEditableDetails(slug);
  const stored = await getStoredCourseDetails(slug);

  return NextResponse.json({
    course: stored?.course ?? course,
    descriptionPreview: content?.courseDescription ?? [],
    faqs: editable.faqs,
    reviewsSummary: editable.reviewsSummary,
    reviews: editable.reviews,
    flexibleBatches: editable.flexibleBatches,
  });
}

async function persistCourse(body: AdminCoursePayload) {
  const error = validateCourse(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    await saveCourseDetails(body);

    return NextResponse.json({
      message: "Course saved successfully.",
      course: body,
    });
  } catch (storeError) {
    const message =
      storeError instanceof Error ? storeError.message : "Could not save course details.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as AdminCoursePayload;
  return persistCourse(body);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as AdminCoursePayload;
  return persistCourse(body);
}
