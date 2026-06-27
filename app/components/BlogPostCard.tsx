import Link from "next/link";
import BlogImage from "./BlogImage";
import { formatBlogDate } from "../../data/blogPosts";
import type { BlogPost } from "../../lib/blogStore";

type BlogPostCardProps = {
  post: BlogPost;
  showExcerpt?: boolean;
};

export default function BlogPostCard({ post, showExcerpt = true }: BlogPostCardProps) {
  const postHref = `/blog/${encodeURIComponent(post.slug)}`;

  return (
    <article className="blog-post-card">
      <Link href={postHref} className="blog-post-image-wrap">
        <BlogImage
          src={post.image}
          alt={post.title}
          width={380}
          height={200}
          className="blog-post-image"
        />
      </Link>
      <div className="blog-post-body">
        <h3>
          <Link href={postHref}>{post.title}</Link>
        </h3>
        <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
        {showExcerpt ? <p className="blog-post-excerpt">{post.excerpt}</p> : null}
        <Link href={postHref} className="blog-post-link">
          Read article →
        </Link>
      </div>
    </article>
  );
}
