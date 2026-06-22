import type { Metadata } from "next";
import "../styles/globals.css";
import MobileContactBar from "./components/MobileContactBar";

const siteDescription =
  "A1–C2 Goethe certified live classes. Book your free demo class today.";

export const metadata: Metadata = {
  metadataBase: new URL("https://fluentauf.com"),
  title: "Fluent AUF: Online German Language Classes",
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fluent AUF: Online German Language Classes",
    description: siteDescription,
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
    title: "Fluent AUF: Online German Language Classes",
    description: siteDescription,
    images: ["/og-share.png"],
  },
  verification: {
    google: "j7GpZqfU5BDf00hqe9oFK3iOQ1iKXOTUhmZTe5kji4Y",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <MobileContactBar />
      </body>
    </html>
  );
}
