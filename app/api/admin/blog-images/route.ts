import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import { saveBlogImage } from "../../../../lib/blogImageStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") ?? formData.get("upload");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const result = await saveBlogImage(file);
    return NextResponse.json(
      {
        ...result,
        url: result.path,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to upload blog image", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = /upload a JPG|must be \d+MB|not configured|MongoDB|MONGODB_URI|database/i.test(message)
      ? 400
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
