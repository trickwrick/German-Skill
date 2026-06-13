import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { StoredCourseDetails } from "../data/adminCourseDetails.types";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "course-details-store.json");

type CourseDetailsStore = Record<string, StoredCourseDetails>;

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
  const store = await readStore();
  return store[slug] ?? null;
}

export async function saveFileCourseDetails(document: StoredCourseDetails) {
  const store = await readStore();
  store[document.slug] = document;
  await writeStore(store);
  return document;
}
