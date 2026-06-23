import type { Metadata } from "next";
import LegalPageContent from "../components/LegalPageContent";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | Fluent AUF",
  description: "Learn how Fluent AUF collects, uses, and protects your personal information.",
};

const paragraphs = [
  "Fluent AUF collects information such as your name, email address, phone number, and course preferences when you submit enquiry or enrollment forms.",
  "We use this information to contact you about classes, batches, demos, and support related to your German learning journey.",
  "Your details are not sold to third parties. Information may be shared only with trusted service providers required to operate our website, communication tools, or payment systems.",
  "You may request correction or deletion of your contact details by writing to fluentauf@gmail.com.",
];

export default function PrivacyPage() {
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
        <LegalPageContent paragraphs={paragraphs} />
      </main>
      <SiteFooter />
    </>
  );
}
