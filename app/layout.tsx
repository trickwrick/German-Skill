import type { Metadata } from "next";
import "../styles/globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MobileContactBar from "./components/MobileContactBar";
import { getSeoSettings } from "../lib/seoStore";
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSeoSettings();
  
  return {
    metadataBase: new URL("https://fluentauf.com"),
    title: settings.title,
    description: settings.description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: settings.title,
      description: settings.description,
      url: "https://fluentauf.com",
      siteName: "Fluent AUF",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: "/og-share.png",
          width: 1536,
          height: 1024,
          alt: "Fluent AUF — Online German Language Classes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.title,
      description: settings.description,
      images: ["/og-share.png"],
    },
    verification: {
      google: "j7GpZqfU5BDf00hqe9oFK3iOQ1iKXOTUhmZTe5kji4Y",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://fluentauf.com/#organization",
        "name": "Fluent AUF",
        "url": "https://fluentauf.com/",
        "logo": "https://fluentauf.com/fluent-logo.png",
        "description": "Fluent AUF provides online German language courses from A1 to C2 with live classes, experienced trainers, doubt-solving sessions, and certification support.",
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://fluentauf.com/#website",
        "url": "https://fluentauf.com/",
        "name": "Fluent AUF",
        "publisher": {
          "@id": "https://fluentauf.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://fluentauf.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://fluentauf.com/#webpage",
        "url": "https://fluentauf.com/",
        "name": "Fluent AUF: Online German Language Courses & Classes",
        "isPartOf": {
          "@id": "https://fluentauf.com/#website"
        },
        "about": {
          "@id": "https://fluentauf.com/#organization"
        },
        "description": "Join online German language classes from A1 to C2. Learn with certified trainers through live interactive sessions, study materials, doubt support, and certification guidance."
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
        <MobileContactBar />
      </body>
    </html>
  );
}
