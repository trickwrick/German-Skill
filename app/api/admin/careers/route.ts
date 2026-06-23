import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import { deleteCareerApplication, getCareerApplications } from "../../../../lib/careerApplicationStore";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const applications = await getCareerApplications();
  return NextResponse.json({ applications });
}

export async function DELETE(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Application id is required." }, { status: 400 });
  }

  try {
    const removed = await deleteCareerApplication(id);

    if (!removed) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Application deleted." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete application.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
