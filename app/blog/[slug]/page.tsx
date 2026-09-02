import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import BlogImage from "../../components/BlogImage";
import BlogSidebar from "../_components/BlogSidebar";
import BlogPromoBanner from "../_components/BlogPromoBanner";
import { formatBlogDate } from "../../../data/blogPosts";
import { getCachedBlogPostBySlug, getCachedBlogPosts } from "../../../lib/cachedBlogReads";
import { sanitizeBlogHtml, sanitizeFaqAnswer } from "../../../lib/blogHtmlUtils";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPageMetadata,
} from "../../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../../lib/publicDataCache";
import JsonLd from "../../components/JsonLd";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

type BlogDetailPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const post = await getCachedBlogPostBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Blog | Fluent AUF",
      description: "Read German language learning tips and exam guidance on the Fluent AUF blog.",
      path: "/blogs",
    });
  }

  const title = post.seo?.metaTitle || `${post.title} | Fluent AUF Blog`;
  const description = post.seo?.metaDescription || post.excerpt;

  return buildPageMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    keywords: post.seo?.metaKeyword || undefined,
    ogType: "article",
    ogImage: post.image || undefined,
    ogImageAlt: `${post.title} — Fluent AUF Blog`,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const slug = decodeURIComponent(params.slug);
  const [post, posts] = await Promise.all([
    getCachedBlogPostBySlug(slug),
    getCachedBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const primaryCategory = post.categories?.[0]?.trim();
  const blogSchema = [
    buildArticleSchema({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      image: post.image,
      datePublished: post.date,
      author: post.author,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blogs" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
    buildFaqSchema(
      (post.faqs ?? []).map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
    ),
  ];

  return (
    <>
      <JsonLd data={blogSchema} />
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title={post.title}
          description={post.excerpt}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blogs" },
            { label: post.title },
          ]}
        />

        <article className="blog-detail">
          <div className="blog-detail-inner blog-layout">
            <div className="blog-layout-main">
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
                    href={`/blogs?category=${encodeURIComponent(primaryCategory)}`}
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
                  <div dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }} />
                ) : (
                  <>
                    <p>{post.excerpt}</p>
                    <p>
                      Full article content will be added soon. For course guidance or exam
                      preparation support, reach out to our team.
                    </p>
                  </>
                )}

                <BlogPromoBanner />

                {post.faqs && post.faqs.length > 0 ? (
                  <section className="blog-faqs">
                    <h2>FAQ&apos;s</h2>
                    <div className="blog-faq-list">
                      {post.faqs.map((faq, index) => (
                        <details key={index} className="blog-faq-item">
                          <summary>{faq.question}</summary>
                          <div
                            className="blog-faq-answer blog-prose"
                            dangerouslySetInnerHTML={{ __html: sanitizeFaqAnswer(faq.answer) }}
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
                  <Link href="/blogs" className="blog-detail-back">
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
