import Link from "next/link";
import AdminCourseForm from "../../../_components/AdminCourseForm";
import { defaultFaqItem, defaultReviewsSummary } from "../../../../../data/adminCourseDetails.types";

export default function AdminAddCoursePage() {
  return (
    <div className="adm-courses">
      <div className="adm-page-head">
        <div>
          <Link href="/admin/courses" className="adm-breadcrumb">
            ← Back to Courses
          </Link>
          <h1 className="adm-page-title">Add Course</h1>
          <p className="adm-page-subtitle">
            Create a new German course with pricing, FAQ, and reviews.
          </p>
        </div>
      </div>

      <AdminCourseForm
        mode="create"
        initialFaqs={[{ ...defaultFaqItem }]}
        initialReviewsSummary={defaultReviewsSummary}
        initialReviews={[]}
      />
    </div>
  );
}
