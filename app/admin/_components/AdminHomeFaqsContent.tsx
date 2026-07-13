"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultHomeFaqContent, type HomeFaqContent, type HomeFaqItem } from "../../../data/homeFaqs";
import { slugifyHomeFaqId } from "../../../lib/homeFaqUtils";

const emptyItem: HomeFaqItem = {
  id: "",
  question: "",
  answer: "",
  sortOrder: 1,
  isActive: true,
};

export default function AdminHomeFaqsContent() {
  const [content, setContent] = useState<HomeFaqContent>(defaultHomeFaqContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<HomeFaqItem>(emptyItem);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...content.items].sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );

  async function loadContent() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/home-faqs", { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error("Could not load homepage FAQs.");
      }

      const data = (await response.json()) as HomeFaqContent;
      setContent(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load homepage FAQs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadContent();
  }, []);

  function resetForm() {
    setForm(emptyItem);
    setEditingId(null);
    setError("");
  }

  function startEdit(item: HomeFaqItem) {
    setForm(item);
    setEditingId(item.id);
    setError("");
    setSuccess("");
  }

  async function handleSaveSection(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/home-faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(content),
      });

      const data = (await response.json()) as HomeFaqContent & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not save homepage FAQs.");
      }

      setContent(data);
      setSuccess("Homepage FAQ section saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save homepage FAQs.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveItem(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload: HomeFaqItem & { title: string; subtitle: string } = {
      ...form,
      id: slugifyHomeFaqId(form.id || form.question),
      question: form.question.trim(),
      answer: form.answer.trim(),
      sortOrder: editingId ? Number(form.sortOrder) || 1 : 1,
      isActive: form.isActive !== false,
      title: content.title,
      subtitle: content.subtitle,
    };

    try {
      const response = await fetch("/api/admin/home-faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as HomeFaqContent & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not save FAQ item.");
      }

      setContent(data);
      resetForm();
      setSuccess(editingId ? "FAQ updated." : "FAQ added.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save FAQ item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ from the homepage?")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/home-faqs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const data = (await response.json()) as HomeFaqContent & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Could not delete FAQ item.");
      }

      setContent(data);
      if (editingId === id) {
        resetForm();
      }
      setSuccess("FAQ deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete FAQ item.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="adm-page-content">Loading homepage FAQs...</div>;
  }

  return (
    <div className="adm-page-content">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Homepage FAQs</h1>
          <p className="adm-page-subtitle">
            Manage the FAQ section shown below Join Free Webinars on the homepage.
          </p>
        </div>
      </div>

      {error ? <p className="adm-form-error">{error}</p> : null}
      {success ? <p className="adm-form-message adm-form-message-success">{success}</p> : null}

      <form className="adm-panel" onSubmit={handleSaveSection}>
        <h2 className="adm-panel-title">Section Heading</h2>
        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full">
            <span>Title</span>
            <input
              type="text"
              value={content.title}
              onChange={(event) => setContent((current) => ({ ...current, title: event.target.value }))}
              required
            />
          </label>
          <label className="adm-form-field adm-form-field-full">
            <span>Subtitle</span>
            <textarea
              value={content.subtitle}
              onChange={(event) =>
                setContent((current) => ({ ...current, subtitle: event.target.value }))
              }
              rows={3}
              required
            />
          </label>
        </div>
        <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
          Save Heading
        </button>
      </form>

      <form className="adm-panel" onSubmit={handleSaveItem}>
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">{editingId ? "Edit FAQ" : "Add FAQ"}</h2>
          {editingId ? (
            <button type="button" className="adm-btn adm-btn-secondary adm-btn-small" onClick={resetForm}>
              Cancel Edit
            </button>
          ) : null}
        </div>

        <div className="adm-form-grid">
          <label className="adm-form-field adm-form-field-full">
            <span>Question</span>
            <input
              type="text"
              value={form.question}
              onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
              placeholder="What levels of German do you offer?"
              required
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Answer</span>
            <textarea
              value={form.answer}
              onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))}
              rows={4}
              placeholder="Fluent AUF offers structured German courses from A1 to C2..."
              required
            />
          </label>

          <label className="adm-form-field">
            <span>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
              />{" "}
              Active on homepage
            </span>
          </label>
        </div>

        <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
          {editingId ? "Update FAQ" : "Add FAQ"}
        </button>
      </form>

      <section className="adm-panel">
        <h2 className="adm-panel-title">Current FAQs</h2>
        {sortedItems.length === 0 ? (
          <p className="adm-panel-note">No FAQs added yet.</p>
        ) : (
          <div className="adm-repeat-list">
            {sortedItems.map((item, index) => (
              <article key={item.id} className="adm-repeat-card">
                <div className="adm-repeat-card-head">
                  <strong>
                    {index + 1}. {item.question}
                  </strong>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button type="button" className="adm-text-btn" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="adm-text-btn"
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{ margin: 0, color: "#555" }}>{item.answer}</p>
                {!item.isActive ? (
                  <small className="adm-field-hint">Hidden on homepage</small>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
