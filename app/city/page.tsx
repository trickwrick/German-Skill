import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import { getCityPagesForDisplay } from "../../lib/cityPageStore";
import { buildCityPagePath } from "../../lib/cityPageUtils";
import { buildPageMetadata } from "../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../lib/publicDataCache";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export const metadata: Metadata = buildPageMetadata({
  title: "German Classes by City | Fluent AUF",
  description:
    "Explore Fluent AUF German classes for learners across India. Find live online A1–C2 courses for your city.",
  path: "/city",
});

export default async function CityIndexPage() {
  const pages = await getCityPagesForDisplay();

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title="German Classes by City"
          description="Choose your city and start learning German online with Fluent AUF."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cities" },
          ]}
        />

        <section className="city-index">
          <div className="city-index-inner">
            {pages.length === 0 ? (
              <p className="city-index-empty">City pages will appear here soon.</p>
            ) : (
              <div className="city-index-grid">
                {pages.map((page) => (
                  <Link key={page.slug} href={buildCityPagePath(page.slug)} className="city-index-card">
                    <span className="city-index-card-label">German Classes</span>
                    <strong>{page.cityName}</strong>
                    <p>{page.subtitle}</p>
                    <span className="city-index-card-link">View page →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
