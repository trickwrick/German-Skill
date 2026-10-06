import { NextResponse } from "next/server";
import type { EnrollQueryInput } from "../../../data/contactQuery.types";
import { saveContactQuery } from "../../../lib/contactQueryStore";
import { getClientIp, getGeoLocation } from "../../../lib/ipTracker";

function validateEnrollBody(body: EnrollQueryInput) {
  if (!body.name?.trim()) {
    return "Full name is required.";
  }

  if (!body.email?.trim()) {
    return "Email address is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return "Enter a valid email address.";
  }

  if (!body.phone?.trim() || body.phone.trim().length < 8) {
    return "Phone number is required.";
  }

  if (!body.city?.trim()) {
    return "City is required.";
  }

  if (!body.level?.trim()) {
    return "Level is required.";
  }

  if (!body.course?.trim()) {
    return "Course is required.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnrollQueryInput;
    const error = validateEnrollBody(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const ip = await getClientIp(request);
    const geo = await getGeoLocation(ip);

    const query = await saveContactQuery({
      name: body.name,
      email: body.email,
      phone: body.phone,
      city: body.city,
      course: body.course,
      level: body.level,
      source: "enroll",
      ip,
      ...(geo ? geo : {}),
    });

    return NextResponse.json({
      message: "Your enquiry has been received.",
      id: query.id,
    });
  } catch (storeError) {
    const message =
      storeError instanceof Error ? storeError.message : "Could not save your enquiry.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
