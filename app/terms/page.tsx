import type { Metadata } from "next";
import LegalPageContent from "../components/LegalPageContent";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import { getLegalPageContent } from "../../lib/generalPageStore";
import { buildPageMetadata } from "../../lib/siteSeo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions | Fluent AUF",
  description: "Read the terms and conditions for Fluent AUF German language courses and services.",
  path: "/terms",
});

export default async function TermsPage() {
  const { paragraphs } = await getLegalPageContent("terms");

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          title="Terms & Conditions"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Terms & Conditions" },
          ]}
        />
        <LegalPageContent paragraphs={paragraphs} />
      </main>
      <SiteFooter />
    </>
  );
}
