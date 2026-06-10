export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "german-online-courses",
    title: "German Online Language Courses",
    date: "2026-05-22",
    author: "Fluent AUF Team",
    excerpt:
      "Discover flexible online German courses from A1 to C2 with live classes, expert tutors, and exam-focused preparation.",
    image: "/portal-education.jpg",
  },
  {
    slug: "goethe-exam-guide-2026",
    title: "Goethe Exam 2026: Levels, Format, Fees & Preparation Tips",
    date: "2026-05-19",
    author: "Fluent AUF Team",
    excerpt:
      "A complete guide to Goethe-Zertifikat exams — understand CEFR levels, registration, and how to prepare effectively.",
    image: "/webinar-student.jpg",
  },
  {
    slug: "gpa-germany",
    title: "GPA Calculation Method for Germany Admissions",
    date: "2026-05-19",
    author: "Fluent AUF Team",
    excerpt:
      "Learn how German universities evaluate Indian academic scores and what you need for a successful application.",
    image: "/hero-students.jpg",
  },
  {
    slug: "uni-assist",
    title: "Uni Assist Germany Guide: Process, Fees & VPD",
    date: "2026-05-18",
    author: "Fluent AUF Team",
    excerpt:
      "Step-by-step breakdown of Uni Assist applications, verification documents, and timelines for studying in Germany.",
    image: "/courses/german-hero.jpg",
  },
  {
    slug: "aps-certificate",
    title: "APS Certificate Germany: Step-by-Step Process",
    date: "2026-05-18",
    author: "Fluent AUF Team",
    excerpt:
      "Everything Indian students need to know about APS verification for German university and visa applications.",
    image: "/courses/german-a1.jpg",
  },
  {
    slug: "study-in-germany-requirements",
    title: "Study in Germany: Language Requirements Explained",
    date: "2026-04-28",
    author: "Fluent AUF Team",
    excerpt:
      "From Goethe to TestDaF — understand which German certification you need for admissions and blocked accounts.",
    image: "/portal-education.jpg",
  },
  {
    slug: "telc-german-exam",
    title: "Telc German Exam: Format, Scoring & How to Prepare",
    date: "2026-04-15",
    author: "Fluent AUF Team",
    excerpt:
      "Understand Telc exam structure, passing criteria, and proven strategies to score well at every level.",
    image: "/webinar-student.jpg",
  },
  {
    slug: "german-a1-tips",
    title: "How to Clear German A1 in 30 Days: A Practical Plan",
    date: "2026-04-02",
    author: "Fluent AUF Team",
    excerpt:
      "A focused 30-day study plan for beginners covering vocabulary, grammar, listening, and speaking for Goethe A1.",
    image: "/courses/instructor.jpg",
  },
  {
    slug: "work-in-germany-german",
    title: "Work in Germany: Why German Language Skills Matter",
    date: "2026-03-20",
    author: "Fluent AUF Team",
    excerpt:
      "Explore career opportunities in Germany and how strong German skills improve jobs, PR pathways, and daily life.",
    image: "/hero-students.jpg",
  },
];

export function formatBlogDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
