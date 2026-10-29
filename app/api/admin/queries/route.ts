import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import {
  addContactQueryFollowUp,
  deleteContactQuery,
  deleteContactQueryFollowUp,
  getContactQueries,
} from "../../../../lib/contactQueryStore";

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

  const followUpId = searchParams.get("followUpId");

  if (followUpId) {
    try {
      const removedFollowUp = await deleteContactQueryFollowUp(id, followUpId);

      if (!removedFollowUp) {
        return NextResponse.json({ error: "Follow-up not found." }, { status: 404 });
      }

      return NextResponse.json({ message: "Follow-up deleted." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete follow-up.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
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

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { id?: unknown; text?: unknown };

  try {
    body = (await request.json()) as { id?: unknown; text?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (!id || !text) {
    return NextResponse.json({ error: "Query id and follow-up text are required." }, { status: 400 });
  }

  if (text.length > 2000) {
    return NextResponse.json({ error: "Follow-up is too long (max 2000 characters)." }, { status: 400 });
  }

  try {
    const followUp = await addContactQueryFollowUp(id, text);

    if (!followUp) {
      return NextResponse.json({ error: "Query not found." }, { status: 404 });
    }

    return NextResponse.json({ followUp });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save follow-up.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
