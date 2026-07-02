import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../../lib/adminAuth";
import { saveBlogPost, deleteBlogPost, getBlogPostBySlug, updateBlogPost, BlogPost } from "../../../../../lib/blogStore";
import { slugifyCoursePath } from "../../../../../lib/courseUtils";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const slug = decodeURIComponent(params.slug);
    const body = await request.json();
    const nextSlug = slugifyCoursePath(body.slug || body.title || "");

    if (!nextSlug) {
      return NextResponse.json({ error: "Blog slug is required." }, { status: 400 });
    }

    const saved = await updateBlogPost(slug, { ...body, slug: nextSlug } as BlogPost);
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
    const slug = decodeURIComponent(params.slug);
    const existing = await getBlogPostBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteBlogPost(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog post", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
