import type { Metadata } from "next";
import LegalPageContent from "../components/LegalPageContent";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions | Fluent AUF",
  description: "Read the terms and conditions for Fluent AUF German language courses and services.",
};

const paragraphs = [
  "By enrolling in Fluent AUF courses or using our website, you agree to follow our class schedules, payment terms, and communication guidelines.",
  "Course access, batch timings, and study material are provided as per the selected program. Students are expected to attend live sessions regularly and maintain respectful conduct during classes.",
  "Fluent AUF may update course content, faculty assignments, or batch schedules when required for academic quality or operational reasons.",
  "For questions about these terms, contact us at fluentauf@gmail.com or +91 88269 67151.",
];

export default function TermsPage() {
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
