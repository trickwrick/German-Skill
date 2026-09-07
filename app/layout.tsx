import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "../styles/globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";
import MobileContactBar from "./components/MobileContactBar";
import JsonLd from "./components/JsonLd";
import { buildOrganizationSchema, buildWebSiteSchema, SITE_URL } from "../lib/siteSeo";

const WelcomeDiscountPopup = dynamic(
  () => {
    // @ts-expect-error Next.js resolves the TSX module without a .js extension.
    return import("./components/WelcomeDiscountPopup");
  },
  { ssr: false },
);

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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TW4JQ5K8');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <JsonLd data={jsonLd} />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TW4JQ5K8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <GoogleAnalytics />
        {children}
        <WelcomeDiscountPopup />
        <MobileContactBar />
      </body>
    </html>
  );
}
