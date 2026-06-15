export type GermanCourse = {
  slug: string;
  pathName: string;
  title: string;
  description: string;
  hours: string;
  price: string;
  image: string;
  batchSize?: string;
  enrolled?: string;
  rating?: string;
  reviewCount?: string;
  learningHours?: string;
};

export const germanCourses: GermanCourse[] = [
  {
    slug: "a1",
    pathName: "german-a1",
    title: "German A1 Level : For Beginners!",
    description:
      "Learn German Language From A Native and Experienced German Teacher - Learn German Grammar, Vocabulary and Speaking from scratch.",
    hours: "111 Hours +",
    price: "₹14,999.00",
    image: "/courses/german-a1.png",
    batchSize: "20-40 Students",
    enrolled: "112",
    rating: "4.50",
    reviewCount: "37",
    learningHours: "111 Hours",
  },
  {
    slug: "a2",
    pathName: "german-a2",
    title: "German A2 Level : Elementary",
    description:
      "Learn The German Grammar From A Native and Experienced German Teacher - Learn German Grammar For Advanced Beginners.",
    hours: "115 Hours +",
    price: "₹17,500.00",
    image: "/portal-education.jpg",
    batchSize: "20-40 Students",
    enrolled: "98",
    rating: "4.50",
    reviewCount: "29",
    learningHours: "115 Hours",
  },
  {
    slug: "b1",
    pathName: "german-b1",
    title: "German B1 Level : Intermediate",
    description:
      "German Language has taken immense importance in contemporary business. It should be learnt properly with structured modules.",
    hours: "130 Hours +",
    price: "₹21,000.00",
    image: "/webinar-student.jpg",
    batchSize: "20-40 Students",
    enrolled: "86",
    rating: "4.50",
    reviewCount: "24",
    learningHours: "130 Hours",
  },
  {
    slug: "b2",
    pathName: "german-b2",
    title: "German B2 Level : Upper Intermediate",
    description:
      "Learn German Language From A Native & Experienced German Teacher - Learn German Grammar, Vocabulary and fluency skills.",
    hours: "51 Hours +",
    price: "₹21,000.00",
    image: "/hero-students.jpg",
    batchSize: "15-30 Students",
    enrolled: "64",
    rating: "4.50",
    reviewCount: "18",
    learningHours: "51 Hours",
  },
  {
    slug: "c1",
    pathName: "german-c1",
    title: "German C1 Level : Advance Level German",
    description:
      "The German Language C1 level, also known as the Advanced Level, represents a significant milestone in language mastery.",
    hours: "60 Hours +",
    price: "₹20,500.00",
    image: "/portal-education.jpg",
    batchSize: "15-25 Students",
    enrolled: "42",
    rating: "4.50",
    reviewCount: "15",
    learningHours: "60 Hours",
  },
  {
    slug: "c2",
    pathName: "german-c2",
    title: "German C2 Level : Highly Competent Level German",
    description:
      "The German Language C2 level, also known as the Highly Competent Level, represents the pinnacle of mastery in German.",
    hours: "60 Hours +",
    price: "₹23,500.00",
    image: "/webinar-student.jpg",
    batchSize: "10-20 Students",
    enrolled: "28",
    rating: "4.50",
    reviewCount: "12",
    learningHours: "60 Hours",
  },
];

export function getCourseBySlug(slug: string) {
  return germanCourses.find((course) => course.slug === slug);
}

export function getCourseByPathName(pathName: string) {
  const decoded = decodeURIComponent(pathName);
  return germanCourses.find((course) => course.pathName === decoded);
}

export function getCourseHref(course: GermanCourse) {
  return `/course/${course.pathName}`;
}
