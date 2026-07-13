import type { CourseContent } from "../data/courseContent.types";
import type { CourseDescriptionTab, CourseCurriculumSection } from "../data/adminCourseDetails.types";
import { getCourseContent } from "../data/courseContents";

export const defaultCurriculumSection: CourseCurriculumSection = {
  title: "",
  topics: [],
};

export function emptyDescriptionTab(): CourseDescriptionTab {
  return {
    aboutCourse: "",
    objectivesLeft: [],
    objectivesRight: [],
    courseDescription: [],
    goalsLessons: [],
    curriculumSections: [{ ...defaultCurriculumSection }],
    targetAudience: [],
  };
}

export function descriptionTabFromContent(content: CourseContent): CourseDescriptionTab {
  return {
    aboutCourse: content.aboutCourse,
    objectivesLeft: content.objectivesLeft,
    objectivesRight: content.objectivesRight,
    courseDescription: content.courseDescription,
    goalsLessons: content.goalsLessons,
    curriculumSections: content.curriculumSections.map((section) => ({
      title: section.title,
      topics: [...section.topics],
    })),
    targetAudience: content.targetAudience,
  };
}

export function getDescriptionTabForSlug(slug: string): CourseDescriptionTab {
  const content = getCourseContent(slug);
  if (!content) {
    return emptyDescriptionTab();
  }

  return descriptionTabFromContent(content);
}

export function mergeDescriptionTab(
  slug: string,
  storedTab?: CourseDescriptionTab | null,
  legacyCourseDescription?: string[],
): CourseDescriptionTab {
  const fallback = getDescriptionTabForSlug(slug);

  if (!storedTab) {
    if (legacyCourseDescription?.length) {
      return {
        ...fallback,
        courseDescription: legacyCourseDescription,
      };
    }

    return fallback;
  }

  return {
    aboutCourse: storedTab.aboutCourse?.trim() ? storedTab.aboutCourse : fallback.aboutCourse,
    objectivesLeft: storedTab.objectivesLeft?.length
      ? storedTab.objectivesLeft
      : fallback.objectivesLeft,
    objectivesRight: storedTab.objectivesRight?.length
      ? storedTab.objectivesRight
      : fallback.objectivesRight,
    courseDescription: storedTab.courseDescription?.length
      ? storedTab.courseDescription
      : legacyCourseDescription?.length
        ? legacyCourseDescription
        : fallback.courseDescription,
    goalsLessons: storedTab.goalsLessons?.length ? storedTab.goalsLessons : fallback.goalsLessons,
    curriculumSections: storedTab.curriculumSections?.length
      ? storedTab.curriculumSections.map((section) => ({
          title: section.title,
          topics: section.topics.filter((topic) => topic.trim()),
        }))
      : fallback.curriculumSections,
    targetAudience: storedTab.targetAudience?.length
      ? storedTab.targetAudience
      : fallback.targetAudience,
  };
}

export function joinLines(items: string[]) {
  return items.join("\n");
}

export function splitLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function joinParagraphs(paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

export function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
