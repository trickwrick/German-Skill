import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../../lib/adminAuth";
import { saveBlogPost, deleteBlogPost, getBlogPostBySlug, BlogPost } from "../../../../../lib/blogStore";

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    if (body.slug !== params.slug) {
      return NextResponse.json({ error: "Slug mismatch" }, { status: 400 });
    }

    const saved = await saveBlogPost(body as BlogPost);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Failed to update blog post", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if it exists
    const existing = await getBlogPostBySlug(params.slug);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteBlogPost(params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog post", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
