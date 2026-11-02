"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { buildThankYouUrl } from "../../lib/thankYouConfig";

const STORAGE_KEY = "fluentauf_diwali_popup_seen";
// Set to true to activate
const SHOW_POPUP = true;

export default function WelcomeDiscountPopup() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
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

    const timer = window.setTimeout(() => {
      setOpen(true);
      document.body.style.overflow = "hidden";
    }, 100);

    return () => window.clearTimeout(timer);
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
      phone: String(formData.get("phone") ?? "").trim(),
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
    <div className="diwali-popup-wrap" role="dialog" aria-modal="true" aria-label="Diwali Special Offer">
      <button type="button" className="diwali-popup-backdrop" onClick={closePopup} aria-label="Close popup" />

      {/* Firecracker & spark particles */}
      <div className="diwali-sparkles" aria-hidden="true">
        <span className="spark spark-1">✨</span>
        <span className="spark spark-2">🎆</span>
        <span className="spark spark-3">🎇</span>
        <span className="spark spark-4">🪔</span>
        <span className="spark spark-5">✨</span>
        <span className="spark spark-6">🎆</span>
        <span className="spark spark-7">🎇</span>
        <span className="spark spark-8">🪔</span>
      </div>

      <div className="diwali-popup-panel">
        <button type="button" className="diwali-popup-close" onClick={closePopup} aria-label="Close">
          ✕
        </button>

        {/* Festive Header with Diya & Lighting effects */}
        <div className="diwali-popup-header">
          <div className="diwali-header-badge">
            <span className="diwali-diya-icon">🪔</span>
            <span>DIWALI SPECIAL OFFER</span>
            <span className="diwali-diya-icon">🪔</span>
          </div>

          <h2 className="diwali-popup-title">
            Happy Diwali! <span className="diwali-sparkle-text">✨</span>
          </h2>
          <p className="diwali-popup-tagline">
            Special Festive Discount on All German Language Courses!
          </p>
          <div className="diwali-offer-pill">
            🎉 Flat 20% OFF — Limited Time Festive Batches 🎉
          </div>
        </div>

        {success ? (
          <div className="diwali-popup-success">
            <strong>🪔 Happy Diwali! 🪔</strong>
            <p>Your offer request has been received. Our team will contact you shortly with the best festive discount!</p>
          </div>
        ) : (
          <form className="diwali-popup-form" onSubmit={handleSubmit}>
            {error ? <p className="diwali-popup-error">{error}</p> : null}

            <label className="diwali-field">
              <span className="diwali-label">Your Name</span>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </label>



            <label className="diwali-field">
              <span className="diwali-label">Phone / WhatsApp (Optional)</span>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </label>

            <label className="diwali-field">
              <span className="diwali-label">Message</span>
              <textarea
                name="message"
                rows={3}
                placeholder="Which German course (A1, A2, B1, B2) are you interested in?"
              />
            </label>

            <button type="submit" className="diwali-submit-btn" disabled={loading}>
              <span className="diwali-btn-shine" />
              {loading ? "Submitting..." : "🪔 Claim Your Diwali Discount"}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .diwali-popup-wrap {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .diwali-popup-backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(10, 5, 2, 0.78);
          backdrop-filter: blur(8px);
          cursor: pointer;
        }

        /* Sparkles & Crackers animation */
        .diwali-sparkles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .spark {
          position: absolute;
          font-size: 1.5rem;
          animation: float-sparkle 6s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 8px #ffb703);
        }
        .spark-1 { top: 12%; left: 15%; animation-delay: 0s; font-size: 2rem; }
        .spark-2 { top: 18%; right: 18%; animation-delay: 1.2s; font-size: 2.3rem; }
        .spark-3 { bottom: 20%; left: 12%; animation-delay: 2.1s; font-size: 2rem; }
        .spark-4 { bottom: 25%; right: 15%; animation-delay: 0.8s; font-size: 1.8rem; }
        .spark-5 { top: 45%; left: 8%; animation-delay: 3s; font-size: 1.6rem; }
        .spark-6 { top: 50%; right: 9%; animation-delay: 2.5s; font-size: 2.1rem; }
        .spark-7 { top: 8%; left: 45%; animation-delay: 1.7s; font-size: 1.8rem; }
        .spark-8 { bottom: 10%; right: 42%; animation-delay: 3.4s; font-size: 2rem; }

        @keyframes float-sparkle {
          0% { transform: translateY(0) scale(0.9) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-18px) scale(1.2) rotate(15deg); opacity: 1; }
          100% { transform: translateY(-30px) scale(0.95) rotate(-15deg); opacity: 0.7; }
        }

        .diwali-popup-panel {
          position: relative;
          z-index: 10;
          width: min(100%, 450px);
          max-height: 92vh;
          overflow-y: auto;
          padding: 30px 24px 24px;
          border-radius: 24px;
          background: linear-gradient(180deg, #1f0b08 0%, #160404 100%);
          color: #fff;
          border: 2px solid #eab308;
          box-shadow: 0 0 35px rgba(234, 179, 8, 0.45), 0 25px 60px rgba(0, 0, 0, 0.6);
          animation: diwali-popup-bounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes diwali-popup-bounce {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(25px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .diwali-popup-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(234, 179, 8, 0.4);
          background: rgba(255, 255, 255, 0.1);
          color: #fbbf24;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .diwali-popup-close:hover {
          background: #eab308;
          color: #000;
          transform: rotate(90deg);
        }

        .diwali-popup-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .diwali-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 14px;
          border-radius: 999px;
          background: rgba(234, 179, 8, 0.15);
          border: 1px solid #eab308;
          color: #fde047;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .diwali-diya-icon {
          font-size: 0.95rem;
          animation: pulse-diya 1.5s ease-in-out infinite;
        }

        @keyframes pulse-diya {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 3px #f59e0b); }
          50% { transform: scale(1.25); filter: drop-shadow(0 0 8px #f59e0b); }
        }

        .diwali-popup-title {
          margin: 0 0 6px;
          font-size: 1.85rem;
          font-weight: 800;
          line-height: 1.2;
          background: linear-gradient(135deg, #fff 20%, #fef08a 60%, #eab308 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .diwali-sparkle-text {
          -webkit-text-fill-color: initial;
          display: inline-block;
          animation: spin-sparkle 3s linear infinite;
        }

        @keyframes spin-sparkle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .diwali-popup-tagline {
          margin: 0 0 12px;
          font-size: 0.88rem;
          color: #fecdd3;
          line-height: 1.4;
        }

        .diwali-offer-pill {
          background: linear-gradient(90deg, #b91c1c 0%, #991b1b 100%);
          color: #fef08a;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px dashed #facc15;
          box-shadow: 0 4px 12px rgba(185, 28, 28, 0.4);
        }

        .diwali-popup-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .diwali-popup-error {
          background: rgba(220, 38, 38, 0.2);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          margin: 0;
        }

        .diwali-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align: left;
        }

        .diwali-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #fde047;
          letter-spacing: 0.02em;
        }

        .diwali-field input,
        .diwali-field textarea {
          width: 100%;
          padding: 9px 13px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(234, 179, 8, 0.35);
          border-radius: 10px;
          color: #fff;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }

        .diwali-field input::placeholder,
        .diwali-field textarea::placeholder {
          color: #9ca3af;
          font-size: 0.85rem;
        }

        .diwali-field input:focus,
        .diwali-field textarea:focus {
          border-color: #facc15;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.25);
        }

        .diwali-submit-btn {
          position: relative;
          overflow: hidden;
          margin-top: 6px;
          padding: 12px 20px;
          border-radius: 12px;
          border: 0;
          background: linear-gradient(135deg, #eab308 0%, #ca8a04 50%, #b45309 100%);
          color: #111;
          font-weight: 800;
          font-size: 0.96rem;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(234, 179, 8, 0.45);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .diwali-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(234, 179, 8, 0.6);
        }

        .diwali-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .diwali-btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          transform: skewX(-20deg);
          animation: diwali-btn-glow 3s infinite;
        }

        @keyframes diwali-btn-glow {
          0% { left: -100%; }
          30%, 100% { left: 200%; }
        }

        .diwali-popup-success {
          text-align: center;
          padding: 30px 10px;
        }
        .diwali-popup-success strong {
          display: block;
          font-size: 1.3rem;
          color: #fde047;
          margin-bottom: 8px;
        }
        .diwali-popup-success p {
          color: #fecdd3;
          font-size: 0.9rem;
          line-height: 1.5;
        }
      `}</style>
    </div>,
    document.body,
  );
}
