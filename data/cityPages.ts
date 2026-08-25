export type CityPageSeo = {
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
};

export type CityPageHighlight = {
  title: string;
  text: string;
};

export type CityVisionSectionData = {
  tag: string;
  heading: string;
  headingHighlight: string;
  headingSuffix: string;
  text: string;
  points: string[];
  imageSrc: string;
  imageAlt: string;
  badgeValue: string;
  badgeLabel: string;
  linkText: string;
  linkHref: string;
};

export type CityWhyCollageItem = {
  src: string;
  alt: string;
  label: string;
};

export type CityWhyFeatureItem = {
  title: string;
  text: string;
  badge: string;
  tone: "demo" | "exam" | "tutors" | "batch";
};

export type CityWhyLearnSectionData = {
  headingBefore: string;
  headingHighlight: string;
  headingAfter: string;
  text: string;
  collage: CityWhyCollageItem[];
  features: CityWhyFeatureItem[];
};

export type CityJourneySectionData = {
  text: string;
  buttonText: string;
  buttonHref: string;
};

export type CitySuccessSectionData = {
  badge: string;
  kicker: string;
  heading: string;
  headingHighlight: string;
  text: string;
  buttonText: string;
  buttonHref: string;
  mosaicImages: string[];
};

export type CityFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CityFaqSectionData = {
  title: string;
  subtitle: string;
  items: CityFaqItem[];
};

export type CityPage = {
  slug: string;
  cityName: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  highlights: CityPageHighlight[];
  contentHtml: string;
  vision: CityVisionSectionData;
  whyLearn: CityWhyLearnSectionData;
  journey: CityJourneySectionData;
  success: CitySuccessSectionData;
  faqs: CityFaqSectionData;
  /** @deprecated Prefer journey.text — kept for older stored pages */
  ctaHeading: string;
  /** @deprecated Prefer journey.text */
  ctaText: string;
  /** @deprecated Prefer journey.buttonText */
  ctaButtonText: string;
  seo: CityPageSeo;
  isActive: boolean;
  sortOrder: number;
  updatedAt?: string;
};

export type CityPagesStore = {
  pages: CityPage[];
};

export const defaultCityPageSeo = (cityName: string): CityPageSeo => ({
  metaTitle: `German Classes in ${cityName} | Fluent AUF`,
  metaKeyword: `German classes in ${cityName}, learn German ${cityName}, Goethe exam ${cityName}`,
  metaDescription: `Learn German online with Fluent AUF — live A1 to C2 classes for students in ${cityName}. Book a free demo today.`,
});

export const defaultCityHeroDescription =
  "Professional German Goethe & TELC learning assistance from A1 to C2 — prepare for study abroad, stronger careers, and Germany / Austria / Switzerland pathways with live expert-led classes.";

export function defaultCityVision(cityName: string): CityVisionSectionData {
  return {
    tag: "Our Vision",
    heading: `Empowering German learners in`,
    headingHighlight: cityName,
    headingSuffix: " and beyond",
    text: `At Fluent AUF, our vision is to help learners in ${cityName} and across India achieve real German fluency — not just textbook knowledge, but the confidence to communicate in exams, interviews, and everyday life abroad.`,
    points: [
      "Make quality German education accessible to learners in every city through live online classes.",
      "Build exam-ready fluency with Goethe and TELC focused training from A1 to C2.",
      "Help students gain confidence to study, work, and settle abroad with practical language skills.",
    ],
    imageSrc: "/hero-students.jpg",
    imageAlt: `Fluent AUF German language learners from ${cityName}`,
    badgeValue: "16,000+",
    badgeLabel: "Students learning with us",
    linkText: "Learn more about Fluent AUF",
    linkHref: "/about/our-company",
  };
}

export function defaultCityWhyLearn(cityName: string): CityWhyLearnSectionData {
  return {
    headingBefore: "Why Learn at",
    headingHighlight: "Fluent AUF",
    headingAfter: "?",
    text: `Build real German fluency with live classes, certified tutors, and exam-focused guidance — trusted by learners in ${cityName} and across India.`,
    collage: [
      {
        src: "/portal-education.jpg",
        alt: "Live German classroom session",
        label: "Live Classroom Sessions",
      },
      {
        src: "/webinar-student.jpg",
        alt: "Student learning German online",
        label: "Interactive Online Classes",
      },
      {
        src: "/hero-students.jpg",
        alt: "Students preparing for German exams",
        label: "Goethe & TELC Preparation",
      },
    ],
    features: [
      {
        title: "Free Demo Classes",
        text: "Experience our teaching style before you enroll. Sit in a live session and decide with confidence.",
        badge: "100% Free",
        tone: "demo",
      },
      {
        title: "Exam-Focused Training",
        text: "Structured A1–C2 prep aligned with Goethe and TELC patterns, practice tests, and speaking drills.",
        badge: "Exam Ready",
        tone: "exam",
      },
      {
        title: "Certified German Tutors",
        text: "Learn from experienced, certified trainers who guide you with clear feedback every step of the way.",
        badge: "Expert Faculty",
        tone: "tutors",
      },
      {
        title: "Flexible Online Batches",
        text: `Join weekday or weekend batches from ${cityName} or anywhere — small groups, live classes, recorded support.`,
        badge: "Live Online",
        tone: "batch",
      },
    ],
  };
}

export function defaultCityJourney(cityName: string): CityJourneySectionData {
  return {
    text: `Achieve German language expertise from our German classes in ${cityName}, as we design courses that make your German learning journey easy and productive. Whether you are planning to learn German for better career or academic opportunities on a global scale, learn a new language as a hobby, or want to achieve immigration goals, we are here to train you with all the practical methods that can help you achieve fluency in the language. No matter what your learning goal is, we are here to help you learn a new language from beginner to advanced level. Browse through our courses and select the one that aligns with your learning goals now!`,
    buttonText: "Start Your Journey Now",
    buttonHref: "/contact",
  };
}

export function defaultCitySuccess(cityName: string): CitySuccessSectionData {
  return {
    badge: "Goethe & TELC Focused",
    kicker: "Learn German at Fluent AUF & Unlock Your",
    heading: "Dream Opportunity",
    headingHighlight: "Abroad",
    text: `Join 10,500+ successful students who built German fluency for study, work, and career growth — including learners from ${cityName}.`,
    buttonText: "Enquire Now",
    buttonHref: "/contact",
    mosaicImages: [
      "/tutors/khushi-sharma.jpg",
      "/tutors/preeti-sharma.jpg",
      "/tutors/khushi-birsat.jpg",
      "/hero-students.jpg",
      "/portal-education.jpg",
      "/webinar-student.jpg",
      "/og-share.png",
      "/courses/german-a1.png",
    ],
  };
}

export function defaultCityFaqs(): CityFaqSectionData {
  return {
    title: "Frequently Asked Questions",
    subtitle:
      "Get answers to the most common questions about our German courses and learning process.",
    items: [
      {
        id: "german-levels",
        question: "What levels of German do you offer?",
        answer:
          "Fluent AUF offers structured German courses from A1 to C2, including Goethe and Telc exam preparation for every level.",
      },
      {
        id: "course-duration",
        question: "How long does it take to complete a course?",
        answer:
          "Course duration depends on the level. A1 typically takes 8–12 weeks, while higher levels may take longer with regular live classes and practice.",
      },
      {
        id: "demo-class",
        question: "Can I attend a free demo class?",
        answer:
          "Yes. You can book a free demo class to experience our teaching style, meet a trainer, and get level guidance before enrolling.",
      },
    ],
  };
}

function buildSampleCity(slug: string, cityName: string, sortOrder: number): CityPage {
  const journey = defaultCityJourney(cityName);
  return {
    slug,
    cityName,
    title: `German Classes in ${cityName}`,
    subtitle: "Build Confidence in German Communication",
    heroDescription: defaultCityHeroDescription,
    highlights: [
      {
        title: "Live Online Classes",
        text: `Join interactive German batches from ${cityName} with real-time speaking practice.`,
      },
      {
        title: "A1 to C2 Levels",
        text: "Structured CEFR courses for beginners through advanced learners.",
      },
      {
        title: "Exam Preparation",
        text: "Goethe, telc and TestDaF focused practice with mock tests.",
      },
      {
        title: "Flexible Batches",
        text: "Weekday and weekend timings that fit your schedule.",
      },
    ],
    contentHtml: [
      `<p>Fluent AUF helps learners in <strong>${cityName}</strong> build German fluency for study abroad, careers, migration, and personal growth.</p>`,
      `<p>Our certified trainers guide you through grammar, vocabulary, conversation, and exam skills with small interactive batches.</p>`,
      `<h3>Why choose Fluent AUF in ${cityName}?</h3>`,
      `<ul><li>Live online classes you can attend from home</li><li>Personalized attention and doubt support</li><li>Study material and session recordings</li><li>Free demo class before you enroll</li></ul>`,
    ].join("\n"),
    vision: defaultCityVision(cityName),
    whyLearn: defaultCityWhyLearn(cityName),
    journey,
    success: defaultCitySuccess(cityName),
    faqs: defaultCityFaqs(),
    ctaHeading: `Start learning German from ${cityName}`,
    ctaText: journey.text,
    ctaButtonText: journey.buttonText,
    seo: defaultCityPageSeo(cityName),
    isActive: true,
    sortOrder,
  };
}

export const defaultCityPages: CityPage[] = [
  buildSampleCity("delhi", "Delhi", 1),
  buildSampleCity("jaipur", "Jaipur", 2),
  buildSampleCity("mumbai", "Mumbai", 3),
];

export const defaultCityPagesStore: CityPagesStore = {
  pages: defaultCityPages,
};
