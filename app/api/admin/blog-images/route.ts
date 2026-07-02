import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import { saveBlogImage } from "../../../../lib/blogImageStore";

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
