import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import type { GeneralPageId } from "../../../../data/generalPages";
import {
  getGeneralPagesContent,
  saveGeneralPageContent,
  saveGeneralPagesContent,
  type GeneralPagesContent,
  type GermanLanguageCoursePageData,
  type LegalPageContentData,
  type OurCompanyPageData,
} from "../../../../lib/generalPageStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await getGeneralPagesContent({ fresh: true });
    return NextResponse.json(content, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Failed to fetch general pages", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as
      | GeneralPagesContent
      | {
          pageId: GeneralPageId;
          content: LegalPageContentData | OurCompanyPageData | GermanLanguageCoursePageData;
        };

    if ("pageId" in body && body.pageId) {
      const saved = await saveGeneralPageContent(body.pageId, body.content);
      return NextResponse.json(saved, { headers: NO_CACHE_HEADERS });
    }

    const saved = await saveGeneralPagesContent(body as GeneralPagesContent);
    return NextResponse.json(saved, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Failed to save general pages", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500, headers: NO_CACHE_HEADERS },
    );
  }
}
