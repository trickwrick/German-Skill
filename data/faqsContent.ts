export type FaqItem = {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "goethe-1",
    categoryId: "goethe",
    question: "What is the Goethe-Zertifikat?",
    answer:
      "Goethe-Zertifikat is an internationally recognized German language certificate issued by the Goethe-Institut. It tests reading, writing, listening, and speaking skills across CEFR levels from A1 to C2.",
  },
  {
    id: "goethe-2",
    categoryId: "goethe",
    question: "Which Goethe level should I start with?",
    answer:
      "Complete beginners should start with A1. If you already know basic German, book a free evaluation with our counsellors — we will recommend A2, B1, or higher based on your skills.",
  },
  {
    id: "goethe-3",
    categoryId: "goethe",
    question: "Does Fluent AUF prepare students for Goethe exams?",
    answer:
      "Yes. Our A1 to C2 programs include exam-pattern practice, mock tests, speaking drills, and writing feedback aligned with Goethe exam requirements.",
  },
  {
    id: "goethe-4",
    categoryId: "goethe",
    question: "How often are Goethe exams conducted?",
    answer:
      "Goethe exam dates vary by city and level. Our team helps you register at the nearest authorized exam centre and plan your preparation timeline accordingly.",
  },
  {
    id: "telc-1",
    categoryId: "telc",
    question: "What is the Telc German exam?",
    answer:
      "Telc (The European Language Certificates) offers German exams for general and professional purposes. It is widely accepted for study, work, and visa-related requirements in German-speaking countries.",
  },
  {
    id: "telc-2",
    categoryId: "telc",
    question: "What is the difference between Goethe and Telc?",
    answer:
      "Both follow CEFR levels and are widely recognized. Goethe is issued by Goethe-Institut, while Telc is offered through Telc exam partners. Your choice may depend on university, employer, or embassy requirements.",
  },
  {
    id: "telc-3",
    categoryId: "telc",
    question: "Do you offer Telc-focused batches?",
    answer:
      "Yes. We run level-wise batches with Telc-style mock papers, timed practice, and trainer feedback for speaking and writing modules.",
  },
  {
    id: "osd-1",
    categoryId: "osd",
    question: "What is ÖSD certification?",
    answer:
      "ÖSD (Österreichisches Sprachdiplom Deutsch) is an Austrian German language certificate recognized across Europe for study, work, and integration purposes.",
  },
  {
    id: "osd-2",
    categoryId: "osd",
    question: "Is ÖSD accepted in Germany?",
    answer:
      "Yes. ÖSD certificates are accepted by many universities and institutions in Germany and Austria. Always confirm the specific requirement with your institution or visa office.",
  },
  {
    id: "general-1",
    categoryId: "general",
    question: "Why should I learn German?",
    answer:
      "German opens doors for higher education in Germany, skilled migration, global careers, and access to Europe's largest economy. It also helps with daily life if you plan to live or work abroad.",
  },
  {
    id: "general-2",
    categoryId: "general",
    question: "How long does it take to complete German A1?",
    answer:
      "Most learners complete A1 in 8 to 12 weeks with regular classes and practice. Duration depends on batch intensity, self-study time, and prior language exposure.",
  },
  {
    id: "general-3",
    categoryId: "general",
    question: "Can I study in Germany without knowing German?",
    answer:
      "Some English-taught programs exist, but most pathways require German from A2 to B2 or higher. Strong German skills improve admissions, part-time jobs, and daily life in Germany.",
  },
  {
    id: "general-4",
    categoryId: "general",
    question: "What are CEFR levels A1 to C2?",
    answer:
      "CEFR (Common European Framework) defines language proficiency from A1 (beginner) to C2 (near-native). Fluent AUF offers structured courses for every level with certification-focused outcomes.",
  },
  {
    id: "courses-1",
    categoryId: "courses",
    question: "Do you offer online classes?",
    answer:
      "Yes. Fluent AUF offers live online batches, morning/evening timings, and weekend options so students and working professionals can learn flexibly.",
  },
  {
    id: "courses-2",
    categoryId: "courses",
    question: "How do I book a free demo class?",
    answer:
      "Visit our Contact page or call us to schedule a free demo. You will experience our teaching style and get guidance on the right course level and upcoming batch.",
  },
  {
    id: "courses-3",
    categoryId: "courses",
    question: "How are batch timings decided?",
    answer:
      "We run multiple batches across the week. After your demo or counselling session, our team shares available schedules for your level so you can pick what fits best.",
  },
  {
    id: "courses-4",
    categoryId: "courses",
    question: "Will I get study material and recordings?",
    answer:
      "Yes. Students receive structured notes, practice sheets, and access to learning resources. Online batch details including recordings depend on the program you enroll in.",
  },
  {
    id: "payment-1",
    categoryId: "payment",
    question: "What are the course fees at Fluent AUF?",
    answer:
      "Fees vary by level (A1 to C2), batch type, and duration. Contact our counsellors for the latest fee structure, offers, and installment options.",
  },
  {
    id: "payment-2",
    categoryId: "payment",
    question: "Do you offer EMI or installment plans?",
    answer:
      "Yes. We offer flexible payment options on selected programs. Our team will explain eligible plans during enrollment based on the course you choose.",
  },
  {
    id: "payment-3",
    categoryId: "payment",
    question: "What is your refund policy?",
    answer:
      "Refund terms depend on the course, batch start date, and classes attended. Please refer to our refund policy or speak with admissions for case-specific guidance before enrolling.",
  },
  {
    id: "payment-4",
    categoryId: "payment",
    question: "Are there seasonal discounts or offers?",
    answer:
      "We periodically run promotional offers on select batches. Check our homepage banners or contact the team to know current discounts and enrollment deadlines.",
  },
];

const homeFaqIds = ["goethe-2", "goethe-3", "general-2", "courses-1", "courses-2"];

export const homeFaqItems = homeFaqIds
  .map((id) => faqItems.find((item) => item.id === id))
  .filter((item): item is FaqItem => Boolean(item));

export function getFaqsByCategory(categoryId: string) {
  return faqItems.filter((item) => item.categoryId === categoryId);
}
