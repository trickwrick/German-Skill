import { NextResponse } from "next/server";
import type { ContactQueryInput } from "../../../data/contactQuery.types";
import { saveContactQuery } from "../../../lib/contactQueryStore";

function validateContactBody(body: ContactQueryInput) {
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

  if (!body.message?.trim()) {
    return "Message is required.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactQueryInput;
    const error = validateContactBody(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const query = await saveContactQuery(body);

    return NextResponse.json({
      message: "Your message has been received.",
      id: query.id,
    });
  } catch (storeError) {
    const message =
      storeError instanceof Error ? storeError.message : "Could not save your message.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
