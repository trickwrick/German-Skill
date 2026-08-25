"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminImageUploadField from "./AdminImageUploadField";
import {
  DEFAULT_HERO_BADGE_PREFIX,
  defaultCityPageSeo,
  defaultCityHeroDescription,
  defaultCityVision,
  defaultCityWhyLearn,
  defaultCityJourney,
  defaultCitySuccess,
  defaultCityFaqs,
  defaultHeroTypedPhrases,
  type CityPage,
  type CityPageHighlight,
  type CityPagesStore,
  type CityVisionSectionData,
  type CityWhyLearnSectionData,
  type CityWhyFeatureItem,
  type CityJourneySectionData,
  type CitySuccessSectionData,
  type CityFaqSectionData,
  type CityFaqItem,
} from "../../../data/cityPages";
import { normalizeCitySlug, buildCityPagePath, cityPagePathSlug } from "../../../lib/cityPageUtils";
import { SITE_URL } from "../../../lib/siteSeo";
import AdminRichTextField from "./AdminRichTextField";
import BlogContentEditor from "../(dashboard)/blog/_components/BlogContentEditor";

const emptyHighlight: CityPageHighlight = { title: "", text: "" };

const FEATURE_TONES: CityWhyFeatureItem["tone"][] = ["demo", "exam", "tutors", "batch"];

function emptyFeature(): CityWhyFeatureItem {
  return { title: "", text: "", badge: "", tone: "demo" };
}

function emptyFaq(): CityFaqItem {
  return { id: `faq-${Date.now()}`, question: "", answer: "" };
}

function cityNameFromTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) {
    return "";
  }

  const match = trimmed.match(/\bin\s+(.+)$/i);
  if (match?.[1]?.trim()) {
    return match[1].trim();
  }

  return trimmed;
}

function ensureVision(page: Partial<CityPage>, cityName: string): CityVisionSectionData {
  const fallback = defaultCityVision(cityName);
  if (!page.vision) {
    return fallback;
  }

  return {
    ...fallback,
    ...page.vision,
    points:
      Array.isArray(page.vision.points) && page.vision.points.length
        ? page.vision.points
        : fallback.points,
  };
}

function ensureWhyLearn(page: Partial<CityPage>, cityName: string): CityWhyLearnSectionData {
  const fallback = defaultCityWhyLearn(cityName);
  const base = page.whyLearn ?? fallback;
  const collage = Array.isArray(base.collage) ? [...base.collage] : [...fallback.collage];
  while (collage.length < 3) {
    collage.push({ src: "", alt: "", label: "" });
  }

  return {
    ...fallback,
    ...base,
    collage: collage.slice(0, 3),
    features:
      Array.isArray(base.features) && base.features.length ? base.features : fallback.features,
  };
}

function ensureJourney(page: Partial<CityPage>, cityName: string): CityJourneySectionData {
  if (page.journey) return page.journey;
  const fallback = defaultCityJourney(cityName);
  return {
    text: page.ctaText || fallback.text,
    buttonText: page.ctaButtonText || fallback.buttonText,
    buttonHref: fallback.buttonHref,
  };
}

function ensureSuccess(page: Partial<CityPage>, cityName: string): CitySuccessSectionData {
  const fallback = defaultCitySuccess(cityName);
  const success = page.success as
    | (Partial<CitySuccessSectionData> & { mosaicImages?: string[] })
    | undefined;
  if (!success) {
    return fallback;
  }

  const legacyImage = Array.isArray(success.mosaicImages)
    ? success.mosaicImages.find((src) => src?.trim())
    : "";

  return {
    ...fallback,
    ...success,
    imageSrc: success.imageSrc?.trim() || legacyImage || fallback.imageSrc,
    imageAlt: success.imageAlt?.trim() || fallback.imageAlt,
  };
}

function ensureFaqs(page: Partial<CityPage>): CityFaqSectionData {
  const fallback = defaultCityFaqs();
  if (!page.faqs) {
    return fallback;
  }

  return {
    ...fallback,
    ...page.faqs,
    items:
      Array.isArray(page.faqs.items) && page.faqs.items.length
        ? page.faqs.items
        : fallback.items,
  };
}

function emptyForm(): CityPage {
  const cityName = "";
  const journey = defaultCityJourney(cityName);
  return {
    slug: "",
    cityName,
    title: "",
    subtitle: DEFAULT_HERO_BADGE_PREFIX,
    heroTypedPhrases: defaultHeroTypedPhrases(),
    heroDescription: defaultCityHeroDescription,
    highlights: [{ ...emptyHighlight }, { ...emptyHighlight }, { ...emptyHighlight }, { ...emptyHighlight }],
    contentHtml: "",
    vision: defaultCityVision(cityName),
    whyLearn: ensureWhyLearn({ whyLearn: defaultCityWhyLearn(cityName) }, cityName),
    journey,
    success: defaultCitySuccess(cityName),
    faqs: defaultCityFaqs(),
    ctaHeading: "",
    ctaText: journey.text,
    ctaButtonText: journey.buttonText,
    seo: defaultCityPageSeo(cityName),
    isActive: true,
    sortOrder: 1,
  };
}

function stillMatchesDefault(
  current: string,
  previousDefault: string,
  emptyDefault: string,
): boolean {
  return !current || current === previousDefault || current === emptyDefault;
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
    const cityName = page.cityName || "";
    const journey = ensureJourney(page, cityName);
    setForm({
      ...page,
      highlights: page.highlights?.length ? page.highlights : [{ ...emptyHighlight }],
      subtitle: page.subtitle || DEFAULT_HERO_BADGE_PREFIX,
      heroTypedPhrases:
        Array.isArray(page.heroTypedPhrases) && page.heroTypedPhrases.length
          ? page.heroTypedPhrases
          : defaultHeroTypedPhrases(),
      heroDescription: page.heroDescription || defaultCityHeroDescription,
      vision: ensureVision(page, cityName),
      whyLearn: ensureWhyLearn(page, cityName),
      journey,
      success: ensureSuccess(page, cityName),
      faqs: ensureFaqs(page),
      ctaHeading: page.ctaHeading || `Start learning German from ${cityName}`,
      ctaText: page.ctaText || journey.text,
      ctaButtonText: page.ctaButtonText || journey.buttonText,
      seo: page.seo ?? defaultCityPageSeo(cityName),
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

      if (key === "title" && typeof value === "string") {
        const prevCity = current.cityName;
        const cityName = cityNameFromTitle(value);
        next.cityName = cityName;

        const prevVision = defaultCityVision(prevCity);
        const prevWhy = defaultCityWhyLearn(prevCity);
        const prevJourney = defaultCityJourney(prevCity);
        const prevSuccess = defaultCitySuccess(prevCity);
        const prevSeo = defaultCityPageSeo(prevCity);
        const emptyVision = defaultCityVision("");
        const emptyWhy = defaultCityWhyLearn("");
        const emptyJourney = defaultCityJourney("");
        const emptySuccess = defaultCitySuccess("");
        const emptySeo = defaultCityPageSeo("");

        if (!editingSlug) {
          next.slug = normalizeCitySlug(cityName);
        }

        if (!current.ctaHeading || current.ctaHeading.startsWith("Start learning German from")) {
          next.ctaHeading = cityName ? `Start learning German from ${cityName}` : "";
        }

        const vision = { ...current.vision };
        if (
          stillMatchesDefault(
            current.vision.headingHighlight,
            prevVision.headingHighlight,
            emptyVision.headingHighlight,
          ) ||
          !editingSlug
        ) {
          vision.headingHighlight = cityName;
        }
        if (stillMatchesDefault(current.vision.text, prevVision.text, emptyVision.text)) {
          vision.text = defaultCityVision(cityName).text;
        }
        if (stillMatchesDefault(current.vision.imageAlt, prevVision.imageAlt, emptyVision.imageAlt)) {
          vision.imageAlt = defaultCityVision(cityName).imageAlt;
        }
        next.vision = vision;

        const whyLearn = {
          ...current.whyLearn,
          features: [
            ...(Array.isArray(current.whyLearn?.features)
              ? current.whyLearn.features
              : defaultCityWhyLearn(cityName).features),
          ],
        };
        if (stillMatchesDefault(current.whyLearn.text, prevWhy.text, emptyWhy.text)) {
          whyLearn.text = defaultCityWhyLearn(cityName).text;
        }
        whyLearn.features = whyLearn.features.map((feature, index) => {
          const prevFeature = prevWhy.features[index];
          const emptyFeatureText = emptyWhy.features[index]?.text || "";
          if (prevFeature && stillMatchesDefault(feature.text, prevFeature.text, emptyFeatureText)) {
            return {
              ...feature,
              text: defaultCityWhyLearn(cityName).features[index]?.text || feature.text,
            };
          }
          return feature;
        });
        next.whyLearn = whyLearn;

        const journey = { ...current.journey };
        if (stillMatchesDefault(current.journey.text, prevJourney.text, emptyJourney.text)) {
          journey.text = defaultCityJourney(cityName).text;
          next.ctaText = journey.text;
        }
        next.journey = journey;

        const successSection = { ...current.success };
        if (stillMatchesDefault(current.success.text, prevSuccess.text, emptySuccess.text)) {
          successSection.text = defaultCitySuccess(cityName).text;
        }
        next.success = successSection;

        next.seo = {
          ...current.seo,
          metaTitle: stillMatchesDefault(current.seo.metaTitle, prevSeo.metaTitle, emptySeo.metaTitle)
            ? defaultCityPageSeo(cityName).metaTitle
            : current.seo.metaTitle,
          metaKeyword: stillMatchesDefault(
            current.seo.metaKeyword,
            prevSeo.metaKeyword,
            emptySeo.metaKeyword,
          )
            ? defaultCityPageSeo(cityName).metaKeyword
            : current.seo.metaKeyword,
          metaDescription: stillMatchesDefault(
            current.seo.metaDescription,
            prevSeo.metaDescription,
            emptySeo.metaDescription,
          )
            ? defaultCityPageSeo(cityName).metaDescription
            : current.seo.metaDescription,
        };
      }

      return next;
    });
  }

  function updateVision<K extends keyof CityVisionSectionData>(key: K, value: CityVisionSectionData[K]) {
    setForm((current) => ({ ...current, vision: { ...current.vision, [key]: value } }));
  }

  function updateWhyLearn<K extends keyof CityWhyLearnSectionData>(
    key: K,
    value: CityWhyLearnSectionData[K],
  ) {
    setForm((current) => ({ ...current, whyLearn: { ...current.whyLearn, [key]: value } }));
  }

  function updateJourney<K extends keyof CityJourneySectionData>(
    key: K,
    value: CityJourneySectionData[K],
  ) {
    setForm((current) => {
      const journey = { ...current.journey, [key]: value };
      return {
        ...current,
        journey,
        ctaText: key === "text" ? String(value) : current.ctaText,
        ctaButtonText: key === "buttonText" ? String(value) : current.ctaButtonText,
      };
    });
  }

  function updateSuccess<K extends keyof CitySuccessSectionData>(
    key: K,
    value: CitySuccessSectionData[K],
  ) {
    setForm((current) => ({ ...current, success: { ...current.success, [key]: value } }));
  }

  function updateFaqs<K extends keyof CityFaqSectionData>(key: K, value: CityFaqSectionData[K]) {
    setForm((current) => ({ ...current, faqs: { ...current.faqs, [key]: value } }));
  }

  function updateHighlight(index: number, key: keyof CityPageHighlight, value: string) {
    setForm((current) => {
      const highlights = [...current.highlights];
      highlights[index] = { ...highlights[index], [key]: value };
      return { ...current, highlights };
    });
  }

  function updateVisionPoint(index: number, value: string) {
    setForm((current) => {
      const points = [...current.vision.points];
      points[index] = value;
      return { ...current, vision: { ...current.vision, points } };
    });
  }

  function updateCollage(
    index: number,
    key: "src" | "alt" | "label",
    value: string,
  ) {
    setForm((current) => {
      const collage = [...current.whyLearn.collage];
      collage[index] = { ...collage[index], [key]: value };
      return { ...current, whyLearn: { ...current.whyLearn, collage } };
    });
  }

  function updateFeature(index: number, key: keyof CityWhyFeatureItem, value: string) {
    setForm((current) => {
      const features = [...current.whyLearn.features];
      features[index] = { ...features[index], [key]: value } as CityWhyFeatureItem;
      return { ...current, whyLearn: { ...current.whyLearn, features } };
    });
  }

  function updateFaqItem(index: number, key: keyof CityFaqItem, value: string) {
    setForm((current) => {
      const items = [...current.faqs.items];
      items[index] = { ...items[index], [key]: value };
      return { ...current, faqs: { ...current.faqs, items } };
    });
  }

  function updateHeroTypedPhrase(index: number, value: string) {
    setForm((current) => {
      const heroTypedPhrases = [...current.heroTypedPhrases];
      heroTypedPhrases[index] = value;
      return { ...current, heroTypedPhrases };
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
          cityName: form.cityName.trim() || cityNameFromTitle(form.title),
          subtitle: DEFAULT_HERO_BADGE_PREFIX,
          slug: normalizeCitySlug(form.slug || form.cityName || cityNameFromTitle(form.title)),
          ctaText: form.journey.text,
          ctaButtonText: form.journey.buttonText,
          originalSlug: editingSlug || undefined,
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

          {/* —— Add New Page —— */}
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
                <small>
                  City is taken from the page name (for example, Delhi from “German Classes in
                  Delhi”).
                </small>
              </label>

              <label className="adm-city-field">
                <span>
                  Page Url: <em>*</em>
                </span>
                <div className="adm-city-url-field">
                  <span className="adm-city-url-prefix">{SITE_URL}/</span>
                  <input
                    type="text"
                    value={cityPagePathSlug(form.slug) || "german-classes-"}
                    onChange={(event) =>
                      updateField("slug", normalizeCitySlug(event.target.value))
                    }
                    placeholder="german-classes-delhi"
                    required
                  />
                </div>
                <small>
                  Live link will open like{" "}
                  {SITE_URL}
                  {buildCityPagePath(form.slug || "delhi")}
                </small>
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
          </section>

          {/* —— SECTION 1 HERO —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION 1 (HERO)</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>Fixed Badge Text</span>
                <input
                  type="text"
                  value={DEFAULT_HERO_BADGE_PREFIX.trim()}
                  readOnly
                  disabled
                  className="adm-city-input-locked"
                />
                <small>
                  This text is fixed and cannot be edited. Phrases after it will type out one by one.
                </small>
              </label>

              <div className="adm-city-section-head">
                <h4>Rotating Typed Phrases</h4>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() =>
                    updateField("heroTypedPhrases", [...form.heroTypedPhrases, ""])
                  }
                >
                  + Add Phrase
                </button>
              </div>
              {(form.heroTypedPhrases?.length ? form.heroTypedPhrases : [""]).map(
                (phrase, index) => (
                  <div key={`hero-phrase-${index}`} className="adm-city-highlight-card">
                    <div className="adm-city-section-head">
                      <h4>Phrase {index + 1}</h4>
                      {(form.heroTypedPhrases?.length || 0) > 1 ? (
                        <button
                          type="button"
                          className="adm-btn adm-btn-secondary"
                          onClick={() =>
                            updateField(
                              "heroTypedPhrases",
                              form.heroTypedPhrases.filter((_, i) => i !== index),
                            )
                          }
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <label className="adm-city-field">
                      <span>Text</span>
                      <input
                        type="text"
                        value={phrase}
                        onChange={(event) => updateHeroTypedPhrase(index, event.target.value)}
                        placeholder={
                          index === 0
                            ? "German Communication"
                            : index === 1
                              ? "German Classes"
                              : "German Best learn"
                        }
                      />
                    </label>
                  </div>
                ),
              )}
              <small className="adm-city-field-hint">
                Example: German Communication → German Classes → German Best learn (one after another)
              </small>

              <AdminRichTextField
                label="Hero Paragraph (Under badge text)"
                value={form.heroDescription}
                onChange={(html) => updateField("heroDescription", html)}
                hint="Shown under the typed badge line on the city page hero. Use bold, links, and highlights as needed."
              />
            </div>
          </section>

          {/* —— SECTION Our Vision —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION Our Vision</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>Tag</span>
                <input
                  type="text"
                  value={form.vision.tag}
                  onChange={(event) => updateVision("tag", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Heading</span>
                <input
                  type="text"
                  value={form.vision.heading}
                  onChange={(event) => updateVision("heading", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Heading Highlight (city name)</span>
                <input
                  type="text"
                  value={form.vision.headingHighlight}
                  onChange={(event) => updateVision("headingHighlight", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Heading Suffix</span>
                <input
                  type="text"
                  value={form.vision.headingSuffix}
                  onChange={(event) => updateVision("headingSuffix", event.target.value)}
                />
              </label>
              <AdminRichTextField
                label="Vision Description Text"
                value={form.vision.text}
                onChange={(html) => updateVision("text", html)}
              />

              <div className="adm-city-section-head">
                <h4>Points</h4>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() => updateVision("points", [...form.vision.points, ""])}
                >
                  + Add Point
                </button>
              </div>
              {form.vision.points.map((point, index) => (
                <div key={`vision-point-${index}`} className="adm-city-highlight-card">
                  <div className="adm-city-section-head">
                    <h4>Point {index + 1}</h4>
                    {form.vision.points.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        onClick={() =>
                          updateVision(
                            "points",
                            form.vision.points.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <AdminRichTextField
                    label="Point Text"
                    value={point}
                    height={220}
                    onChange={(html) => updateVisionPoint(index, html)}
                  />
                </div>
              ))}

              <AdminImageUploadField
                label="Vision Image"
                value={form.vision.imageSrc}
                folder="general"
                placeholder="/hero-students.jpg"
                onChange={(path) => updateVision("imageSrc", path)}
              />
              <label className="adm-city-field">
                <span>Image Alt</span>
                <input
                  type="text"
                  value={form.vision.imageAlt}
                  onChange={(event) => updateVision("imageAlt", event.target.value)}
                />
              </label>
              <div className="adm-city-field-row">
                <label className="adm-city-field">
                  <span>Badge Value</span>
                  <input
                    type="text"
                    value={form.vision.badgeValue}
                    onChange={(event) => updateVision("badgeValue", event.target.value)}
                  />
                </label>
                <label className="adm-city-field">
                  <span>Badge Label</span>
                  <input
                    type="text"
                    value={form.vision.badgeLabel}
                    onChange={(event) => updateVision("badgeLabel", event.target.value)}
                  />
                </label>
              </div>
              <label className="adm-city-field">
                <span>Link Text</span>
                <input
                  type="text"
                  value={form.vision.linkText}
                  onChange={(event) => updateVision("linkText", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Link Href</span>
                <input
                  type="text"
                  value={form.vision.linkHref}
                  onChange={(event) => updateVision("linkHref", event.target.value)}
                />
              </label>
            </div>
          </section>

          {/* —— SECTION Why Learn —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION Why Learn at Fluent AUF</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>Heading Before</span>
                <input
                  type="text"
                  value={form.whyLearn.headingBefore}
                  onChange={(event) => updateWhyLearn("headingBefore", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Heading Highlight</span>
                <input
                  type="text"
                  value={form.whyLearn.headingHighlight}
                  onChange={(event) => updateWhyLearn("headingHighlight", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Heading After</span>
                <input
                  type="text"
                  value={form.whyLearn.headingAfter}
                  onChange={(event) => updateWhyLearn("headingAfter", event.target.value)}
                />
              </label>
              <AdminRichTextField
                label="Description Text"
                value={form.whyLearn.text}
                onChange={(html) => updateWhyLearn("text", html)}
              />

              <h4>Collage Images (3)</h4>
              {form.whyLearn.collage.map((item, index) => (
                <div key={`collage-${index}`} className="adm-city-highlight-card">
                  <h4>Collage {index + 1}</h4>
                  <label className="adm-city-field">
                    <span>Label</span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(event) => updateCollage(index, "label", event.target.value)}
                    />
                  </label>
                  <label className="adm-city-field">
                    <span>Alt</span>
                    <input
                      type="text"
                      value={item.alt}
                      onChange={(event) => updateCollage(index, "alt", event.target.value)}
                    />
                  </label>
                  <AdminImageUploadField
                    label={`Collage Image ${index + 1}`}
                    value={item.src}
                    folder="general"
                    placeholder="/hero-students.jpg"
                    onChange={(path) => updateCollage(index, "src", path)}
                  />
                </div>
              ))}

              <div className="adm-city-section-head">
                <h4>Features</h4>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() =>
                    updateWhyLearn("features", [...form.whyLearn.features, emptyFeature()])
                  }
                >
                  + Add Feature
                </button>
              </div>
              {form.whyLearn.features.map((feature, index) => (
                <div key={`feature-${index}`} className="adm-city-highlight-card">
                  <div className="adm-city-section-head">
                    <h4>Feature {index + 1}</h4>
                    {form.whyLearn.features.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        onClick={() =>
                          updateWhyLearn(
                            "features",
                            form.whyLearn.features.filter((_, i) => i !== index),
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
                      value={feature.title}
                      onChange={(event) => updateFeature(index, "title", event.target.value)}
                    />
                  </label>
                  <AdminRichTextField
                    label="Feature Description"
                    value={feature.text}
                    height={220}
                    onChange={(html) => updateFeature(index, "text", html)}
                  />
                  <div className="adm-city-field-row">
                    <label className="adm-city-field">
                      <span>Badge</span>
                      <input
                        type="text"
                        value={feature.badge}
                        onChange={(event) => updateFeature(index, "badge", event.target.value)}
                      />
                    </label>
                    <label className="adm-city-field">
                      <span>Tone</span>
                      <select
                        value={feature.tone}
                        onChange={(event) =>
                          updateFeature(index, "tone", event.target.value as CityWhyFeatureItem["tone"])
                        }
                      >
                        {FEATURE_TONES.map((tone) => (
                          <option key={tone} value={tone}>
                            {tone}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* —— SECTION Journey —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION Start Your Journey Now</h3>
            <div className="adm-city-section-body">
              <AdminRichTextField
                label="Journey Description Text"
                value={form.journey.text}
                height={360}
                onChange={(html) => updateJourney("text", html)}
              />
              <label className="adm-city-field">
                <span>Button Text</span>
                <input
                  type="text"
                  value={form.journey.buttonText}
                  onChange={(event) => updateJourney("buttonText", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Button Href</span>
                <input
                  type="text"
                  value={form.journey.buttonHref}
                  onChange={(event) => updateJourney("buttonHref", event.target.value)}
                />
              </label>
            </div>
          </section>

          {/* —— SECTION Success —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION Goethe &amp; TELC Focused (Success)</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>Badge</span>
                <input
                  type="text"
                  value={form.success.badge}
                  onChange={(event) => updateSuccess("badge", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Kicker</span>
                <input
                  type="text"
                  value={form.success.kicker}
                  onChange={(event) => updateSuccess("kicker", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Heading</span>
                <input
                  type="text"
                  value={form.success.heading}
                  onChange={(event) => updateSuccess("heading", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Heading Highlight</span>
                <input
                  type="text"
                  value={form.success.headingHighlight}
                  onChange={(event) => updateSuccess("headingHighlight", event.target.value)}
                />
              </label>
              <AdminRichTextField
                label="Success Description Text"
                value={form.success.text}
                onChange={(html) => updateSuccess("text", html)}
              />
              <label className="adm-city-field">
                <span>Button Text</span>
                <input
                  type="text"
                  value={form.success.buttonText}
                  onChange={(event) => updateSuccess("buttonText", event.target.value)}
                />
              </label>
              <label className="adm-city-field">
                <span>Button Href</span>
                <input
                  type="text"
                  value={form.success.buttonHref}
                  onChange={(event) => updateSuccess("buttonHref", event.target.value)}
                />
              </label>

              <AdminImageUploadField
                label="Banner Image (right side)"
                value={form.success.imageSrc}
                folder="general"
                uploadLabel={`success-${form.slug || form.cityName || "city"}`}
                placeholder="/hero-students.jpg"
                onChange={(path) => updateSuccess("imageSrc", path)}
              />
              <label className="adm-city-field">
                <span>Image Alt Text</span>
                <input
                  type="text"
                  value={form.success.imageAlt}
                  onChange={(event) => updateSuccess("imageAlt", event.target.value)}
                  placeholder={`Successful German learners from ${form.cityName || "city"}`}
                />
                <small>Upload one collage-style image for the right side of this banner.</small>
              </label>
            </div>
          </section>

          {/* —— SECTION FAQs —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SECTION Frequently Asked Questions</h3>
            <div className="adm-city-section-body">
              <label className="adm-city-field">
                <span>Title</span>
                <input
                  type="text"
                  value={form.faqs.title}
                  onChange={(event) => updateFaqs("title", event.target.value)}
                />
              </label>
              <AdminRichTextField
                label="FAQ Subtitle"
                value={form.faqs.subtitle}
                height={220}
                onChange={(html) => updateFaqs("subtitle", html)}
              />

              <div className="adm-city-section-head">
                <h4>FAQ Items</h4>
                <button
                  type="button"
                  className="adm-btn adm-btn-secondary"
                  onClick={() => updateFaqs("items", [...form.faqs.items, emptyFaq()])}
                >
                  + Add FAQ
                </button>
              </div>
              {form.faqs.items.map((item, index) => (
                <div key={item.id || `faq-${index}`} className="adm-city-highlight-card">
                  <div className="adm-city-section-head">
                    <h4>FAQ {index + 1}</h4>
                    {form.faqs.items.length > 1 ? (
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary"
                        onClick={() =>
                          updateFaqs(
                            "items",
                            form.faqs.items.filter((_, i) => i !== index),
                          )
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <label className="adm-city-field">
                    <span>Question</span>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(event) => updateFaqItem(index, "question", event.target.value)}
                    />
                  </label>
                  <AdminRichTextField
                    label="Answer"
                    value={item.answer}
                    onChange={(html) => updateFaqItem(index, "answer", html)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* —— Highlights (optional) —— */}
          <section className="adm-city-section-card">
            <div className="adm-city-section-head">
              <h3 className="adm-city-section-title">Highlights (optional)</h3>
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
                  <AdminRichTextField
                    label="Highlight Text"
                    value={item.text}
                    height={220}
                    onChange={(html) => updateHighlight(index, "text", html)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* —— Main Content —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">Main Content</h3>
            <div className="adm-city-section-body">
              <BlogContentEditor
                value={form.contentHtml}
                onChange={(html) => updateField("contentHtml", html)}
                showPdfUpload
              />
            </div>
          </section>

          {/* —— SEO —— */}
          <section className="adm-city-section-card">
            <h3 className="adm-city-section-title">SEO Meta Tags</h3>
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
                      <Link
                        href={buildCityPagePath(page.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="adm-city-url"
                      >
                        {SITE_URL}
                        {buildCityPagePath(page.slug)}
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
