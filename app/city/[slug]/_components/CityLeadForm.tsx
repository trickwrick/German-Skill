"use client";

import { useState, type FormEvent } from "react";
import { enrollCourseLevels } from "../../../../data/enrollFormOptions";

type CityLeadFormProps = {
  cityName: string;
};

export default function CityLeadForm({ cityName }: CityLeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const levelSlug = String(formData.get("level") ?? "").trim();
    const level = enrollCourseLevels.find((item) => item.slug === levelSlug);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: cityName,
      level: level?.label ?? levelSlug,
      course: level?.title ?? `German Classes in ${cityName}`,
      courseSlug: levelSlug || "a1",
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
      event.currentTarget.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not submit your enquiry.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="city-lead-success">
        <strong>Thank you!</strong>
        <p>Our team will call you shortly about German classes in {cityName}.</p>
        <button type="button" className="city-lead-submit" onClick={() => setSubmitted(false)}>
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="city-lead-form" onSubmit={handleSubmit}>
      <h2>Enquire Now</h2>
      <p className="city-lead-note">Get batch details for German classes in {cityName}.</p>

      {error ? <p className="city-lead-error">{error}</p> : null}

      <div className="city-lead-row">
        <label className="city-lead-field">
          <span>Full Name *</span>
          <input type="text" name="name" required placeholder="Your name" />
        </label>

        <label className="city-lead-field">
          <span>Phone *</span>
          <input type="tel" name="phone" required placeholder="10-digit mobile" />
        </label>
      </div>

      <div className="city-lead-row">
        <label className="city-lead-field">
          <span>Email *</span>
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>

        <label className="city-lead-field">
          <span>Level *</span>
          <select name="level" required defaultValue="a1">
            {enrollCourseLevels.map((level) => (
              <option key={level.slug} value={level.slug}>
                {level.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <input type="hidden" name="city" value={cityName} />

      <button type="submit" className="city-lead-submit" disabled={loading}>
        {loading ? "Submitting..." : "Request A Call Back"}
      </button>
    </form>
  );
}
