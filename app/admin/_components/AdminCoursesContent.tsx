import Link from "next/link";
import { getCourseLevelLabel } from "../../../data/adminCourseLevels";
import { germanCourses, getCourseHref } from "../../../data/germanCourses";

export default function AdminCoursesContent() {
  return (
    <div className="adm-courses">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Courses</h1>
          <p className="adm-page-subtitle">
            Manage German language courses, pricing, and course page details.
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
            <p className="adm-stat-value">{germanCourses.length}</p>
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
            <p className="adm-stat-value">{germanCourses.length}</p>
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
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {germanCourses.map((course) => (
                <tr key={course.slug}>
                  <td>
                    <div className="adm-course-cell">
                      <strong>{course.title}</strong>
                      <span>{course.pathName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="adm-badge">{course.slug.toUpperCase()}</span>
                    <span className="adm-course-level">{getCourseLevelLabel(course.slug)}</span>
                  </td>
                  <td>{course.price}</td>
                  <td>{course.hours}</td>
                  <td>
                    <span className="adm-status adm-status-live">Live</span>
                  </td>
                  <td>
                    <div className="adm-table-actions">
                      <Link href={getCourseHref(course)} className="adm-table-link" target="_blank">
                        View
                      </Link>
                      <Link href={`/admin/courses/${course.slug}/edit`} className="adm-table-link">
                        Edit
                      </Link>
                    </div>
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
