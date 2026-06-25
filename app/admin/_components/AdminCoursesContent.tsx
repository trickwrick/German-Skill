import Link from "next/link";
import { getCourseLevelLabel } from "../../../data/adminCourseLevels";
import { isStaticCourseSlug, type GermanCourse } from "../../../data/germanCourses";
import AdminCourseActions from "./AdminCourseActions";

type AdminCoursesContentProps = {
  courses: GermanCourse[];
};

export default function AdminCoursesContent({ courses }: AdminCoursesContentProps) {
  return (
    <div className="adm-courses">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Courses</h1>
          <p className="adm-page-subtitle">
            A1–C2 courses are always available. Use Edit to update them, or Add Course for a new one.
          </p>
        </div>
        <Link href="/admin/courses/new" className="adm-btn adm-btn-primary">
          + Add Course
        </Link>
      </div>

      <div className="adm-stat-grid adm-courses-stats">
        <article className="adm-stat-card">
          <div>
            <p className="adm-stat-label">Total Courses</p>
            <p className="adm-stat-value">{courses.length}</p>
          </div>
        </article>
        <article className="adm-stat-card">
          <div>
            <p className="adm-stat-label">Active Levels</p>
            <p className="adm-stat-value">A1 – C2</p>
          </div>
        </article>
        <article className="adm-stat-card">
          <div>
            <p className="adm-stat-label">Live on Website</p>
            <p className="adm-stat-value">{courses.length}</p>
          </div>
        </article>
      </div>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">All Courses</h2>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Level</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.slug}>
                  <td>
                    <div className="adm-course-cell">
                      <strong>{course.title}</strong>
                      <span>{course.pathName}</span>
                    </div>
                  </td>
                  <td>
                    {isStaticCourseSlug(course.slug) ? (
                      <>
                        <span className="adm-badge">{course.slug.toUpperCase()}</span>
                        <span className="adm-course-level">{getCourseLevelLabel(course.slug)}</span>
                      </>
                    ) : (
                      <span className="adm-badge adm-badge-custom">Custom</span>
                    )}
                  </td>
                  <td>{course.price}</td>
                  <td>{course.learningHours ?? course.hours}</td>
                  <td>
                    <span className="adm-status adm-status-live">Live</span>
                  </td>
                  <td>
                    <AdminCourseActions course={course} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
