import Link from "next/link";
import BlogImage from "../../components/BlogImage";
import { DEFAULT_BLOG_CATEGORIES, getRecentBlogPosts } from "../../../lib/blogUtils";
import type { BlogPost } from "../../../lib/blogStore";

type BlogSidebarProps = {
  posts: BlogPost[];
  currentSlug?: string;
  activeCategory?: string;
};

export default function BlogSidebar({
  posts,
  currentSlug,
  activeCategory,
}: BlogSidebarProps) {
  const recentPosts = getRecentBlogPosts(posts, 3, currentSlug);

  return (
    <aside className="blog-sidebar" aria-label="Blog sidebar">
      <div className="blog-sidebar-widget">
        <details className="blog-sidebar-section" open>
          <summary>Recent Posts</summary>
          <div className="blog-sidebar-section-body">
            {recentPosts.length > 0 ? (
              <ul className="blog-sidebar-recent-list">
                {recentPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${encodeURIComponent(post.slug)}`}
                      className="blog-sidebar-recent-item"
                    >
                      <span className="blog-sidebar-recent-thumb">
                        <BlogImage
                          src={post.image}
                          alt={post.title}
                          width={72}
                          height={54}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </span>
                      <span className="blog-sidebar-recent-title">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="blog-sidebar-empty">No posts yet.</p>
            )}
          </div>
        </details>

        <details className="blog-sidebar-section" open>
          <summary>Categories</summary>
          <div className="blog-sidebar-section-body">
            <ul className="blog-sidebar-category-list">
              {DEFAULT_BLOG_CATEGORIES.map((category) => {
                  const isActive =
                    activeCategory?.trim().toLowerCase() === category.toLowerCase();

                  return (
                    <li key={category}>
                      <Link
                        href={`/blog?category=${encodeURIComponent(category)}`}
                        className={
                          isActive
                            ? "blog-sidebar-category-link is-active"
                            : "blog-sidebar-category-link"
                        }
                      >
                        {category}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </details>
      </div>
    </aside>
  );
}
