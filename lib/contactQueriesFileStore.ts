import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ContactQuery } from "../data/contactQuery.types";
import { isFileStoreEnabled } from "./courseDetailsFileStore";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "contact-queries-store.json");

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

async function readStore(): Promise<ContactQuery[]> {
  if (!existsSync(STORE_FILE)) {
    return [];
  }

  try {
    const raw = stripBom(await readFile(STORE_FILE, "utf8"));
    const parsed = JSON.parse(raw) as ContactQuery[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(queries: ContactQuery[]) {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }

  await writeFile(STORE_FILE, JSON.stringify(queries, null, 2), "utf8");
}

export async function getFileContactQueries() {
  if (!isFileStoreEnabled()) {
    return null;
  }

  const queries = await readStore();
  return queries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addFileContactQuery(query: ContactQuery) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  const queries = await readStore();
  queries.unshift(query);
  await writeStore(queries);
  return query;
}

export async function deleteFileContactQuery(id: string) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  const queries = await readStore();
  const next = queries.filter((query) => query.id !== id);
  const removed = next.length !== queries.length;
  await writeStore(next);
  return removed;
}
