import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { CityPagesStore } from "../data/cityPages";
import { isFileStoreEnabled } from "./courseDetailsFileStore";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "city-pages-store.json");

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

async function readStore(): Promise<CityPagesStore | null> {
  if (!existsSync(STORE_FILE)) {
    return null;
  }

  try {
    const raw = stripBom(await readFile(STORE_FILE, "utf8"));
    return JSON.parse(raw) as CityPagesStore;
  } catch {
    return null;
  }
}

async function writeStore(content: CityPagesStore) {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }

  await writeFile(STORE_FILE, JSON.stringify(content, null, 2), "utf8");
}

export async function getFileCityPagesStore() {
  if (!isFileStoreEnabled()) {
    return null;
  }

  return readStore();
}

export async function saveFileCityPagesStore(content: CityPagesStore) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  await writeStore(content);
  return content;
}
