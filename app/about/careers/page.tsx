import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import CareersContent from "./_components/CareersContent";

export const metadata: Metadata = {
  title: "Careers | Fluent AUF",
  description:
    "Join Fluent AUF — build a rewarding career in German language education. Grow, lead, and thrive with our team.",
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title="Careers"
          description="Build a career that's fun and fulfilling. Grow, lead, and thrive with Fluent AUF."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Careers" },
          ]}
        />

        <CareersContent />
      </main>
      <SiteFooter />
    </>
  );
}
