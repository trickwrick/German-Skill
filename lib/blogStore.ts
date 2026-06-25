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

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection<BlogPost>(COLLECTION);
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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

  return docs.map(
    (doc) =>
      ({
        ...doc,
        _id: undefined,
      }) as BlogPost,
  );
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

  return mergeBlogLists(storedPosts, deletedSlugs);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  noStore();

  const deletedSlugs = await getDeletedSlugs();
  if (deletedSlugs.has(slug)) {
    return null;
  }

  if (isFileStoreEnabled()) {
    try {
      const filePost = await getFileBlogPostBySlug(slug);
      if (filePost) {
        return filePost;
      }
    } catch {
      // Fall through to MongoDB/static.
    }
  }

  if (process.env.MONGODB_URI) {
    try {
      const collection = await getMongoCollection();
      const doc = await collection.findOne({ slug });
      if (doc) {
        return {
          ...doc,
          _id: undefined,
        } as BlogPost;
      }
    } catch (error) {
      console.error(`Failed to fetch blog post ${slug} from DB`, error);
    }
  }

  return staticBlogPosts.find((post) => post.slug === slug) ?? null;
}

export async function saveBlogPost(payload: BlogPost) {
  const slug = slugifyCoursePath(payload.slug || payload.title || "");
  if (!slug) {
    throw new Error("Blog slug is required.");
  }

  const document: BlogPost = {
    ...payload,
    slug,
    updatedAt: new Date(),
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
