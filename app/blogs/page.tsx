import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import BlogListing from "../blog/_components/BlogListing";
import BlogPageContent from "../blog/_components/BlogPageContent";
import BlogSidebar from "../blog/_components/BlogSidebar";
import { getBlogPosts } from "../../lib/blogStore";
import { buildPageMetadata } from "../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../lib/publicDataCache";

/** Blog list uses a shorter ISR window so recovered Mongo data shows up faster. */
export const revalidate = Math.min(PUBLIC_REVALIDATE_SECONDS, 60);

export const metadata: Metadata = buildPageMetadata({
  title: "Blog | Fluent AUF",
  description:
    "Read Fluent AUF blogs on Goethe, Telc, study in Germany, APS, Uni Assist, and German language learning tips.",
  path: "/blogs",
  keywords: "Learn German, German Grammar, Study in Germany, Goethe-Zertifikat Prep",
});

function BlogListingFallback({ posts }: { posts: Awaited<ReturnType<typeof getBlogPosts>> }) {
  return (
    <>
      <div className="blog-layout-main">
        <BlogPageContent posts={posts} />
      </div>
      <BlogSidebar posts={posts} />
    </>
  );
}

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title="Blog"
          description="Explore guides, exam tips, and language learning insights from Fluent AUF."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
        />
        <section className="blog-page-section">
          <div className="blog-page-inner blog-layout">
            <Suspense fallback={<BlogListingFallback posts={posts} />}>
              <BlogListing posts={posts} />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
