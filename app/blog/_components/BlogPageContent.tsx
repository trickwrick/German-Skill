import BlogPostCard from "../../components/BlogPostCard";
import type { BlogPost } from "../../../lib/blogStore";

type BlogPageContentProps = {
  posts: BlogPost[];
  activeCategory?: string;
};

export default function BlogPageContent({ posts, activeCategory }: BlogPageContentProps) {
  return (
    <>
      {activeCategory ? (
        <p className="blog-page-filter-note">
          Showing posts in <strong>{activeCategory}</strong>
        </p>
      ) : null}

      {posts.length > 0 ? (
        <>
          <p className="blog-page-count">
            Showing {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
          <div className="blog-grid blog-page-grid blog-page-grid-with-sidebar">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      ) : (
        <p className="blog-page-empty">
          {activeCategory
            ? "No blog posts found in this category."
            : "No blog posts published yet."}
        </p>
      )}
    </>
  );
}
