import { NextResponse } from "next/server";
import {
  getGeneralPageImage,
  isSafeGeneralPageImageFilename,
} from "../../../../lib/generalPageImageStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteProps = {
  params: { filename: string };
};

export async function GET(_request: Request, { params }: RouteProps) {
  const filename = decodeURIComponent(params.filename);

  if (!isSafeGeneralPageImageFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const image = await getGeneralPageImage(filename);
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
