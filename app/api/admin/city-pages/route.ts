import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import {
  deleteCityPage,
  getCityPagesStore,
  saveCityPagesStore,
  upsertCityPage,
  type CityPage,
  type CityPagesStore,
} from "../../../../lib/cityPageStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await getCityPagesStore({ fresh: true });
    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to fetch city pages", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<CityPage> & { cityName: string };
    const saved = await upsertCityPage(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Failed to save city page", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CityPagesStore;
    const saved = await saveCityPagesStore(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to save city pages", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "City slug is required." }, { status: 400 });
  }

  try {
    const saved = await deleteCityPage(slug);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to delete city page", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
