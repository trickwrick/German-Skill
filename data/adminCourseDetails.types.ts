import type { CourseReview } from "./courseContent.types";
import type { CourseFlexibleBatches } from "./courseFlexibleBatches";
import type { GermanCourse } from "./germanCourses";

export type CourseFaqItem = {
  q: string;
  a: string;
};

export type CourseReviewsSummary = {
  average: string;
  total: number;
  breakdown: {
    stars: number;
    percent: number;
  }[];
  note: string;
};
  
export type CourseCurriculumSection = {
  title: string;
  topics: string[];
};

export type CourseDescriptionTab = {
  aboutCourse: string;
  objectivesLeft: string[];
  objectivesRight: string[];
  courseDescription: string[];
  goalsLessons: string[];
  curriculumSections: CourseCurriculumSection[];
  targetAudience: string[];
};

export type StoredCourseDetails = {
  slug: string;
  isCustom?: boolean;
  course: Partial<GermanCourse>;
  /** @deprecated Use descriptionTab.courseDescription */
  courseDescription?: string[];
  descriptionTab?: CourseDescriptionTab;
  faqs: CourseFaqItem[];
  reviewsSummary: CourseReviewsSummary;
  reviews: CourseReview[];
  flexibleBatches?: CourseFlexibleBatches;
  seoContent?: string;
  updatedAt: Date;
};

export type AdminCoursePayload = Partial<GermanCourse> & {
  descriptionTab: CourseDescriptionTab;
  faqs: CourseFaqItem[];
  reviewsSummary: CourseReviewsSummary;
  reviews: CourseReview[];
  flexibleBatches: CourseFlexibleBatches;
  seoContent?: string;
  /** Original stored slug when editing a custom course URL. */
  previousSlug?: string;
};

export const defaultReviewsSummary: CourseReviewsSummary = {
  average: "4.50",
  total: 0,
  breakdown: [
    { stars: 5, percent: 50 },
    { stars: 4, percent: 50 },
    { stars: 3, percent: 0 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
  ],
  note: "",
};

export const defaultFaqItem: CourseFaqItem = {
  q: "",
  a: "",
};

export const defaultReviewItem: CourseReview = {
  initials: "",
  name: "",
  date: "",
  rating: 5,
  text: "",
  color: "#6366f1",
};

export const reviewColorOptions = [
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#e31e24",
];

export const reviewRatingOptions = [5, 4.8, 4.6, 4.2, 4, 3, 2, 1];
