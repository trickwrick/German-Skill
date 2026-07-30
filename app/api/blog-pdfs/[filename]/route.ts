import { NextResponse } from "next/server";
import { getBlogPdf } from "../../../../lib/blogPdfStore";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  try {
    const pdf = await getBlogPdf(params.filename);

    if (!pdf) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(pdf.data as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": pdf.contentType,
        "Content-Disposition": `inline; filename="${params.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Failed to serve blog PDF", error);
    return new NextResponse(null, { status: 500 });
  }
}
