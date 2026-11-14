"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { shortLabelCountries } from "../../data/shortLabelCountries";
import { buildThankYouUrl } from "../../lib/thankYouConfig";

const STORAGE_KEY = "fluentauf_special_offer_popup_seen";
const SHOW_POPUP = true;

export default function WelcomeDiscountPopup() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("+91");
  const [popupHeading, setPopupHeading] = useState("Apply Code: FESTIVE10 (10%OFF)");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!SHOW_POPUP || !mounted || pathname.startsWith("/admin")) {
      return;
    }

    const seen = window.sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      return;
    }

    let isMounted = true;
    async function fetchHeading() {
      try {
        const res = await fetch("/api/announcement");
        if (!res.ok) return;
        const data = (await res.json()) as { popupTitle?: string };
        if (isMounted && data && typeof data.popupTitle === "string" && data.popupTitle.trim()) {
          setPopupHeading(data.popupTitle.trim());
        }
      } catch {
        // silent fallback
      }
    }
    fetchHeading();

    const timer = window.setTimeout(() => {
      setOpen(true);
      document.body.style.overflow = "hidden";
    }, 100);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [mounted, pathname]);

  function markSeen() {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  }

  function closePopup() {
    markSeen();
    setOpen(false);
    document.body.style.overflow = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      phone: phone.trim(),
    };

    try {
      const response = await fetch("/api/discount-popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not submit your request.");
      }

      setSuccess(true);
      markSeen();
      document.body.style.overflow = "";
      setOpen(false);
      router.push(buildThankYouUrl());
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit your request.");
    } finally {
      setLoading(false);
    }
  }

  if (!SHOW_POPUP || !mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="promo-popup-wrap" role="dialog" aria-modal="true" aria-label="Special Discount Offer">
      <button type="button" className="promo-popup-backdrop" onClick={closePopup} aria-label="Close popup" />

      <div className="promo-popup-card">
        <button type="button" className="promo-popup-close-btn" onClick={closePopup} aria-label="Close">
          ✕
        </button>

        {/* Title Heading */}
        <div className="promo-popup-head">
          <h2 className="promo-popup-title">
            {popupHeading}
          </h2>
        </div>

        {success ? (
          <div className="promo-popup-success">
            <strong>Thank You!</strong>
            <p>Your request has been received. Our team will contact you shortly.</p>
          </div>
        ) : (
          <form className="promo-popup-form" onSubmit={handleSubmit}>
            {error ? <p className="promo-popup-error">{error}</p> : null}

            {/* Full Name Field */}
            <div className="promo-field-group">
              <label className="promo-field-label">
                Full Name <span className="promo-required">*</span>
              </label>
              <div className="promo-input-box">
                <span className="promo-input-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder=""
                  autoComplete="name"
                  className="promo-text-input"
                />
              </div>
            </div>

            {/* Email Address Field */}
            <div className="promo-field-group">
              <label className="promo-field-label">
                Email Address
              </label>
              <div className="promo-input-box">
                <span className="promo-input-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder=""
                  autoComplete="email"
                  className="promo-text-input"
                />
              </div>
            </div>

            {/* Mobile Number Field */}
            <div className="promo-field-group">
              <label className="promo-field-label">
                Mobile Number <span className="promo-required">*</span>
              </label>
              <div className="promo-phone-container">
                <PhoneInput
                  defaultCountry="in"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  countries={shortLabelCountries}
                  forceDialCode
                  preferredCountries={["in", "de", "ae", "us", "gb", "ca", "au", "np", "bd", "sg"]}
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="promo-submit-btn" disabled={loading}>
              {loading ? "Submitting..." : (
                <>
                  <span>Submit Request</span>
                  <span className="promo-arrow-icon" aria-hidden="true">↗</span>
                </>
              )}
            </button>

            {/* Confidential footer text */}
            <p className="promo-footer-note">
              <span className="promo-verified-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#dcfce7" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </span>
              <span>100% Secure &amp; Confidential | We Respect Your Privacy</span>
            </p>
          </form>
        )}
      </div>

      <style jsx>{`
        .promo-popup-wrap {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .promo-popup-backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          cursor: pointer;
        }

        /* Wider width, compact height */
        .promo-popup-card {
          position: relative;
          z-index: 10;
          width: min(100%, 500px);
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px 30px 22px;
          border-radius: 16px;
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
          animation: promo-popup-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes promo-popup-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .promo-popup-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 0;
          background: #f1f5f9;
          color: #64748b;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .promo-popup-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .promo-popup-head {
          padding-right: 36px;
          margin-bottom: 20px;
        }

        .promo-popup-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .promo-popup-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .promo-popup-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          margin: 0;
        }

        .promo-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .promo-field-label {
          font-size: 0.86rem;
          font-weight: 700;
          color: #1e293b;
        }

        .promo-required {
          color: #ef4444;
          font-weight: 700;
        }

        .promo-input-box {
          display: flex;
          align-items: center;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          overflow: hidden;
        }

        .promo-input-box:focus-within {
          border-color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
        }

        .promo-input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          color: #94a3b8;
          border-right: 1px solid #e2e8f0;
          background: #f8fafc;
          align-self: stretch;
        }

        .promo-text-input {
          flex: 1;
          width: 100%;
          border: 0;
          outline: none;
          padding: 10px 14px;
          font-size: 0.92rem;
          color: #0f172a;
          background: transparent;
        }

        .promo-text-input::placeholder {
          color: #94a3b8;
          font-size: 0.88rem;
        }

        /* Phone Input Styling */
        .promo-phone-container :global(.react-international-phone-input-container) {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          overflow: visible !important;
          position: relative;
        }
        .promo-phone-container :global(.react-international-phone-input-container:focus-within) {
          border-color: #b91c1c;
          box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
        }
        .promo-phone-container :global(.react-international-phone-country-selector) {
          position: relative;
        }
        .promo-phone-container :global(.react-international-phone-country-selector-button) {
          border: 0 !important;
          border-right: 1px solid #e2e8f0 !important;
          background: #f8fafc !important;
          padding: 0 10px !important;
          height: 42px !important;
          border-radius: 6px 0 0 6px !important;
        }
        .promo-phone-container :global(.react-international-phone-input) {
          border: 0 !important;
          height: 42px !important;
          font-size: 0.92rem !important;
          color: #0f172a !important;
          padding: 0 14px !important;
          width: 100% !important;
          border-radius: 0 6px 6px 0 !important;
        }
        .promo-phone-container :global(.react-international-phone-country-selector-dropdown) {
          position: absolute !important;
          top: calc(100% + 4px) !important;
          bottom: auto !important;
          left: 0 !important;
          width: 280px !important;
          max-height: 200px !important;
          padding: 4px !important;
          margin: 0 !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          background: #ffffff !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15) !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          z-index: 999999 !important;
        }
        .promo-phone-container :global(.react-international-phone-country-selector-dropdown__list-item) {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 8px 10px !important;
          font-size: 0.86rem !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          color: #1e293b !important;
        }
        .promo-phone-container :global(.react-international-phone-country-selector-dropdown__list-item:hover),
        .promo-phone-container :global(.react-international-phone-country-selector-dropdown__list-item--focused) {
          background: #f1f5f9 !important;
        }

        /* Submit Button */
        .promo-submit-btn {
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px 20px;
          border-radius: 8px;
          border: 0;
          background: #b91c1c;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.98rem;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .promo-submit-btn:hover {
          background: #991b1b;
        }
        .promo-submit-btn:active {
          transform: scale(0.99);
        }
        .promo-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .promo-arrow-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .promo-footer-note {
          margin: 6px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
        }

        .promo-verified-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .promo-popup-success {
          text-align: center;
          padding: 24px 10px;
        }
        .promo-popup-success strong {
          display: block;
          font-size: 1.25rem;
          color: #0f172a;
          margin-bottom: 6px;
        }
        .promo-popup-success p {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }
      `}</style>
    </div>,
    document.body,
  );
}
