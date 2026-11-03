"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { buildThankYouUrl } from "../../lib/thankYouConfig";

const STORAGE_KEY = "fluentauf_diwali_popup_seen";
const SHOW_POPUP = true;

export default function WelcomeDiscountPopup() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Canvas Fireworks & Rocket Simulation Effect
  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "#ff0055",
      "#ff5500",
      "#ffcc00",
      "#00ffcc",
      "#3399ff",
      "#ff00cc",
      "#ffe600",
      "#ff3300",
      "#ffffff",
      "#00ff66",
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;
    }

    interface Rocket {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      trail: { x: number; y: number }[];
    }

    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    function createFirework(x: number, y: number, color?: string) {
      const baseColor = color || colors[Math.floor(Math.random() * colors.length)];
      const count = 45 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.4 ? baseColor : colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 2.5,
          decay: 0.012 + Math.random() * 0.018,
        });
      }
    }

    function launchRocket() {
      const x = Math.random() * width;
      const targetY = height * 0.15 + Math.random() * (height * 0.45);
      rockets.push({
        x,
        y: height,
        targetY,
        vy: -(8 + Math.random() * 5),
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    }

    // Initial burst
    for (let i = 0; i < 3; i++) {
      createFirework(
        width * (0.2 + i * 0.3),
        height * (0.25 + (i % 2) * 0.15)
      );
    }

    let lastRocketTime = 0;

    function render(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Launch rockets periodically
      if (time - lastRocketTime > 400 + Math.random() * 500) {
        launchRocket();
        lastRocketTime = time;
      }

      // Update & draw rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 5) r.trail.shift();

        // Draw trail
        ctx.beginPath();
        for (let j = 0; j < r.trail.length; j++) {
          ctx.lineTo(r.trail[j].x, r.trail[j].y);
        }
        ctx.strokeStyle = "#ffaa00";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        r.y += r.vy;

        // Sparkle near rocket head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffea00";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (r.y <= r.targetY) {
          createFirework(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update & draw explosion particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

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

      {/* Live Canvas Fireworks & Rocket Simulation */}
      <canvas ref={canvasRef} className="diwali-fireworks-canvas" aria-hidden="true" />

      {/* Floating Animated Rockets & Diyas */}
      <div className="diwali-rockets-container" aria-hidden="true">
        <div className="floating-rocket rocket-left">🚀</div>
        <div className="floating-rocket rocket-right">🚀</div>
        <div className="floating-anaar anaar-left">🎇</div>
        <div className="floating-anaar anaar-right">🎇</div>
      </div>

      <div className="diwali-popup-panel">
        <button type="button" className="diwali-popup-close" onClick={closePopup} aria-label="Close">
          ✕
        </button>

        {/* Festive Header */}
        <div className="diwali-popup-header">
          <div className="diwali-header-badge">
            <span className="diwali-diya-icon">🪔</span>
            <span>DIWALI DHAMAKA OFFER</span>
            <span className="diwali-diya-icon">🪔</span>
          </div>

          <h2 className="diwali-popup-title">
            Happy Diwali! <span className="diwali-sparkle-text">✨</span>
          </h2>
          <p className="diwali-popup-tagline">
            Celebrate with Grand Discounts on German Language Courses!
          </p>
          <div className="diwali-offer-pill">
            🎆 Flat 10% - Special Diwali Batches 🎆
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
              <span className="diwali-label">Phone / WhatsApp</span>
              <input
                type="tel"
                name="phone"
                required
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
          background: rgba(10, 4, 2, 0.82);
          backdrop-filter: blur(6px);
          cursor: pointer;
        }

        /* Fullscreen Canvas for Live Fireworks */
        .diwali-fireworks-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* Floating Rockets & Anaar */
        .diwali-rockets-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          overflow: hidden;
        }

        .floating-rocket {
          position: absolute;
          font-size: 2.8rem;
          filter: drop-shadow(0 0 12px #ff6600);
        }

        .rocket-left {
          bottom: -80px;
          left: 12%;
          animation: rocket-fly-left 4.5s ease-in-out infinite;
        }

        .rocket-right {
          bottom: -80px;
          right: 14%;
          animation: rocket-fly-right 5.2s ease-in-out 2.2s infinite;
        }

        @keyframes rocket-fly-left {
          0% {
            transform: translateY(0) rotate(-40deg) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) rotate(-35deg) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes rocket-fly-right {
          0% {
            transform: translateY(0) rotate(40deg) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) rotate(35deg) scale(1.1);
            opacity: 0;
          }
        }

        .floating-anaar {
          position: absolute;
          bottom: 25px;
          font-size: 2.4rem;
          filter: drop-shadow(0 0 16px #ffcc00);
          animation: anaar-sparkle 1.2s ease-in-out infinite alternate;
        }

        .anaar-left {
          left: 6%;
        }

        .anaar-right {
          right: 6%;
        }

        @keyframes anaar-sparkle {
          0% {
            transform: scale(0.9) rotate(-5deg);
            filter: drop-shadow(0 0 8px #ff9900);
          }
          100% {
            transform: scale(1.25) rotate(5deg);
            filter: drop-shadow(0 0 25px #ffea00);
          }
        }

        .diwali-popup-panel {
          position: relative;
          z-index: 10;
          width: min(100%, 460px);
          max-height: 92vh;
          overflow-y: auto;
          padding: 32px 26px 26px;
          border-radius: 24px;
          background: linear-gradient(180deg, #1f0b08 0%, #140303 100%);
          color: #fff;
          border: 2px solid #eab308;
          box-shadow: 0 0 40px rgba(234, 179, 8, 0.5), 0 25px 60px rgba(0, 0, 0, 0.7);
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

        @media (max-width: 640px) {
          .floating-anaar {
            display: none;
          }
          .floating-rocket {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}
