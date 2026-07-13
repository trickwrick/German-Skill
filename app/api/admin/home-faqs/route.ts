import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import {
  deleteHomeFaqItem,
  getHomeFaqContent,
  saveHomeFaqContent,
  upsertHomeFaqItem,
  type HomeFaqContent,
  type HomeFaqItem,
} from "../../../../lib/homeFaqStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await getHomeFaqContent({ fresh: true });
    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to fetch homepage FAQs", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as HomeFaqItem & {
      title?: string;
      subtitle?: string;
    };
    const saved = await upsertHomeFaqItem(body, {
      title: body.title?.trim(),
      subtitle: body.subtitle?.trim(),
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Failed to save homepage FAQ", error);
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
    const body = (await request.json()) as HomeFaqContent;
    const saved = await saveHomeFaqContent(body);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to save homepage FAQs", error);
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
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "FAQ id is required." }, { status: 400 });
  }

  try {
    const saved = await deleteHomeFaqItem(id);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to delete homepage FAQ", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
