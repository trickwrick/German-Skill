import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { VideoTestimonial } from "../data/videoTestimonials";
import { isFileStoreEnabled } from "./courseDetailsFileStore";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "video-testimonials-store.json");

type VideoTestimonialFileStore = {
  items: VideoTestimonial[];
};

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function emptyStore(): VideoTestimonialFileStore {
  return { items: [] };
}

async function readStore(): Promise<VideoTestimonialFileStore> {
  if (!existsSync(STORE_FILE)) {
    return emptyStore();
  }

  try {
    const raw = stripBom(await readFile(STORE_FILE, "utf8"));
    const parsed = JSON.parse(raw) as VideoTestimonialFileStore;
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: VideoTestimonialFileStore) {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }

  await writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getFileVideoTestimonials() {
  if (!isFileStoreEnabled()) {
    return null;
  }

  return readStore();
}

export async function saveFileVideoTestimonials(items: VideoTestimonial[]) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  await writeStore({ items });
  return items;
}
