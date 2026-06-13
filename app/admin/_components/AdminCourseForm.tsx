"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { CourseReview } from "../../../data/courseContent.types";
import type {
  AdminCoursePayload,
  CourseFaqItem,
  CourseReviewsSummary,
} from "../../../data/adminCourseDetails.types";
import {
  defaultFaqItem,
  defaultReviewItem,
  defaultReviewsSummary,
  reviewColorOptions,
} from "../../../data/adminCourseDetails.types";
import { courseLevelOptions } from "../../../data/adminCourseLevels";
import type { GermanCourse } from "../../../data/germanCourses";

type AdminCourseFormProps = {
  mode: "create" | "edit";
  lockedSlug?: string;
  initialValues?: Partial<GermanCourse>;
  descriptionPreview?: string[];
  initialFaqs?: CourseFaqItem[];
  initialReviewsSummary?: CourseReviewsSummary;
  initialReviews?: CourseReview[];
};

const emptyValues: Partial<GermanCourse> = {
  slug: "",
  pathName: "",
  title: "",
  description: "",
  hours: "",
  learningHours: "",
  price: "",
  image: "/courses/german-a1.jpg",
  batchSize: "20-40 Students",
  enrolled: "0",
  rating: "4.50",
  reviewCount: "0",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminCourseForm({
  mode,
  lockedSlug,
  initialValues,
  descriptionPreview = [],
  initialFaqs = [{ ...defaultFaqItem }],
  initialReviewsSummary = defaultReviewsSummary,
  initialReviews = [],
}: AdminCourseFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Partial<GermanCourse>>({
    ...emptyValues,
    ...initialValues,
    slug: lockedSlug ?? initialValues?.slug ?? "",
  });
  const [faqs, setFaqs] = useState<CourseFaqItem[]>(
    initialFaqs.length ? initialFaqs : [{ ...defaultFaqItem }],
  );
  const [reviewsSummary, setReviewsSummary] = useState<CourseReviewsSummary>(initialReviewsSummary);
  const [reviews, setReviews] = useState<CourseReview[]>(initialReviews);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof GermanCourse>(field: K, value: GermanCourse[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleLevelChange(level: string) {
    setValues((current) => ({
      ...current,
      slug: level,
      pathName: current.pathName || `german-${level}`,
    }));
  }

  function updateFaq(index: number, field: keyof CourseFaqItem, value: string) {
    setFaqs((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addFaq() {
    setFaqs((current) => [...current, { ...defaultFaqItem }]);
  }

  function removeFaq(index: number) {
    setFaqs((current) => (current.length === 1 ? current : current.filter((_, i) => i !== index)));
  }

  function updateReview(index: number, field: keyof CourseReview, value: string | number) {
    setReviews((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const next = { ...item, [field]: value } as CourseReview;
        if (field === "name" && typeof value === "string") {
          next.initials = getInitials(value);
        }

        return next;
      }),
    );
  }

  function addReview() {
    setReviews((current) => [...current, { ...defaultReviewItem }]);
  }

  function removeReview(index: number) {
    setReviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateBreakdown(index: number, percent: number) {
    setReviewsSummary((current) => ({
      ...current,
      breakdown: current.breakdown.map((row, rowIndex) =>
        rowIndex === index ? { ...row, percent } : row,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const courseSlug = lockedSlug ?? values.slug ?? "";
    const payload: AdminCoursePayload = {
      ...(values as GermanCourse),
      slug: courseSlug,
      reviewCount: String(reviews.length),
      faqs,
      reviewsSummary: {
        ...reviewsSummary,
        total: reviews.length,
        average: values.rating ?? reviewsSummary.average,
      },
      reviews,
    };

    try {
      const response = await fetch("/api/admin/courses", {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not save course. Please try again.");
        return;
      }

      setSuccess(data.message ?? "Course saved successfully.");
      setTimeout(() => {
        router.push("/admin/courses");
        router.refresh();
      }, 800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="adm-course-form" onSubmit={handleSubmit}>
      <section className="adm-panel">
        <h2 className="adm-panel-title">Basic Information</h2>
        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full">
            <span>Course Title</span>
            <input
              type="text"
              value={values.title ?? ""}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="German A1 Level : For Beginners!"
              required
            />
          </label>

          <label className="adm-form-field">
            <span>Level</span>
            <select
              value={values.slug ?? ""}
              onChange={(event) => handleLevelChange(event.target.value)}
              disabled={mode === "edit" && Boolean(lockedSlug)}
              required
            >
              <option value="">Select level</option>
              {courseLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="adm-form-field">
            <span>URL Slug</span>
            <input
              type="text"
              value={values.pathName ?? ""}
              onChange={(event) => updateField("pathName", event.target.value)}
              placeholder="german-a1"
              required
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Short Description</span>
            <textarea
              value={values.description ?? ""}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Brief course summary shown on cards and course header."
              rows={3}
              required
            />
          </label>
        </div>
      </section>

      <section className="adm-panel">
        <h2 className="adm-panel-title">Pricing & Duration</h2>
        <div className="adm-form-grid">
          <label className="adm-form-field">
            <span>Price</span>
            <input
              type="text"
              value={values.price ?? ""}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="₹14,999.00"
              required
            />
          </label>

          <label className="adm-form-field">
            <span>Display Hours</span>
            <input
              type="text"
              value={values.hours ?? ""}
              onChange={(event) => updateField("hours", event.target.value)}
              placeholder="111 Hours +"
              required
            />
          </label>

          <label className="adm-form-field">
            <span>Learning Hours</span>
            <input
              type="text"
              value={values.learningHours ?? ""}
              onChange={(event) => updateField("learningHours", event.target.value)}
              placeholder="111 Hours"
            />
          </label>

          <label className="adm-form-field">
            <span>Batch Size</span>
            <input
              type="text"
              value={values.batchSize ?? ""}
              onChange={(event) => updateField("batchSize", event.target.value)}
              placeholder="20-40 Students"
            />
          </label>
        </div>
      </section>

      <section className="adm-panel">
        <h2 className="adm-panel-title">Media & Stats</h2>
        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full">
            <span>Course Image Path</span>
            <input
              type="text"
              value={values.image ?? ""}
              onChange={(event) => updateField("image", event.target.value)}
              placeholder="/courses/german-a1.jpg"
              required
            />
          </label>

          <label className="adm-form-field">
            <span>Enrolled Students</span>
            <input
              type="text"
              value={values.enrolled ?? ""}
              onChange={(event) => updateField("enrolled", event.target.value)}
              placeholder="112"
            />
          </label>

          <label className="adm-form-field">
            <span>Rating</span>
            <input
              type="text"
              value={values.rating ?? ""}
              onChange={(event) => updateField("rating", event.target.value)}
              placeholder="4.50"
            />
          </label>

          <label className="adm-form-field">
            <span>Review Count</span>
            <input
              type="text"
              value={values.reviewCount ?? ""}
              onChange={(event) => updateField("reviewCount", event.target.value)}
              placeholder="37"
            />
          </label>
        </div>
      </section>

      <section className="adm-panel adm-panel-readonly">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Description Tab</h2>
          <span className="adm-readonly-tag">Fixed</span>
        </div>
        <p className="adm-panel-note">
          Course details page par Description tab ka content same rahega. Is section ko admin se change
          nahi kiya ja sakta.
        </p>
        <div className="adm-readonly-content">
          {descriptionPreview.length ? (
            descriptionPreview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>Description content is generated automatically for this course level.</p>
          )}
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">FAQ</h2>
          <button type="button" className="adm-btn adm-btn-secondary adm-btn-small" onClick={addFaq}>
            + Add FAQ
          </button>
        </div>

        <div className="adm-repeat-list">
          {faqs.map((faq, index) => (
            <article key={`faq-${index}`} className="adm-repeat-card">
              <div className="adm-repeat-card-head">
                <strong>FAQ {index + 1}</strong>
                <button
                  type="button"
                  className="adm-text-btn"
                  onClick={() => removeFaq(index)}
                  disabled={faqs.length === 1}
                >
                  Remove
                </button>
              </div>

              <label className="adm-form-field adm-form-field-full">
                <span>Question</span>
                <input
                  type="text"
                  value={faq.q}
                  onChange={(event) => updateFaq(index, "q", event.target.value)}
                  placeholder="Do I need any prior knowledge of German?"
                  required
                />
              </label>

              <label className="adm-form-field adm-form-field-full">
                <span>Answer</span>
                <textarea
                  value={faq.a}
                  onChange={(event) => updateFaq(index, "a", event.target.value)}
                  placeholder="No. This course is designed for complete beginners."
                  rows={3}
                  required
                />
              </label>
            </article>
          ))}
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Reviews</h2>
          <button
            type="button"
            className="adm-btn adm-btn-secondary adm-btn-small"
            onClick={addReview}
          >
            + Add Review
          </button>
        </div>

        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full">
            <span>Reviews Note</span>
            <textarea
              value={reviewsSummary.note}
              onChange={(event) =>
                setReviewsSummary((current) => ({ ...current, note: event.target.value }))
              }
              rows={2}
            />
          </label>

          {reviewsSummary.breakdown.map((row, index) => (
            <label key={row.stars} className="adm-form-field">
              <span>{row.stars} Star %</span>
              <input
                type="number"
                min="0"
                max="100"
                value={row.percent}
                onChange={(event) => updateBreakdown(index, Number(event.target.value))}
              />
            </label>
          ))}
        </div>

        <div className="adm-repeat-list">
          {reviews.length === 0 ? (
            <p className="adm-panel-note">No reviews added yet. Use &quot;Add Review&quot; to create one.</p>
          ) : null}

          {reviews.map((review, index) => (
            <article key={`review-${index}`} className="adm-repeat-card">
              <div className="adm-repeat-card-head">
                <strong>Review {index + 1}</strong>
                <button type="button" className="adm-text-btn" onClick={() => removeReview(index)}>
                  Remove
                </button>
              </div>

              <div className="adm-form-grid">
                <label className="adm-form-field">
                  <span>Student Name</span>
                  <input
                    type="text"
                    value={review.name}
                    onChange={(event) => updateReview(index, "name", event.target.value)}
                    placeholder="Chitra Sharma"
                    required
                  />
                </label>

                <label className="adm-form-field">
                  <span>Date</span>
                  <input
                    type="text"
                    value={review.date}
                    onChange={(event) => updateReview(index, "date", event.target.value)}
                    placeholder="May 30, 2023"
                  />
                </label>

                <label className="adm-form-field">
                  <span>Rating</span>
                  <select
                    value={review.rating}
                    onChange={(event) => updateReview(index, "rating", Number(event.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Stars
                      </option>
                    ))}
                  </select>
                </label>

                <label className="adm-form-field">
                  <span>Avatar Color</span>
                  <select
                    value={review.color}
                    onChange={(event) => updateReview(index, "color", event.target.value)}
                  >
                    {reviewColorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="adm-form-field adm-form-field-full">
                  <span>Review Text</span>
                  <textarea
                    value={review.text}
                    onChange={(event) => updateReview(index, "text", event.target.value)}
                    placeholder="Excellent teaching methodology and very helpful for exam preparation."
                    rows={3}
                    required
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}
      {success ? <p className="adm-form-message adm-form-message-success">{success}</p> : null}

      <div className="adm-form-actions">
        <Link href="/admin/courses" className="adm-btn adm-btn-secondary">
          Cancel
        </Link>
        <button type="submit" className="adm-btn adm-btn-primary" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Add Course" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
