import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../../lib/adminAuth";
import { saveBlogImage } from "../../../../../lib/blogImageStore";

export const runtime = "nodejs";

function getRequestOrigin(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  return host ? `${protocol}://${host}` : "";
}

function buildAbsoluteImageUrl(request: Request, path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const origin = getRequestOrigin(request);
  return origin ? `${origin}${path}` : path;
}

function buildCkeUploadResponse(funcNum: string, url: string, message = "") {
  const script = `window.parent.CKEDITOR.tools.callFunction(${funcNum}, ${JSON.stringify(url)}, ${JSON.stringify(message)});`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body><script type="text/javascript">${script}<\/script></body></html>`;
}

function buildUploadImageJsonResponse(url: string, filename: string) {
  return NextResponse.json({
    uploaded: 1,
    fileName: filename,
    url,
  });
}

function buildUploadImageJsonError(message: string, status = 400) {
  return NextResponse.json(
    {
      uploaded: 0,
      error: { message },
    },
    { status },
  );
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const funcNum = requestUrl.searchParams.get("CKEditorFuncNum");
  const useFileBrowserResponse = Boolean(funcNum);

  if (!isAdminRequestAuthorized(request)) {
    if (useFileBrowserResponse) {
      return new NextResponse(buildCkeUploadResponse(funcNum!, "", "Unauthorized"), {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return buildUploadImageJsonError("Unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("upload") ?? formData.get("file");

    if (!file || !(file instanceof File)) {
      const message = "No image file provided.";

      if (useFileBrowserResponse) {
        return new NextResponse(buildCkeUploadResponse(funcNum!, "", message), {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return buildUploadImageJsonError(message);
    }

    const result = await saveBlogImage(file);
    const imageUrl = buildAbsoluteImageUrl(request, result.path);

    if (useFileBrowserResponse) {
      return new NextResponse(buildCkeUploadResponse(funcNum!, imageUrl), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return buildUploadImageJsonResponse(imageUrl, result.filename);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload image.";

    if (useFileBrowserResponse) {
      return new NextResponse(buildCkeUploadResponse(funcNum!, "", message), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return buildUploadImageJsonError(message);
  }
}
