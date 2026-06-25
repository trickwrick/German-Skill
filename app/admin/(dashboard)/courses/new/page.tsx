import Link from "next/link";
import AdminCourseForm from "../../../_components/AdminCourseForm";
import { defaultFaqItem, defaultReviewsSummary } from "../../../../../data/adminCourseDetails.types";
import { getDefaultFlexibleBatches } from "../../../../../data/courseFlexibleBatches";

export default function AdminAddCoursePage() {
  return (
    <div className="adm-courses">
      <div className="adm-page-head">
        <div>
          <Link href="/admin/courses" className="adm-breadcrumb">
            ← Back to Courses
          </Link>
          <h1 className="adm-page-title">Add New Course</h1>
          <p className="adm-page-subtitle">
            Add a new course besides A1–C2. To edit German A1, A2, B1, B2, C1, or C2, go back and
            use Edit on that course in the list.
          </p>
        </div>
      </div>

      <AdminCourseForm
        mode="create"
        initialFaqs={[{ ...defaultFaqItem }]}
        initialReviewsSummary={defaultReviewsSummary}
        initialReviews={[]}
        initialFlexibleBatches={getDefaultFlexibleBatches()}
      />
    </div>
  );
}
