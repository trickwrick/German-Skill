import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import OurCompanyContent from "./_components/OurCompanyContent";
import { getOurCompanyPageContent } from "../../../lib/generalPageStore";
import { buildPageMetadata } from "../../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../../lib/publicDataCache";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export const metadata: Metadata = buildPageMetadata({
  title: "Our Company | Fluent AUF",
  description:
    "Learn about Fluent AUF — our mission, journey, and commitment to quality German language education since 2013.",
  path: "/about/our-company",
});

export default async function OurCompanyPage() {
  const content = await getOurCompanyPageContent();

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

        <OurCompanyContent content={content} />
      </main>
      <SiteFooter />
    </>
  );
}
