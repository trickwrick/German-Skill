"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { THANK_YOU_CONFIG, getSafeReturnUrl } from "../../../lib/thankYouConfig";

export default function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Resolve and sanitize return URL
  const returnUrl = useMemo(() => {
    const fromParam = searchParams.get("returnUrl");
    if (fromParam) {
      return getSafeReturnUrl(fromParam);
    }

    if (typeof window !== "undefined") {
      try {
        const fromStorage = sessionStorage.getItem(THANK_YOU_CONFIG.storageKey);
        if (fromStorage) {
          return getSafeReturnUrl(fromStorage);
        }
      } catch {
        // Fallback below
      }
    }

    return THANK_YOU_CONFIG.defaultReturnUrl;
  }, [searchParams]);

  const totalMs: number = THANK_YOU_CONFIG.redirectDelayMs;
  const [msRemaining, setMsRemaining] = useState<number>(totalMs);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const intervalMs = 50;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalMs - elapsed);
      setMsRemaining(remaining);

      if (remaining <= 0) {
        window.clearInterval(interval);
        setRedirected(true);

        // Clear stored return URL after redirect
        try {
          sessionStorage.removeItem(THANK_YOU_CONFIG.storageKey);
        } catch {
          // Ignore
        }

        // Use router.replace or fallback to window.location.replace to prevent back-button trap
        try {
          router.replace(returnUrl);
        } catch {
          window.location.replace(returnUrl);
        }
      }
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [returnUrl, router, totalMs]);

  const secondsLeft = Math.max(1, Math.ceil(msRemaining / 1000));
  const progressPercent = Math.min(100, Math.max(0, ((totalMs - msRemaining) / totalMs) * 100));

  return (
    <div className="thank-you-wrapper">
      <div className="thank-you-card" role="status" aria-live="polite">
        <div className="thank-you-icon-box" aria-hidden="true">
          <div className="thank-you-icon-pulse" />
          <svg
            className="thank-you-check-svg"
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="11" className="thank-you-check-bg" />
            <path
              d="M7.5 12.5L10.5 15.5L16.5 9"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="thank-you-check-path"
            />
          </svg>
        </div>

        <h1 className="thank-you-title">Thank You!</h1>
        <p className="thank-you-subtitle">
          Your enquiry has been submitted successfully.
        </p>
        <p className="thank-you-description">
          Our German language education advisors have received your details and will get in touch with you shortly.
        </p>

        <div className="thank-you-redirect-panel">
          <div className="thank-you-redirect-meta">
            <span className="thank-you-spinner" aria-hidden="true" />
            <span className="thank-you-redirect-text">
              {redirected ? "Redirecting now..." : `Redirecting you back in ${secondsLeft}s...`}
            </span>
          </div>

          <div className="thank-you-progress-track" aria-hidden="true">
            <div
              className="thank-you-progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="thank-you-actions">
          <Link
            href={returnUrl}
            className="btn btn-primary thank-you-btn"
            onClick={() => {
              try {
                sessionStorage.removeItem(THANK_YOU_CONFIG.storageKey);
              } catch {
                // Ignore
              }
            }}
          >
            Back to Page Now
          </Link>
        </div>

        <p className="thank-you-safe-note">
          If you are not redirected automatically, please click the button above.
        </p>
      </div>
    </div>
  );
}
