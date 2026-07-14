import type { Metadata } from "next";

export const SITE_URL = "https://fluentauf.com";
export const SITE_NAME = "Fluent AUF";
export const DEFAULT_OG_IMAGE = "/og-share.png";
export const DEFAULT_OG_IMAGE_ALT = "Fluent AUF — Online German Language Classes";
export const DEFAULT_OG_IMAGE_WIDTH = 1536;
export const DEFAULT_OG_IMAGE_HEIGHT = 1024;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqSchemaItem = {
  question: string;
  answer: string;
};

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path: string) {
  if (!path || path === "/") {
    return SITE_URL;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(options: BuildPageMetadataOptions): Metadata {
  const path = options.path.startsWith("/") ? options.path : `/${options.path}`;
  const ogImage = options.ogImage ?? DEFAULT_OG_IMAGE;
  const ogImageAlt = options.ogImageAlt ?? DEFAULT_OG_IMAGE_ALT;

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      type: options.ogType ?? "website",
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [ogImage],
    },
    ...(options.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function stripHtmlForSchema(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/fluent-logo.png`,
    description:
      "Fluent AUF provides online German language courses from A1 to C2 with live classes, experienced trainers, doubt-solving sessions, and certification support.",
    sameAs: [] as string[],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?s={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildWebPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqSchema(faqs: FaqSchemaItem[]) {
  const validFaqs = faqs.filter((faq) => faq.question.trim() && faq.answer.trim());
  if (!validFaqs.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtmlForSchema(faq.answer),
      },
    })),
  };
}

export function buildCourseSchema({
  name,
  description,
  path,
  image,
}: {
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description: stripHtmlForSchema(description),
    url: absoluteUrl(path),
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    ...(image
      ? {
          image: image.startsWith("http") ? image : absoluteUrl(image),
        }
      : {}),
  };
}

export function buildArticleSchema({
  title,
  description,
  path,
  image,
  datePublished,
  author = "Fluent AUF Team",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: stripHtmlForSchema(description),
    url: absoluteUrl(path),
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/fluent-logo.png`,
      },
    },
    ...(datePublished ? { datePublished } : {}),
    ...(image
      ? {
          image: image.startsWith("http") ? image : absoluteUrl(image),
        }
      : {}),
  };
}
