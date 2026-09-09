import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import ThankYouContent from "./_components/ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You | Fluent AUF",
  description: "Thank you! Your enquiry has been submitted successfully.",
  robots: {
    index: false,
    follow: false,
  },
};

function ThankYouFallback() {
  return (
    <div className="thank-you-wrapper">
      <div className="thank-you-card">
        <div className="thank-you-icon-box" aria-hidden="true">
          <svg className="thank-you-check-svg" width="56" height="56" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#16a34a" />
            <path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="thank-you-title">Thank You!</h1>
        <p className="thank-you-subtitle">Your enquiry has been submitted successfully.</p>
        <p className="thank-you-description">Redirecting you back...</p>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main className="thank-you-main">
        <Suspense fallback={<ThankYouFallback />}>
          <ThankYouContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
