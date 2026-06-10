import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import FaqsContent from "./_components/FaqsContent";

export const metadata: Metadata = {
  title: "FAQs | Fluent AUF",
  description:
    "Find answers about German courses, Goethe, Telc, ÖSD exams, batches, fees, and policies at Fluent AUF.",
};

export default function FaqsPage() {
  return (
    <>
      <Navbar />
      <main>
        <FaqsContent />
      </main>
      <SiteFooter />
    </>
  );
}
