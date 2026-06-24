import { NextResponse } from "next/server";
import { getBlogImage } from "../../../../lib/blogImageStore";

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  try {
    const image = await getBlogImage(params.filename);

    if (!image) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(image.data as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Failed to serve blog image", error);
    return new NextResponse(null, { status: 500 });
  }
}
