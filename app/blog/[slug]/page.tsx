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
    title: `${post.title} | Fluent AUF Blog`,
    description: post.excerpt,
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
