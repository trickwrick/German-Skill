import { NextResponse } from "next/server";
import { saveContactQuery } from "../../../lib/contactQueryStore";
import { getClientIp, getGeoLocation } from "../../../lib/ipTracker";

type DiscountPopupInput = {
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  city?: string;
};

function validateBody(body: DiscountPopupInput) {
  if (!body.name?.trim()) {
    return "Full name is required.";
  }

  if (body.email && body.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    return "Enter a valid email address.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DiscountPopupInput;
    const error = validateBody(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const ip = await getClientIp(request);
    const geo = await getGeoLocation(ip);

    const query = await saveContactQuery({
      name: body.name.trim(),
      email: body.email?.trim() || "",
      phone: body.phone?.trim() || "",
      message: body.message?.trim() || "Diwali Special Offer Request",
      course: "Diwali Special Offer",
      source: "discount-popup",
      ip,
      ...(geo ? geo : {}),
    });

    return NextResponse.json({
      message: "Your Diwali offer request has been received.",
      id: query.id,
    });
  } catch (storeError) {
    const message =
      storeError instanceof Error ? storeError.message : "Could not save your request.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
