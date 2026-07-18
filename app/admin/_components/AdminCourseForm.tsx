"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import type { CourseReview } from "../../../data/courseContent.types";
import type {
  AdminCoursePayload,
  CourseDescriptionTab,
  CourseCurriculumSection,
  CourseFaqItem,
  CourseReviewsSummary,
} from "../../../data/adminCourseDetails.types";
import {
  defaultFaqItem,
  defaultReviewItem,
  defaultReviewsSummary,
  reviewColorOptions,
  reviewRatingOptions,
} from "../../../data/adminCourseDetails.types";
import { courseLevelOptions } from "../../../data/adminCourseLevels";
import {
  defaultBatchItem,
  getCourseFlexibleBatches,
  getDefaultOfferEndDate,
  type CourseBatchOption,
  type CourseFlexibleBatches,
} from "../../../data/courseFlexibleBatches";
import type { GermanCourse } from "../../../data/germanCourses";
import { getCourseBySlug } from "../../../data/germanCourses";
import { slugifyCoursePath } from "../../../lib/courseUtils";
import {
  defaultCurriculumSection,
  getDescriptionTabForSlug,
  joinLines,
  joinParagraphs,
  splitLines,
  splitParagraphs,
} from "../../../lib/courseDescriptionTabUtils";
import { getDefaultCourseSeoContent } from "../../../data/courseSeoContentDefaults";
import BlogCKEditor from "../(dashboard)/blog/_components/BlogCKEditor";

type AdminCourseFormProps = {
  mode: "create" | "edit";
  lockedSlug?: string;
  isCustomCourse?: boolean;
  initialValues?: Partial<GermanCourse>;
  initialDescriptionTab?: CourseDescriptionTab;
  initialFaqs?: CourseFaqItem[];
  initialReviewsSummary?: CourseReviewsSummary;
  initialReviews?: CourseReview[];
  initialFlexibleBatches?: CourseFlexibleBatches;
  initialSeoContent?: string;
};

const emptyValues: Partial<GermanCourse> = {
  slug: "",
  pathName: "",
  title: "",
  description: "",
  hours: "",
  learningHours: "",
  price: "",
  image: "/courses/german-a1.png",
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

function toDateTimeLocalValue(iso?: string) {
  const date = iso ? new Date(iso) : new Date(getDefaultOfferEndDate());
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function updateDescriptionTabField<K extends keyof CourseDescriptionTab>(
  current: CourseDescriptionTab,
  field: K,
  value: CourseDescriptionTab[K],
): CourseDescriptionTab {
  return { ...current, [field]: value };
}

export default function AdminCourseForm({
  mode,
  lockedSlug,
  isCustomCourse = false,
  initialValues,
  initialDescriptionTab,
  initialFaqs = [{ ...defaultFaqItem }],
  initialReviewsSummary = defaultReviewsSummary,
  initialReviews = [],
  initialFlexibleBatches,
  initialSeoContent,
}: AdminCourseFormProps) {
  const starterSlug = lockedSlug ?? initialValues?.slug ?? "a1";
  const router = useRouter();
  const isNewCourseFlow = mode === "create" || isCustomCourse;
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
  const [flexibleBatches, setFlexibleBatches] = useState<CourseFlexibleBatches>(
    initialFlexibleBatches ?? getCourseFlexibleBatches(starterSlug),
  );
  const [descriptionTab, setDescriptionTab] = useState<CourseDescriptionTab>(
    initialDescriptionTab ?? getDescriptionTabForSlug(starterSlug),
  );
  const [seoContent, setSeoContent] = useState(
    initialSeoContent ?? getDefaultCourseSeoContent(starterSlug),
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");

  function updateField<K extends keyof GermanCourse>(field: K, value: GermanCourse[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleTitleChange(title: string) {
    setValues((current) => {
      const next = { ...current, title };

      if (isNewCourseFlow && !slugManuallyEdited) {
        const pathName = slugifyCoursePath(title);
        next.pathName = pathName;
        next.slug = pathName;
      }

      return next;
    });
  }

  function updateDuration(value: string) {
    setValues((current) => ({ ...current, hours: value, learningHours: value }));
  }

  function handlePathNameChange(value: string) {
    setSlugManuallyEdited(true);
    const pathName = slugifyCoursePath(value);
    setValues((current) => ({
      ...current,
      pathName,
      slug: pathName,
    }));
  }

  function handleLevelChange(level: string) {
    if (!level) {
      return;
    }

    setValues((current) => ({
      ...current,
      slug: level,
      pathName: `german-${level}`,
    }));

    setFlexibleBatches(getCourseFlexibleBatches(level));
    setDescriptionTab(getDescriptionTabForSlug(level));
    setSeoContent(getDefaultCourseSeoContent(level));
  }

  function updateDescriptionField<K extends keyof CourseDescriptionTab>(
    field: K,
    value: CourseDescriptionTab[K],
  ) {
    setDescriptionTab((current) => updateDescriptionTabField(current, field, value));
  }

  function updateCurriculumSection(
    index: number,
    field: keyof CourseCurriculumSection,
    value: string | string[],
  ) {
    setDescriptionTab((current) => ({
      ...current,
      curriculumSections: current.curriculumSections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  }

  function addCurriculumSection() {
    setDescriptionTab((current) => ({
      ...current,
      curriculumSections: [...current.curriculumSections, { ...defaultCurriculumSection }],
    }));
  }

  function removeCurriculumSection(index: number) {
    setDescriptionTab((current) => ({
      ...current,
      curriculumSections:
        current.curriculumSections.length === 1
          ? current.curriculumSections
          : current.curriculumSections.filter((_, sectionIndex) => sectionIndex !== index),
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

  function updateFlexibleField<K extends keyof CourseFlexibleBatches>(
    field: K,
    value: CourseFlexibleBatches[K],
  ) {
    setFlexibleBatches((current) => ({ ...current, [field]: value }));
  }

  function updateBatch(
    index: number,
    field: keyof CourseBatchOption,
    value: string | boolean,
  ) {
    setFlexibleBatches((current) => ({
      ...current,
      batches: current.batches.map((batch, batchIndex) => {
        if (batchIndex !== index) {
          if (field === "defaultSelected" && value === true) {
            return { ...batch, defaultSelected: false };
          }
          return batch;
        }

        const next = { ...batch, [field]: value } as CourseBatchOption;
        if (field === "soldOut" && value === true) {
          next.defaultSelected = false;
        }
        return next;
      }),
    }));
  }

  function addBatch() {
    setFlexibleBatches((current) => ({
      ...current,
      batches: [...current.batches, { ...defaultBatchItem, id: `batch-${Date.now()}` }],
    }));
  }

  function removeBatch(index: number) {
    setFlexibleBatches((current) => ({
      ...current,
      batches: current.batches.length === 1 ? current.batches : current.batches.filter((_, i) => i !== index),
    }));
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setImageUploadError("");
    setSelectedImageName("");

    if (!file) {
      return;
    }

    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", lockedSlug ?? values.slug ?? "");

      const response = await fetch("/api/admin/courses/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string; path?: string };

      if (!response.ok || !data.path) {
        setImageUploadError(data.error ?? "Could not upload image.");
        event.target.value = "";
        return;
      }

      updateField("image", data.path);
      setSelectedImageName(file.name);
    } catch {
      setImageUploadError("Could not upload image. Please try again.");
      event.target.value = "";
    } finally {
      setImageUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const courseSlug = lockedSlug ?? values.slug ?? "";
    const pathName = slugifyCoursePath(values.pathName || values.title || "");

    if (isNewCourseFlow) {
      if (!pathName) {
        setError("Course title is required to create the course URL.");
        setLoading(false);
        return;
      }
    } else if (!courseSlug || !getCourseBySlug(courseSlug)) {
      setError("Could not find this standard course level.");
      setLoading(false);
      return;
    }

    const duration = (values.learningHours ?? values.hours ?? "").trim();

    if (!duration) {
      setError("Duration is required.");
      setLoading(false);
      return;
    }

    const resolvedSlug = isNewCourseFlow ? pathName : courseSlug;
    const resolvedPathName = isNewCourseFlow
      ? pathName
      : lockedSlug
        ? `german-${lockedSlug}`
        : values.pathName ?? `german-${courseSlug}`;

    const payload: AdminCoursePayload = {
      ...(values as GermanCourse),
      slug: resolvedSlug,
      pathName: resolvedPathName,
      hours: duration,
      learningHours: duration,
      reviewCount: values.reviewCount ?? "0",
      faqs,
      reviewsSummary: {
        ...reviewsSummary,
        total: Number(values.reviewCount) || 0,
        average: values.rating ?? reviewsSummary.average,
      },
      reviews,
      flexibleBatches,
      descriptionTab,
      seoContent,
    };

    try {
      const response = await fetch("/api/admin/courses", {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not save course. Please try again.");
        return;
      }

      setSuccess(
        data.message ?? (mode === "create" ? "Course added successfully." : "Course saved successfully."),
      );
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
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Business German for Professionals"
              required
            />
          </label>

          {isNewCourseFlow ? (
            <label className="adm-form-field adm-form-field-full">
              <span>Course URL</span>
              <input
                type="text"
                value={values.pathName ?? ""}
                onChange={(event) => handlePathNameChange(event.target.value)}
                placeholder="auto-created-from-title"
                readOnly={mode === "create" && !slugManuallyEdited}
                className={mode === "create" && !slugManuallyEdited ? "adm-input-readonly" : undefined}
              />
              <small className="adm-field-hint">
                {mode === "create" && !slugManuallyEdited
                  ? `Auto-created from title → /course/${values.pathName || "your-course"}`
                  : `Course page → /course/${values.pathName || "your-course"}`}
              </small>
              {mode === "create" && !slugManuallyEdited ? (
                <button
                  type="button"
                  className="adm-text-btn adm-slug-edit-btn"
                  onClick={() => setSlugManuallyEdited(true)}
                >
                  Edit URL manually
                </button>
              ) : null}
            </label>
          ) : (
            <>
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
                  disabled
                  required
                />
              </label>
            </>
          )}

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
            <span>Duration</span>
            <input
              type="text"
              value={values.learningHours ?? values.hours ?? ""}
              onChange={(event) => updateDuration(event.target.value)}
              placeholder="3 Months"
              required
            />
            <small className="adm-field-hint">Shown on course cards and the course detail page.</small>
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
          <div className="adm-form-field adm-form-field-full adm-image-field">
            <span>Course Image</span>

            {values.image ? (
              <div className="adm-image-preview">
                <img
                  src={values.image}
                  alt={values.title ?? "Course preview"}
                  className="adm-image-preview-img"
                />
              </div>
            ) : null}

            <label className="adm-file-upload">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={imageUploading}
              />
              <span className="adm-file-btn">
                {imageUploading ? "Uploading..." : "Choose Image"}
              </span>
              <span className="adm-file-name">
                {selectedImageName || "Upload JPG, PNG, WEBP, or GIF up to 5MB"}
              </span>
            </label>

            {imageUploadError ? <p className="adm-file-error">{imageUploadError}</p> : null}

            <label className="adm-form-field adm-form-field-full adm-image-path-field">
              <span>Course Image Path</span>
              <input
                type="text"
                value={values.image ?? ""}
                onChange={(event) => updateField("image", event.target.value)}
                placeholder="/courses/german-a1.png"
                required
              />
              <small className="adm-field-hint">
                Upload an image above or paste an existing image path manually.
              </small>
            </label>
          </div>

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
            <small className="adm-field-hint">
              Shown in the course header and Reviews tab for this course.
            </small>
          </label>
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Description Tab</h2>
        </div>
        <p className="adm-panel-note">
          Edit all content shown on the course details page Description tab. One item per line for
          lists. Leave a blank line between paragraphs in Course Description.
        </p>

        <label className="adm-form-field adm-form-field-full">
          <span>About This Course</span>
          <textarea
            value={descriptionTab.aboutCourse}
            onChange={(event) => updateDescriptionField("aboutCourse", event.target.value)}
            rows={3}
          />
        </label>

        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full">
            <span>Objectives — Left Column</span>
            <textarea
              value={joinLines(descriptionTab.objectivesLeft)}
              onChange={(event) =>
                updateDescriptionField("objectivesLeft", splitLines(event.target.value))
              }
              rows={10}
            />
            <small className="adm-field-hint">One objective per line.</small>
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Objectives — Right Column</span>
            <textarea
              value={joinLines(descriptionTab.objectivesRight)}
              onChange={(event) =>
                updateDescriptionField("objectivesRight", splitLines(event.target.value))
              }
              rows={10}
            />
            <small className="adm-field-hint">One objective per line.</small>
          </label>
        </div>

        <label className="adm-form-field adm-form-field-full">
          <span>Course Description</span>
          <textarea
            value={joinParagraphs(descriptionTab.courseDescription)}
            onChange={(event) =>
              updateDescriptionField("courseDescription", splitParagraphs(event.target.value))
            }
            rows={10}
          />
          <small className="adm-field-hint">Separate paragraphs with a blank line.</small>
        </label>

        <label className="adm-form-field adm-form-field-full">
          <span>Goals / Lessons</span>
          <textarea
            value={joinLines(descriptionTab.goalsLessons)}
            onChange={(event) =>
              updateDescriptionField("goalsLessons", splitLines(event.target.value))
            }
            rows={8}
          />
          <small className="adm-field-hint">One goal per line.</small>
        </label>

        <div className="adm-panel-head" style={{ marginTop: "1rem" }}>
          <h3 className="adm-panel-title" style={{ fontSize: "1rem" }}>
            You Will Learn The Following
          </h3>
          <button
            type="button"
            className="adm-btn adm-btn-secondary adm-btn-small"
            onClick={addCurriculumSection}
          >
            + Add Section
          </button>
        </div>

        <div className="adm-repeat-list">
          {descriptionTab.curriculumSections.map((section, index) => (
            <article key={`curriculum-${index}`} className="adm-repeat-card">
              <div className="adm-repeat-card-head">
                <strong>Section {index + 1}</strong>
                <button
                  type="button"
                  className="adm-text-btn"
                  onClick={() => removeCurriculumSection(index)}
                  disabled={descriptionTab.curriculumSections.length === 1}
                >
                  Remove
                </button>
              </div>

              <label className="adm-form-field adm-form-field-full">
                <span>Section Title</span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(event) =>
                    updateCurriculumSection(index, "title", event.target.value)
                  }
                  placeholder="German Grammar"
                />
              </label>

              <label className="adm-form-field adm-form-field-full">
                <span>Topics</span>
                <textarea
                  value={joinLines(section.topics)}
                  onChange={(event) =>
                    updateCurriculumSection(index, "topics", splitLines(event.target.value))
                  }
                  rows={5}
                  placeholder="The Alphabet"
                />
                <small className="adm-field-hint">
                  One topic per line. They appear separated by | on the course page.
                </small>
              </label>
            </article>
          ))}
        </div>

        <label className="adm-form-field adm-form-field-full">
          <span>Who This Course Is For</span>
          <textarea
            value={joinLines(descriptionTab.targetAudience)}
            onChange={(event) =>
              updateDescriptionField("targetAudience", splitLines(event.target.value))
            }
            rows={4}
          />
          <small className="adm-field-hint">One audience line per row.</small>
        </label>
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
              placeholder="Optional note shown above the review list."
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
                    {reviewRatingOptions.map((rating) => (
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

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Flexible Batches</h2>
          <button type="button" className="adm-btn adm-btn-secondary adm-btn-small" onClick={addBatch}>
            + Add Batch
          </button>
        </div>

        <p className="adm-panel-note">
          Edit the batch section shown at the bottom of the course page, including pricing offer and
          countdown timer.
        </p>

        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full">
            <span>Section Title</span>
            <input
              type="text"
              value={flexibleBatches.title}
              onChange={(event) => updateFlexibleField("title", event.target.value)}
              placeholder="Flexible batches for you"
              required
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Subtitle</span>
            <input
              type="text"
              value={flexibleBatches.subtitle}
              onChange={(event) => updateFlexibleField("subtitle", event.target.value)}
              placeholder="Get Certification in A2 Level German Language Course Online Live Training with"
              required
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Highlight Text</span>
            <input
              type="text"
              value={flexibleBatches.highlight}
              onChange={(event) => updateFlexibleField("highlight", event.target.value)}
              placeholder="Goethe Exam Preparation"
              required
            />
          </label>

          <label className="adm-form-field">
            <span>Original Price</span>
            <input
              type="text"
              value={flexibleBatches.originalPrice}
              onChange={(event) => updateFlexibleField("originalPrice", event.target.value)}
              placeholder="₹35,000"
              required
            />
          </label>

          <label className="adm-form-field">
            <span>Discount %</span>
            <input
              type="number"
              min="0"
              max="100"
              value={flexibleBatches.discountPercent}
              onChange={(event) =>
                updateFlexibleField("discountPercent", Number(event.target.value))
              }
              required
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Feature Badge</span>
            <input
              type="text"
              value={flexibleBatches.badge}
              onChange={(event) => updateFlexibleField("badge", event.target.value)}
              placeholder="Live Classes + Study Material Included"
              required
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Offer Ends On</span>
            <input
              type="datetime-local"
              value={toDateTimeLocalValue(flexibleBatches.offerEndsAt)}
              onChange={(event) =>
                updateFlexibleField("offerEndsAt", new Date(event.target.value).toISOString())
              }
              required
            />
            <small className="adm-field-hint">Controls the countdown timer in the pricing box.</small>
          </label>
        </div>

        <div className="adm-repeat-list">
          {flexibleBatches.batches.map((batch, index) => (
            <article key={batch.id || `batch-${index}`} className="adm-repeat-card">
              <div className="adm-repeat-card-head">
                <strong>Batch {index + 1}</strong>
                <button
                  type="button"
                  className="adm-text-btn"
                  onClick={() => removeBatch(index)}
                  disabled={flexibleBatches.batches.length === 1}
                >
                  Remove
                </button>
              </div>

              <div className="adm-form-grid">
                <label className="adm-form-field">
                  <span>Batch Date</span>
                  <input
                    type="text"
                    value={batch.date}
                    onChange={(event) => updateBatch(index, "date", event.target.value)}
                    placeholder="June 22nd"
                    required
                  />
                </label>

                <label className="adm-form-field">
                  <span>Day Type</span>
                  <input
                    type="text"
                    value={batch.dayType}
                    onChange={(event) => updateBatch(index, "dayType", event.target.value)}
                    placeholder="Weekdays"
                    required
                  />
                </label>

                <label className="adm-form-field adm-form-field-full">
                  <span>Schedule</span>
                  <input
                    type="text"
                    value={batch.schedule}
                    onChange={(event) => updateBatch(index, "schedule", event.target.value)}
                    placeholder="MON - FRI (1 Month)"
                    required
                  />
                </label>

                <label className="adm-form-field adm-form-field-full">
                  <span>Time</span>
                  <input
                    type="text"
                    value={batch.time}
                    onChange={(event) => updateBatch(index, "time", event.target.value)}
                    placeholder="06:00PM to 07:30PM (IST)"
                    required
                  />
                </label>

                <label className="adm-form-field adm-form-field-inline">
                  <input
                    type="checkbox"
                    checked={Boolean(batch.soldOut)}
                    onChange={(event) => updateBatch(index, "soldOut", event.target.checked)}
                  />
                  <span>Sold out</span>
                </label>

                <label className="adm-form-field adm-form-field-inline">
                  <input
                    type="checkbox"
                    checked={Boolean(batch.defaultSelected)}
                    onChange={(event) => updateBatch(index, "defaultSelected", event.target.checked)}
                    disabled={Boolean(batch.soldOut)}
                  />
                  <span>Selected by default</span>
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">About Course — Main Content</h2>
        </div>

        <p className="adm-panel-note">
          Edit the full About Course section in one editor below Flexible Batches on the course page.
          Paste or format headings, lists, and paragraphs together — no separate line fields.
        </p>

        <BlogCKEditor value={seoContent} onChange={setSeoContent} />
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
