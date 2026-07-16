import type { Metadata } from "next";
import "../styles/globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MobileContactBar from "./components/MobileContactBar";
import WelcomeDiscountPopup from "./components/WelcomeDiscountPopup";
import JsonLd from "./components/JsonLd";
import { buildOrganizationSchema, buildWebSiteSchema, SITE_URL } from "../lib/siteSeo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "j7GpZqfU5BDf00hqe9oFK3iOQ1iKXOTUhmZTe5kji4Y",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [buildOrganizationSchema(), buildWebSiteSchema()];

  return (
    <html lang="en">
      <head>
        <JsonLd data={jsonLd} />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
        <WelcomeDiscountPopup />
        <MobileContactBar />
      </body>
    </html>
  );
}
