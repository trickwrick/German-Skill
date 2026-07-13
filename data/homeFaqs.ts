export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomeFaqContent = {
  title: string;
  subtitle: string;
  items: HomeFaqItem[];
};

export const defaultHomeFaqContent: HomeFaqContent = {
  title: "Frequently Asked Questions",
  subtitle:
    "Get answers to the most common questions about our German courses and learning process.",
  items: [
    {
      id: "german-levels",
      question: "What levels of German do you offer?",
      answer:
        "Fluent AUF offers structured German courses from A1 to C2, including Goethe and Telc exam preparation for every level.",
      sortOrder: 1,
      isActive: true,
    },
    {
      id: "course-duration",
      question: "How long does it take to complete a course?",
      answer:
        "Course duration depends on the level. A1 typically takes 8–12 weeks, while higher levels may take longer with regular live classes and practice.",
      sortOrder: 2,
      isActive: true,
    },
    {
      id: "certificates",
      question: "Do you provide certificates upon completion?",
      answer:
        "Yes. Students receive a course completion certificate from Fluent AUF, and we also prepare you for official Goethe and Telc certifications.",
      sortOrder: 3,
      isActive: true,
    },
    {
      id: "trial-class",
      question: "Can I get a trial class before enrolling?",
      answer:
        "Yes. You can book a free demo class to experience our teaching style and get guidance on the right course level.",
      sortOrder: 4,
      isActive: true,
    },
    {
      id: "refund-policy",
      question: "What is your refund policy?",
      answer:
        "Refund terms depend on the course, batch start date, and classes attended. Contact our admissions team for details before enrolling.",
      sortOrder: 5,
      isActive: true,
    },
    {
      id: "one-on-one",
      question: "Do you offer one-on-one classes?",
      answer:
        "Yes. We offer one-on-one German coaching for learners who need flexible timings or focused exam preparation.",
      sortOrder: 6,
      isActive: true,
    },
  ],
};
