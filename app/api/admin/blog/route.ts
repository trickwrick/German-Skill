import { NextResponse } from "next/server";
import { isAdminRequestAuthorized } from "../../../../lib/adminAuth";
import { getBlogPosts, saveBlogPost, BlogPost } from "../../../../lib/blogStore";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getBlogPosts();
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
    
    // Basic validation
    if (!body.slug || !body.title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    const saved = await saveBlogPost(body as BlogPost);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
