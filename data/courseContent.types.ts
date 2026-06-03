export type CourseReview = {
  initials: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  color: string;
};

export type CourseContent = {
  sidebarPrice: string;
  includes: string[];
  instructor: {
    name: string;
    image: string;
  };
  aboutCourse: string;
  objectivesLeft: string[];
  objectivesRight: string[];
  courseDescription: string[];
  goalsLessons: string[];
  curriculumSections: {
    title: string;
    topics: string[];
  }[];
  targetAudience: string[];
  faqs: {
    q: string;
    a: string;
  }[];
  reviewsSummary: {
    average: string;
    total: number;
    breakdown: {
      stars: number;
      percent: number;
    }[];
    note: string;
  };
  reviews: CourseReview[];
};
