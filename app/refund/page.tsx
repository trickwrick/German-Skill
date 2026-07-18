import type { Metadata } from "next";
import LegalPageContent from "../components/LegalPageContent";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import { getLegalPageContent } from "../../lib/generalPageStore";
import { buildPageMetadata } from "../../lib/siteSeo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund Policy | Fluent AUF",
  description: "Understand Fluent AUF refund terms for German language courses and enrollments.",
  path: "/refund",
});

export default async function RefundPage() {
  const { html } = await getLegalPageContent("refund");

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          title="Refund Policy"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Refund Policy" },
          ]}
        />
        <LegalPageContent html={html} />
      </main>
      <SiteFooter />
    </>
  );
}
