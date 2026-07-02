import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import BlogPageContent from "./_components/BlogPageContent";
import BlogSidebar from "./_components/BlogSidebar";
import { getBlogPosts } from "../../lib/blogStore";
import { filterBlogPostsByCategory } from "../../lib/blogUtils";

import { PUBLIC_REVALIDATE_SECONDS } from "../../lib/publicDataCache";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Blog | Fluent AUF",
  description:
    "Read Fluent AUF blogs on Goethe, Telc, study in Germany, APS, Uni Assist, and German language learning tips.",
};

type BlogPageProps = {
  searchParams?: { category?: string };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getBlogPosts();
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
