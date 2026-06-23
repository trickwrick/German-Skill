import { NextResponse } from "next/server";
import { isAcceptedCareerCv } from "../../../lib/careerCvValidation";
import { saveCareerApplication } from "../../../lib/careerApplicationStore";

function validateCareerForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const germanLevel = String(formData.get("germanLevel") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const about = String(formData.get("about") ?? "").trim();
  const certification = String(formData.get("certification") ?? "").trim();
  const cv = formData.get("cv");

  if (!name) {
    return { error: "Full name is required." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (!phone || phone.length < 8) {
    return { error: "Phone number is required." };
  }

  if (!city) {
    return { error: "City is required." };
  }

  if (!germanLevel) {
    return { error: "German level is required." };
  }

  if (!experience) {
    return { error: "Teaching experience is required." };
  }

  if (!about) {
    return { error: "About you is required." };
  }

  if (!(cv instanceof File) || cv.size === 0) {
    return { error: "Please upload your CV." };
  }

  if (!isAcceptedCareerCv(cv)) {
    return { error: "Please upload a PDF, DOC, or DOCX file." };
  }

  if (cv.size > 5 * 1024 * 1024) {
    return { error: "CV must be 5MB or smaller." };
  }

  return {
    data: {
      name,
      email,
      phone,
      city,
      germanLevel,
      experience,
      certification: certification || undefined,
      about,
      cv,
    },
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const validation = validateCareerForm(formData);

    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { cv, ...input } = validation.data;
    const application = await saveCareerApplication(input, cv);

    return NextResponse.json({
      message: "Your application has been received.",
      id: application.id,
    });
  } catch (storeError) {
    const message =
      storeError instanceof Error ? storeError.message : "Could not submit your application.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
