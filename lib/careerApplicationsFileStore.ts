import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { CareerApplication } from "../data/careerApplication.types";
import { isFileStoreEnabled } from "./courseDetailsFileStore";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "career-applications-store.json");

function stripBom(value: string) {
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

async function readStore(): Promise<CareerApplication[]> {
  if (!existsSync(STORE_FILE)) {
    return [];
  }

  try {
    const raw = stripBom(await readFile(STORE_FILE, "utf8"));
    const parsed = JSON.parse(raw) as CareerApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(applications: CareerApplication[]) {
  if (!existsSync(STORE_DIR)) {
    await mkdir(STORE_DIR, { recursive: true });
  }

  await writeFile(STORE_FILE, JSON.stringify(applications, null, 2), "utf8");
}

export async function getFileCareerApplications() {
  if (!isFileStoreEnabled()) {
    return null;
  }

  const applications = await readStore();
  return applications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addFileCareerApplication(application: CareerApplication) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  const applications = await readStore();
  applications.unshift(application);
  await writeStore(applications);
  return application;
}

export async function deleteFileCareerApplication(id: string) {
  if (!isFileStoreEnabled()) {
    throw new Error("Local file storage is disabled in this environment.");
  }

  const applications = await readStore();
  const next = applications.filter((application) => application.id !== id);
  const removed = next.length !== applications.length;
  await writeStore(next);
  return removed;
}
