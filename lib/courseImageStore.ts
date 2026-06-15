import { Binary } from "mongodb";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getMongoClient } from "./mongodb";

const PUBLIC_COURSES_DIR = path.join(process.cwd(), "public", "courses");
const DB_NAME = "germanskill";
const COLLECTION = "course_images";

const acceptedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function getImageExtension(file: File) {
  const fromType = acceptedImageTypes[file.type];
  if (fromType) {
    return fromType;
  }

  const lowerName = file.name.trim().toLowerCase();
  if (lowerName.endsWith(".jpeg") || lowerName.endsWith(".jpg")) return "jpg";
  if (lowerName.endsWith(".png")) return "png";
  if (lowerName.endsWith(".webp")) return "webp";
  if (lowerName.endsWith(".gif")) return "gif";

  return null;
}

function readImageBuffer(value: unknown): Buffer | null {
  if (!value) {
    return null;
  }

  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (value instanceof Binary) {
    return Buffer.from(value.buffer);
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }

  return null;
}

type StoredCourseImage = {
  filename: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
};

function sanitizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function isSafeCourseImageFilename(filename: string) {
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

export async function saveCourseImage(file: File, slug?: string) {
  const extension = getImageExtension(file);
  if (!extension) {
    throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.");
  }

  const maxSizeMb = 5;
  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`Image must be ${maxSizeMb}MB or smaller.`);
  }

  const safeSlug = sanitizeSlug(slug ?? "");
  const baseName = safeSlug ? `german-${safeSlug}` : "course";
  const filename = `${baseName}-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isFileStoreEnabled()) {
    if (!existsSync(PUBLIC_COURSES_DIR)) {
      await mkdir(PUBLIC_COURSES_DIR, { recursive: true });
    }

    await writeFile(path.join(PUBLIC_COURSES_DIR, filename), buffer);
    return { path: `/courses/${filename}` };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Image upload is not configured for this environment.");
  }

  const client = await getMongoClient();
  await client
    .db(DB_NAME)
    .collection<StoredCourseImage>(COLLECTION)
    .updateOne(
      { filename },
      {
        $set: {
          filename,
          contentType: file.type || `image/${extension === "jpg" ? "jpeg" : extension}`,
          data: buffer,
          uploadedAt: new Date(),
        },
      },
      { upsert: true },
    );

  return { path: `/api/course-images/${filename}` };
}

export async function getCourseImage(filename: string) {
  if (!isSafeCourseImageFilename(filename) || !process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client
    .db(DB_NAME)
    .collection<StoredCourseImage>(COLLECTION)
    .findOne({ filename });

  if (!doc?.data) {
    return null;
  }

  const data = readImageBuffer(doc.data);
  if (!data) {
    return null;
  }

  return {
    contentType: doc.contentType || "application/octet-stream",
    data,
  };
}
