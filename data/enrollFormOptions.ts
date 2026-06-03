import { germanCourses } from "./germanCourses";

export const batchScheduleOptions = [
  "Weekday Morning",
  "Weekday Evening",
  "Weekend",
];

export const enrollCourseLevels = germanCourses.map((course) => {
  const levelCode = course.slug.toUpperCase();
  const levelName = course.title.split(":")[1]?.trim() ?? course.title;

  return {
    slug: course.slug,
    label: `${levelCode} - ${levelName}`,
    title: course.title,
  };
});

export function getEnrollLevelBySlug(slug: string) {
  return enrollCourseLevels.find((level) => level.slug === slug) ?? enrollCourseLevels[0];
}
