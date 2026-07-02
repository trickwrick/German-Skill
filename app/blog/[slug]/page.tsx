import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import BlogImage from "../../components/BlogImage";
import BlogSidebar from "../_components/BlogSidebar";
import { formatBlogDate } from "../../../data/blogPosts";
import { getBlogPostBySlug, getBlogPosts } from "../../../lib/blogStore";
import { normalizeBlogHtml } from "../../../lib/blogHtmlUtils";

export const dynamic = "force-dynamic";

type BlogDetailPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Blog | Fluent AUF" };
  }

  return {
    title: post.seo?.metaTitle || `${post.title} | Fluent AUF Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.metaKeyword || undefined,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const slug = decodeURIComponent(params.slug);
  const [post, posts] = await Promise.all([getBlogPostBySlug(slug), getBlogPosts()]);

  if (!post) {
    notFound();
  }

  const primaryCategory = post.categories?.[0]?.trim();

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title="Blog"
          description="Guides, exam tips, and language learning insights."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <article className="blog-detail">
          <div className="blog-detail-inner blog-layout">
            <div className="blog-layout-main">
              <header className="blog-detail-header">
                <h1>{post.title}</h1>
              </header>

              <div className="blog-detail-image-wrap">
                <BlogImage
                  src={post.image}
                  alt={post.title}
                  width={960}
                  height={540}
                  className="blog-detail-image"
                  priority
                />
              </div>

              <div className="blog-detail-post-meta">
                {primaryCategory ? (
                  <Link
                    href={`/blog?category=${encodeURIComponent(primaryCategory)}`}
                    className="blog-detail-category"
                  >
                    {primaryCategory}
                  </Link>
                ) : (
                  <span className="blog-detail-category-fallback">Blog</span>
                )}
                <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              </div>

              <div className="blog-detail-content blog-prose">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: normalizeBlogHtml(post.content) }} />
                ) : (
                  <>
                    <p>{post.excerpt}</p>
                    <p>
                      Full article content will be added soon. For course guidance or exam
                      preparation support, reach out to our team.
                    </p>
                  </>
                )}

                {post.faqs && post.faqs.length > 0 ? (
                  <section className="blog-faqs">
                    <h2>FAQ&apos;s</h2>
                    <div className="blog-faq-list">
                      {post.faqs.map((faq, index) => (
                        <details key={index} className="blog-faq-item">
                          <summary>{faq.question}</summary>
                          <div
                            className="blog-faq-answer blog-prose"
                            dangerouslySetInnerHTML={{ __html: normalizeBlogHtml(faq.answer) }}
                          />
                        </details>
                      ))}
                    </div>
                  </section>
                ) : null}

                {post.tags && post.tags.length > 0 ? (
                  <section className="blog-detail-tags">
                    <h2>Tags</h2>
                    <div className="blog-detail-tags-list">
                      {post.tags.map((tag) => (
                        <span key={tag} className="blog-detail-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}

                <div className="blog-detail-actions">
                  <Link href="/contact" className="btn btn-primary blog-detail-cta">
                    Contact Us
                  </Link>
                  <Link href="/blog" className="blog-detail-back">
                    ← Back to all blogs
                  </Link>
                </div>
              </div>
            </div>

            <BlogSidebar posts={posts} currentSlug={post.slug} />
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
