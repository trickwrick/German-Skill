import { NextResponse } from "next/server";
import { getCourseImage, isSafeCourseImageFilename } from "../../../../lib/courseImageStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteProps = {
  params: { filename: string };
};

export async function GET(_request: Request, { params }: RouteProps) {
  const filename = decodeURIComponent(params.filename);

  if (!isSafeCourseImageFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const image = await getCourseImage(filename);
  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
