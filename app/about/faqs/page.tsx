import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import FaqsContent from "./_components/FaqsContent";
import JsonLd from "../../components/JsonLd";
import { faqItems } from "../../../data/faqsContent";
import { buildFaqSchema, buildPageMetadata } from "../../../lib/siteSeo";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQs | Fluent AUF",
  description:
    "Find answers about German courses, Goethe, Telc, ÖSD exams, batches, fees, and policies at Fluent AUF.",
  path: "/about/faqs",
});

export default function FaqsPage() {
  const faqSchema = buildFaqSchema(
    faqItems.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <>
      <JsonLd data={[faqSchema]} />
      <Navbar />
      <main>
        <FaqsContent />
      </main>
      <SiteFooter />
    </>
  );
}