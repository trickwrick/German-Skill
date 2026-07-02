import type { Metadata } from "next";
import AllCoursesSection from "../components/AllCoursesSection";
import Navbar from "../components/Navbar";
import PageBanner from "../components/PageBanner";
import SiteFooter from "../components/SiteFooter";
import { getGermanCoursesForDisplay } from "../../lib/courseContentStore";
import { PUBLIC_REVALIDATE_SECONDS } from "../../lib/publicDataCache";

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "German Courses A1–C2 | Fluent AUF",
  description:
    "Explore Fluent AUF German language courses from A1 to C2 with live classes, certified tutors, and Goethe-focused preparation.",
  alternates: {
    canonical: "/courses",
  },
};

export default async function CoursesPage() {
  const courses = await getGermanCoursesForDisplay();

  return (
    <>
      <Navbar />
      <main>
        <PageBanner
          layout="stacked"
          title="All Courses"
          description="Choose the right German level for your goals — from beginner A1 to advanced C2."
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
