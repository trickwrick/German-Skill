"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "../../../../../lib/blogStore";
import RichTextEditor from "./RichTextEditor";

type BlogFormProps = {
  initialData?: BlogPost;
  isEdit?: boolean;
};

export default function BlogForm({ initialData, isEdit }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    author: initialData?.author || "Fluent AUF Team",
    excerpt: initialData?.excerpt || "",
    image: initialData?.image || "/portal-education.jpg",
    content: initialData?.content || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/blog-images", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to upload image");
      }

      const data = await res.json();
      setFormData({ ...formData, image: data.path });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/blog/${initialData?.slug}` : `/api/admin/blog`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save blog");
      }

      router.push("/admin/blog");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="adm-form" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="adm-form-group">
        <label>Title</label>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
          className="adm-input" 
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div className="adm-form-group">
        <label>Slug (URL-friendly)</label>
        <input 
          type="text" 
          name="slug" 
          value={formData.slug} 
          onChange={handleChange} 
          required 
          disabled={isEdit}
          className="adm-input" 
          style={{ width: '100%', padding: '0.5rem' }}
        />
        {isEdit && <small style={{color: '#666'}}>Slug cannot be changed once created.</small>}
      </div>

      <div className="adm-form-group" style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <label>Date</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
            className="adm-input" 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Author</label>
          <input 
            type="text" 
            name="author" 
            value={formData.author} 
            onChange={handleChange} 
            required 
            className="adm-input" 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      </div>

      <div className="adm-form-group">
        <label>Image</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {formData.image && (
            <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload} 
            disabled={uploadingImage}
            className="adm-input" 
            style={{ flex: 1, padding: '0.5rem' }}
          />
        </div>
        {uploadingImage && <small style={{color: '#666'}}>Uploading image...</small>}
        <small style={{display: 'block', marginTop: '0.5rem', color: '#666'}}>Or provide a URL directly:</small>
        <input 
          type="text" 
          name="image" 
          value={formData.image} 
          onChange={handleChange} 
          className="adm-input" 
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          placeholder="Image URL"
        />
      </div>

      <div className="adm-form-group">
        <label>Excerpt (Short summary)</label>
        <textarea 
          name="excerpt" 
          value={formData.excerpt} 
          onChange={handleChange} 
          required 
          rows={3}
          className="adm-input" 
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div className="adm-form-group">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content (Rich Text)</label>
        <RichTextEditor 
          value={formData.content || ""} 
          onChange={(value) => setFormData({ ...formData, content: value })} 
        />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1.5rem', background: 'var(--primary-color, #0056b3)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? "Saving..." : (isEdit ? "Update Blog" : "Create Blog")}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} style={{ padding: '0.5rem 1.5rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
