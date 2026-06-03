import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import { blogPosts, formatBlogDate } from "../../../data/blogPosts";

type BlogDetailPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogDetailPageProps): Metadata {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) {
    return { title: "Blog | GermanSkill" };
  }

  return {
    title: `${post.title} | GermanSkill Blog`,
    description: post.excerpt,
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = blogPosts.find((item) => item.slug === params.slug);

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
              <p>{post.excerpt}</p>
              <p>
                Full article content will be added soon. For course guidance or exam
                preparation support, reach out to our team.
              </p>
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
