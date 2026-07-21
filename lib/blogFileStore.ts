import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { BlogPost as StaticBlogPost } from "../data/blogPosts";
import { slugifyCoursePath } from "./courseUtils";
import { isFileStoreEnabled } from "./courseDetailsFileStore";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "blog-store.json");

type StoredBlogPost = StaticBlogPost & {
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type BlogFileStore = {
  posts: StoredBlogPost[];
  deletedSlugs: string[];
};

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function emptyStore(): BlogFileStore {
  return { posts: [], deletedSlugs: [] };
}

async function readStore(): Promise<BlogFileStore> {
  if (!existsSync(STORE_FILE)) {
    return emptyStore();
  }

  try {
    const raw = stripBom(await readFile(STORE_FILE, "utf8"));
    const parsed = JSON.parse(raw) as BlogFileStore;
    return {
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      deletedSlugs: Array.isArray(parsed.deletedSlugs) ? parsed.deletedSlugs : [],
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: BlogFileStore) {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }

  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getFileBlogStore() {
  if (!isFileStoreEnabled()) {
    return null;
  }

  return readStore();
}

export async function getFileBlogPostBySlug(slug: string) {
  const store = await readStore();
  const normalized = slugifyCoursePath(slug);
  return store.posts.find((post) => slugifyCoursePath(post.slug) === normalized) ?? null;
}

export async function saveFileBlogPost(
  post: StoredBlogPost,
  options: { forceLocal?: boolean } = {},
) {
  if (!options.forceLocal && !isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  const store = await readStore();
  const index = store.posts.findIndex((item) => item.slug === post.slug);
  const nextPost = { ...post, updatedAt: new Date() };

  if (index === -1) {
    store.posts.unshift({ ...nextPost, createdAt: new Date() });
  } else {
    store.posts[index] = { ...store.posts[index], ...nextPost };
  }

  store.deletedSlugs = store.deletedSlugs.filter((item) => item !== post.slug);
  await writeStore(store);
  return nextPost;
}

export async function deleteFileBlogPost(slug: string) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  const store = await readStore();
  store.posts = store.posts.filter((post) => post.slug !== slug);

  if (!store.deletedSlugs.includes(slug)) {
    store.deletedSlugs.push(slug);
  }

  await writeStore(store);
  return true;
}

export async function removeFileBlogPostOnly(slug: string) {
  if (!isFileStoreEnabled()) {
    return false;
  }

  const store = await readStore();
  const nextPosts = store.posts.filter((post) => post.slug !== slug);
  const removed = nextPosts.length !== store.posts.length;
  store.posts = nextPosts;
  await writeStore(store);
  return removed;
}

export async function addFileDeletedBlogSlug(slug: string) {
  if (!isFileStoreEnabled()) {
    return;
  }

  const store = await readStore();
  if (!store.deletedSlugs.includes(slug)) {
    store.deletedSlugs.push(slug);
    await writeStore(store);
  }
}

export async function getFileDeletedBlogSlugs() {
  const store = await readStore();
  return store.deletedSlugs;
}
