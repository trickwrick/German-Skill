import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import BlogPageContent from "./_components/BlogPageContent";
import { getBlogPosts } from "../../lib/blogStore";

export const metadata: Metadata = {
  title: "Blog | Fluent AUF",
  description:
    "Read Fluent AUF blogs on Goethe, Telc, study in Germany, APS, Uni Assist, and German language learning tips.",
};

export default async function BlogPage() {
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
        <BlogPageContent posts={posts} />
      </main>
      <SiteFooter />
    </>
  );
}
