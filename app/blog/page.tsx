import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import BlogPageContent from "./_components/BlogPageContent";

export const metadata: Metadata = {
  title: "Blog | GermanSkill",
  description:
    "Read GermanSkill blogs on Goethe, Telc, study in Germany, APS, Uni Assist, and German language learning tips.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title="Blog"
          description="Explore guides, exam tips, and language learning insights from GermanSkill."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
        />
        <BlogPageContent />
      </main>
      <SiteFooter />
    </>
  );
}
