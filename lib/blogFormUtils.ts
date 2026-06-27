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

export function hasUnsupportedQuillHtml(value: string) {
  return /<(table|colgroup|col|tbody|thead|tfoot)\b/i.test(value);
}
