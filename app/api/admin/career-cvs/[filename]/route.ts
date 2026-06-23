import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../../lib/adminAuth";
import { getCareerCv, isSafeCareerCvFilename } from "../../../../../lib/careerCvStore";

type RouteContext = {
  params: { filename: string };
};

export async function GET(request: Request, { params }: RouteContext) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const filename = decodeURIComponent(params.filename);

  if (!isSafeCareerCvFilename(filename)) {
    return NextResponse.json({ error: "Invalid file." }, { status: 400 });
  }

  const file = await getCareerCv(filename);

  if (!file) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
