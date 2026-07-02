import { unstable_noStore as noStore } from "next/cache";
import { blogPosts as staticBlogPosts, type BlogPost as StaticBlogPost } from "../data/blogPosts";
import {
  addFileDeletedBlogSlug,
  deleteFileBlogPost,
  getFileBlogPostBySlug,
  getFileBlogStore,
  removeFileBlogPostOnly,
  saveFileBlogPost,
} from "./blogFileStore";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { slugifyCoursePath } from "./courseUtils";
import { resolveBlogImageSrc } from "./blogImageUtils";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";

export type BlogPost = StaticBlogPost & {
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const DB_NAME = "germanskill";
const COLLECTION = "blog_posts";
const SETTINGS_COLLECTION = "admin_settings";
const DELETED_SETTINGS_ID = "blog_deleted_slugs";

type DeletedSlugsDoc = {
  _id: string;
  slugs: string[];
};

function normalizeBlogDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return new Date().toISOString().split("T")[0];
}

function normalizeBlogSeo(value: unknown): BlogPost["seo"] {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const seo = value as Record<string, unknown>;

  return {
    metaTitle: typeof seo.metaTitle === "string" ? seo.metaTitle : "",
    metaKeyword: typeof seo.metaKeyword === "string" ? seo.metaKeyword : "",
    metaDescription: typeof seo.metaDescription === "string" ? seo.metaDescription : "",
    otherMeta: typeof seo.otherMeta === "string" ? seo.otherMeta : "",
  };
}

function normalizeBlogFaqs(value: unknown): BlogPost["faqs"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const faq = item as Record<string, unknown>;
      const question = typeof faq.question === "string" ? faq.question.trim() : "";
      const answer = typeof faq.answer === "string" ? faq.answer : "";

      if (!question) {
        return null;
      }

      return { question, answer };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function sanitizeBlogPost(post: Partial<BlogPost> & { slug: string }): BlogPost {
  return {
    slug: slugifyCoursePath(post.slug),
    title: typeof post.title === "string" ? post.title : "Blog Post",
    date: normalizeBlogDate(post.date),
    author: typeof post.author === "string" && post.author.trim() ? post.author : "Fluent AUF Team",
    excerpt: typeof post.excerpt === "string" ? post.excerpt : "",
    image: resolveBlogImageSrc(typeof post.image === "string" ? post.image : ""),
    content: typeof post.content === "string" ? post.content : undefined,
    faqs: normalizeBlogFaqs(post.faqs),
    seo: normalizeBlogSeo(post.seo),
    categories: Array.isArray(post.categories)
      ? post.categories.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : undefined,
    tags: Array.isArray(post.tags)
      ? post.tags.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : undefined,
  };
}

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection<BlogPost>(COLLECTION);
}

function getPostSortTimestamp(post: BlogPost): number {
  if (post.createdAt) {
    const created = new Date(post.createdAt).getTime();
    if (!Number.isNaN(created)) {
      return created;
    }
  }

  const date = new Date(post.date).getTime();
  if (!Number.isNaN(date)) {
    return date;
  }

  if (post.updatedAt) {
    const updated = new Date(post.updatedAt).getTime();
    if (!Number.isNaN(updated)) {
      return updated;
    }
  }

  return 0;
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => getPostSortTimestamp(b) - getPostSortTimestamp(a),
  );
}

function mergeBlogLists(storedPosts: BlogPost[], deletedSlugs: Set<string>) {
  const bySlug = new Map<string, BlogPost>();

  for (const post of staticBlogPosts) {
    if (!deletedSlugs.has(post.slug)) {
      bySlug.set(post.slug, post);
    }
  }

  for (const post of storedPosts) {
    if (!deletedSlugs.has(post.slug)) {
      bySlug.set(post.slug, post);
    }
  }

  return sortPosts(Array.from(bySlug.values()));
}

async function getMongoStoredPosts(): Promise<BlogPost[]> {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const collection = await getMongoCollection();
  const docs = await collection.find({}).toArray();

  return docs.map((doc) => sanitizeBlogPost({ ...doc, _id: undefined } as BlogPost));
}

async function getMongoDeletedSlugs(): Promise<string[]> {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const client = await getMongoClient();
  const doc = await client
    .db(DB_NAME)
    .collection<DeletedSlugsDoc>(SETTINGS_COLLECTION)
    .findOne({ _id: DELETED_SETTINGS_ID });

  return Array.isArray(doc?.slugs) ? doc.slugs : [];
}

async function addMongoDeletedSlug(slug: string) {
  if (!process.env.MONGODB_URI) {
    return;
  }

  const client = await getMongoClient();
  await client
    .db(DB_NAME)
    .collection<DeletedSlugsDoc>(SETTINGS_COLLECTION)
    .updateOne(
      { _id: DELETED_SETTINGS_ID },
      { $addToSet: { slugs: slug } },
      { upsert: true },
    );
}

async function removeMongoDeletedSlug(slug: string) {
  if (!process.env.MONGODB_URI) {
    return;
  }

  const client = await getMongoClient();
  await client
    .db(DB_NAME)
    .collection<DeletedSlugsDoc>(SETTINGS_COLLECTION)
    .updateOne({ _id: DELETED_SETTINGS_ID }, { $pull: { slugs: slug } });
}

async function getDeletedSlugs(): Promise<Set<string>> {
  if (isFileStoreEnabled()) {
    try {
      const store = await getFileBlogStore();
      return new Set(store?.deletedSlugs ?? []);
    } catch {
      return new Set();
    }
  }

  try {
    const slugs = await getMongoDeletedSlugs();
    return new Set(slugs);
  } catch {
    return new Set();
  }
}

async function getStoredPosts(): Promise<BlogPost[]> {
  if (isFileStoreEnabled()) {
    try {
      const store = await getFileBlogStore();
      return store?.posts ?? [];
    } catch {
      return [];
    }
  }

  try {
    return await getMongoStoredPosts();
  } catch (error) {
    console.error("Failed to fetch blog posts from DB", error);
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  noStore();

  const [storedPosts, deletedSlugs] = await Promise.all([
    getStoredPosts(),
    getDeletedSlugs(),
  ]);

  return mergeBlogLists(storedPosts, deletedSlugs).map((post) => sanitizeBlogPost(post));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  noStore();

  const normalizedSlug = decodeURIComponent(slug).trim();
  const deletedSlugs = await getDeletedSlugs();
  if (deletedSlugs.has(normalizedSlug)) {
    return null;
  }

  if (isFileStoreEnabled()) {
    try {
      const filePost = await getFileBlogPostBySlug(normalizedSlug);
      if (filePost) {
        return sanitizeBlogPost(filePost);
      }
    } catch {
      // Fall through to MongoDB/static.
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const collection = await getMongoCollection();
      const doc = await collection.findOne({ slug: normalizedSlug });
      if (doc) {
        return sanitizeBlogPost({ ...doc, _id: undefined } as BlogPost);
      }
    } catch (error) {
      console.error(`Failed to fetch blog post ${normalizedSlug} from DB`, error);
    }
  }

  const staticPost = staticBlogPosts.find((post) => post.slug === normalizedSlug);
  return staticPost ? sanitizeBlogPost(staticPost) : null;
}

export async function saveBlogPost(payload: BlogPost) {
  const slug = slugifyCoursePath(payload.slug || payload.title || "");
  if (!slug) {
    throw new Error("Blog slug is required.");
  }

  const existing = await getBlogPostBySlug(slug);
  const now = new Date();
  const document: BlogPost = {
    ...payload,
    slug,
    date: payload.date || now.toISOString().split("T")[0],
    updatedAt: now,
    ...(existing?.createdAt || payload.createdAt
      ? { createdAt: existing?.createdAt || payload.createdAt }
      : { createdAt: now }),
  };

  if (isFileStoreEnabled()) {
    const saved = await saveFileBlogPost(document);

    if (process.env.MONGODB_URI) {
      try {
        await saveMongoBlogPost(document);
        await removeMongoDeletedSlug(slug);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return saved;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured. Add it in your hosting environment variables.");
  }

  await saveMongoBlogPost(document);
  await removeMongoDeletedSlug(slug);
  return document;
}

export async function isBlogSlugTaken(slug: string, excludeSlug?: string) {
  const normalized = slugifyCoursePath(slug);
  if (!normalized || normalized === excludeSlug) {
    return false;
  }

  const post = await getBlogPostBySlug(normalized);
  return Boolean(post);
}

async function removeBlogPostRecordOnly(slug: string) {
  if (isFileStoreEnabled()) {
    const removed = await removeFileBlogPostOnly(slug);

    if (process.env.MONGODB_URI) {
      try {
        const collection = await getMongoCollection();
        await collection.deleteOne({ slug });
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return removed;
  }

  if (!process.env.MONGODB_URI) {
    return false;
  }

  const collection = await getMongoCollection();
  const result = await collection.deleteOne({ slug });
  return result.deletedCount > 0;
}

async function markBlogSlugDeleted(slug: string) {
  if (isFileStoreEnabled()) {
    await addFileDeletedBlogSlug(slug);

    if (process.env.MONGODB_URI) {
      try {
        await addMongoDeletedSlug(slug);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return;
  }

  if (process.env.MONGODB_URI) {
    await addMongoDeletedSlug(slug);
  }
}

export async function updateBlogPost(oldSlug: string, payload: BlogPost) {
  const previousSlug = slugifyCoursePath(oldSlug);
  const nextSlug = slugifyCoursePath(payload.slug || payload.title || "");

  if (!nextSlug) {
    throw new Error("Blog slug is required.");
  }

  if (nextSlug !== previousSlug) {
    if (await isBlogSlugTaken(nextSlug, previousSlug)) {
      throw new Error("This blog URL slug is already used.");
    }

    await removeBlogPostRecordOnly(previousSlug);

    if (staticBlogPosts.some((post) => post.slug === previousSlug)) {
      await markBlogSlugDeleted(previousSlug);
    }
  }

  return saveBlogPost({ ...payload, slug: nextSlug });
}

async function saveMongoBlogPost(document: BlogPost) {
  async function writeDocument() {
    const collection = await getMongoCollection();
    await collection.updateOne(
      { slug: document.slug },
      {
        $set: document,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
  }

  try {
    await writeDocument();
  } catch (error) {
    resetMongoClient();
    try {
      await writeDocument();
    } catch (retryError) {
      throw new Error(getMongoConnectionErrorMessage(retryError));
    }
  }
}

export async function deleteBlogPost(slug: string) {
  if (!slug?.trim()) {
    throw new Error("Blog slug is required.");
  }

  if (isFileStoreEnabled()) {
    await deleteFileBlogPost(slug);

    if (process.env.MONGODB_URI) {
      try {
        const collection = await getMongoCollection();
        await collection.deleteOne({ slug });
        await addMongoDeletedSlug(slug);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return true;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured. Add it in your hosting environment variables.");
  }

  try {
    const collection = await getMongoCollection();
    await collection.deleteOne({ slug });
    await addMongoDeletedSlug(slug);
    return true;
  } catch (error) {
    console.error(`Failed to delete blog post ${slug}`, error);
    throw new Error("Failed to delete blog post.");
  }
}
