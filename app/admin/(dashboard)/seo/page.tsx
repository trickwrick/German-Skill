"use client";

import { useEffect, useState } from "react";
import type { SeoSettings } from "../../../../lib/seoStore";

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SeoSettings>({
    title: "",
    description: "",
    keywords: "",
  });

  useEffect(() => {
    async function fetchSeo() {
      try {
        const res = await fetch("/api/admin/seo");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || "",
            description: data.description || "",
            keywords: data.keywords || "",
          });
        }
      } catch (error) {
        console.error("Failed to load SEO settings", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSeo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");
      alert("SEO settings updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="adm-page-content">Loading SEO settings...</div>;
  }

  return (
    <div className="adm-page-content">
      <div className="adm-page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="adm-page-title">Meta Web</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Update the global title and meta description for your website. 
          These will be used across the site unless overridden by a specific page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="adm-form" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="adm-form-group">
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Site Title (Global)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="adm-input"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="e.g. Fluent AUF: Online German Language Classes"
          />
          <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
            This title appears in the browser tab and search engine results.
          </small>
        </div>

        <div className="adm-form-group">
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Site Meta Keywords (Global)
          </label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            required
            className="adm-input"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Online German Classes, Learn German, German Language Course"
          />
          <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
            Comma-separated keywords for the homepage and global site metadata.
          </small>
        </div>

        <div className="adm-form-group">
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Site Meta Description (Global)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="adm-input"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            placeholder="A brief description of your site..."
          />
          <small style={{ color: '#666', display: 'block', marginTop: '0.25rem' }}>
            A summary of your website. Usually ~150-160 characters. Appears under the title in search engine results.
          </small>
        </div>

        <div>
          <button 
            type="submit" 
            disabled={saving} 
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', background: 'var(--primary-color, #0056b3)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
          >
            {saving ? "Saving..." : "Save SEO Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
