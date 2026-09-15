import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import CareersContent from "./_components/CareersContent";
import { getApplyJobPageContent } from "../../../lib/generalPageStore";
import { buildPageMetadata } from "../../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../../lib/publicDataCache";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  const applyJob = await getApplyJobPageContent();
  const seo = applyJob?.seo;

  return buildPageMetadata({
    title: seo?.metaTitle?.trim() || "Apply Job | Fluent AUF",
    description:
      seo?.metaDescription?.trim() ||
      "Join Fluent AUF — build a rewarding career in German language education. Grow, lead, and thrive with our team.",
    path: "/about/apply-job",
    keywords:
      seo?.metaKeyword?.trim() ||
      "German tutor jobs, online German teacher, teach German online, Fluent AUF careers",
  });
}

export default async function CareersPage() {
  const applyJob = await getApplyJobPageContent();
  const applyJobHtml = applyJob?.html?.trim() ? applyJob.html : "";

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

        <CareersContent applyJobHtml={applyJobHtml} />
      </main>
      <SiteFooter />
    </>
  );
}
