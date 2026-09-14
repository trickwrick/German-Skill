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
  imageSrc: string;
  imageAlt: string;
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

export const DEFAULT_HERO_BADGE_PREFIX = "Build Confidence in ";

export const defaultHeroTypedPhrases = (): string[] => [
  "German Communication",
  "German Classes",
  "German Best learn",
];

export type CityPage = {
  slug: string;
  cityName: string;
  title: string;
  /** Fixed text shown before the rotating typed phrases */
  subtitle: string;
  /** Phrases typed one-by-one after the fixed subtitle */
  heroTypedPhrases: string[];
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
  metaTitle: `German Classes in ${cityName} | German Skill`,
  metaKeyword: `German classes in ${cityName}, learn German ${cityName}, Goethe exam ${cityName}`,
  metaDescription: `Learn German online with German Skill — live A1 to C2 classes for students in ${cityName}. Book a free demo today.`,
});

export const defaultCityHeroDescription =
  "<p>Professional German language learning support from A1 to C2, with expert-led live classes designed to help you prepare for Goethe and TELC exams, study abroad opportunities, career growth, and pathways to Germany, Austria, and Switzerland.</p>";

export function defaultCityVision(cityName: string): CityVisionSectionData {
  return {
    tag: "Our Vision",
    heading: `Empowering German learners in`,
    headingHighlight: cityName,
    headingSuffix: " and beyond",
    text: `<p>At German Skill, our vision is to help learners in ${cityName} and across India achieve real German fluency &mdash; not just textbook knowledge, but the confidence to communicate in exams, interviews, and everyday life abroad.</p>`,
    points: [
      "<p>Make quality German education accessible to learners in every city through live online classes.</p>",
      "<p>Build exam-ready fluency with Goethe and TELC focused training from A1 to C2.</p>",
      "<p>Help students gain confidence to study, work, and settle abroad with practical language skills.</p>",
    ],
    imageSrc: "/hero-students.jpg",
    imageAlt: `German Skill German language learners from ${cityName}`,
    badgeValue: "16,000+",
    badgeLabel: "Students learning with us",
    linkText: "Learn more about German Skill",
    linkHref: "/about/our-company",
  };
}

export function defaultCityWhyLearn(cityName: string): CityWhyLearnSectionData {
  return {
    headingBefore: "Why Learn at",
    headingHighlight: "German Skill",
    headingAfter: "?",
    text: `<p>Build real German fluency with live classes, certified tutors, and exam-focused guidance &mdash; trusted by learners in ${cityName} and across India.</p>`,
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
        text: "<p>Experience our teaching style before you enroll. Sit in a live session and decide with confidence.</p>",
        badge: "100% Free",
        tone: "demo",
      },
      {
        title: "Exam-Focused Training",
        text: "<p>Structured A1&ndash;C2 prep aligned with Goethe and TELC patterns, practice tests, and speaking drills.</p>",
        badge: "Exam Ready",
        tone: "exam",
      },
      {
        title: "Certified German Tutors",
        text: "<p>Learn from experienced, certified trainers who guide you with clear feedback every step of the way.</p>",
        badge: "Expert Faculty",
        tone: "tutors",
      },
      {
        title: "Flexible Online Batches",
        text: "<p>Choose 1-on-1 personalized sessions or small-group classes with flexible weekday and weekend batches. Learn from anywhere with live classes.</p>",
        badge: "Live Online",
        tone: "batch",
      },
      {
        title: "Study Material & Quizzes",
        text: "<p>Get structured German study materials, practice exercises, and interactive quizzes to reinforce your learning and build confidence alongside live classes.</p>",
        badge: "Free Access",
        tone: "material" as any,
      },
      {
        title: "Career & Visa Guidance",
        text: "<p>Guidance for university admissions, job seeker visas, blocked account, and Germany relocation pathways.</p>",
        badge: "Career Ready",
        tone: "career" as any,
      },
    ],
  };
}

export function defaultCityJourney(cityName: string): CityJourneySectionData {
  return {
    text: `<p>Start learning German using our German classes in ${cityName} that will not only simplify your learning process but also make it exciting and effective. No matter whether you need to learn German for more job or education options overseas, as a hobby, or to achieve your immigration purposes, our courses offer you practical and systematic training for the same.</p>\n\n<p>Regardless of your purpose of learning German, our courses help you in achieving your goal in a progressive manner right from beginner to advanced levels of learning. Browse our different courses of German and find the course suitable for you!</p>`,
    buttonText: "Start Your Journey Now",
    buttonHref: "/contact",
  };
}

export function defaultCitySuccess(cityName: string): CitySuccessSectionData {
  return {
    badge: "Goethe & TELC Focused",
    kicker: "Learn German at German Skill & Unlock Your",
    heading: "Dream Opportunity",
    headingHighlight: "Abroad",
    text: `<p>Join 10,500+ successful students who built German fluency for study, work, and career growth &mdash; including learners from ${cityName}.</p>`,
    buttonText: "Enquire Now",
    buttonHref: "/contact",
    imageSrc: "/hero-students.jpg",
    imageAlt: `Successful German learners from ${cityName}`,
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
    subtitle: DEFAULT_HERO_BADGE_PREFIX,
    heroTypedPhrases: defaultHeroTypedPhrases(),
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
