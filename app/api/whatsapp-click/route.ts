import { NextResponse } from "next/server";
import { saveContactQuery } from "../../../lib/contactQueryStore";
import { getClientIp, getGeoLocation } from "../../../lib/ipTracker";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    let page = "";
    try {
      const body = (await request.json()) as { page?: string };
      if (body && typeof body.page === "string") {
        page = body.page.trim();
      }
    } catch {
      // Body is optional
    }

    const ip = await getClientIp(request);
    const geo = await getGeoLocation(ip);

    const query = await saveContactQuery({
      name: "WhatsApp Visitor",
      email: "",
      phone: "",
      course: "WhatsApp Enquiry",
      message: page ? `Initiated WhatsApp chat from page: ${page}` : "Initiated WhatsApp chat enquiry.",
      source: "whatsapp",
      ip,
      ...(geo ? geo : {}),
    });

    return NextResponse.json({
      success: true,
      id: query.id,
    });
  } catch (error) {
    console.error("Failed to track WhatsApp click", error);
    return NextResponse.json({ error: "Failed to record enquiry" }, { status: 500 });
  }
}

