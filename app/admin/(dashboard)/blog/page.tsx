"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "../../../../lib/blogStore";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", { credentials: "same-origin" });
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
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = (await res.json()) as { error?: string };

      if (res.ok) {
        fetchBlogs();
        return;
      }

      alert(data.error || "Failed to delete blog post.");
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Failed to delete blog post.");
    }
  }

  if (loading) {
    return <div className="adm-page-content">Loading blogs...</div>;
  }

  return (
    <div className="adm-page-content" style={{ padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', backgroundColor: '#fff', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#333', fontWeight: 'bold' }}>Blog Listings</h1>
        <Link 
          href="/admin/blog/new" 
          style={{ 
            padding: '0.5rem 1rem', 
            background: '#00b894', 
            color: 'white', 
            borderRadius: '4px', 
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}>
          + Add New
        </Link>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left', backgroundColor: '#fafafa' }}>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333' }}>S.No.</th>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333' }}>Image</th>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333' }}>Blog Name</th>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333' }}>Category</th>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Featured</th>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No blogs found.</td>
              </tr>
            ) : (
              blogs.map((blog, index) => {
                const dateObj = new Date(blog.date);
                const formattedDate = dateObj.toLocaleDateString('en-GB').replace(/\//g, '-');
                const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                return (
                  <tr key={blog.slug} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '1rem', color: '#333', fontWeight: 'bold' }}>{index + 1}</td>
                    <td style={{ padding: '1rem' }}>
                      <img 
                        src={blog.image || "https://via.placeholder.com/40"} 
                        alt="Blog" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    </td>
                    <td style={{ padding: '1rem', color: '#555' }}>
                      {blog.title}
                    </td>
                    <td style={{ padding: '1rem', color: '#555' }}>
                      {blog.categories && blog.categories.length > 0 ? blog.categories.join(", ") : "General"}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: '#e6fcec', 
                        color: '#00b894', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        ACTIVE
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#555', textAlign: 'center' }}>
                      <div>{formattedDate}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{formattedTime}</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <Link 
                          href={`/admin/blog/${encodeURIComponent(blog.slug)}`} 
                          style={{ color: '#00b894', background: '#e6fcec', padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog.slug)} 
                          style={{ color: '#ff7675', background: '#ffeaa7', border: 'none', padding: '0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
