import { NextResponse } from "next/server";
import { getVideoTestimonials } from "../../../lib/videoTestimonialStore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await getVideoTestimonials();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch video testimonials", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
