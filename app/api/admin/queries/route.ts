import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import { deleteContactQuery, getContactQueries } from "../../../../lib/contactQueryStore";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const queries = await getContactQueries();
  return NextResponse.json({ queries });
}

export async function DELETE(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Query id is required." }, { status: 400 });
  }

  try {
    const removed = await deleteContactQuery(id);

    if (!removed) {
      return NextResponse.json({ error: "Query not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Query deleted." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete query.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
