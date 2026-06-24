"use client";

import Link from "next/link";
import BlogForm from "../_components/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="adm-page-content">
      <div className="adm-page-header" style={{ marginBottom: '2rem' }}>
        <Link href="/admin/blog" style={{ color: '#0056b3', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          &larr; Back to Blogs
        </Link>
        <h1 className="adm-page-title">Create New Blog Post</h1>
      </div>
      
      <BlogForm isEdit={false} />
    </div>
  );
}
