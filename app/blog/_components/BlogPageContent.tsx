import BlogPostCard from "../../components/BlogPostCard";
import type { BlogPost } from "../../../lib/blogStore";

type BlogPageContentProps = {
  posts: BlogPost[];
};

export default function BlogPageContent({ posts }: BlogPageContentProps) {
  return (
    <section className="blog-page-section">
      <div className="blog-page-inner">
        <div className="blog-grid blog-page-grid">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
