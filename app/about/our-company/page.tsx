import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import OurCompanyContent from "./_components/OurCompanyContent";

export const metadata: Metadata = {
  title: "Our Company | Fluent AUF",
  description:
    "Learn about Fluent AUF — our mission, journey, and commitment to quality German language education since 2013.",
};

export default function OurCompanyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          variant="brand"
          title="Our Company"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Our Company" },
          ]}
        />

        <OurCompanyContent />
      </main>
      <SiteFooter />
    </>
  );
}
