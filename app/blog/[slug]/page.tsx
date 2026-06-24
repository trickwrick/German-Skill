import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import { formatBlogDate } from "../../../data/blogPosts";
import { getBlogPosts, getBlogPostBySlug } from "../../../lib/blogStore";

type BlogDetailPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: "Blog | Fluent AUF" };
  }

  return {
    title: post.seo?.metaTitle || `${post.title} | Fluent AUF Blog`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.metaKeyword,
    // Note: We're not using otherMeta here directly as Next.js Metadata API handles specific keys.
    // If otherMeta contains HTML tags, they'd need to be injected via layout or dangerouslySetInnerHTML elsewhere,
    // but for now title, description, and keywords are the most important.
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title={post.title}
          description={post.excerpt}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <article className="blog-detail">
          <div className="blog-detail-inner">
            <div className="blog-detail-meta">
              <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              <span>{post.author}</span>
            </div>

            <div className="blog-detail-image-wrap">
              <Image
                src={post.image}
                alt=""
                width={960}
                height={540}
                className="blog-detail-image"
                priority
              />
            </div>

            <div className="blog-detail-content">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <>
                  <p>{post.excerpt}</p>
                  <p>
                    Full article content will be added soon. For course guidance or exam
                    preparation support, reach out to our team.
                  </p>
                </>
              )}
              
              {post.faqs && post.faqs.length > 0 && (
                <div className="blog-faqs" style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#333' }}>Frequently Asked Questions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {post.faqs.map((faq, index) => (
                      <details key={index} style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', cursor: 'pointer' }}>
                        <summary style={{ fontWeight: 'bold', color: '#3b5998', fontSize: '1.1rem' }}>
                          {faq.question}
                        </summary>
                        <div 
                          style={{ marginTop: '0.5rem', color: '#555', lineHeight: '1.6' }}
                          dangerouslySetInnerHTML={{ __html: faq.answer }} 
                        />
                      </details>
                    ))}
                  </div>
                </div>
              )}
              
              <Link href="/contact" className="btn btn-primary blog-detail-cta">
                Contact Us
              </Link>
            </div>

            <Link href="/blog" className="blog-detail-back">
              ← Back to all blogs
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
