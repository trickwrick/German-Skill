"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  defaultCityPageSeo,
  defaultCityHeroDescription,
  type CityPage,
  type CityPageHighlight,
  type CityPagesStore,
} from "../../../data/cityPages";
import { slugifyCitySlug } from "../../../lib/cityPageUtils";
import { SITE_URL } from "../../../lib/siteSeo";
import BlogContentEditor from "../(dashboard)/blog/_components/BlogContentEditor";

const emptyHighlight: CityPageHighlight = { title: "", text: "" };

function emptyForm(): CityPage {
  return {
    slug: "",
    cityName: "",
    title: "",
    subtitle: "Build Confidence in German Communication",
    heroDescription: defaultCityHeroDescription,
    highlights: [{ ...emptyHighlight }, { ...emptyHighlight }, { ...emptyHighlight }, { ...emptyHighlight }],
    contentHtml: "",
    ctaHeading: "",
    ctaText: "Book a free demo class and get the right level and batch recommendation.",
    ctaButtonText: "Start Your Journey Now",
    seo: defaultCityPageSeo(""),
    isActive: true,
    sortOrder: 1,
  };
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminCityPagesContent() {
  const [store, setStore] = useState<CityPagesStore>({ pages: [] });
  const [form, setForm] = useState<CityPage>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedPages = useMemo(
    () => [...store.pages].sort((a, b) => a.sortOrder - b.sortOrder || a.cityName.localeCompare(b.cityName)),
    [store.pages],
  );

  async function loadPages() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/city-pages", { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error("Could not load city pages.");
      }
      const data = (await response.json()) as CityPagesStore;
      setStore(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load city pages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPages();
  }, []);

  function resetForm() {
    setForm(emptyForm());
    setEditingSlug(null);
    setError("");
  }

  function openAddForm() {
    resetForm();
    setSuccess("");
    setViewMode("form");
  }

  function openEditForm(page: CityPage) {
    setForm({
      ...page,
      highlights: page.highlights.length ? page.highlights : [{ ...emptyHighlight }],
      seo: page.seo ?? defaultCityPageSeo(page.cityName),
    });
    setEditingSlug(page.slug);
    setSuccess("");
    setError("");
    setViewMode("form");
  }

  function backToList() {
    resetForm();
    setViewMode("list");
  }

  function updateField<K extends keyof CityPage>(key: K, value: CityPage[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "cityName" && typeof value === "string") {
        const cityName = value.trim();
        if (!editingSlug) {
          next.slug = slugifyCitySlug(cityName);
        }
        if (!current.title || current.title === `German Classes in ${current.cityName}`) {
          next.title = cityName ? `German Classes in ${cityName}` : "";
        }
        if (!current.ctaHeading || current.ctaHeading.startsWith("Start learning German from")) {
          next.ctaHeading = cityName ? `Start learning German from ${cityName}` : "";
        }
        next.seo = {
          ...current.seo,
          metaTitle: current.seo.metaTitle.includes(current.cityName || " ")
            ? defaultCityPageSeo(cityName).metaTitle
            : current.seo.metaTitle,
          metaKeyword: current.seo.metaKeyword.includes(current.cityName || " ")
            ? defaultCityPageSeo(cityName).metaKeyword
            : current.seo.metaKeyword,
          metaDescription: current.seo.metaDescription.includes(current.cityName || " ")
            ? defaultCityPageSeo(cityName).metaDescription
            : current.seo.metaDescription,
        };
      }
      return next;
    });
  }

  function updateHighlight(index: number, key: keyof CityPageHighlight, value: string) {
    setForm((current) => {
      const highlights = [...current.highlights];
      highlights[index] = { ...highlights[index], [key]: value };
      return { ...current, highlights };
    });
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/city-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          ...form,
          slug: editingSlug || form.slug || slugifyCitySlug(form.cityName),
        }),
      });
      const data = (await response.json()) as CityPagesStore & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not save city page.");
      }

      setStore(data);
      setSuccess(editingSlug ? "City page updated." : "City page created.");
      backToList();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save city page.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("Delete this city page?")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/city-pages?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = (await response.json()) as CityPagesStore & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not delete city page.");
      }

      setStore(data);
      if (editingSlug === slug) {
        backToList();
      }
      setSuccess("City page deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete city page.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="adm-page-content adm-city-manage">Loading city pages...</div>;
  }

  if (viewMode === "form") {
    return (
      <div className="adm-city-manage">
        <h1 className="adm-city-manage-title">City Page Management</h1>

        <form onSubmit={handleSave} className="adm-city-edit-form">
          <div className="adm-city-edit-bar">
            <div>
              <h2 className="adm-city-edit-bar-title">
                {editingSlug ? "Edit City Page" : "Add City Page"}
              </h2>
              <p className="adm-city-breadcrumb">
                Pages &gt; {editingSlug ? "Edit Pages city" : "Add New Pages city"}
              </p>
            </div>
            <div className="adm-city-edit-bar-actions">
              <button type="button" className="adm-city-cancel-link" onClick={backToList}>
                Cancel
              </button>
              <button type="submit" className="adm-city-publish-btn" disabled={saving}>
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>

          {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}

          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">Add New Page</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>
                  Page Name: <em>*</em>
                </span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="German Classes in Delhi"
                  required
                />
              </label>

              <label className="adm-city-field">
                <span>
                  City Name: <em>*</em>
                </span>
                <input
                  type="text"
                  value={form.cityName}
                  onChange={(event) => updateField("cityName", event.target.value)}
                  placeholder="Delhi"
                  required
                />
              </label>

              <label className="adm-city-field">
                <span>
                  Page Url: <em>*</em>
                </span>
                <div className="adm-city-url-field">
                  <span className="adm-city-url-prefix">{SITE_URL}/city/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) => updateField("slug", slugifyCitySlug(event.target.value))}
                    placeholder="delhi"
                    required
                    disabled={Boolean(editingSlug)}
                  />
                </div>
              </label>

              <div className="adm-city-field-row">
                <label className="adm-city-field">
                  <span>Sort Order</span>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(event) => updateField("sortOrder", Number(event.target.value) || 0)}
                  />
                </label>
                <label className="adm-city-check-field">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) => updateField("isActive", event.target.checked)}
                  />
                  <span>Active on website</span>
                </label>
              </div>
            </div>
          </section>

          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION 1 (HERO TITLE)</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>Badge Text (Small label above heading)</span>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(event) => updateField("subtitle", event.target.value)}
                  placeholder="Build Confidence in German Communication"
                />
                <small>
                  This is the small highlighted text shown with the main heading on the city page.
                </small>
              </label>
              <label className="adm-city-field">
                <span>Hero Paragraph (Under badge text)</span>
                <textarea
                  rows={4}
                  value={form.heroDescription}
                  onChange={(event) => updateField("heroDescription", event.target.value)}
                  placeholder="Professional German Goethe & TELC learning assistance from A1 to C2..."
                />
                <small>
                  Shown under the typed badge line on the city page hero. Aim for about 3 lines.
                </small>
              </label>
            </div>
          </section>

          <section className="adm-city-section-card">
            <div className="adm-city-section-head">
              <h3 className="adm-city-section-title">SECTION 2 (HIGHLIGHTS)</h3>
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => updateField("highlights", [...form.highlights, { ...emptyHighlight }])}
              >
                + Add Highlight
              </button>
            </div>
            <div className="adm-city-section-body">
              {form.highlights.map((item, index) => (
                <div key={`highlight-${index}`} className="adm-city-highlight-card">
                  <div className="adm-city-section-head">
                    <h4>Highlight {index + 1}</h4>
                    {form.highlights.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        onClick={() =>
                          updateField(
                            "highlights",
                            form.highlights.filter((_, itemIndex) => itemIndex !== index),
                          )
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <label className="adm-city-field">
                    <span>Title</span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) => updateHighlight(index, "title", event.target.value)}
                    />
                  </label>
                  <label className="adm-city-field">
                    <span>Text</span>
                    <textarea
                      rows={2}
                      value={item.text}
                      onChange={(event) => updateHighlight(index, "text", event.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>

          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION 3 (MAIN CONTENT)</h3>
            <div className="adm-city-section-body">
              <BlogContentEditor value={form.contentHtml} onChange={(html) => updateField("contentHtml", html)} />
            </div>
          </section>

          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION 4 (BOTTOM CTA)</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>CTA Heading</span>
                <input
                  type="text"
                  value={form.ctaHeading}
                  onChange={(event) => updateField("ctaHeading", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>CTA Text</span>
                <textarea
                  rows={3}
                  value={form.ctaText}
                  onChange={(event) => updateField("ctaText", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>CTA Button</span>
                <input
                  type="text"
                  value={form.ctaButtonText}
                  onChange={(event) => updateField("ctaButtonText", event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION 5 (SEO META TAGS)</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>Meta Title</span>
                <input
                  type="text"
                  maxLength={70}
                  value={form.seo.metaTitle}
                  onChange={(event) => updateField("seo", { ...form.seo, metaTitle: event.target.value })}
                />
              </label>
              <label className="adm-city-field">
                <span>Meta Keyword</span>
                <textarea
                  rows={2}
                  maxLength={160}
                  value={form.seo.metaKeyword}
                  onChange={(event) => updateField("seo", { ...form.seo, metaKeyword: event.target.value })}
                />
              </label>
              <label className="adm-city-field">
                <span>Meta Description</span>
                <textarea
                  rows={3}
                  maxLength={250}
                  value={form.seo.metaDescription}
                  onChange={(event) =>
                    updateField("seo", { ...form.seo, metaDescription: event.target.value })
                  }
                />
              </label>
            </div>
          </section>
        </form>
      </div>
    );
  }

  return (
    <div className="adm-city-manage">
      <div className="adm-city-manage-head">
        <div>
          <h1 className="adm-city-manage-title">City Page Management</h1>
          <p className="adm-city-manage-subtitle">Manage Pages</p>
          <p className="adm-city-breadcrumb">Pages &gt; Manage Pages</p>
        </div>
        <button type="button" className="adm-city-add-btn" onClick={openAddForm}>
          + Add New
        </button>
      </div>

      {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}
      {success ? <p className="adm-form-message adm-form-message-success">{success}</p> : null}

      <section className="adm-city-listing-card">
        <h2 className="adm-city-listing-title">Pages Listing</h2>

        <div className="adm-city-table-wrap">
          <table className="adm-city-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Page Name</th>
                <th>Page Url</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="adm-city-empty">
                    No city pages yet. Click &quot;+ Add New&quot; to create one.
                  </td>
                </tr>
              ) : (
                sortedPages.map((page, index) => (
                  <tr key={page.slug}>
                    <td>{index + 1}</td>
                    <td>{page.title}</td>
                    <td>
                      <Link href={`/city/${page.slug}`} target="_blank" rel="noreferrer" className="adm-city-url">
                        {SITE_URL}/city/{page.slug}
                      </Link>
                    </td>
                    <td>
                      <div className="adm-city-row-actions">
                        <button
                          type="button"
                          className="adm-city-action-btn adm-city-action-edit"
                          onClick={() => openEditForm(page)}
                          title="Edit"
                          aria-label={`Edit ${page.title}`}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="adm-city-action-btn adm-city-action-delete"
                          onClick={() => void handleDelete(page.slug)}
                          disabled={saving}
                          title="Delete"
                          aria-label={`Delete ${page.title}`}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
