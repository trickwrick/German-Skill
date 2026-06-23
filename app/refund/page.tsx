import type { Metadata } from "next";
import LegalPageContent from "../components/LegalPageContent";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Refund Policy | Fluent AUF",
  description: "Understand Fluent AUF refund terms for German language courses and enrollments.",
};

const paragraphs = [
  "Refund eligibility depends on the course selected, batch start date, and number of classes attended.",
  "If you need to cancel enrollment, please contact our team before the batch begins for the best available resolution.",
  "Approved refunds, when applicable, are processed to the original payment method within the timelines shared by our admissions team.",
  "For refund-related questions, email fluentauf@gmail.com or call +91 88269 67151 before enrolling.",
];

export default function RefundPage() {
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
