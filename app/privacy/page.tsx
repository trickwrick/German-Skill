import type { Metadata } from "next";
import LegalPageContent from "../components/LegalPageContent";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import { getLegalPageContent } from "../../lib/generalPageStore";
import { buildPageMetadata } from "../../lib/siteSeo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Fluent AUF",
  description: "Learn how Fluent AUF collects, uses, and protects your personal information.",
  path: "/privacy",
});

export default async function PrivacyPage() {
  const { html } = await getLegalPageContent("privacy");

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          title="Privacy Policy"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" },
          ]}
        />
        <LegalPageContent html={html} />
      </main>
      <SiteFooter />
    </>
  );
}
