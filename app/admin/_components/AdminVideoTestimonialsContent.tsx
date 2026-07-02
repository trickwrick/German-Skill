"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { videoTestimonialRatingOptions, type VideoTestimonial } from "../../../data/videoTestimonials";
import { formatTestimonialRating, getDefaultTestimonialDescription, getYoutubeVideoId, slugifyTestimonialId } from "../../../lib/videoTestimonialUtils";

const emptyForm: VideoTestimonial = {
  id: "",
  name: "",
  rating: 5,
  youtubeUrl: "",
  image: "",
  description: "",
  sortOrder: 1,
  isActive: true,
};

export default function AdminVideoTestimonialsContent() {
  const [items, setItems] = useState<VideoTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<VideoTestimonial>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [items],
  );

  async function loadItems() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/video-testimonials");
      if (!response.ok) {
        throw new Error("Could not load video testimonials.");
      }

      const data = (await response.json()) as VideoTestimonial[];
      setItems(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load video testimonials.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function resetForm() {
    setForm({
      ...emptyForm,
      sortOrder: 0,
    });
    setEditingId(null);
    setError("");
  }

  function startEdit(item: VideoTestimonial) {
    setForm(item);
    setEditingId(item.id);
    setError("");
  }

  async function handleImageUpload(file: File | null) {
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/blog-images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      setForm((current) => ({
        ...current,
        image: data.path || data.url || "",
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: VideoTestimonial = {
      ...form,
      id: slugifyTestimonialId(form.id || form.name),
      name: form.name.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
      image: form.image.trim() || "/webinar-student.jpg",
      description: form.description.trim() || getDefaultTestimonialDescription(form.name.trim()),
      rating: Number(form.rating),
      sortOrder: editingId ? Number(form.sortOrder) || 1 : 1,
      isActive: form.isActive !== false,
    };

    if (!payload.name) {
      setError("Student name is required.");
      setSaving(false);
      return;
    }

    if (!getYoutubeVideoId(payload.youtubeUrl)) {
      setError("Please enter a valid YouTube link.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/video-testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not save testimonial.");
      }

      await loadItems();
      resetForm();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save testimonial.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this video testimonial?")) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/video-testimonials?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not delete testimonial.");
      }

      if (editingId === id) {
        resetForm();
      }

      await loadItems();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete testimonial.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-video-testimonials">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Video Testimonials</h1>
          <p className="adm-page-subtitle">
            Manage the homepage &quot;Real Feedback, Real Results&quot; section. New testimonials automatically appear first.
          </p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={resetForm}>
          + Add Testimonial
        </button>
      </div>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="adm-form-grid adm-video-testimonial-form">
          <label className="adm-form-field">
            <span>Student Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="e.g. Payal Sharma"
              required
            />
          </label>

          <label className="adm-form-field">
            <span>Rating</span>
            <select
              value={form.rating}
              onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
              required
            >
              {videoTestimonialRatingOptions.map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Paragraph</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={4}
              placeholder="Hear how this student improved their German skills with Fluent AUF..."
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>YouTube Link</span>
            <input
              type="url"
              value={form.youtubeUrl}
              onChange={(event) => setForm((current) => ({ ...current, youtubeUrl: event.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </label>

          <label className="adm-form-field adm-form-field-full">
            <span>Thumbnail Image URL</span>
            <input
              type="text"
              value={form.image}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
              placeholder="/uploads/blog/..."
            />
          </label>

          <label className="adm-form-field">
            <span>Upload Thumbnail</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(event) => void handleImageUpload(event.target.files?.[0] ?? null)}
            />
          </label>

          {editingId ? (
            <label className="adm-form-field">
              <span>Sort Order</span>
              <input
                type="number"
                min="1"
                value={form.sortOrder}
                onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))}
              />
            </label>
          ) : null}

          <label className="adm-form-field adm-form-field-inline">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            />
            <span>Show on homepage</span>
          </label>

          {form.image ? (
            <div className="adm-form-field adm-form-field-full adm-video-testimonial-preview">
              <span>Preview</span>
              <div className="adm-video-testimonial-thumb">
                <Image src={form.image} alt="Testimonial thumbnail preview" fill sizes="180px" />
              </div>
            </div>
          ) : null}

          <div className="adm-form-field adm-form-field-full adm-video-testimonial-actions">
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving || uploading}>
              {saving ? "Saving..." : editingId ? "Update Testimonial" : "Save Testimonial"}
            </button>
            {editingId ? (
              <button type="button" className="adm-btn adm-btn-secondary" onClick={resetForm} disabled={saving}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        {error ? <p className="adm-table-action-error">{error}</p> : null}
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">All Video Testimonials</h2>
        </div>

        {loading ? (
          <p>Loading testimonials...</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>YouTube</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="adm-video-testimonial-thumb adm-video-testimonial-thumb-table">
                        <Image src={item.image} alt={item.name} fill sizes="72px" />
                      </div>
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{formatTestimonialRating(item.rating)}</td>
                    <td>
                      <a href={item.youtubeUrl} target="_blank" rel="noreferrer" className="adm-table-link">
                        Open
                      </a>
                    </td>
                    <td>{item.sortOrder}</td>
                    <td>
                      <span className={`adm-status ${item.isActive ? "adm-status-live" : "adm-status-draft"}`}>
                        {item.isActive ? "Live" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button type="button" className="adm-table-link" onClick={() => startEdit(item)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="adm-table-link adm-table-link-danger"
                          onClick={() => void handleDelete(item.id)}
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
