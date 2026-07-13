export type GeneralPageId = "terms" | "privacy" | "refund" | "our-company";

export type LegalPageContentData = {
  paragraphs: string[];
};

export type OurCompanyStat = {
  value: string;
  label: string;
};

export type OurCompanyFeature = {
  title: string;
  text: string;
};

export type OurCompanyValue = {
  title: string;
  text: string;
};

export type OurCompanyFacultyMember = {
  name: string;
  image: string;
  role: string;
};

export type OurCompanyPageData = {
  intro: {
    tag: string;
    heading: string;
    headingHighlight: string;
    headingSuffix: string;
    description: string;
    listItems: string[];
    primaryButtonText: string;
    secondaryButtonText: string;
    imageSrc: string;
    imageAlt: string;
    badgeValue: string;
    badgeLabel: string;
  };
  stats: OurCompanyStat[];
  features: {
    tag: string;
    heading: string;
    description: string;
    items: OurCompanyFeature[];
  };
  values: {
    tag: string;
    heading: string;
    items: OurCompanyValue[];
  };
  faculty: {
    tag: string;
    heading: string;
    description: string;
    members: OurCompanyFacultyMember[];
  };
  cta: {
    heading: string;
    description: string;
    buttonText: string;
  };
};

export type GeneralPagesContent = {
  terms: LegalPageContentData;
  privacy: LegalPageContentData;
  refund: LegalPageContentData;
  ourCompany: OurCompanyPageData;
};

export const generalPageOptions: Array<{ id: GeneralPageId; label: string }> = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "refund", label: "Refund Policy" },
  { id: "our-company", label: "Our Company" },
];

export const defaultTermsContent: LegalPageContentData = {
  paragraphs: [
    "By enrolling in Fluent AUF courses or using our website, you agree to follow our class schedules, payment terms, and communication guidelines.",
    "Course access, batch timings, and study material are provided as per the selected program. Students are expected to attend live sessions regularly and maintain respectful conduct during classes.",
    "Fluent AUF may update course content, faculty assignments, or batch schedules when required for academic quality or operational reasons.",
    "For questions about these terms, contact us at fluentauf@gmail.com or +91 88269 67151.",
  ],
};

export const defaultPrivacyContent: LegalPageContentData = {
  paragraphs: [
    "Fluent AUF collects information such as your name, email address, phone number, and course preferences when you submit enquiry or enrollment forms.",
    "We use this information to contact you about classes, batches, demos, and support related to your German learning journey.",
    "Your details are not sold to third parties. Information may be shared only with trusted service providers required to operate our website, communication tools, or payment systems.",
    "You may request correction or deletion of your contact details by writing to fluentauf@gmail.com.",
  ],
};

export const defaultRefundContent: LegalPageContentData = {
  paragraphs: [
    "Refund eligibility depends on the course selected, batch start date, and number of classes attended.",
    "If you need to cancel enrollment, please contact our team before the batch begins for the best available resolution.",
    "Approved refunds, when applicable, are processed to the original payment method within the timelines shared by our admissions team.",
    "For refund-related questions, email fluentauf@gmail.com or call +91 88269 67151 before enrolling.",
  ],
};

export const defaultOurCompanyContent: OurCompanyPageData = {
  intro: {
    tag: "Est. 2013",
    heading: "Building German fluency for",
    headingHighlight: "10,500+ learners",
    headingSuffix: "across India",
    description:
      "Fluent AUF is a dedicated German language institute helping students, professionals, and aspirants achieve certification and confidence for study, work, and life in Germany.",
    listItems: [
      "A1 to C2 structured programs with certified trainers",
      "Goethe & telc exam preparation with mock tests",
      "Online batches with flexible timings",
    ],
    primaryButtonText: "Explore Courses",
    secondaryButtonText: "Talk to Us",
    imageSrc: "/hero-students.jpg",
    imageAlt: "Fluent AUF students in a learning session",
    badgeValue: "13+",
    badgeLabel: "Years of trust",
  },
  stats: [
    { value: "10,500+", label: "Happy Students" },
    { value: "2,100+", label: "Batches Completed" },
    { value: "21+", label: "Certified Trainers" },
    { value: "85%", label: "Exam Success Rate" },
  ],
  features: {
    tag: "Our Edge",
    heading: "Why learners choose Fluent AUF",
    description:
      "A professional institute built around results — not just syllabus completion, but real language ability and exam readiness.",
    items: [
      {
        title: "Certified Faculty",
        text: "Goethe-trained instructors with real classroom experience across A1 to C2 levels.",
      },
      {
        title: "Exam-Focused Curriculum",
        text: "Structured programs aligned with Goethe and telc patterns — grammar, speaking, and mocks.",
      },
      {
        title: "Flexible Learning",
        text: "Online, morning, and weekend batches designed for students and professionals.",
      },
      {
        title: "Student Support",
        text: "Doubt sessions, progress tracking, and counsellor guidance from demo class to certification.",
      },
    ],
  },
  values: {
    tag: "What we stand for",
    heading: "Our Core Values",
    items: [
      {
        title: "Commitment",
        text: "Every learner gets focused attention from enrollment through exam results.",
      },
      {
        title: "Integrity",
        text: "Transparent fees, honest guidance, and quality teaching — no shortcuts.",
      },
      {
        title: "Excellence",
        text: "We continuously improve batches, materials, and methods to raise outcomes.",
      },
    ],
  },
  faculty: {
    tag: "Faculty Team",
    heading: "Meet our German trainers",
    description:
      "Certified mentors who guide you through grammar, speaking, writing, and exam strategy — in live classes and focused doubt sessions.",
    members: [
      {
        name: "Khushi Sharma",
        image: "/tutors/khushi-sharma.jpg",
        role: "Certified German Trainer",
      },
      {
        name: "Preeti Sharma",
        image: "/tutors/preeti-sharma.jpg",
        role: "Certified German Trainer",
      },
    ],
  },
  cta: {
    heading: "Ready to start your German journey?",
    description:
      "Book a free demo class and experience our teaching approach before you enroll. No pressure — just clarity on the right level and batch for you.",
    buttonText: "Book Free Demo",
  },
};

export const defaultGeneralPagesContent: GeneralPagesContent = {
  terms: defaultTermsContent,
  privacy: defaultPrivacyContent,
  refund: defaultRefundContent,
  ourCompany: defaultOurCompanyContent,
};
