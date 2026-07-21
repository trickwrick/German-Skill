import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import BlogPageContent from "../blog/_components/BlogPageContent";
import BlogSidebar from "../blog/_components/BlogSidebar";
import { getBlogPosts } from "../../lib/blogStore";
import { filterBlogPostsByCategory } from "../../lib/blogUtils";
import { buildPageMetadata } from "../../lib/siteSeo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog | Fluent AUF",
  description:
    "Read Fluent AUF blogs on Goethe, Telc, study in Germany, APS, Uni Assist, and German language learning tips.",
  path: "/blogs",
  keywords: "Learn German, German Grammar, Study in Germany, Goethe-Zertifikat Prep",
});

type BlogsPageProps = {
  searchParams?: { category?: string };
};

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const posts = await getBlogPosts({ fresh: true });
  const activeCategory = searchParams?.category?.trim();
  const filteredPosts = filterBlogPostsByCategory(posts, activeCategory);

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
            <div className="blog-layout-main">
              <BlogPageContent posts={filteredPosts} activeCategory={activeCategory} />
            </div>
            <BlogSidebar posts={posts} activeCategory={activeCategory} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
