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
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
        <MobileContactBar />
      </body>
    </html>
  );
}
