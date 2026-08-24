"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  defaultCityPageSeo,
  type CityPage,
  type CityPageHighlight,
  type CityPagesStore,
} from "../../../data/cityPages";
import { slugifyCitySlug } from "../../../lib/cityPageUtils";
import BlogContentEditor from "../(dashboard)/blog/_components/BlogContentEditor";

const emptyHighlight: CityPageHighlight = { title: "", text: "" };

function emptyForm(): CityPage {
  return {
    slug: "",
    cityName: "",
    title: "",
    subtitle: "Build Confidence in German Communication",
    heroDescription: "",
    highlights: [{ ...emptyHighlight }, { ...emptyHighlight }, { ...emptyHighlight }, { ...emptyHighlight }],
    contentHtml: "",
    ctaHeading: "",
    ctaText: "Book a free demo class and get the right level and batch recommendation.",
    ctaButtonText: "Book Free Demo",
    seo: defaultCityPageSeo(""),
    isActive: true,
    sortOrder: 1,
  };
}

export default function AdminCityPagesContent() {
  const [store, setStore] = useState<CityPagesStore>({ pages: [] });
  const [form, setForm] = useState<CityPage>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
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

  function startEdit(page: CityPage) {
    setForm({
      ...page,
      highlights: page.highlights.length ? page.highlights : [{ ...emptyHighlight }],
      seo: page.seo ?? defaultCityPageSeo(page.cityName),
    });
    setEditingSlug(page.slug);
    setSuccess("");
    setError("");
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
      resetForm();
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
        resetForm();
      }
      setSuccess("City page deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete city page.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="adm-page-content">Loading city pages...</div>;
  }

  return (
    <div className="adm-city-pages">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">City Pages</h1>
          <p className="adm-page-subtitle">
            Create city landing pages like German Classes in Delhi, Jaipur, Mumbai.
          </p>
        </div>
      </div>

      {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}
      {success ? <p className="adm-form-message adm-form-message-success">{success}</p> : null}

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">All City Pages</h2>
        </div>
        {sortedPages.length === 0 ? (
          <p className="adm-panel-note">No city pages yet. Add the first one below.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>City</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPages.map((page) => (
                  <tr key={page.slug}>
                    <td>{page.cityName}</td>
                    <td>
                      <Link href={`/city/${page.slug}`} target="_blank" rel="noreferrer">
                        /city/{page.slug}
                      </Link>
                    </td>
                    <td>{page.isActive ? "Active" : "Hidden"}</td>
                    <td>{page.sortOrder}</td>
                    <td className="adm-table-actions">
                      <button type="button" className="adm-btn adm-btn-secondary" onClick={() => startEdit(page)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        onClick={() => void handleDelete(page.slug)}
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <form onSubmit={handleSave} className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">{editingSlug ? `Edit ${form.cityName || "City"}` : "Add City Page"}</h2>
          {editingSlug ? (
            <button type="button" className="adm-btn adm-btn-secondary" onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <div className="adm-form-grid">
          <label className="adm-form-field">
            <span>City Name *</span>
            <input
              type="text"
              value={form.cityName}
              onChange={(event) => updateField("cityName", event.target.value)}
              placeholder="Delhi"
              required
            />
          </label>
          <label className="adm-form-field">
            <span>URL Slug *</span>
            <input
              type="text"
              value={form.slug}
              onChange={(event) => updateField("slug", slugifyCitySlug(event.target.value))}
              placeholder="delhi"
              required
              disabled={Boolean(editingSlug)}
            />
          </label>
          <label className="adm-form-field">
            <span>Sort Order</span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => updateField("sortOrder", Number(event.target.value) || 0)}
            />
          </label>
          <label className="adm-form-field adm-form-field-inline">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateField("isActive", event.target.checked)}
            />
            <span>Active on website</span>
          </label>
          <label className="adm-form-field adm-form-field-full">
            <span>Page Title *</span>
            <input
              type="text"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
            />
          </label>
          <label className="adm-form-field adm-form-field-full">
            <span>Subtitle</span>
            <input
              type="text"
              value={form.subtitle}
              onChange={(event) => updateField("subtitle", event.target.value)}
            />
          </label>
          <label className="adm-form-field adm-form-field-full">
            <span>Hero Description</span>
            <textarea
              rows={3}
              value={form.heroDescription}
              onChange={(event) => updateField("heroDescription", event.target.value)}
            />
          </label>
        </div>

        <div className="adm-panel-head" style={{ marginTop: "1.25rem" }}>
          <h3 className="adm-panel-title">Highlights</h3>
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            onClick={() => updateField("highlights", [...form.highlights, { ...emptyHighlight }])}
          >
            + Add Highlight
          </button>
        </div>
        {form.highlights.map((item, index) => (
          <div key={`highlight-${index}`} className="adm-general-card-editor">
            <div className="adm-panel-head">
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
            <label className="adm-form-field adm-form-field-full">
              <span>Title</span>
              <input
                type="text"
                value={item.title}
                onChange={(event) => updateHighlight(index, "title", event.target.value)}
              />
            </label>
            <label className="adm-form-field adm-form-field-full">
              <span>Text</span>
              <textarea
                rows={2}
                value={item.text}
                onChange={(event) => updateHighlight(index, "text", event.target.value)}
              />
            </label>
          </div>
        ))}

        <div className="adm-panel-head" style={{ marginTop: "1.25rem" }}>
          <h3 className="adm-panel-title">Main Content</h3>
        </div>
        <BlogContentEditor value={form.contentHtml} onChange={(html) => updateField("contentHtml", html)} />

        <div className="adm-form-grid" style={{ marginTop: "1.25rem" }}>
          <label className="adm-form-field adm-form-field-full">
            <span>CTA Heading</span>
            <input
              type="text"
              value={form.ctaHeading}
              onChange={(event) => updateField("ctaHeading", event.target.value)}
            />
          </label>
          <label className="adm-form-field adm-form-field-full">
            <span>CTA Text</span>
            <textarea
              rows={2}
              value={form.ctaText}
              onChange={(event) => updateField("ctaText", event.target.value)}
            />
          </label>
          <label className="adm-form-field">
            <span>CTA Button</span>
            <input
              type="text"
              value={form.ctaButtonText}
              onChange={(event) => updateField("ctaButtonText", event.target.value)}
            />
          </label>
        </div>

        <section className="adm-panel adm-seo-panel" style={{ marginTop: "1.5rem", boxShadow: "none" }}>
          <div className="adm-panel-head">
            <h3 className="adm-panel-title">SEO — Meta Tags</h3>
          </div>
          <div className="adm-form-grid adm-seo-grid">
            <label className="adm-form-field adm-form-field-full">
              <span>Meta Title</span>
              <input
                type="text"
                maxLength={70}
                value={form.seo.metaTitle}
                onChange={(event) => updateField("seo", { ...form.seo, metaTitle: event.target.value })}
              />
            </label>
            <label className="adm-form-field adm-form-field-full">
              <span>Meta Keyword</span>
              <textarea
                rows={2}
                maxLength={160}
                value={form.seo.metaKeyword}
                onChange={(event) => updateField("seo", { ...form.seo, metaKeyword: event.target.value })}
              />
            </label>
            <label className="adm-form-field adm-form-field-full">
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

        <div className="adm-form-actions">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingSlug ? "Update City Page" : "Create City Page"}
          </button>
        </div>
      </form>
    </div>
  );
}
