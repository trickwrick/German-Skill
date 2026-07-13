import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import type { GeneralPageId } from "../../../../data/generalPages";
import {
  getGeneralPagesContent,
  saveGeneralPageContent,
  saveGeneralPagesContent,
  type GeneralPagesContent,
  type LegalPageContentData,
  type OurCompanyPageData,
} from "../../../../lib/generalPageStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await getGeneralPagesContent({ fresh: true });
    return NextResponse.json(content);
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
          content: LegalPageContentData | OurCompanyPageData;
        };

    if ("pageId" in body && body.pageId) {
      const saved = await saveGeneralPageContent(body.pageId, body.content);
      return NextResponse.json(saved);
    }

    const saved = await saveGeneralPagesContent(body as GeneralPagesContent);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to save general pages", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
