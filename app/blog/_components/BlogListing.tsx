"use client";

import { useSearchParams } from "next/navigation";
import { filterBlogPostsByCategory } from "../../../lib/blogUtils";
import type { BlogPost } from "../../../lib/blogStore";
import BlogPageContent from "./BlogPageContent";
import BlogSidebar from "./BlogSidebar";

type BlogListingProps = {
  posts: BlogPost[];
};

export default function BlogListing({ posts }: BlogListingProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category")?.trim() || undefined;
  const filteredPosts = filterBlogPostsByCategory(posts, activeCategory);

  return (
    <>
      <div className="blog-layout-main">
        <BlogPageContent posts={filteredPosts} activeCategory={activeCategory} />
      </div>
      <BlogSidebar posts={posts} activeCategory={activeCategory} />
    </>
  );
}
