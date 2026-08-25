export type CityPageSeo = {
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
};

export type CityPageHighlight = {
  title: string;
  text: string;
};

export type CityPage = {
  slug: string;
  cityName: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  highlights: CityPageHighlight[];
  contentHtml: string;
  ctaHeading: string;
  ctaText: string;
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

function buildSampleCity(slug: string, cityName: string, sortOrder: number): CityPage {
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
    ctaHeading: `Start learning German from ${cityName}`,
    ctaText: "Book a free demo class and get the right level and batch recommendation.",
    ctaButtonText: "Start Your Journey Now",
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
