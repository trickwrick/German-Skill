import BlogPostCard from "../../components/BlogPostCard";
import { blogPosts } from "../../../data/blogPosts";

export default function BlogPageContent() {
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
          {blogPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
