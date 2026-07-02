import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import { getSeoSettings, saveSeoSettings, SeoSettings } from "../../../../lib/seoStore";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSeoSettings({ fresh: true });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch SEO settings", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const saved = await saveSeoSettings(body as Partial<SeoSettings>);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    console.error("Failed to save SEO settings", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
