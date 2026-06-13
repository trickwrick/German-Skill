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
        url: "/fluent-logo-new.png",
        width: 512,
        height: 512,
        alt: "Fluent AUF",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Fluent AUF: Online German Language Classes",
    description: siteDescription,
    images: ["/fluent-logo-new.png"],
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
