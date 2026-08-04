import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import {
  safeRevalidatePublicBlogData,
  safeRevalidatePublicCourseData,
  safeRevalidatePublicGeneralPagesData,
  safeRevalidatePublicHomeFaqsData,
  safeRevalidatePublicSeoData,
  safeRevalidatePublicVideoTestimonialsData,
} from "../../../../lib/publicDataCache";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { scope?: string };
    const scope = body.scope?.trim() || "all";

    if (scope === "blog" || scope === "all") {
      safeRevalidatePublicBlogData();
    }
    if (scope === "courses" || scope === "all") {
      safeRevalidatePublicCourseData();
    }
    if (scope === "faqs" || scope === "all") {
      safeRevalidatePublicHomeFaqsData();
    }
    if (scope === "testimonials" || scope === "all") {
      safeRevalidatePublicVideoTestimonialsData();
    }
    if (scope === "pages" || scope === "all") {
      safeRevalidatePublicGeneralPagesData();
    }
    if (scope === "seo" || scope === "all") {
      safeRevalidatePublicSeoData();
    }

    return NextResponse.json({ ok: true, scope });
  } catch (error) {
    console.error("Failed to revalidate public cache", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
