import { Binary } from "mongodb";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getMongoClient } from "./mongodb";

const DB_NAME = "germanskill";
const COLLECTION = "general_page_images";

const acceptedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type GeneralPageImageFolder = "tutors" | "general";

type StoredGeneralPageImage = {
  filename: string;
  folder: GeneralPageImageFolder;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
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

function sanitizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function isSafeGeneralPageImageFilename(filename: string) {
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

function getPublicDir(folder: GeneralPageImageFolder) {
  return path.join(process.cwd(), "public", folder);
}

export async function saveGeneralPageImage(
  file: File,
  folder: GeneralPageImageFolder,
  label?: string,
) {
  const extension = getImageExtension(file);
  if (!extension) {
    throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.");
  }

  const maxSizeMb = 5;
  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`Image must be ${maxSizeMb}MB or smaller.`);
  }

  const safeLabel = sanitizeLabel(label ?? "");
  const prefix = folder === "tutors" ? "faculty" : "general";
  const baseName = safeLabel ? `${prefix}-${safeLabel}` : prefix;
  const filename = `${baseName}-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isFileStoreEnabled()) {
    const publicDir = getPublicDir(folder);
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    await writeFile(path.join(publicDir, filename), buffer);
    return { path: `/${folder}/${filename}` };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Image upload is not configured for this environment.");
  }

  const client = await getMongoClient();
  await client
    .db(DB_NAME)
    .collection<StoredGeneralPageImage>(COLLECTION)
    .updateOne(
      { filename },
      {
        $set: {
          filename,
          folder,
          contentType: file.type || `image/${extension === "jpg" ? "jpeg" : extension}`,
          data: buffer,
          uploadedAt: new Date(),
        },
      },
      { upsert: true },
    );

  return { path: `/api/general-page-images/${filename}` };
}

export async function getGeneralPageImage(filename: string) {
  const safeName = decodeURIComponent(filename);

  if (!isSafeGeneralPageImageFilename(safeName)) {
    return null;
  }

  for (const folder of ["tutors", "general"] as const) {
    const publicPath = path.join(getPublicDir(folder), safeName);
    if (existsSync(publicPath)) {
      const data = await readFile(publicPath);
      const extension = safeName.split(".").pop()?.toLowerCase();
      const contentType =
        extension === "png"
          ? "image/png"
          : extension === "webp"
            ? "image/webp"
            : extension === "gif"
              ? "image/gif"
              : "image/jpeg";

      return { contentType, data };
    }
  }

  if (!process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client
    .db(DB_NAME)
    .collection<StoredGeneralPageImage>(COLLECTION)
    .findOne({ filename: safeName });

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
