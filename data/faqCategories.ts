export type FaqCategory = {
  id: string;
  title: string;
  description: string;
};

export const faqCategories: FaqCategory[] = [
  {
    id: "goethe",
    title: "Goethe",
    description:
      "Learn about Goethe-Zertifikat exams, CEFR levels, and how GermanSkill prepares you for certification success.",
  },
  {
    id: "telc",
    title: "Telc",
    description:
      "Understand Telc German certification, exam formats, and the preparation support available at GermanSkill.",
  },
  {
    id: "osd",
    title: "ÖSD",
    description:
      "Explore ÖSD exam pathways, Austrian German certification, and structured coaching for every level.",
  },
  {
    id: "general",
    title: "General",
    description:
      "Learn why German is valuable, how to start learning, and the career and educational opportunities it offers.",
  },
  {
    id: "courses",
    title: "Course & Classes",
    description:
      "Find answers about batches, online and offline classes, demo sessions, schedules, and level placement.",
  },
  {
    id: "payment",
    title: "Payment & Policy",
    description:
      "Get clarity on course fees, payment options, refund policy, offers, and enrollment terms at GermanSkill.",
  },
];
