import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import { getBlogPosts, saveBlogPost, BlogPost, isBlogSlugTaken } from "../../../../lib/blogStore";
import { slugifyCoursePath } from "../../../../lib/courseUtils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getBlogPosts({ fresh: true });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = slugifyCoursePath(body.slug || body.title || "");

    if (!slug || !body.title?.trim()) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    if (await isBlogSlugTaken(slug)) {
      return NextResponse.json({ error: "This blog URL slug is already used." }, { status: 400 });
    }

    const saved = await saveBlogPost({ ...body, slug } as BlogPost);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
