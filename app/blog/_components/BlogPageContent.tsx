import BlogPostCard from "../../components/BlogPostCard";
import type { BlogPost } from "../../../lib/blogStore";

type BlogPageContentProps = {
  posts: BlogPost[];
};

export default function BlogPageContent({ posts }: BlogPageContentProps) {
  return (
    <section className="blog-page-section">
      <div className="blog-page-inner">
        <header className="blog-page-header">
          <span className="blog-tag">News &amp; Blogs</span>
          <h2>All Blogs &amp; Articles</h2>
          <p>
            Tips, guides, and updates on German language learning, exams, study abroad, and
            career opportunities.
          </p>
        </header>

        <div className="blog-grid blog-page-grid">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
