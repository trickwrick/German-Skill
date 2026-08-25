import type { Metadata } from "next";
import AllCoursesSection from "../components/AllCoursesSection";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import { defaultGermanLanguageCourseContent } from "../../data/generalPages";
import { getGermanCoursesForDisplay } from "../../lib/courseContentStore";
import { getGermanLanguageCoursePageContent } from "../../lib/generalPageStore";
import { buildPageMetadata } from "../../lib/siteSeo";
import { PUBLIC_REVALIDATE_SECONDS } from "../../lib/publicDataCache";
import { COURSES_PAGE_PATH } from "../../lib/sitePaths";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGermanLanguageCoursePageContent();
  const seo = page.seo ?? defaultGermanLanguageCourseContent.seo;

  return buildPageMetadata({
    title: seo.metaTitle?.trim() || defaultGermanLanguageCourseContent.seo.metaTitle,
    description:
      seo.metaDescription?.trim() || defaultGermanLanguageCourseContent.seo.metaDescription,
    path: COURSES_PAGE_PATH,
    keywords: seo.metaKeyword?.trim() || defaultGermanLanguageCourseContent.seo.metaKeyword,
  });
}

export default async function CoursesPage() {
  const [courses, page] = await Promise.all([
    getGermanCoursesForDisplay(),
    getGermanLanguageCoursePageContent(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title={page.pageTitle?.trim() || defaultGermanLanguageCourseContent.pageTitle}
          description={
            page.pageDescription?.trim() || defaultGermanLanguageCourseContent.pageDescription
          }
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Courses" },
          ]}
        />
        <AllCoursesSection courses={courses} />
      </main>
      <SiteFooter />
    </>
  );
}
