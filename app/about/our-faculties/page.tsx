import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import PageBanner from "../../components/PageBanner";
import SiteFooter from "../../components/SiteFooter";
import OurFacultiesContent from "./_components/OurFacultiesContent";
import { buildPageMetadata } from "../../../lib/siteSeo";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Faculties | Fluent AUF",
  description:
    "Meet the certified German language trainers and faculty at Fluent AUF — experienced mentors for A1 to C2 levels.",
  path: "/about/our-faculties",
});

export default function OurFacultiesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          variant="brand"
          title="Our Faculties"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Our Faculties" },
          ]}
        />
        <OurFacultiesContent />
      </main>
      <SiteFooter />
    </>
  );
}
