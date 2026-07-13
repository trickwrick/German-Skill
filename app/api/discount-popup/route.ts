import { NextResponse } from "next/server";
import { saveContactQuery } from "../../../lib/contactQueryStore";

type DiscountPopupInput = {
  name: string;
  email: string;
  phone: string;
};

function validateBody(body: DiscountPopupInput) {
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
    return "Mobile number is required.";
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

    const query = await saveContactQuery({
      name: body.name,
      email: body.email,
      phone: body.phone,
      course: "Discount Coupon",
      source: "discount-popup",
    });

    return NextResponse.json({
      message: "Your discount coupon request has been received.",
      id: query.id,
    });
  } catch (storeError) {
    const message =
      storeError instanceof Error ? storeError.message : "Could not save your request.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
