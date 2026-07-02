import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import {
  deleteVideoTestimonial,
  getAllVideoTestimonials,
  saveVideoTestimonials,
  upsertVideoTestimonial,
  type VideoTestimonial,
} from "../../../../lib/videoTestimonialStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getAllVideoTestimonials({ fresh: true });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch admin video testimonials", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as VideoTestimonial;
    const saved = await upsertVideoTestimonial(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Failed to save video testimonial", error);
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
    const body = (await request.json()) as { items?: VideoTestimonial[] };
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: "Items array is required." }, { status: 400 });
    }

    const saved = await saveVideoTestimonials(body.items);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to save video testimonials", error);
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
    return NextResponse.json({ error: "Testimonial id is required." }, { status: 400 });
  }

  try {
    const saved = await deleteVideoTestimonial(id);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to delete video testimonial", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 },
    );
  }
}
