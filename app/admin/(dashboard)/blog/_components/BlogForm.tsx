"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "../../../../../lib/blogStore";
import { slugifyCoursePath } from "../../../../../lib/courseUtils";
import BlogContentEditor from "./BlogContentEditor";
import { sanitizeBlogHtml, sanitizeFaqAnswer } from "../../../../../lib/blogHtmlUtils";
import { MAX_BLOG_IMAGE_SIZE_MB, validateBlogImageFile } from "../../../../../lib/blogImageValidation";

type BlogFormProps = {
  initialData?: BlogPost;
  isEdit?: boolean;
};

export default function BlogForm({ initialData, isEdit }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");
  const [isImageDragActive, setIsImageDragActive] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(isEdit));
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    slug: initialData?.slug || "",
    title: initialData?.title || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    author: initialData?.author || "",
    excerpt: initialData?.excerpt || "",
    image: initialData?.image || "",
    content: initialData?.content || "",
    faqs: initialData?.faqs || [],
    featured: initialData?.featured || false,
    seo: initialData?.seo || {
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      otherMeta: "",
    },
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
  });

  const predefinedCategories = ["Goethe-Zertifikat Prep", "Learn German", "German Grammar", "Vocabulary", "Study in Germany", "German Culture", "General"];
  const defaultTags = [
    "A1 exam preparation strategy",
    "Learn German for A1 exam",
    "B1 Goethe-Zertifikat tips",
    "Study in Germany requirements",
    "German Grammar rules",
    "Top 10 German TV shows",
    "German verbs to learn easily",
    "Is Berlin affordable for students",
    "Advantages of learning German",
  ];

  const mergeAvailableTags = (selectedTags: string[]) => {
    const merged = [...defaultTags];
    for (const tag of selectedTags) {
      const trimmed = tag.trim();
      if (!trimmed) {
        continue;
      }
      if (!merged.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
        merged.push(trimmed);
      }
    }
    return merged;
  };

  const [availableTags, setAvailableTags] = useState(() => mergeAvailableTags(initialData?.tags || []));
  const [newTagInput, setNewTagInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData((current) => {
        const next = { ...current, title: value };

        if (!isEdit && !slugManuallyEdited) {
          next.slug = slugifyCoursePath(value);
        }

        return next;
      });
      return;
    }

    if (name === "slug") {
      setSlugManuallyEdited(true);
      setFormData((current) => ({
        ...current,
        slug: slugifyCoursePath(value),
      }));
      return;
    }

    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData((current) => ({ ...current, content: value }));
  };

  const uploadFeaturedImage = async (file: File) => {
    setImageUploadError("");

    const validation = validateBlogImageFile(file);
    if (!validation.ok) {
      setImageUploadError(validation.error);
      return;
    }

    setUploadingImage(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/blog-images", {
        method: "POST",
        body: form,
        credentials: "same-origin",
      });

      let data: { path?: string; error?: string } = {};
      try {
        data = (await res.json()) as { path?: string; error?: string };
      } catch {
        throw new Error("Upload failed. Please try again.");
      }

      if (!res.ok || !data.path) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData((current) => ({ ...current, image: data.path! }));
      setSelectedImageName(file.name);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload image";
      setImageUploadError(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      return;
    }

    await uploadFeaturedImage(file);
  };

  const handleImageDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsImageDragActive(true);
  };

  const handleImageDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsImageDragActive(false);
  };

  const handleImageDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsImageDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await uploadFeaturedImage(file);
  };

  const handleAddFaq = () => {
    setFormData((current) => ({
      ...current,
      faqs: [...(current.faqs || []), { question: "", answer: "" }],
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setFormData((current) => ({
      ...current,
      faqs: (current.faqs || []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    setFormData((current) => {
      const newFaqs = [...(current.faqs || [])];
      newFaqs[index] = { ...newFaqs[index], [field]: value };
      return { ...current, faqs: newFaqs };
    });
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({
      ...current,
      seo: {
        ...(current.seo || {}),
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData((current) => {
      const cats = current.categories || [];
      return {
        ...current,
        categories: cats.includes(cat) ? cats.filter((item) => item !== cat) : [...cats, cat],
      };
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData((current) => {
      const tgs = current.tags || [];
      return {
        ...current,
        tags: tgs.includes(tag) ? tgs.filter((item) => item !== tag) : [...tgs, tag],
      };
    });
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) {
      return;
    }

    const existingTag = availableTags.find(
      (tag) => tag.toLowerCase() === trimmed.toLowerCase(),
    );
    const tagToAdd = existingTag ?? trimmed;

    if (!existingTag) {
      setAvailableTags((current) => [...current, tagToAdd]);
    }

    const selectedTags = formData.tags || [];
    if (!selectedTags.some((tag) => tag.toLowerCase() === tagToAdd.toLowerCase())) {
      setFormData((current) => ({
        ...current,
        tags: [...(current.tags || []), tagToAdd],
      }));
    }

    setNewTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/blog/${encodeURIComponent(initialData?.slug ?? "")}`
        : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          content: sanitizeBlogHtml(formData.content || ""),
          faqs: (formData.faqs || []).map((faq) => ({
            ...faq,
            answer: sanitizeFaqAnswer(faq.answer || ""),
          })),
        }),
        credentials: "same-origin",
      });

      const saved = (await res.json()) as BlogPost & { error?: string };

      if (!res.ok) {
        throw new Error(saved.error || "Failed to save blog");
      }

      if (isEdit && saved.slug && saved.slug !== initialData?.slug) {
        router.replace(`/admin/blog/${encodeURIComponent(saved.slug)}`);
      } else {
        router.push("/admin/blog");
      }
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="adm-form" style={{ maxWidth: '1200px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          readOnly={!isEdit && !slugManuallyEdited}
          className={!isEdit && !slugManuallyEdited ? "adm-input adm-input-readonly" : "adm-input"}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <small style={{ color: '#666' }}>
          {!isEdit && !slugManuallyEdited
            ? `Auto-created from title → /blog/${formData.slug || "your-post"}`
            : `Blog page → /blog/${formData.slug || "your-post"}`}
        </small>
        {!isEdit && !slugManuallyEdited ? (
          <button
            type="button"
            onClick={() => setSlugManuallyEdited(true)}
            style={{
              display: 'block',
              marginTop: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#0056b3',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.875rem',
            }}
          >
            Edit slug manually
          </button>
        ) : null}
      </div>

      <div className="adm-form-group">
        <label>Date</label>
        <div>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
            className="adm-input" 
            style={{ width: '200px', padding: '0.5rem' }}
          />
        </div>
      </div>

      <div className="adm-form-group">
        <label>Image</label>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          {formData.image ? (
            <img
              src={formData.image}
              alt="Preview"
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px", border: "1px solid #e2e8f0" }}
            />
          ) : null}

          <label
            className={`adm-file-upload${isImageDragActive ? " adm-file-upload-active" : ""}`}
            style={{ flex: 1, minWidth: "240px" }}
            onDragOver={handleImageDragOver}
            onDragLeave={handleImageDragLeave}
            onDrop={handleImageDrop}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            <span className="adm-file-btn">
              {uploadingImage ? "Uploading..." : "Choose Image"}
            </span>
            <span className="adm-file-name">
              {selectedImageName || `Drag & drop or choose JPG, PNG, WEBP, or GIF up to ${MAX_BLOG_IMAGE_SIZE_MB}MB`}
            </span>
          </label>
        </div>

        {imageUploadError ? <p className="adm-file-error">{imageUploadError}</p> : null}

        <small style={{ display: "block", marginTop: "0.5rem", color: "#666" }}>Or provide a URL directly:</small>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="adm-input"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
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
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content</label>
        <BlogContentEditor
          value={formData.content || ""}
          onChange={handleContentChange}
        />
      </div>

      <div className="adm-form-group" style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#333' }}>Faq's</h3>
        
        {(formData.faqs || []).map((faq, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', backgroundColor: '#fff', padding: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Question" 
                value={faq.question}
                onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                aria-label={`FAQ Question ${index + 1}`}
                className="adm-input"
                style={{ padding: '0.5rem', width: '100%' }}
              />
              <div style={{ marginTop: '0.5rem', flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem', display: 'block' }}>Answer</label>
                <textarea
                  value={faq.answer || ""}
                  onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                  aria-label={`FAQ Answer ${index + 1}`}
                  rows={6}
                  className="adm-input"
                  style={{ width: '100%', padding: '0.5rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => handleRemoveFaq(index)}
              aria-label={`Remove FAQ ${index + 1}`}
              style={{ background: '#ff7675', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer', alignSelf: 'flex-start' }}
              title="Remove FAQ"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        ))}

        <button 
          type="button" 
          onClick={handleAddFaq}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#3b5998', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '0.5rem 1rem', 
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '0.5rem'
          }}
        >
          + Add FAQ
        </button>
      </div>

      <div className="adm-form-group" style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#333' }}>SEO - Meta Tags</h3>
        <p style={{ color: '#666', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>Define page meta title, meta keywords and meta description to list your page in search engines</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meta Title: *</label>
            <input 
              type="text" 
              name="metaTitle"
              value={formData.seo?.metaTitle || ""}
              onChange={handleSeoChange}
              className="adm-input"
              style={{ width: '100%', padding: '0.5rem' }}
            />
            <small style={{ color: '#888' }}>Max length 70 characters</small>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meta Keyword:</label>
            <textarea 
              name="metaKeyword"
              value={formData.seo?.metaKeyword || ""}
              onChange={handleSeoChange}
              className="adm-input"
              rows={2}
              style={{ width: '100%', padding: '0.5rem', fontFamily: 'inherit' }}
            />
            <small style={{ color: '#888' }}>Max length 160 characters</small>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meta Description:</label>
            <textarea 
              name="metaDescription"
              value={formData.seo?.metaDescription || ""}
              onChange={handleSeoChange}
              className="adm-input"
              rows={3}
              style={{ width: '100%', padding: '0.5rem', fontFamily: 'inherit' }}
            />
            <small style={{ color: '#888' }}>Max length 250 characters</small>
          </div>

        </div>
      </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading} style={{ padding: '0.5rem 1.5rem', background: 'var(--primary-color, #0056b3)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? "Saving..." : (isEdit ? "Update Blog" : "Create Blog")}
          </button>
          <button type="button" onClick={() => router.push("/admin/blog")} style={{ padding: '0.5rem 1.5rem', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
        
        {/* Featured Box */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Featured</h3>
          </div>
          <div style={{ padding: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData((current) => ({ ...current, featured: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6c5ce7' }}
              />
              <span>Mark as Featured post</span>
            </label>
            <small style={{ display: 'block', marginTop: '0.5rem', color: '#888' }}>
              Featured posts are highlighted with a ★ in the admin list.
            </small>
          </div>
        </div>

        {/* Categories Box */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Categories *</h3>
          </div>
          <div style={{ padding: '1rem', maxHeight: '250px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {predefinedCategories.map(cat => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={(formData.categories || []).includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    style={{ cursor: 'pointer' }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e9ecef', backgroundColor: '#fdfdfd' }}>
            <button type="button" style={{ color: '#0056b3', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
              + Add New Category
            </button>
          </div>
        </div>

        {/* Tags Box */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Tags</h3>
          </div>
          <div style={{ padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {availableTags.map(tag => (
                <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={(formData.tags || []).includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    style={{ cursor: 'pointer' }}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #e9ecef', backgroundColor: '#fdfdfd' }}>
            <input
              type="text"
              value={newTagInput}
              onChange={(event) => setNewTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Type a new tag..."
              className="adm-input"
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              style={{ color: '#0056b3', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
            >
              + Add Tag
            </button>
          </div>
        </div>
        
      </div>
    </form>
  );
}
