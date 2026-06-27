import type { BlogPost } from "./blogStore";

export function toEditableBlogPost(blog: BlogPost): BlogPost {
  return {
    slug: blog.slug,
    title: blog.title,
    date: blog.date,
    author: blog.author,
    excerpt: blog.excerpt,
    image: blog.image,
    content: blog.content ?? "",
    faqs: (blog.faqs ?? []).map((faq) => ({
      question: faq.question ?? "",
      answer: faq.answer ?? "",
    })),
    seo: {
      metaTitle: blog.seo?.metaTitle ?? "",
      metaKeyword: blog.seo?.metaKeyword ?? "",
      metaDescription: blog.seo?.metaDescription ?? "",
      otherMeta: blog.seo?.otherMeta ?? "",
    },
    categories: blog.categories ?? [],
    tags: blog.tags ?? [],
  };
}

export function shouldUseHtmlEditor(value: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    return false;
  }

  if (
    /<(table|colgroup|col|tbody|thead|tfoot|tr|td|th|iframe|video|svg|o:p|w:tbl)\b/i.test(
      trimmed,
    )
  ) {
    return true;
  }

  if ((trimmed.match(/<div\b/gi)?.length ?? 0) > 3) {
    return true;
  }

  if (/style\s*=\s*['"]/i.test(trimmed)) {
    return true;
  }

  if (/class\s*=\s*['"][^'"]*Mso/i.test(trimmed)) {
    return true;
  }

  return false;
}

export function blogFormNeedsHtmlEditor(data?: Partial<BlogPost>) {
  if (shouldUseHtmlEditor(data?.content ?? "")) {
    return true;
  }

  return (data?.faqs ?? []).some((faq) => shouldUseHtmlEditor(faq.answer ?? ""));
}
