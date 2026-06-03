"use client";

import { useState, type FormEvent } from "react";

const courseOptions = [
  "German Level A1",
  "German Level A2",
  "German Level B1",
  "German Level B2",
  "German Level C1",
  "German Level C2",
  "Free Demo Class",
  "General Inquiry",
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
        <h2>Thank You!</h2>
        <p>
          Your message has been received. Our team will get back to you within 24
          hours on working days.
        </p>
        <button
          type="button"
          className="btn btn-primary contact-success-btn"
          onClick={() => setSubmitted(false)}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Send Us a Message</h2>
      <p className="contact-form-lead">
        Have questions about courses, batches, or fees? Fill in the form and we&apos;ll
        reach out shortly.
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

        <label className="contact-field">
          <span>Phone Number *</span>
          <input type="tel" name="phone" required placeholder="+91 98765 43210" />
        </label>

        <label className="contact-field">
          <span>Interested In</span>
          <select name="course" defaultValue="">
            <option value="" disabled>
              Select a course or inquiry type
            </option>
            {courseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="contact-field contact-field-full">
        <span>Message *</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us how we can help you..."
        />
      </label>

      <button type="submit" className="btn btn-primary contact-submit-btn">
        Submit Message
      </button>
    </form>
  );
}
