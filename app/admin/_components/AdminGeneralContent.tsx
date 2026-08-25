"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultGeneralPagesContent,
  generalPageOptions,
  type GeneralPageId,
  type GeneralPagesContent,
  type GermanLanguageCoursePageData,
  type LegalPageContentData,
  type OurCompanyPageData,
  type PageSeoMeta,
} from "../../../data/generalPages";
import AdminImageUploadField from "./AdminImageUploadField";
import BlogContentEditor from "../(dashboard)/blog/_components/BlogContentEditor";

function isHtmlPage(
  pageId: GeneralPageId,
): pageId is "terms" | "privacy" | "refund" | "apply-job" {
  return (
    pageId === "terms" ||
    pageId === "privacy" ||
    pageId === "refund" ||
    pageId === "apply-job"
  );
}

function getHtmlPageKey(
  pageId: "terms" | "privacy" | "refund" | "apply-job",
): "terms" | "privacy" | "refund" | "applyJob" {
  return pageId === "apply-job" ? "applyJob" : pageId;
}

const emptyApplyJobSeo: PageSeoMeta = {
  metaTitle: "",
  metaKeyword: "",
  metaDescription: "",
};

export default function AdminGeneralContent() {
  const [content, setContent] = useState<GeneralPagesContent>(defaultGeneralPagesContent);
  const [selectedPage, setSelectedPage] = useState<GeneralPageId>("terms");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedLabel = useMemo(
    () => generalPageOptions.find((option) => option.id === selectedPage)?.label ?? "Page",
    [selectedPage],
  );

  async function loadContent() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/general-pages", { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error("Could not load general pages.");
      }

      const data = (await response.json()) as GeneralPagesContent;
      setContent(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load general pages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadContent();
  }, []);

  function updateLegalHtml(html: string) {
    if (!isHtmlPage(selectedPage)) {
      return;
    }

    const key = getHtmlPageKey(selectedPage);
    setContent((current) => ({
      ...current,
      [key]: { ...current[key], html },
    }));
  }

  function updateApplyJobSeo(field: keyof PageSeoMeta, value: string) {
    setContent((current) => ({
      ...current,
      applyJob: {
        ...current.applyJob,
        seo: {
          ...(current.applyJob.seo ?? emptyApplyJobSeo),
          [field]: value,
        },
      },
    }));
  }

  function updateGermanLanguageCourse(
    updater: (current: GermanLanguageCoursePageData) => GermanLanguageCoursePageData,
  ) {
    setContent((current) => ({
      ...current,
      germanLanguageCourse: updater(current.germanLanguageCourse),
    }));
  }

  function updateOurCompany(updater: (current: OurCompanyPageData) => OurCompanyPageData) {
    setContent((current) => ({
      ...current,
      ourCompany: updater(current.ourCompany),
    }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload =
      selectedPage === "german-language-course"
        ? {
            pageId: selectedPage,
            content: content.germanLanguageCourse,
          }
        : isHtmlPage(selectedPage)
          ? {
              pageId: selectedPage,
              content: content[getHtmlPageKey(selectedPage)] as LegalPageContentData,
            }
          : { pageId: selectedPage, content: content.ourCompany as OurCompanyPageData };

    try {
      const response = await fetch("/api/admin/general-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as GeneralPagesContent & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not save page content.");
      }

      setContent(data);
      setSuccess(`${selectedLabel} saved successfully.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save page content.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="adm-page-content">Loading general pages...</div>;
  }

  const ourCompany = content.ourCompany;
  const selectedHtml = isHtmlPage(selectedPage)
    ? content[getHtmlPageKey(selectedPage)].html
    : "";
  const applyJobSeo = content.applyJob.seo ?? emptyApplyJobSeo;
  const germanLanguageCourse =
    content.germanLanguageCourse ?? defaultGeneralPagesContent.germanLanguageCourse;

  return (
    <div className="adm-general-pages">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">General</h1>
          <p className="adm-page-subtitle">
            Edit Terms &amp; Conditions, Privacy Policy, Refund Policy, Our Company, Apply Job, and
            German Language Course SEO.
          </p>
        </div>
      </div>

      {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}
      {success ? <p className="adm-form-message adm-form-message-success">{success}</p> : null}

      <form onSubmit={handleSave} className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Page Content</h2>
        </div>

        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full adm-general-page-select">
            <span>Select Page</span>
            <select
              value={selectedPage}
              onChange={(event) => {
                setSelectedPage(event.target.value as GeneralPageId);
                setSuccess("");
                setError("");
              }}
            >
              {generalPageOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedPage === "german-language-course" ? (
          <div className="adm-general-seo-editor">
            <p className="adm-panel-note">
              Manage the German Language Course listing heading, page banner, and SEO meta tags (
              <code>/german-language-course</code>).
            </p>

            <section className="adm-general-section">
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Page Banner</h3>
              </div>
              <div className="adm-form-grid">
                <label className="adm-form-field adm-form-field-full">
                  <span>Page Title</span>
                  <input
                    type="text"
                    value={germanLanguageCourse.pageTitle}
                    onChange={(event) =>
                      updateGermanLanguageCourse((current) => ({
                        ...current,
                        pageTitle: event.target.value,
                      }))
                    }
                    placeholder="German Language Course"
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Page Description</span>
                  <textarea
                    rows={3}
                    value={germanLanguageCourse.pageDescription}
                    onChange={(event) =>
                      updateGermanLanguageCourse((current) => ({
                        ...current,
                        pageDescription: event.target.value,
                      }))
                    }
                    placeholder="Choose the right German level for your goals..."
                  />
                </label>
              </div>
            </section>

            <section className="adm-general-section" style={{ marginTop: "1.5rem" }}>
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Courses Section</h3>
              </div>
              <p className="adm-panel-note">
                This heading and text appear above the course cards on the homepage, city pages, and
                courses page.
              </p>
              <div className="adm-form-grid">
                <label className="adm-form-field adm-form-field-full">
                  <span>Section Title</span>
                  <input
                    type="text"
                    value={germanLanguageCourse.sectionTitle}
                    onChange={(event) =>
                      updateGermanLanguageCourse((current) => ({
                        ...current,
                        sectionTitle: event.target.value,
                      }))
                    }
                    placeholder="German Language Course"
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Section Description</span>
                  <textarea
                    rows={3}
                    value={germanLanguageCourse.sectionDescription}
                    onChange={(event) =>
                      updateGermanLanguageCourse((current) => ({
                        ...current,
                        sectionDescription: event.target.value,
                      }))
                    }
                    placeholder="Take your language skills to the next level..."
                  />
                </label>
              </div>
            </section>

            <section className="adm-panel adm-seo-panel" style={{ marginTop: "1.5rem" }}>
              <div className="adm-panel-head">
                <h2 className="adm-panel-title">SEO — Meta Tags</h2>
              </div>
              <p className="adm-panel-note">
                Define meta title, keywords and description shown in Google for this page.
              </p>
              <div className="adm-form-grid adm-seo-grid">
                <label className="adm-form-field adm-form-field-full">
                  <span>Meta Title *</span>
                  <input
                    type="text"
                    name="metaTitle"
                    value={germanLanguageCourse.seo.metaTitle}
                    onChange={(event) =>
                      updateGermanLanguageCourse((current) => ({
                        ...current,
                        seo: { ...current.seo, metaTitle: event.target.value },
                      }))
                    }
                    maxLength={70}
                    placeholder="German Courses A1–C2 | Fluent AUF"
                    required
                  />
                  <small className="adm-field-hint">Max length 70 characters</small>
                </label>

                <label className="adm-form-field adm-form-field-full">
                  <span>Meta Keyword</span>
                  <textarea
                    name="metaKeyword"
                    value={germanLanguageCourse.seo.metaKeyword}
                    onChange={(event) =>
                      updateGermanLanguageCourse((current) => ({
                        ...current,
                        seo: { ...current.seo, metaKeyword: event.target.value },
                      }))
                    }
                    maxLength={160}
                    rows={2}
                    placeholder="German Language Course, Online German Classes, Learn German"
                  />
                  <small className="adm-field-hint">Max length 160 characters</small>
                </label>

                <label className="adm-form-field adm-form-field-full">
                  <span>Meta Description</span>
                  <textarea
                    name="metaDescription"
                    value={germanLanguageCourse.seo.metaDescription}
                    onChange={(event) =>
                      updateGermanLanguageCourse((current) => ({
                        ...current,
                        seo: { ...current.seo, metaDescription: event.target.value },
                      }))
                    }
                    maxLength={250}
                    rows={3}
                    placeholder="Short summary shown in Google search results for this page."
                  />
                  <small className="adm-field-hint">Max length 250 characters</small>
                </label>
              </div>
            </section>

            <section className="adm-general-section" style={{ marginTop: "1.5rem" }}>
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Page Content</h3>
              </div>
              <p className="adm-panel-note">
                This content appears on the German Language Course page below the course cards. Use
                headings, bold, links, and lists as needed.
              </p>
              <BlogContentEditor
                key="german-language-course-content"
                value={germanLanguageCourse.contentHtml || ""}
                onChange={(html) =>
                  updateGermanLanguageCourse((current) => ({
                    ...current,
                    contentHtml: html,
                  }))
                }
                showPdfUpload
              />
            </section>
          </div>
        ) : isHtmlPage(selectedPage) ? (
          <div className="adm-general-legal-editor">
            <p className="adm-panel-note">
              {selectedPage === "apply-job"
                ? "Edit the Apply Job scroll content shown on the public careers page. Use headings, lists, and formatting as needed."
                : "Edit the full page content in one place. Use headings, lists, links, and formatting as needed — same editor as blog posts."}
            </p>
            <BlogContentEditor
              key={`legal-editor-${selectedPage}`}
              value={selectedHtml}
              onChange={updateLegalHtml}
            />

            {selectedPage === "apply-job" ? (
              <section className="adm-panel adm-seo-panel" style={{ marginTop: "1.5rem" }}>
                <div className="adm-panel-head">
                  <h2 className="adm-panel-title">SEO — Meta Tags</h2>
                </div>

                <p className="adm-panel-note">
                  Define page meta title, meta keywords and meta description to list your Apply Job
                  page in search engines.
                </p>

                <div className="adm-form-grid adm-seo-grid">
                  <label className="adm-form-field adm-form-field-full">
                    <span>Meta Title *</span>
                    <input
                      type="text"
                      name="metaTitle"
                      value={applyJobSeo.metaTitle}
                      onChange={(event) => updateApplyJobSeo("metaTitle", event.target.value)}
                      maxLength={70}
                      placeholder="Apply Job | Fluent AUF"
                      required
                    />
                    <small className="adm-field-hint">Max length 70 characters</small>
                  </label>

                  <label className="adm-form-field adm-form-field-full">
                    <span>Meta Keyword</span>
                    <textarea
                      name="metaKeyword"
                      value={applyJobSeo.metaKeyword}
                      onChange={(event) => updateApplyJobSeo("metaKeyword", event.target.value)}
                      maxLength={160}
                      rows={2}
                      placeholder="German tutor jobs, online German teacher, Fluent AUF careers"
                    />
                    <small className="adm-field-hint">Max length 160 characters</small>
                  </label>

                  <label className="adm-form-field adm-form-field-full">
                    <span>Meta Description</span>
                    <textarea
                      name="metaDescription"
                      value={applyJobSeo.metaDescription}
                      onChange={(event) => updateApplyJobSeo("metaDescription", event.target.value)}
                      maxLength={250}
                      rows={3}
                      placeholder="Short summary shown in Google search results for this page."
                    />
                    <small className="adm-field-hint">Max length 250 characters</small>
                  </label>
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <div className="adm-general-company-editor">
            <section className="adm-general-section">
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Intro Section</h3>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() =>
                    updateOurCompany((current) => ({
                      ...current,
                      intro: { ...current.intro, listItems: [...current.intro.listItems, ""] },
                    }))
                  }
                >
                  + Add List Item
                </button>
              </div>
              <div className="adm-form-grid">
                <label className="adm-form-field">
                  <span>Tag</span>
                  <input
                    type="text"
                    value={ourCompany.intro.tag}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, tag: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field">
                  <span>Badge Value</span>
                  <input
                    type="text"
                    value={ourCompany.intro.badgeValue}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, badgeValue: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Heading</span>
                  <input
                    type="text"
                    value={ourCompany.intro.heading}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, heading: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Heading Highlight</span>
                  <input
                    type="text"
                    value={ourCompany.intro.headingHighlight}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, headingHighlight: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Heading Suffix</span>
                  <input
                    type="text"
                    value={ourCompany.intro.headingSuffix}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, headingSuffix: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Description</span>
                  <textarea
                    rows={4}
                    value={ourCompany.intro.description}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, description: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field">
                  <span>Primary Button</span>
                  <input
                    type="text"
                    value={ourCompany.intro.primaryButtonText}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, primaryButtonText: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field">
                  <span>Secondary Button</span>
                  <input
                    type="text"
                    value={ourCompany.intro.secondaryButtonText}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, secondaryButtonText: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field">
                  <span>Badge Label</span>
                  <input
                    type="text"
                    value={ourCompany.intro.badgeLabel}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, badgeLabel: event.target.value },
                      }))
                    }
                  />
                </label>
                <AdminImageUploadField
                  label="Intro Image"
                  value={ourCompany.intro.imageSrc}
                  folder="general"
                  uploadLabel="intro"
                  placeholder="/hero-students.jpg"
                  onChange={(path) =>
                    updateOurCompany((current) => ({
                      ...current,
                      intro: { ...current.intro, imageSrc: path },
                    }))
                  }
                />
                <label className="adm-form-field adm-form-field-full">
                  <span>Image Alt Text</span>
                  <input
                    type="text"
                    value={ourCompany.intro.imageAlt}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        intro: { ...current.intro, imageAlt: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>

              {ourCompany.intro.listItems.map((item, index) => (
                <div key={`intro-list-${index}`} className="adm-general-paragraph-row">
                  <label className="adm-form-field adm-form-field-full">
                    <span>List Item {index + 1}</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(event) =>
                        updateOurCompany((current) => {
                          const listItems = [...current.intro.listItems];
                          listItems[index] = event.target.value;
                          return { ...current, intro: { ...current.intro, listItems } };
                        })
                      }
                    />
                  </label>
                  {ourCompany.intro.listItems.length > 1 ? (
                    <button
                      type="button"
                      className="adm-btn adm-btn-secondary adm-general-remove-btn"
                      onClick={() =>
                        updateOurCompany((current) => ({
                          ...current,
                          intro: {
                            ...current.intro,
                            listItems: current.intro.listItems.filter((_, itemIndex) => itemIndex !== index),
                          },
                        }))
                      }
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="adm-general-section">
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Stats</h3>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() =>
                    updateOurCompany((current) => ({
                      ...current,
                      stats: [...current.stats, { value: "", label: "" }],
                    }))
                  }
                >
                  + Add Stat
                </button>
              </div>
              <div className="adm-form-grid">
                {ourCompany.stats.map((item, index) => (
                  <div key={`stat-${index}`} className="adm-form-field adm-form-field-full adm-general-inline-pair">
                    <label className="adm-form-field">
                      <span>Stat {index + 1} Value</span>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(event) =>
                          updateOurCompany((current) => {
                            const stats = [...current.stats];
                            stats[index] = { ...stats[index], value: event.target.value };
                            return { ...current, stats };
                          })
                        }
                      />
                    </label>
                    <label className="adm-form-field">
                      <span>Stat {index + 1} Label</span>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(event) =>
                          updateOurCompany((current) => {
                            const stats = [...current.stats];
                            stats[index] = { ...stats[index], label: event.target.value };
                            return { ...current, stats };
                          })
                        }
                      />
                    </label>
                    {ourCompany.stats.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-general-remove-btn"
                        onClick={() =>
                          updateOurCompany((current) => ({
                            ...current,
                            stats: current.stats.filter((_, itemIndex) => itemIndex !== index),
                          }))
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="adm-general-section">
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Features Section</h3>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() =>
                    updateOurCompany((current) => ({
                      ...current,
                      features: {
                        ...current.features,
                        items: [...current.features.items, { title: "", text: "" }],
                      },
                    }))
                  }
                >
                  + Add Feature
                </button>
              </div>
              <div className="adm-form-grid">
                <label className="adm-form-field">
                  <span>Tag</span>
                  <input
                    type="text"
                    value={ourCompany.features.tag}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        features: { ...current.features, tag: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Heading</span>
                  <input
                    type="text"
                    value={ourCompany.features.heading}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        features: { ...current.features, heading: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={ourCompany.features.description}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        features: { ...current.features, description: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>

              {ourCompany.features.items.map((item, index) => (
                <div key={`feature-${index}`} className="adm-general-card-editor">
                  <div className="adm-panel-head">
                    <h4>Feature {index + 1}</h4>
                    {ourCompany.features.items.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-general-remove-btn"
                        onClick={() =>
                          updateOurCompany((current) => ({
                            ...current,
                            features: {
                              ...current.features,
                              items: current.features.items.filter((_, itemIndex) => itemIndex !== index),
                            },
                          }))
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <label className="adm-form-field adm-form-field-full">
                    <span>Title</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                        updateOurCompany((current) => {
                          const items = [...current.features.items];
                          items[index] = { ...items[index], title: event.target.value };
                          return { ...current, features: { ...current.features, items } };
                        })
                      }
                    />
                  </label>
                  <label className="adm-form-field adm-form-field-full">
                    <span>Text</span>
                    <textarea
                      rows={3}
                      value={item.text}
                      onChange={(event) =>
                        updateOurCompany((current) => {
                          const items = [...current.features.items];
                          items[index] = { ...items[index], text: event.target.value };
                          return { ...current, features: { ...current.features, items } };
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </section>

            <section className="adm-general-section">
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Values Section</h3>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() =>
                    updateOurCompany((current) => ({
                      ...current,
                      values: {
                        ...current.values,
                        items: [...current.values.items, { title: "", text: "" }],
                      },
                    }))
                  }
                >
                  + Add Value
                </button>
              </div>
              <div className="adm-form-grid">
                <label className="adm-form-field">
                  <span>Tag</span>
                  <input
                    type="text"
                    value={ourCompany.values.tag}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        values: { ...current.values, tag: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Heading</span>
                  <input
                    type="text"
                    value={ourCompany.values.heading}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        values: { ...current.values, heading: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>

              {ourCompany.values.items.map((item, index) => (
                <div key={`value-${index}`} className="adm-general-card-editor">
                  <div className="adm-panel-head">
                    <h4>Value {index + 1}</h4>
                    {ourCompany.values.items.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-general-remove-btn"
                        onClick={() =>
                          updateOurCompany((current) => ({
                            ...current,
                            values: {
                              ...current.values,
                              items: current.values.items.filter((_, itemIndex) => itemIndex !== index),
                            },
                          }))
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <label className="adm-form-field adm-form-field-full">
                    <span>Title</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) =>
                        updateOurCompany((current) => {
                          const items = [...current.values.items];
                          items[index] = { ...items[index], title: event.target.value };
                          return { ...current, values: { ...current.values, items } };
                        })
                      }
                    />
                  </label>
                  <label className="adm-form-field adm-form-field-full">
                    <span>Text</span>
                    <textarea
                      rows={3}
                      value={item.text}
                      onChange={(event) =>
                        updateOurCompany((current) => {
                          const items = [...current.values.items];
                          items[index] = { ...items[index], text: event.target.value };
                          return { ...current, values: { ...current.values, items } };
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </section>

            <section className="adm-general-section">
              <div className="adm-panel-head">
                <h3 className="adm-panel-title">Faculty Section</h3>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() =>
                    updateOurCompany((current) => ({
                      ...current,
                      faculty: {
                        ...current.faculty,
                        members: [...current.faculty.members, { name: "", image: "", role: "" }],
                      },
                    }))
                  }
                >
                  + Add Faculty Member
                </button>
              </div>
              <div className="adm-form-grid">
                <label className="adm-form-field">
                  <span>Tag</span>
                  <input
                    type="text"
                    value={ourCompany.faculty.tag}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        faculty: { ...current.faculty, tag: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Heading</span>
                  <input
                    type="text"
                    value={ourCompany.faculty.heading}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        faculty: { ...current.faculty, heading: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={ourCompany.faculty.description}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        faculty: { ...current.faculty, description: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>

              {ourCompany.faculty.members.map((member, index) => (
                <div key={`faculty-${index}`} className="adm-general-card-editor">
                  <div className="adm-panel-head">
                    <h4>Faculty Member {index + 1}</h4>
                    {ourCompany.faculty.members.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-general-remove-btn"
                        onClick={() =>
                          updateOurCompany((current) => ({
                            ...current,
                            faculty: {
                              ...current.faculty,
                              members: current.faculty.members.filter((_, itemIndex) => itemIndex !== index),
                            },
                          }))
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <label className="adm-form-field adm-form-field-full">
                    <span>Name</span>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(event) =>
                        updateOurCompany((current) => {
                          const members = [...current.faculty.members];
                          members[index] = { ...members[index], name: event.target.value };
                          return { ...current, faculty: { ...current.faculty, members } };
                        })
                      }
                    />
                  </label>
                  <label className="adm-form-field adm-form-field-full">
                    <span>Role</span>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(event) =>
                        updateOurCompany((current) => {
                          const members = [...current.faculty.members];
                          members[index] = { ...members[index], role: event.target.value };
                          return { ...current, faculty: { ...current.faculty, members } };
                        })
                      }
                    />
                  </label>
                  <AdminImageUploadField
                    label="Faculty Photo"
                    value={member.image}
                    folder="tutors"
                    uploadLabel={member.name || `member-${index + 1}`}
                    placeholder="/tutors/name.jpg"
                    onChange={(path) =>
                      updateOurCompany((current) => {
                        const members = [...current.faculty.members];
                        members[index] = { ...members[index], image: path };
                        return { ...current, faculty: { ...current.faculty, members } };
                      })
                    }
                  />
                </div>
              ))}
            </section>

            <section className="adm-general-section">
              <h3 className="adm-panel-title">CTA Section</h3>
              <div className="adm-form-grid">
                <label className="adm-form-field adm-form-field-full">
                  <span>Heading</span>
                  <input
                    type="text"
                    value={ourCompany.cta.heading}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        cta: { ...current.cta, heading: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field adm-form-field-full">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={ourCompany.cta.description}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        cta: { ...current.cta, description: event.target.value },
                      }))
                    }
                  />
                </label>
                <label className="adm-form-field">
                  <span>Button Text</span>
                  <input
                    type="text"
                    value={ourCompany.cta.buttonText}
                    onChange={(event) =>
                      updateOurCompany((current) => ({
                        ...current,
                        cta: { ...current.cta, buttonText: event.target.value },
                      }))
                    }
                  />
                </label>
              </div>
            </section>
          </div>
        )}

        {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}
        {success ? <p className="adm-form-message adm-form-message-success">{success}</p> : null}

        <div className="adm-form-actions">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? "Saving..." : `Save ${selectedLabel}`}
          </button>
        </div>
      </form>
    </div>
  );
}
