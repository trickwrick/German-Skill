"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export type BlogContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const BlogContentEditor = dynamic(
  async () => {
    // @ts-expect-error Next.js resolves the TSX module without a .js extension.
    const module = await import("./BlogCKEditor");
    return module.default;
  },
  {
    ssr: false,
    loading: () => <p className="blog-ckeditor-loading">Preparing editor...</p>,
  },
) as ComponentType<BlogContentEditorProps>;

export default BlogContentEditor;
