import { NextResponse } from "next/server";
import { getAnnouncementData } from "../../../lib/announcementStore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getAnnouncementData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch announcement", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

