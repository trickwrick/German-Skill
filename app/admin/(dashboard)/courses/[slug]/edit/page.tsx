import Link from "next/link";
import { notFound } from "next/navigation";
import AdminCourseForm from "../../../../_components/AdminCourseForm";
import { getCourseContent, getCourseContentForCourse } from "../../../../../../data/courseContents";
import { isStaticCourseSlug } from "../../../../../../data/germanCourses";
import {
  getCourseBySlugAsync,
  getCourseEditableDetails,
  getStoredCourseDetails,
  mergeStoredCourse,
} from "../../../../../../lib/courseContentStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditCoursePageProps = {
  params: { slug: string };
};

export default async function AdminEditCoursePage({ params }: EditCoursePageProps) {
  const course = await getCourseBySlugAsync(params.slug);

  if (!course) {
    notFound();
  }

  const isCustomCourse = !isStaticCourseSlug(params.slug);
  const content = getCourseContent(params.slug) ?? getCourseContentForCourse(course);
  const editable = await getCourseEditableDetails(params.slug);
  const stored = await getStoredCourseDetails(params.slug);

  return (
    <div className="adm-courses">
      <div className="adm-page-head">
        <div>
          <Link href="/admin/courses" className="adm-breadcrumb">
            ← Back to Courses
          </Link>
          <h1 className="adm-page-title">Edit Course</h1>
          <p className="adm-page-subtitle">
            Update course details, FAQ, and reviews for {course.title}.
          </p>
        </div>
      </div>

      <AdminCourseForm
        mode="edit"
        lockedSlug={params.slug}
        isCustomCourse={isCustomCourse}
        initialValues={mergeStoredCourse(course, stored?.course)}
        descriptionPreview={content?.courseDescription ?? []}
        initialFaqs={editable.faqs}
        initialReviewsSummary={editable.reviewsSummary}
        initialReviews={editable.reviews}
        initialFlexibleBatches={editable.flexibleBatches}
      />
    </div>
  );
}
