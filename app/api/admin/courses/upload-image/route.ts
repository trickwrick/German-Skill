import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../../lib/adminAuth";
import { saveCourseImage } from "../../../../../lib/courseImageStore";

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const slug = formData.get("slug");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose an image to upload." }, { status: 400 });
    }

    const result = await saveCourseImage(file, typeof slug === "string" ? slug : undefined);

    return NextResponse.json({
      message: "Image uploaded successfully.",
      path: result.path,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not upload image.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
