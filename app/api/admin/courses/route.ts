import { NextResponse } from "next/server";
import type { AdminCoursePayload } from "../../../../data/adminCourseDetails.types";
import { getCourseBySlug, isStaticCourseSlug } from "../../../../data/germanCourses";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import {
  getCourseBySlugAsync,
  getCourseEditableDetails,
  getStoredCourseDetails,
  isCoursePathNameTaken,
  saveCourseDetails,
  deleteCourseDetails,
} from "../../../../lib/courseContentStore";
import { slugifyCoursePath } from "../../../../lib/courseUtils";

function validateCourse(body: AdminCoursePayload) {
  if (!body.title?.trim()) {
    return "Course title is required.";
  }

  if (!body.slug?.trim()) {
    return "Course slug is required.";
  }

  if (!body.pathName?.trim()) {
    return "URL slug is required.";
  }

  if (!slugifyCoursePath(body.pathName)) {
    return "URL slug can only use letters, numbers, and hyphens.";
  }

  if (!body.description?.trim()) {
    return "Short description is required.";
  }

  if (!body.price?.trim()) {
    return "Price is required.";
  }

  if (!body.hours?.trim()) {
    return "Duration is required.";
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
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Course slug is required." }, { status: 400 });
  }

  const course = await getCourseBySlugAsync(slug);
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const editable = await getCourseEditableDetails(slug);
  const stored = await getStoredCourseDetails(slug);

  return NextResponse.json({
    course: stored?.course ?? course,
    descriptionTab: editable.descriptionTab,
    faqs: editable.faqs,
    reviewsSummary: editable.reviewsSummary,
    reviews: editable.reviews,
    flexibleBatches: editable.flexibleBatches,
    seoContent: editable.seoContent,
  });
}

async function persistCourse(body: AdminCoursePayload, isCreate: boolean) {
  const error = validateCourse(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const previousSlug = body.previousSlug?.trim() ?? "";
  const originalSlug = previousSlug || body.slug?.trim() || "";
  const pathName = slugifyCoursePath(body.pathName?.trim() || "");
  const isCustom = previousSlug ? !isStaticCourseSlug(previousSlug) : !isStaticCourseSlug(originalSlug);

  if (isCreate && isCustom) {
    body.slug = pathName;
  } else if (!isCreate && isCustom) {
    body.slug = pathName;
    body.previousSlug = previousSlug || originalSlug;
  }

  body.pathName = pathName;

  if (await isCoursePathNameTaken(pathName, isCreate ? undefined : originalSlug)) {
    return NextResponse.json(
      { error: "This URL slug is already used by another course." },
      { status: 400 },
    );
  }

  try {
    await saveCourseDetails(body);

    return NextResponse.json({
      message: isCreate && isCustom ? "Course added successfully." : "Course saved successfully.",
      course: body,
    });
  } catch (storeError) {
    const message =
      storeError instanceof Error ? storeError.message : "Could not save course details.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as AdminCoursePayload;
  return persistCourse(body, true);
}

export async function PUT(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as AdminCoursePayload;
  return persistCourse(body, false);
}

export async function DELETE(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();

  if (!slug) {
    return NextResponse.json({ error: "Course slug is required." }, { status: 400 });
  }

  try {
    const result = await deleteCourseDetails(slug);

    if (result.reset) {
      return NextResponse.json({
        message: "Saved changes removed. Course reset to default settings.",
      });
    }

    if (isStaticCourseSlug(slug) && !result.removed) {
      return NextResponse.json({
        message: "This course is already using default settings.",
      });
    }

    return NextResponse.json({ message: "Course deleted successfully." });
  } catch (deleteError) {
    const message =
      deleteError instanceof Error ? deleteError.message : "Could not delete course.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
