import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import CareersContent from "./_components/CareersContent";
import { buildPageMetadata } from "../../../lib/siteSeo";

export const metadata: Metadata = buildPageMetadata({
  title: "Apply Job | Fluent AUF",
  description:
    "Join Fluent AUF — build a rewarding career in German language education. Grow, lead, and thrive with our team.",
  path: "/about/careers",
});

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title="Apply Job"
          description="Build a career that's fun and fulfilling. Grow, lead, and thrive with Fluent AUF."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Apply Job" },
          ]}
        />

        <CareersContent />
      </main>
      <SiteFooter />
    </>
  );
}
