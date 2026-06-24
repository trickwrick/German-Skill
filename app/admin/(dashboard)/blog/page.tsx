"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "../../../../lib/blogStore";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to load blogs", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBlogs();
      } else {
        alert("Failed to delete blog post.");
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  }

  if (loading) {
    return <div className="adm-page-content">Loading blogs...</div>;
  }

  return (
    <div className="adm-page-content">
      <div className="adm-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="adm-page-title">Blog Management</h1>
        <Link href="/admin/blog/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: 'var(--primary-color, #0056b3)', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
          + Add New Blog
        </Link>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Author</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '1rem', textAlign: 'center' }}>No blogs found.</td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.slug} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <strong>{blog.title}</strong>
                    <br />
                    <small style={{ color: '#666' }}>/{blog.slug}</small>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(blog.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{blog.author}</td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/admin/blog/${blog.slug}`} style={{ marginRight: '1rem', color: '#0056b3' }}>Edit</Link>
                    <button onClick={() => handleDelete(blog.slug)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
