"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  enrollCourseLevels,
} from "../../../data/enrollFormOptions";

type CourseEnrollModalProps = {
  open: boolean;
  courseSlug: string;
  courseTitle: string;
  onClose: () => void;
};

export default function CourseEnrollModal({
  open,
  courseSlug,
  courseTitle,
  onClose,
}: CourseEnrollModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setError("");
      setLoading(false);
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function fitModal() {
      const shell = shellRef.current;
      const modal = modalRef.current;
      if (!shell || !modal) {
        return;
      }

      shell.style.transform = "translate(-50%, -50%)";

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const padV = 32;
      const padH = 24;
      const availableHeight = viewportHeight - padV;
      const availableWidth = viewportWidth - padH;

      const naturalHeight = modal.offsetHeight;
      const naturalWidth = shell.offsetWidth;
      const scale = Math.min(
        1,
        availableHeight / naturalHeight,
        availableWidth / naturalWidth
      );

      shell.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    fitModal();
    requestAnimationFrame(fitModal);
    window.addEventListener("resize", fitModal);
    window.visualViewport?.addEventListener("resize", fitModal);

    const observer = new ResizeObserver(fitModal);
    if (modalRef.current) {
      observer.observe(modalRef.current);
    }

    return () => {
      window.removeEventListener("resize", fitModal);
      window.visualViewport?.removeEventListener("resize", fitModal);
      observer.disconnect();
      if (shellRef.current) {
        shellRef.current.style.transform = "";
      }
    };
  }, [open, submitted]);

  if (!open || !mounted) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const levelSlug = String(formData.get("level") ?? courseSlug);
    const levelLabel =
      enrollCourseLevels.find((level) => level.slug === levelSlug)?.label ?? levelSlug;

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      course: courseTitle,
      level: levelLabel,
      courseSlug,
    };

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not submit your enquiry.");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not submit your enquiry.",
      );
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="enroll-modal-overlay" onClick={onClose} role="presentation">
      <div className="enroll-modal-shell" ref={shellRef}>
        <div
          className="enroll-modal"
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enroll-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="enroll-modal-close"
            aria-label="Close enrollment form"
            onClick={onClose}
          >
            ×
          </button>

          <div className="enroll-modal-header">
            <h2 id="enroll-modal-title">Book Your Free Demo</h2>
          </div>

          <div className="enroll-modal-stats">
            <div className="enroll-modal-stat">
              <span className="enroll-modal-stat-icon" aria-hidden="true">
                🎓
              </span>
              <span>100+ Batches</span>
            </div>
            <div className="enroll-modal-stat">
              <span className="enroll-modal-stat-icon" aria-hidden="true">
                👥
              </span>
              <span>Certified tutors</span>
            </div>
          </div>

          {submitted ? (
            <div className="enroll-modal-success">
              <strong>Thank you!</strong>
              <p>
                Your enquiry for <span>{courseTitle}</span> has been received. Our team will
                contact you shortly.
              </p>
              <button
                type="button"
                className="btn btn-primary enroll-modal-submit"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          ) : (
            <form className="enroll-modal-form" onSubmit={handleSubmit}>
              <div className="enroll-modal-course-banner">
                <span>Enquiring for</span>
                <strong>{courseTitle}</strong>
              </div>

              {error ? <p className="enroll-modal-error">{error}</p> : null}

              <input type="hidden" name="course" value={courseTitle} />

              <label className="enroll-modal-field">
                <input type="text" name="name" required placeholder="Full Name" />
              </label>

              <label className="enroll-modal-field">
                <input type="email" name="email" required placeholder="Email" />
              </label>

              <label className="enroll-modal-field">
                <input type="tel" name="phone" required placeholder="Phone Number" />
              </label>

              <label className="enroll-modal-field">
                <input type="text" name="city" required placeholder="City" />
              </label>

              <label className="enroll-modal-field">
                <span>Select Level *</span>
                <select name="level" defaultValue={courseSlug} required>
                  {enrollCourseLevels.map((level) => (
                    <option key={level.slug} value={level.slug}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </label>


              <button
                type="submit"
                className="btn btn-primary enroll-modal-submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Enquire Now"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
