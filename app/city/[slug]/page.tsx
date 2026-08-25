import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import CityPageContent from "./_components/CityPageContent";
import { buildCityPagePath } from "../../../lib/cityPageUtils";
import { getCityPageBySlug, getCityPagesForDisplay } from "../../../lib/cityPageStore";
import { getGermanCoursesForDisplay } from "../../../lib/courseContentStore";
import { getGermanLanguageCoursePageContent } from "../../../lib/generalPageStore";
import { getActiveHomeFaqItems } from "../../../lib/homeFaqStore";
import { getVideoTestimonials } from "../../../lib/videoTestimonialStore";
import { buildPageMetadata } from "../../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../../lib/publicDataCache";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  try {
    const pages = await getCityPagesForDisplay();
    return pages.map((page) => ({ slug: page.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getCityPageBySlug(params.slug);
  if (!page) {
    return buildPageMetadata({
      title: "City Page Not Found | Fluent AUF",
      description: "The requested city page could not be found.",
      path: "/city",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: page.seo.metaTitle || `${page.title} | Fluent AUF`,
    description: page.seo.metaDescription || page.heroDescription,
    path: buildCityPagePath(page.slug),
    keywords: page.seo.metaKeyword,
  });
}

export default async function CityPublicPage({ params }: PageProps) {
  const page = await getCityPageBySlug(params.slug);
  if (!page) {
    notFound();
  }

  const [courses, videoTestimonials, homeFaqs, coursesPage] = await Promise.all([
    getGermanCoursesForDisplay(),
    getVideoTestimonials(),
    getActiveHomeFaqItems(),
    getGermanLanguageCoursePageContent(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <CityPageContent
          page={page}
          courses={courses}
          videoTestimonials={videoTestimonials}
          homeFaqs={homeFaqs}
          coursesSectionTitle={coursesPage.sectionTitle}
          coursesSectionDescription={coursesPage.sectionDescription}
        />
      </main>
      <SiteFooter />
    </>
  );
}
