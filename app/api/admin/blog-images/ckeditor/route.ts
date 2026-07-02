import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../../lib/adminAuth";
import { saveBlogImage } from "../../../../../lib/blogImageStore";

function getRequestOrigin(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  return host ? `${protocol}://${host}` : "";
}

function buildCkeUploadResponse(funcNum: string, url: string, message = "") {
  return `<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(${funcNum}, ${JSON.stringify(url)}, ${JSON.stringify(message)});</script>`;
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const funcNum = url.searchParams.get("CKEditorFuncNum") ?? "1";

  try {
    const formData = await request.formData();
    const file = formData.get("upload") ?? formData.get("file");

    if (!file || !(file instanceof File)) {
      return new NextResponse(buildCkeUploadResponse(funcNum, "", "No image file provided."), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const result = await saveBlogImage(file);
    const imageUrl = result.path.startsWith("http")
      ? result.path
      : `${getRequestOrigin(request)}${result.path}`;

    return new NextResponse(buildCkeUploadResponse(funcNum, imageUrl), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload image.";
    return new NextResponse(buildCkeUploadResponse(funcNum, "", message), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}
