import Image from "next/image";
import Link from "next/link";
import { formatBlogDate, type BlogPost } from "../../data/blogPosts";

type BlogPostCardProps = {
  post: BlogPost;
  showExcerpt?: boolean;
};

export default function BlogPostCard({ post, showExcerpt = true }: BlogPostCardProps) {
  return (
    <article className="blog-post-card">
      <Link href={`/blog/${post.slug}`} className="blog-post-image-wrap">
        <Image
          src={post.image}
          alt=""
          width={380}
          height={200}
          className="blog-post-image"
        />
      </Link>
      <div className="blog-post-body">
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
        {showExcerpt && <p className="blog-post-excerpt">{post.excerpt}</p>}
        <Link href={`/blog/${post.slug}`} className="blog-post-link">
          Read article →
        </Link>
      </div>
    </article>
  );
}
