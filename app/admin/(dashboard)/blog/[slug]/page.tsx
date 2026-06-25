import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "../../../../../lib/blogStore";
import BlogForm from "../_components/BlogForm";

export const dynamic = "force-dynamic";

type EditBlogPageProps = {
  params: { slug: string };
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const slug = decodeURIComponent(params.slug);
  const blog = await getBlogPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="adm-page-content">
      <div className="adm-page-header" style={{ marginBottom: '2rem' }}>
        <Link href="/admin/blog" style={{ color: '#0056b3', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
          &larr; Back to Blogs
        </Link>
        <h1 className="adm-page-title">Edit Blog Post: {blog.title}</h1>
      </div>
      
      <BlogForm initialData={blog} isEdit={true} />
    </div>
  );
}
