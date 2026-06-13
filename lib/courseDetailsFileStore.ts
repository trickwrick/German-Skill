import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { StoredCourseDetails } from "../data/adminCourseDetails.types";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "course-details-store.json");

type CourseDetailsStore = Record<string, StoredCourseDetails>;

export function isFileStoreEnabled() {
  if (process.env.COURSE_STORE === "file") {
    return true;
  }

  if (process.env.COURSE_STORE === "mongodb") {
    return false;
  }

  if (process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return false;
  }

  return process.env.NODE_ENV === "development";
}

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

async function readStore(): Promise<CourseDetailsStore> {
  if (!existsSync(STORE_FILE)) {
    return {};
  }

  try {
    const raw = stripBom(await readFile(STORE_FILE, "utf8"));
    return JSON.parse(raw) as CourseDetailsStore;
  } catch {
    return {};
  }
}

async function writeStore(data: CourseDetailsStore) {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }

  await writeFile(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getFileCourseDetails(slug: string) {
  if (!isFileStoreEnabled()) {
    return null;
  }

  const store = await readStore();
  return store[slug] ?? null;
}

export async function saveFileCourseDetails(document: StoredCourseDetails) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  const store = await readStore();
  store[document.slug] = document;
  await writeStore(store);
  return document;
}
