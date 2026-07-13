import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../../lib/adminAuth";
import {
  saveGeneralPageImage,
  type GeneralPageImageFolder,
} from "../../../../../lib/generalPageImageStore";

function parseFolder(value: FormDataEntryValue | null): GeneralPageImageFolder {
  return value === "tutors" ? "tutors" : "general";
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = parseFolder(formData.get("folder"));
    const label = formData.get("label");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose an image to upload." }, { status: 400 });
    }

    const result = await saveGeneralPageImage(
      file,
      folder,
      typeof label === "string" ? label : undefined,
    );

    return NextResponse.json({
      message: "Image uploaded successfully.",
      path: result.path,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not upload image.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
