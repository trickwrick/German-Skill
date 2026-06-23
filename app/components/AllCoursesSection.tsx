import Link from "next/link";
import CourseImage from "./CourseImage";
import { getCourseHref, type GermanCourse } from "../../data/germanCourses";

type AllCoursesSectionProps = {
  courses: GermanCourse[];
};

export default function AllCoursesSection({ courses }: AllCoursesSectionProps) {
  return (
    <section className="all-courses-section">
      <div className="all-courses-inner">
        <h2 className="all-courses-title">All Courses</h2>
        <p className="all-courses-subtitle">
          Take your language skills to the next level with our dynamic and engaging courses in the
          German category, designed to meet the needs of learners at every stage.
        </p>

        <div className="all-courses-grid">
          {courses.map((course) => {
            const courseHref = getCourseHref(course);

            return (
              <Link key={course.slug} href={courseHref} className="course-card">
                <span className="course-card-image-wrap">
                  <CourseImage
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="course-card-image"
                  />
                </span>
                <div className="course-card-body">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-card-footer">
                    <span className="course-hours">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {course.learningHours ?? course.hours}
                    </span>
                    <span className="course-price">{course.price}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
