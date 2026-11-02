import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import {
  getAnnouncementData,
  saveAnnouncementData,
} from "../../../../lib/announcementStore";
import type { TopAnnouncementData } from "../../../../data/announcement.types";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const data = await getAnnouncementData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<TopAnnouncementData>;
    const updated = await saveAnnouncementData({
      customText: typeof body.customText === "string" ? body.customText : "",
      isActive: typeof body.isActive === "boolean" ? body.isActive : true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update announcement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
