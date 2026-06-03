"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import {
  batchScheduleOptions,
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
  const [mounted, setMounted] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
              <span>10K+ Certified Learners</span>
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

              <div className="enroll-modal-row">
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

                <label className="enroll-modal-field">
                  <span>Batch Schedule *</span>
                  <select name="batchSchedule" defaultValue={batchScheduleOptions[2]} required>
                    {batchScheduleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="enroll-modal-consent">
                <input type="checkbox" name="consent" required />
                <span>I agree to receive information from GermanSkill.</span>
              </label>

              <button type="submit" className="btn btn-primary enroll-modal-submit">
                Enquire Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
