"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { shortLabelCountries } from "../../data/shortLabelCountries";

const STORAGE_KEY = "fluentauf_welcome_popup_seen";

export default function WelcomeDiscountPopup() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || pathname.startsWith("/admin")) {
      return;
    }

    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (seen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
      document.body.style.overflow = "hidden";
    }, 900);

    return () => window.clearTimeout(timer);
  }, [mounted, pathname]);

  function markSeen() {
    window.localStorage.setItem(STORAGE_KEY, "1");
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
      window.setTimeout(() => {
        setOpen(false);
        document.body.style.overflow = "";
      }, 1800);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit your request.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="welcome-popup" role="dialog" aria-modal="true" aria-label="Discount coupon request">
      <button type="button" className="welcome-popup-backdrop" onClick={closePopup} aria-label="Close popup" />

      <div className="welcome-popup-panel">
        <button type="button" className="welcome-popup-close" onClick={closePopup} aria-label="Close">
          ×
        </button>

        <div className="welcome-popup-header">
          <h2>Discount Coupon?</h2>
          <p className="welcome-popup-title">Request Now</p>
          <p className="welcome-popup-subtitle">Fill the details below and get your German course offer!</p>
        </div>

        {success ? (
          <div className="welcome-popup-success">
            <strong>Thank you!</strong>
            <p>Our team will share your discount coupon shortly.</p>
          </div>
        ) : (
          <form className="welcome-popup-form" onSubmit={handleSubmit}>
            {error ? <p className="welcome-popup-error">{error}</p> : null}

            <label className="welcome-popup-field">
              <span className="welcome-popup-field-label">Full Name</span>
              <input type="text" name="name" required placeholder="Your full name" autoComplete="name" />
            </label>

            <label className="welcome-popup-field">
              <span className="welcome-popup-field-label">Email Address</span>
              <input type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
            </label>

            <div className="welcome-popup-field welcome-popup-phone-field">
              <span className="welcome-popup-field-label">Mobile</span>
              <div className="welcome-popup-phone">
                <PhoneInput
                  defaultCountry="in"
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  countries={shortLabelCountries}
                  forceDialCode
                  preferredCountries={["in", "de", "ae", "us", "gb", "ca", "au", "np", "bd", "sg"]}
                  placeholder="88269 67151"
                  required
                />
              </div>
            </div>

            <button type="submit" className="welcome-popup-submit" disabled={loading}>
              {loading ? "Submitting..." : "SUBMIT"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
