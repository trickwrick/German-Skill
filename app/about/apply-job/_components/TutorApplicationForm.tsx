"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import PhoneField from "../../../contact/_components/PhoneField";
import { isAcceptedCareerCv } from "../../../../lib/careerCvValidation";

const germanLevelOptions = [
  "German A1",
  "German A2",
  "German B1",
  "German B2",
  "German C1",
  "German C2",
];

const experienceOptions = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5+ years",
];

export default function TutorApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");

  const maxCvSizeMb = 5;

  function handleCvChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setCvError("");

    if (!file) {
      setCvFile(null);
      return;
    }

    if (!isAcceptedCareerCv(file)) {
      setCvFile(null);
      setCvError("Please upload a PDF, DOC, or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > maxCvSizeMb * 1024 * 1024) {
      setCvFile(null);
      setCvError(`CV must be ${maxCvSizeMb}MB or smaller.`);
      event.target.value = "";
      return;
    }

    setCvFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!cvFile) {
      setCvError("Please upload your CV (PDF, DOC, or DOCX).");
      return;
    }

    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("cv", cvFile);

    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not submit your application.");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not submit your application.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setCvFile(null);
    setCvError("");
    setError("");
  }

  if (submitted) {
    return (
      <div className="contact-success">
        <div className="contact-success-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#dcfce7" />
            <path
              d="M8 12.5l2.5 2.5L16 9"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2>Application Received</h2>
        <p>
          Thank you for reaching out. Our team will review your profile and contact you within
          2–3 working days.
        </p>
        <button
          type="button"
          className="btn btn-primary contact-success-btn"
          onClick={resetForm}
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Apply as a German Tutor</h2>
      <p className="contact-form-lead">
        Share your details below and our team will connect with you about teaching opportunities
        at Fluent AUF.
      </p>

      <div className="contact-form-grid">
        <label className="contact-field">
          <span>Full Name *</span>
          <input type="text" name="name" required placeholder="Your full name" />
        </label>

        <label className="contact-field">
          <span>Email Address *</span>
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>

        <PhoneField />

        <label className="contact-field">
          <span>City *</span>
          <input type="text" name="city" required placeholder="Jaipur, Delhi, etc." />
        </label>

        <label className="contact-field">
          <span>Highest German Level *</span>
          <select name="germanLevel" required defaultValue="">
            <option value="" disabled>
              Select your level
            </option>
            {germanLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="contact-field">
          <span>Teaching Experience *</span>
          <select name="experience" required defaultValue="">
            <option value="" disabled>
              Select experience
            </option>
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="contact-field">
          <span>Certification</span>
          <input
            type="text"
            name="certification"
            placeholder="Goethe, telc, ÖSD, etc."
          />
        </label>
      </div>

      <label className="contact-field contact-field-full">
        <span>About You *</span>
        <textarea
          name="about"
          required
          rows={5}
          placeholder="Tell us about your teaching background, certifications, and why you want to join Fluent AUF..."
        />
      </label>

      <div className="contact-field contact-field-full contact-file-field">
        <span>Upload CV *</span>
        <label className="contact-file-upload">
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleCvChange}
          />
          <span className="contact-file-btn">Choose File</span>
          <span className="contact-file-name">
            {cvFile ? cvFile.name : "PDF, DOC, or DOCX up to 5MB"}
          </span>
        </label>
        {cvError ? <p className="contact-file-error">{cvError}</p> : null}
      </div>

      {error ? <p className="adm-form-message adm-form-message-error contact-form-error">{error}</p> : null}

      <button type="submit" className="btn btn-primary contact-submit-btn" disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
