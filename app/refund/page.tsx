import type { Metadata } from "next";
import LegalPageContent from "../components/LegalPageContent";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import { getLegalPageContent } from "../../lib/generalPageStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Refund Policy | Fluent AUF",
  description: "Understand Fluent AUF refund terms for German language courses and enrollments.",
};

export default async function RefundPage() {
  const { paragraphs } = await getLegalPageContent("refund");

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
        <LegalPageContent paragraphs={paragraphs} />
      </main>
      <SiteFooter />
    </>
  );
}
