import type { CourseContent } from "./courseContent.types";
import { a1CourseContent } from "./germanA1Content";
import { a2CourseContent } from "./germanA2Content";
import { getCourseBySlug, type GermanCourse } from "./germanCourses";

function levelLabel(slug: string) {
  return slug.toUpperCase();
}

function createPlaceholderContent(course: GermanCourse): CourseContent {
  const level = levelLabel(course.slug);
  const hours = course.learningHours ?? course.hours.replace(" +", "");
  const reviewCount = Number(course.reviewCount ?? "0");

  return {
    sidebarPrice: course.price,
    includes: [
      `${hours} Learning`,
      "Discussion with Instructor",
      "Access - Mobile, Tablet or Offline",
    ],
    instructor: {
      name: "Khushi Sharma",
      image: "/tutors/khushi-sharma.jpg",
    },
    aboutCourse: course.description,
    objectivesLeft: [
      `Become competent in German ${level} level`,
      "Strengthen grammar, vocabulary, and speaking skills",
      "Practice real-life German conversations",
      "Build confidence for official certification exams",
      "Learn with structured modules and expert guidance",
      "Improve listening and writing through guided exercises",
    ],
    objectivesRight: [
      "Master key grammar topics for this level",
      "Expand vocabulary for everyday and professional use",
      "Prepare for speaking and writing assessments",
      "Understand German culture and communication style",
      "Track progress with quizzes and practice tasks",
      "Get lifetime access to course materials",
    ],
    courseDescription: [
      `Learn German ${level} with experienced native trainers at Fluent AUF.`,
      "This course follows a structured curriculum designed for steady progress from fundamentals to advanced communication.",
      "Content for this page will be updated soon. Contact us for batch details, syllabus, and enrollment.",
    ],
    goalsLessons: [
      `Become fully competent in German ${level} level`,
      "Master grammar and vocabulary for this stage",
      "Improve pronunciation, speaking, and writing",
      "Prepare for Goethe / telc certification requirements",
      "Practice with quizzes, assignments, and live sessions",
    ],
    curriculumSections: [
      {
        title: "German Grammar",
        topics: [
          "Level-specific grammar modules",
          "Sentence structure and verb forms",
          "Cases, tenses, and connectors",
          "Error correction and practice drills",
        ],
      },
      {
        title: "German Conversation",
        topics: [
          "Daily life dialogues",
          "Professional and social situations",
          "Pronunciation and fluency practice",
          "Role-play and speaking assessments",
        ],
      },
      {
        title: "German Vocabulary",
        topics: [
          "Thematic word lists",
          "Common phrases and expressions",
          "Reading and listening vocabulary",
          "Exam-focused vocabulary sets",
        ],
      },
      {
        title: "Other",
        topics: [
          "German culture and etiquette",
          "Exam preparation tips",
          "Study resources and references",
          `Practice for the ${level} exam`,
        ],
      },
    ],
    targetAudience: [
      `Learners preparing for German ${level} level`,
      "Students who want structured offline or hybrid training",
    ],
    faqs: [
      {
        q: `What prior knowledge do I need for German ${level}?`,
        a: `This course is designed for learners moving into the German ${level} level. Our team will guide you on eligibility during enrollment.`,
      },
      {
        q: "How long do I have access to the course?",
        a: "You get lifetime access on mobile, tablet, and desktop.",
      },
      {
        q: `Is this course suitable for Goethe ${level} exam preparation?`,
        a: `Yes. The course includes preparation support for speaking, writing, and core skills required at ${level} level.`,
      },
    ],
    reviewsSummary: {
      average: course.rating ?? "4.50",
      total: reviewCount,
      breakdown: [
        { stars: 5, percent: 50 },
        { stars: 4, percent: 50 },
        { stars: 3, percent: 0 },
        { stars: 2, percent: 0 },
        { stars: 1, percent: 0 },
      ],
      note:
        "Some of real students reviews, verify on our Google place page. Search Fluent AUF Reviews.",
    },
    reviews: [
      {
        initials: "LJ",
        name: "Learning Jainism",
        date: "June 17, 2023",
        rating: 4,
        text: `Great study atmosphere and very supportive trainers. The ${level} course structure helped me build confidence quickly.`,
        color: "#6366f1",
      },
      {
        initials: "CS",
        name: "Chitra Sharma",
        date: "May 30, 2023",
        rating: 4,
        text: "Excellent teaching methodology and very helpful for exam preparation at Fluent AUF.",
        color: "#ec4899",
      },
      {
        initials: "AK",
        name: "Akhil Kumaria",
        date: "June 18, 2023",
        rating: 4,
        text: "Teachers are very knowledgeable and patient. German grammar became much easier to understand.",
        color: "#14b8a6",
      },
      {
        initials: "VC",
        name: "Virendra Chaudhary",
        date: "May 18, 2023",
        rating: 4,
        text: "I highly recommend Fluent AUF as one of the best language institutes for learning German.",
        color: "#f59e0b",
      },
      {
        initials: "YK",
        name: "Yashode K.",
        date: "June 16, 2023",
        rating: 4,
        text: `Wonderful experience learning German ${level} level here. Live classes and recorded videos both are very useful.`,
        color: "#8b5cf6",
      },
      {
        initials: "GS",
        name: "Gaurav Sharma",
        date: "May 30, 2023",
        rating: 4,
        text: "Excellent course! The trainer explains everything clearly with real-life examples. Highly recommended.",
        color: "#e31e24",
      },
    ],
  };
}

const contentBySlug: Record<string, CourseContent> = {
  a1: a1CourseContent,
  a2: a2CourseContent,
};

export function getCourseContent(slug: string): CourseContent | undefined {
  if (contentBySlug[slug]) {
    return contentBySlug[slug];
  }

  const course = getCourseBySlug(slug);
  if (!course) return undefined;

  return createPlaceholderContent(course);
}
